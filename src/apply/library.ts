import { logger } from "../lib/logger";
import { ChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import type { VirtualFolderConfig } from "../types/config/library";
import type {
  VirtualFolderInfoSchema,
  CollectionTypeSchema,
  AddVirtualFolderDtoSchema,
  LibraryOptionsSchema,
} from "../types/schema/library";
import {
  mapVirtualFolderConfigToSchema,
  mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema,
  mapLibraryOptionsConfigToSchema,
} from "../mappers/library";
import { applyChangeset, diff, type IChange } from "json-diff-ts";

export function calculateLibraryDiff(
  current: VirtualFolderInfoSchema[],
  desired: VirtualFolderConfig[],
): VirtualFolderInfoSchema[] | undefined {
  if (desired.length === 0) {
    return undefined;
  }

  const currentNames: Set<string> = new Set(
    current
      .map((f: VirtualFolderInfoSchema) => f.Name)
      .filter((n): n is string => n !== undefined),
  );

  const toCreate: VirtualFolderInfoSchema[] = desired
    .filter(
      (d: VirtualFolderConfig) => !currentNames.has(d.name),
    )
    .map(mapVirtualFolderConfigToSchema);

  if (toCreate.length > 0) {
    return toCreate;
  }

  return undefined;
}

export interface LibraryOptionsUpdate {
  id: string;
  name: string;
  libraryOptions: LibraryOptionsSchema;
}

export function calculateLibraryOptionsDiff(
  current: VirtualFolderInfoSchema[],
  desired: VirtualFolderConfig[],
): LibraryOptionsUpdate[] | undefined {
  const updates: LibraryOptionsUpdate[] = [];

  for (const desiredFolder of desired) {
    const currentFolder = current.find(
      (f: VirtualFolderInfoSchema) => f.Name === desiredFolder.name,
    );
    if (!currentFolder?.ItemId || !currentFolder.LibraryOptions) continue;

    const desiredOptions: LibraryOptionsSchema =
      mapLibraryOptionsConfigToSchema(desiredFolder.libraryOptions);

    const patch: IChange[] = new ChangeSetBuilder(
      diff(currentFolder.LibraryOptions, desiredOptions, {
        treatTypeChangeAsReplace: false,
      }),
    )
      .withoutRemoves()
      .toArray();

    if (patch.length !== 0) {
      logger.info(
        `Library options diff for "${desiredFolder.name}": ${JSON.stringify(patch)}`,
      );
      const updated = applyChangeset(
        currentFolder.LibraryOptions,
        patch,
      ) as LibraryOptionsSchema;
      updates.push({
        id: currentFolder.ItemId,
        name: desiredFolder.name,
        libraryOptions: updated,
      });
    }
  }

  return updates.length > 0 ? updates : undefined;
}

export async function purgeLibraries(
  client: JellyfinClient,
  current: VirtualFolderInfoSchema[],
): Promise<void> {
  for (const folder of current) {
    const name: string = folder.Name as string;
    logger.info(`Removing virtual folder: ${name}`);
    await client.removeVirtualFolder(name);
    logger.info(`✓ Removed virtual folder: ${name}`);
  }
}

export async function applyLibrary(
  client: JellyfinClient,
  virtualFoldersToAdd: VirtualFolderInfoSchema[] | undefined,
): Promise<void> {
  if (!virtualFoldersToAdd) return;

  for (const virtualFolder of virtualFoldersToAdd) {
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

export async function applyLibraryOptions(
  client: JellyfinClient,
  updates: LibraryOptionsUpdate[] | undefined,
): Promise<void> {
  if (!updates) return;

  for (const update of updates) {
    logger.info(`Updating library options for: ${update.name}`);
    await client.updateLibraryOptions(update.id, update.libraryOptions);
    logger.info(`✓ Updated library options for: ${update.name}`);
  }
}
