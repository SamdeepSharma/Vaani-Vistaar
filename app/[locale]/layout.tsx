import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }, { locale: 'mr' }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Fallback to checking the cookie if middleware doesn't run
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
  const selectedLocale = locale || cookieLocale || 'en'; // Default to 'en'

  let messages;
  try {
    // Attempt to import messages for the selected locale
    messages = (await import(`../../locales/${selectedLocale}/about.json`)).default;
  } catch (error) {
    notFound(); // If locale is invalid, trigger a 404
  }

  return (
    <html lang={selectedLocale}>
      <body>
        <NextIntlClientProvider locale={selectedLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
