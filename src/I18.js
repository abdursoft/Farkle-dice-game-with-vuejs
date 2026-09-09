// src/i18n.js
import { createI18n } from 'vue-i18n'

import EN from './i18/en.json'
import BN from './i18/bn.json'
import HI from './i18/hi.json'
import ES from './i18/es.json'

const messages = {
    EN, BN, HI, ES
}

const numberFormats = {
  'en-US': { currency: { style: 'currency', currency: 'USD' }, decimal: { style: 'decimal', minimumFractionDigits: 2 }, percent: { style: 'percent' } },
  'bn-BD': { currency: { style: 'currency', currency: 'BDT' }, decimal: { style: 'decimal', minimumFractionDigits: 2 }, percent: { style: 'percent' } },
  'hi-IN': { currency: { style: 'currency', currency: 'INR' }, decimal: { style: 'decimal', minimumFractionDigits: 2 }, percent: { style: 'percent' } },
  'es-ES': { currency: { style: 'currency', currency: 'EUR' }, decimal: { style: 'decimal', minimumFractionDigits: 2 }, percent: { style: 'percent' } },
  // ... (other number formats, same as you have now)
}

export function createCustomI18n(locale = 'EN') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'EN',
    messages,
    numberFormats,
  })
}