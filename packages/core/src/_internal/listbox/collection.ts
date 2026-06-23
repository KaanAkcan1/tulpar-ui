/** Minimal option shape the collection needs (the Select supplies real elements). */
export interface OptionLike {
  value: string;
  label: string;
  disabled: boolean;
  el: HTMLElement;
}

export interface CollectionItem extends OptionLike {
  index: number;
}

export interface Collection {
  items: CollectionItem[];
  labels: string[];
  indexByValue(value: string): number;
}

/** Build the ordered, index-stamped model from a pre-discovered option list. */
export function buildCollection(options: readonly OptionLike[]): Collection {
  const items: CollectionItem[] = options.map((o, index) => ({ ...o, index }));
  const labels = items.map((i) => i.label);
  return {
    items,
    labels,
    indexByValue(value: string): number {
      if (value === "") return -1;
      return items.findIndex((i) => i.value === value);
    },
  };
}
