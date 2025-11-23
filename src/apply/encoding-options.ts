import { deepEqual } from "fast-equals";
import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapEncodingOptionsConfigToSchema } from "../mappers/encoding-options";
import { type EncodingOptionsConfig } from "../types/config/encoding-options";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";

function hasEnableHardwareEncodingChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.enableHardwareEncoding === undefined) return false;

  const cur: boolean = Boolean(current.EnableHardwareEncoding);
  const next: boolean = desired.enableHardwareEncoding;

  return cur !== next;
}

function hasHardwareAccelerationTypeChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.hardwareAccelerationType === undefined) return false;

  const cur: string = current.HardwareAccelerationType ?? "none";
  const next: string = desired.hardwareAccelerationType;

  return cur !== next;
}

function hasHardwareDecodingCodecsChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.hardwareDecodingCodecs === undefined) return false;

  const cur: string[] = current.HardwareDecodingCodecs ?? [];
  const next: string[] = desired.hardwareDecodingCodecs;

  return !deepEqual([...cur].sort(), [...next].sort());
}

function hasEnableDecodingColorDepth10HevcChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.enableDecodingColorDepth10Hevc === undefined) return false;

  const cur: boolean = Boolean(current.EnableDecodingColorDepth10Hevc);
  const next: boolean = desired.enableDecodingColorDepth10Hevc;

  return cur !== next;
}

function hasEnableDecodingColorDepth10Vp9Changed(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.enableDecodingColorDepth10Vp9 === undefined) return false;

  const cur: boolean = Boolean(current.EnableDecodingColorDepth10Vp9);
  const next: boolean = desired.enableDecodingColorDepth10Vp9;

  return cur !== next;
}

function hasEnableDecodingColorDepth10HevcRextChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.enableDecodingColorDepth10HevcRext === undefined) return false;

  const cur: boolean = Boolean(current.EnableDecodingColorDepth10HevcRext);
  const next: boolean = desired.enableDecodingColorDepth10HevcRext;

  return cur !== next;
}

function hasEnableDecodingColorDepth12HevcRextChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.enableDecodingColorDepth12HevcRext === undefined) return false;

  const cur: boolean = Boolean(current.EnableDecodingColorDepth12HevcRext);
  const next: boolean = desired.enableDecodingColorDepth12HevcRext;

  return cur !== next;
}

function hasVaapiDeviceChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.vaapiDevice === undefined) return false;

  const cur: string = current.VaapiDevice ?? "";
  const next: string = desired.vaapiDevice;

  return cur !== next;
}

function hasQsvDeviceChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.qsvDevice === undefined) return false;

  const cur: string = current.QsvDevice ?? "";
  const next: string = desired.qsvDevice;

  return cur !== next;
}

function hasAllowHevcEncodingChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.allowHevcEncoding === undefined) return false;

  const cur: boolean = Boolean(current.AllowHevcEncoding);
  const next: boolean = desired.allowHevcEncoding;

  return cur !== next;
}

function hasAllowAv1EncodingChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.allowAv1Encoding === undefined) return false;

  const cur: boolean = Boolean(current.AllowAv1Encoding);
  const next: boolean = desired.allowAv1Encoding;

  return cur !== next;
}

