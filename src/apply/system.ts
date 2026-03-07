import { logger } from "../lib/logger";
import { ChangeSetBuilder, AtomicChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapSystemConfigurationConfigToSchema } from "../mappers/system";
import { type SystemConfig } from "../types/config/system";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { diff, applyChangeset, type IChange } from "json-diff-ts";

const SIMPLE_KEYS: string[] = [
  "ServerName",
  "PreferredMetadataLanguage",
  "MetadataCountryCode",
  "UICulture",
  "QuickConnectAvailable",
  "EnableMetrics",
  "EnableFolderView",
  "EnableGroupingMoviesIntoCollections",
  "EnableGroupingShowsIntoCollections",
  "DisplaySpecialsWithinSeasons",
  "EnableExternalContentInSuggestions",
  "ActivityLogRetentionDays",
  "LogFileRetentionDays",
  "LibraryMonitorDelay",
  "LibraryUpdateDuration",
  "LibraryScanFanoutConcurrency",
  "LibraryMetadataRefreshConcurrency",
  "RemoteClientBitrateLimit",
  "MinResumePct",
  "MaxResumePct",
  "MinResumeDurationSeconds",
];

export function calculateSystemDiff(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): ServerConfigurationSchema | undefined {
  const next: ServerConfigurationSchema =
    mapSystemConfigurationConfigToSchema(desired);

  const simpleDiff = diff(current, next, {
    treatTypeChangeAsReplace: false,
  });

  const simpleChanges: IChange[] = SIMPLE_KEYS.flatMap(
    (key: string) =>
      new ChangeSetBuilder(simpleDiff).withKey(key).withoutRemoves().toArray(),
  );

  const patch: IChange[] = new AtomicChangeSetBuilder([
    ...new ChangeSetBuilder(simpleChanges).atomize().toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { ".": "Name" },
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("PluginRepositories")
      .withoutRemoves()
      .atomize()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, { treatTypeChangeAsReplace: false }),
    )
      .withKey("TrickplayOptions")
      .withoutRemoves()
      .atomize()
      .withoutRemoves()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { SortReplaceCharacters: "$value" },
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("SortReplaceCharacters")
      .withoutRemoves()
      .atomize()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { SortRemoveCharacters: "$value" },
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("SortRemoveCharacters")
      .withoutRemoves()
      .atomize()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { SortRemoveWords: "$value" },
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("SortRemoveWords")
      .withoutRemoves()
      .atomize()
      .toArray(),
  ])
    .unatomize()
    .toArray();

  if (patch.length != 0) {
    logger.info(JSON.stringify(patch));
    return applyChangeset(current, patch) as ServerConfigurationSchema;
  }

  return undefined;
}

export async function applySystem(
  client: JellyfinClient,
  updatedSchema: ServerConfigurationSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;

  await client.updateSystemConfiguration(updatedSchema);
}
