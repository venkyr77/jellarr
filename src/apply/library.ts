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
import { diff, type IChange } from "json-diff-ts";

export type LibraryDiff = {
  toCreate?: VirtualFolderInfoSchema[];
  toUpdate?: {
    id: string;
    name: string;
    libraryOptions: LibraryOptionsSchema;
  }[];
};

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

  const toCreate: VirtualFolderInfoSchema[] = [];
  const toUpdate: NonNullable<LibraryDiff["toUpdate"]> = [];

  for (const folder of next) {
    const existing: VirtualFolderInfoSchema | undefined = current.find(
      (currentFolder: VirtualFolderInfoSchema) =>
        currentFolder.Name === folder.Name,
    );

    if (!existing) {
      toCreate.push(folder);
      continue;
    }

    const currentOptions: LibraryOptionsSchema | undefined =
      existing.LibraryOptions as LibraryOptionsSchema | undefined;
    const nextOptions: LibraryOptionsSchema | undefined =
      folder.LibraryOptions as LibraryOptionsSchema | undefined;

    if (
      currentOptions &&
      nextOptions &&
      JSON.stringify(currentOptions) === JSON.stringify(nextOptions)
    ) {
      continue;
    }

    const existingId: string | undefined =
      (existing as { Id?: string }).Id ??
      (existing as { ItemId?: string | null }).ItemId ??
      undefined;

    if (existingId && nextOptions) {
      toUpdate.push({
        id: existingId,
        name: existing.Name ?? "",
        libraryOptions: nextOptions,
      });
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
    .withoutUpdates()
    .toArray();

  if (changeSet.length > 0) {
    logger.info(JSON.stringify(changeSet));
  }

  if (toCreate.length === 0 && toUpdate.length === 0) return undefined;

  return {
    toCreate: toCreate.length > 0 ? toCreate : undefined,
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
