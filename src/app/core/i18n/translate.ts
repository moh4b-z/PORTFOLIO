import { pt } from './locales/pt';

export type TranslationTree = typeof pt;

type Join<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`;

export type TranslationKey<T = TranslationTree, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? Join<Prefix, K>
    : TranslationKey<T[K], Join<Prefix, K>>;
}[keyof T & string];

export function translate(tree: TranslationTree, key: TranslationKey): string {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (typeof node === 'object' && node !== null && part in node) {
      return (node as Record<string, unknown>)[part];
    }

    return undefined;
  }, tree);

  return typeof value === 'string' ? value : key;
}
