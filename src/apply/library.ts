import { deepEqual } from "fast-equals";
import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import type {
  LibraryConfig,
  VirtualFolderConfig,
} from "../types/config/library";
import type {
  VirtualFolderInfoSchema,
  CollectionTypeSchema,
  AddVirtualFolderDtoSchema,
} from "../types/schema/library";
import { mapVirtualFolderConfigToAddVirtualFolderDto } from "../mappers/library";

export function calculateLibraryDiff(
  currentVirtualFolders: VirtualFolderInfoSchema[],
  desired: LibraryConfig,
): LibraryConfig | undefined {
  if (!desired.virtualFolders || desired.virtualFolders.length === 0) {
    return undefined;
  }

  const virtualFoldersToCreate: VirtualFolderConfig[] = [];
  let hasUpdates: boolean = false;

  for (const desiredVF of desired.virtualFolders) {
    const existingVF: VirtualFolderInfoSchema | undefined =
      currentVirtualFolders.find(
        (vf: VirtualFolderInfoSchema) => vf.Name === desiredVF.name,
      );

    if (!existingVF) {
      virtualFoldersToCreate.push(desiredVF);
    } else {
      const currentLocations: string[] = existingVF.Locations ?? [];
      const desiredLocations: string[] = desiredVF.libraryOptions.pathInfos.map(
        (p: { path: string }) => p.path,
      );

      if (
        !deepEqual([...currentLocations].sort(), [...desiredLocations].sort())
      ) {
        hasUpdates = true;
        logger.warn(
          `Virtual folder ${desiredVF.name} exists but locations differ - updates not yet supported`,
        );
        logger.warn(`  Current: [${currentLocations.join(", ")}]`);
        logger.warn(`  Desired: [${desiredLocations.join(", ")}]`);
      }
    }
  }

  if (virtualFoldersToCreate.length === 0 && !hasUpdates) {
    return undefined;
  }

  return { virtualFolders: virtualFoldersToCreate };
}

export async function applyLibrary(
  client: JellyfinClient,
  libraryConfig: LibraryConfig | undefined,
): Promise<void> {
  if (!libraryConfig?.virtualFolders) {
    return;
  }

  for (const virtualFolder of libraryConfig.virtualFolders) {
    logger.info(`Creating virtual folder: ${virtualFolder.name}`);

    const addVirtualFolderDto: AddVirtualFolderDtoSchema =
      mapVirtualFolderConfigToAddVirtualFolderDto(virtualFolder);

    await client.addVirtualFolder(
      virtualFolder.name,
      virtualFolder.collectionType as CollectionTypeSchema,
      addVirtualFolderDto,
    );

    logger.info(
      `✓ Created virtual folder: ${virtualFolder.name} (${virtualFolder.collectionType})`,
    );
  }
}
