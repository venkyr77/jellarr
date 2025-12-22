import { logger } from "../lib/logger";
import { ChangeSetBuilder } from "../lib/changeset";
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
import { applyChangeset, diff, type IChange } from "json-diff-ts";

export function calculateLibraryDiff(
  current: VirtualFolderInfoSchema[],
  desired: VirtualFolderConfig[],
): VirtualFolderInfoSchema[] | undefined {
  if (desired.length === 0) {
    return undefined;
  }

  const next: VirtualFolderInfoSchema[] = desired.map(
    mapVirtualFolderConfigToSchema,
  );

  const patch: IChange[] = new ChangeSetBuilder(
    diff(current, next, {
      embeddedObjKeys: { ".": "Name" },
      treatTypeChangeAsReplace: false,
    }),
  )
    .atomize()
    .withoutRemoves()
    .withoutUpdates()
    .toArray();

  if (patch.length !== 0) {
    logger.info(JSON.stringify(patch));
    return applyChangeset([], patch) as VirtualFolderInfoSchema[];
  }

  return undefined;
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
