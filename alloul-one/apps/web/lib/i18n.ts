import { cookies } from 'next/headers'
import ar from '@/messages/ar.json'
import en from '@/messages/en.json'
import zh from '@/messages/zh.json'
import ko from '@/messages/ko.json'

export const locales = ['ar', 'en', 'zh', 'ko'] as const
export type Locale = (typeof locales)[number]

const dict = { ar, en, zh, ko } as const

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get('locale')?.value as Locale | undefined
  return value && locales.includes(value) ? value : 'en'
}

export async function t(key: string): Promise<string> {
  const locale = await getLocale()
  return (dict[locale] as Record<string, string>)[key] || key
}
