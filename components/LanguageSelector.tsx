'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

function setLanguage(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Update the cookie to persist the language selection
    setLanguage(newLocale);
    
    // Strip the current locale from the pathname and replace with the new one
    const newPathname = pathname.replace(new RegExp(`^/${locale}`), '');
    
    // Push the new locale to the URL
    router.push(`/${newLocale}${newPathname || '/'}`);
  };

  return (
    <div className="relative inline-block">
      <select
        onChange={handleChange}
        value={locale}
        className="appearance-none bg-transparent border-none text-[#F5E6D3] pr-8 pl-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5E6D3] cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-[#4A0E0E] text-[#F5E6D3]">
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#F5E6D3]">
        <Globe size={16} />
      </div>
    </div>
  );
};

export default LanguageSelector;
