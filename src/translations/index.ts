import { en } from "./en";
import { km } from "./km";
import { zh } from "./zh";

export const translations = {
  en,
  km,
  zh,
} as const;

export type TranslationStructure = typeof en;
