import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation resources
import tr from './locales/tr.json';
import en from './locales/en.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

// Initialize i18n
const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('language');
  const userLang = savedLanguage || 'tr';

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: userLang,
      fallbackLng: 'tr',
      interpolation: {
        escapeValue: false,
      },
    });

  // Save language preference
  i18n.on('languageChanged', async (lng) => {
    await AsyncStorage.setItem('language', lng);
  });
};

initI18n();

export default i18n;
