/** A single selectable option in the `options` data-prop. Icon is slot-only. */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Optional muted second line. */
  description?: string;
}

/** A header-labelled group of options in the `options` data-prop. */
export interface SelectOptionGroup {
  label: string;
  /** Disables every option in the group. */
  disabled?: boolean;
  options: SelectOption[];
}

export type SelectOptions = ReadonlyArray<SelectOption | SelectOptionGroup>;

/** True when the entry is a group (has an `options` array), false for a leaf option. */
export function isOptionGroup(entry: SelectOption | SelectOptionGroup): entry is SelectOptionGroup {
  return Array.isArray((entry as SelectOptionGroup).options);
}
