let translations = {};
let currentLang = 'en';

export async function loadTranslations(lang = document.documentElement.lang || 'en') {
  currentLang = lang;
  try {
    translations = await import(`./${lang}.json`);
  } catch (err) {
    console.error(`Could not load ${lang} translation:`, err);
    translations = {};
  }
}

export function t(key) {
  return translations[key] || key;
}

export async function changeLanguage(lang) {
  document.documentElement.lang = lang;
  await loadTranslations(lang);  
  return Promise.resolve();  
}
