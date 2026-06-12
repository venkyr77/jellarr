import { logger } from "../lib/logger";
import { ChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import type { VirtualFolderConfig } from "../types/config/library";
import type {
  VirtualFolderInfoSchema,
  CollectionTypeSchema,
  AddVirtualFolderDtoSchema,
  UpdateLibraryOptionsDtoSchema,
  LibraryOptionsSchema,
} from "../types/schema/library";
import {
  mapVirtualFolderConfigToSchema,
  mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema,
} from "../mappers/library";
import { applyChangeset, diff, Operation, type IChange } from "json-diff-ts";

export type LibraryDiff = {
  toCreate?: VirtualFolderInfoSchema[];
  toUpdate?: {
    id: string;
    name: string;
    libraryOptions: LibraryOptionsSchema;
  }[];
};

type ChangeWithValue = IChange & {
  embeddedKey?: string | number;
  value?: unknown;
  path?: string;
};

function resolveFolderId(
  folder: VirtualFolderInfoSchema | undefined,
): string | undefined {
  if (!folder) return undefined;
  return (
    (folder as { Id?: string }).Id ??
    (folder as { ItemId?: string | null }).ItemId ??
    undefined
  );
}

/**
 * Resolve the folder Name a change belongs to. For atomized nested changes the
 * leaf key is the changed field (e.g. "Path"), while the owning folder Name
 * lives in the JSONPath as a `[?(@.Name=='<name>')]` filter segment, so the
 * path is consulted first before falling back to key/embeddedKey/value.Name.
 *
 * The capture uses a non-greedy `.+?` anchored on the closing `'")]` or `")]`
 * delimiter so that folder names containing apostrophes (e.g. `Kids' Movies`)
 * are captured in full rather than truncated at the inner quote.
 */
function resolveChangeName(change: ChangeWithValue): string | undefined {
  const path: string | undefined = change.path;
  if (typeof path === "string") {
    const match: RegExpExecArray | null = /@\.Name==['"](.+?)['"]\)\]/.exec(
      path,
    );
    if (match) return match[1];
  }
  const key: string = change.key;
  if (key !== "" && Number.isNaN(Number(key))) return key;
  const embeddedKey: string | number | undefined = change.embeddedKey;
  if (
    typeof embeddedKey === "string" &&
    embeddedKey !== "" &&
    Number.isNaN(Number(embeddedKey))
  ) {
    return embeddedKey;
  }
  const value: unknown = change.value;
  if (value && typeof value === "object" && "Name" in value) {
    return (value as { Name?: string }).Name;
  }
  return undefined;
}

export function calculateLibraryDiff(
  current: VirtualFolderInfoSchema[],
  desired: VirtualFolderConfig[],
): LibraryDiff | undefined {
  if (desired.length === 0) {
    return undefined;
  }

  const next: VirtualFolderInfoSchema[] = desired.map(
    mapVirtualFolderConfigToSchema,
  );

  const currentByName: Map<string, VirtualFolderInfoSchema> = new Map(
    current
      .map((folder: VirtualFolderInfoSchema) =>
        folder.Name ? [folder.Name, folder] : undefined,
      )
      .filter(
        (
          entry:
            | [string, VirtualFolderInfoSchema]
            | undefined
            | [string, VirtualFolderInfoSchema | undefined],
        ): entry is [string, VirtualFolderInfoSchema] => Array.isArray(entry),
      ),
  );

  for (const folder of next) {
    const name: string | undefined = folder.Name ?? undefined;
    if (!name) continue;
    const currentFolder: VirtualFolderInfoSchema | undefined =
      currentByName.get(name);
    const currentType: string | undefined =
      (currentFolder?.CollectionType as string | undefined) ?? undefined;
    const desiredType: string | undefined =
      (folder.CollectionType as string | undefined) ?? undefined;
    if (
      currentFolder &&
      typeof currentType !== "undefined" &&
      typeof desiredType !== "undefined" &&
      currentType !== desiredType
    ) {
      throw new Error(
        `Library '${name}' collectionType change is not supported (current: ${currentType}, desired: ${desiredType})`,
      );
    }
  }

  const changeSet: IChange[] = new ChangeSetBuilder(
    diff(current, next, {
      embeddedObjKeys: { ".": "Name" },
      treatTypeChangeAsReplace: false,
    }),
  )
    .atomize()
    .withoutRemoves()
    .toArray();

  if (changeSet.length === 0) return undefined;

  logger.info(JSON.stringify(changeSet));

  /**
   * An ADD whose resolved folder Name already exists is a nested field added to
   * an existing folder (e.g. TypeOptions or a new MetadataSavers entry) and must
   * drive an update, not a create. Only ADDs for folder names absent from the
   * current state are genuine creates.
   */
  const addChanges: IChange[] = [];
  const updateChanges: ChangeWithValue[] = [];

  for (const change of changeSet as ChangeWithValue[]) {
    if (change.type === Operation.ADD) {
      const name: string | undefined = resolveChangeName(change);
      if (name && currentByName.has(name)) {
        updateChanges.push(change);
      } else {
        addChanges.push(change);
      }
    } else if (change.type === Operation.UPDATE) {
      updateChanges.push(change);
    }
  }

  const toCreate: VirtualFolderInfoSchema[] | undefined =
    addChanges.length > 0
      ? (applyChangeset([], addChanges) as VirtualFolderInfoSchema[])
      : undefined;

  const nextByName: Map<string, VirtualFolderInfoSchema> = new Map(
    next
      .map((folder: VirtualFolderInfoSchema) =>
        folder.Name ? [folder.Name, folder] : undefined,
      )
      .filter(
        (
          entry:
            | [string, VirtualFolderInfoSchema]
            | undefined
            | [string, VirtualFolderInfoSchema | undefined],
        ): entry is [string, VirtualFolderInfoSchema] => Array.isArray(entry),
      ),
  );

  const toUpdate: NonNullable<LibraryDiff["toUpdate"]> = [];
  const seenUpdate: Set<string> = new Set();

  for (const change of updateChanges) {
    const name: string | undefined = resolveChangeName(change);
    if (!name || seenUpdate.has(name)) continue;

    const currentFolder: VirtualFolderInfoSchema | undefined =
      currentByName.get(name);
    const desiredFolder: VirtualFolderInfoSchema | undefined =
      nextByName.get(name);
    const existingId: string | undefined = resolveFolderId(currentFolder);
    const libraryOptions: LibraryOptionsSchema | undefined =
      desiredFolder?.LibraryOptions as LibraryOptionsSchema | undefined;

    if (!existingId || !libraryOptions) continue;

    seenUpdate.add(name);
    toUpdate.push({
      id: existingId,
      name,
      libraryOptions,
    });
  }

  if (!toCreate && toUpdate.length === 0) return undefined;

  return {
    toCreate,
    toUpdate: toUpdate.length > 0 ? toUpdate : undefined,
  };
}

export async function applyLibrary(
  client: JellyfinClient,
  diffResult: LibraryDiff | undefined,
): Promise<void> {
  if (!diffResult) return;

  const { toCreate, toUpdate } = diffResult;

  if (!toCreate && !toUpdate) return;

  if (toCreate) {
    for (const virtualFolder of toCreate) {
      if (!virtualFolder.Name) {
        logger.warn("Skipping virtual folder without a Name");
        continue;
      }

      const name: string = virtualFolder.Name as string;
      const collectionType: CollectionTypeSchema =
        virtualFolder.CollectionType as CollectionTypeSchema;

      logger.info(`Creating virtual folder: ${name}`);

      const addVirtualFolderDto: AddVirtualFolderDtoSchema =
        mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema(virtualFolder);

      await client.addVirtualFolder(name, collectionType, addVirtualFolderDto);

      logger.info(`✓ Created virtual folder: ${name} (${collectionType})`);
    }
  }

  if (toUpdate) {
    for (const update of toUpdate) {
      const payload: UpdateLibraryOptionsDtoSchema = {
        Id: update.id,
        LibraryOptions: update.libraryOptions,
      };

      logger.info(`Updating library options: ${update.name}`);
      await client.updateLibraryOptions(update.id, payload);
      logger.info(`✓ Updated library options: ${update.name}`);
    }
  }
}
