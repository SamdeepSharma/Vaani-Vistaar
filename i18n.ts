import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  let messages;

  try {
    // Try to load the locale-specific messages
    messages = (await import(`./locales/${locale}/about.json`)).default;
  } catch (error) {
    // Log the error for debugging purposes
    console.error(`Error loading messages for locale "${locale}":`, error);
    
    // Fallback to the default locale (for example, 'en') if messages are not found
    try {
      messages = (await import(`./locales/en/about.json`)).default;
      console.warn(`Falling back to the default locale "en" due to missing messages for locale "${locale}".`);
    } catch (fallbackError) {
      console.error('Error loading fallback messages for default locale "en":', fallbackError);
      throw new Error(`Messages not found for default locale: en.`);
    }
  }

  return {
    messages: messages
  };
});
