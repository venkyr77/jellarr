import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import type { VirtualFolderConfig } from "../types/config/library";
import type {
  VirtualFolderInfoSchema,
  CollectionTypeSchema,
  AddVirtualFolderDtoSchema,
} from "../types/schema/library";
import {
  mapVirtualFolderConfigToSchema,
  mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema,
} from "../mappers/library";

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
      .filter((n): n is string => n !== undefined && n !== null),
  );

  const foldersToCreate: VirtualFolderInfoSchema[] = desired
    .filter((d: VirtualFolderConfig) => !currentNames.has(d.name))
    .map(mapVirtualFolderConfigToSchema);

  if (foldersToCreate.length === 0) {
    return undefined;
  }

  logger.info(
    JSON.stringify(foldersToCreate.map((f: VirtualFolderInfoSchema) => f.Name)),
  );

  return foldersToCreate;
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
