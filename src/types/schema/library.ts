import type { components } from "../../../generated/schema";

export type AddVirtualFolderDtoSchema =
  components["schemas"]["AddVirtualFolderDto"];

export type VirtualFolderInfoSchema =
  components["schemas"]["VirtualFolderInfo"];
export type CollectionTypeSchema = NonNullable<
  VirtualFolderInfoSchema["CollectionType"]
>;
export type LibraryOptionsSchema = components["schemas"]["LibraryOptions"];
export type MediaPathInfoSchema = components["schemas"]["MediaPathInfo"];
