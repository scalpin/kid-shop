export const SITE_URL = 'https://krokha-trikotazhevna.ru'
export const SITE_NAME = 'Кроха Трикотажевна'
export const SITE_DESCRIPTION =
  'Производитель детской ясельной одежды оптом. Каталог, прайс-лист и контакты производства в Пензе.'
export const SITE_PHONE = '+7 927 287-69-26'
export const SITE_EMAIL = 'nataliya.abroskina@mail.ru'
export const SITE_ADDRESS = 'Пенза, ул. Терновского, 220'

export function absoluteUrl(path = '/') {
  if (!path) {
    return SITE_URL
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function createJsonLdMarkup(data) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }
}

