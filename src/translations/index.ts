import { en } from './en'
import { hi } from './hi'

export type Language = 'en' | 'hi'
export type Translations = typeof en

export const translations = { en, hi } as unknown as Record<Language, Translations>

// Deep-get a translation value by dot-separated key path
export function getTranslation(lang: Language, key: string): string {
  const obj = translations[lang] as Record<string, unknown>
  const parts = key.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      // Fallback to English if key missing in selected language
      let fallback: unknown = translations.en as unknown
      for (const p of parts) {
        if (fallback && typeof fallback === 'object' && p in (fallback as object)) {
          fallback = (fallback as Record<string, unknown>)[p]
        } else {
          return key
        }
      }
      return typeof fallback === 'string' ? fallback : key
    }
  }
  return typeof current === 'string' ? current : key
}

export { en, hi }