export function calculateEncodingDiff(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): EncodingOptionsSchema | undefined {
  const patch: Partial<EncodingOptionsSchema> =
    mapEncodingOptionsConfigToSchema(desired);

  const hasChanges: boolean =
    hasEnableHardwareEncodingChanged(current, desired) ||
    hasHardwareAccelerationTypeChanged(current, desired) ||
    hasHardwareDecodingCodecsChanged(current, desired) ||
    hasEnableDecodingColorDepth10HevcChanged(current, desired) ||
    hasEnableDecodingColorDepth10Vp9Changed(current, desired) ||
    hasEnableDecodingColorDepth10HevcRextChanged(current, desired) ||
    hasEnableDecodingColorDepth12HevcRextChanged(current, desired) ||
    hasVaapiDeviceChanged(current, desired) ||
    hasQsvDeviceChanged(current, desired) ||
    hasAllowHevcEncodingChanged(current, desired) ||
    hasAllowAv1EncodingChanged(current, desired);

  if (!hasChanges) {
    return undefined;
  }

  if (hasEnableHardwareEncodingChanged(current, desired)) {
    logger.info(
      `EnableHardwareEncoding changed: ${String(current.EnableHardwareEncoding)} → ${String(desired.enableHardwareEncoding)}`,
    );
  }

  if (hasHardwareAccelerationTypeChanged(current, desired)) {
    logger.info(
      `HardwareAccelerationType changed: ${current.HardwareAccelerationType ?? "none"} → ${desired.hardwareAccelerationType ?? "none"}`,
    );
  }

  if (hasHardwareDecodingCodecsChanged(current, desired)) {
    logger.info(
      `HardwareDecodingCodecs changed: [${(current.HardwareDecodingCodecs ?? []).join(", ")}] → [${desired.hardwareDecodingCodecs?.join(", ") ?? ""}]`,
    );
  }

  if (hasEnableDecodingColorDepth10HevcChanged(current, desired)) {
    logger.info(
      `EnableDecodingColorDepth10Hevc changed: ${String(current.EnableDecodingColorDepth10Hevc)} → ${String(desired.enableDecodingColorDepth10Hevc)}`,
    );
  }

  if (hasEnableDecodingColorDepth10Vp9Changed(current, desired)) {
    logger.info(
      `EnableDecodingColorDepth10Vp9 changed: ${String(current.EnableDecodingColorDepth10Vp9)} → ${String(desired.enableDecodingColorDepth10Vp9)}`,
    );
  }

  if (hasEnableDecodingColorDepth10HevcRextChanged(current, desired)) {
    logger.info(
      `EnableDecodingColorDepth10HevcRext changed: ${String(current.EnableDecodingColorDepth10HevcRext)} → ${String(desired.enableDecodingColorDepth10HevcRext)}`,
    );
  }

  if (hasEnableDecodingColorDepth12HevcRextChanged(current, desired)) {
    logger.info(
      `EnableDecodingColorDepth12HevcRext changed: ${String(current.EnableDecodingColorDepth12HevcRext)} → ${String(desired.enableDecodingColorDepth12HevcRext)}`,
    );
  }

  if (hasVaapiDeviceChanged(current, desired)) {
    logger.info(
      `VaapiDevice changed: "${current.VaapiDevice ?? ""}" → "${desired.vaapiDevice ?? ""}"`,
    );
  }

  if (hasQsvDeviceChanged(current, desired)) {
    logger.info(
      `QsvDevice changed: "${current.QsvDevice ?? ""}" → "${desired.qsvDevice ?? ""}"`,
    );
  }

  if (hasAllowHevcEncodingChanged(current, desired)) {
    logger.info(
      `AllowHevcEncoding changed: ${String(current.AllowHevcEncoding)} → ${String(desired.allowHevcEncoding)}`,
    );
  }

  if (hasAllowAv1EncodingChanged(current, desired)) {
    logger.info(
      `AllowAv1Encoding changed: ${String(current.AllowAv1Encoding)} → ${String(desired.allowAv1Encoding)}`,
    );
  }

  const out: EncodingOptionsSchema = { ...current };

  if ("EnableHardwareEncoding" in patch) {
    out.EnableHardwareEncoding = patch.EnableHardwareEncoding;
  }

  if ("HardwareAccelerationType" in patch) {
    out.HardwareAccelerationType = patch.HardwareAccelerationType;
  }

  if ("HardwareDecodingCodecs" in patch) {
    out.HardwareDecodingCodecs = patch.HardwareDecodingCodecs;
  }

  if ("EnableDecodingColorDepth10Hevc" in patch) {
    out.EnableDecodingColorDepth10Hevc = patch.EnableDecodingColorDepth10Hevc;
  }

  if ("EnableDecodingColorDepth10Vp9" in patch) {
    out.EnableDecodingColorDepth10Vp9 = patch.EnableDecodingColorDepth10Vp9;
  }

  if ("EnableDecodingColorDepth10HevcRext" in patch) {
    out.EnableDecodingColorDepth10HevcRext =
      patch.EnableDecodingColorDepth10HevcRext;
  }

  if ("EnableDecodingColorDepth12HevcRext" in patch) {
    out.EnableDecodingColorDepth12HevcRext =
      patch.EnableDecodingColorDepth12HevcRext;
  }

  if ("VaapiDevice" in patch) {
    out.VaapiDevice = patch.VaapiDevice;
  }

  if ("QsvDevice" in patch) {
    out.QsvDevice = patch.QsvDevice;
  }

  if ("AllowHevcEncoding" in patch) {
    out.AllowHevcEncoding = patch.AllowHevcEncoding;
  }

  if ("AllowAv1Encoding" in patch) {
    out.AllowAv1Encoding = patch.AllowAv1Encoding;
  }

  return out;
}

export async function applyEncoding(
  client: JellyfinClient,
  updatedSchema: EncodingOptionsSchema | undefined,
): Promise<void> {
  if (!updatedSchema) {
    return;
  }

  await client.updateEncodingConfiguration(updatedSchema);
}
