'use client'

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';


import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, Menu, ChevronRight, Link as LinkIcon } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const LogoSection = () => {
  const t = useTranslations('Common');
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md transition-transform transform group-hover:scale-105">
        <Image 
          src="/logo.png" 
          alt={t('logoAlt')}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E0E]/20 to-transparent" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-[#F5E6D3] text-2xl font-bold leading-tight tracking-tight group-hover:text-[#E6B587] transition-colors">
          {t('brandName')}
        </h2>
        <span className="text-[#F5E6D3]/80 text-xs font-medium leading-tight tracking-wider">
          {t('brandSlogan')}
        </span>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { data: session } = useSession();
  const t = useTranslations('Home');

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#F5E6D3] to-[#E6D2B5] overflow-x-hidden font-serif">
        <header className="sticky top-0 z-10 bg-[#4A0E0E] bg-opacity-90 backdrop-blur-md shadow-md flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10">
          <LogoSection />
          
          <nav className="hidden md:flex flex-1 justify-end items-center gap-8">
            <div className="flex items-center gap-6">
              {session ? (
                <>
                  <Link href="/speak-translate" className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors">{t('nav.voice')}</Link>
                  <Link href="/type-translate" className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors">{t('nav.text')}</Link>
                  <Link href="/watch-translate" className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors">{t('nav.video')}</Link>
                  <Link href="/about" className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors">{t('nav.aboutUs')}</Link>
                </>
              ) : (
                <p className="text-[#F5E6D3] text-sm font-medium leading-normal">{t('nav.signInPrompt')}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
            <LanguageSelector />
              {session ? (
                <button onClick={() => signOut()} className="px-4 py-2 bg-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#A0522D] transition-colors">{t('nav.signOut')}</button>
              ) : (
                <>
                  <Link href="/signup" className="px-4 py-2 bg-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#A0522D] transition-colors">{t('nav.signUp')}</Link>
                  <button onClick={() => signIn()} className="px-4 py-2 border border-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#C45C26] hover:text-[#F5E6D3] transition-colors">{t('nav.logIn')}</button>
                </>
              )}
            </div>
          </nav>
          <div className="md:hidden flex items-center gap-3">
            <LanguageSelector />
            <button className="text-[#F5E6D3]">
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="py-16 sm:py-24">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <div
                  className="flex min-h-[540px] flex-col gap-8 bg-cover bg-center bg-no-repeat items-start justify-end p-8 sm:p-12"
                  style={{ backgroundImage: 'linear-gradient(rgba(74, 14, 14, 0.7), rgba(74, 14, 14, 0.8)), url("https://cdn.usegalileo.ai/sdxl10/ec2655aa-d915-4b3b-aa43-9372efabf40e.png")' }}
                >
                  <div className="flex flex-col gap-6 text-left max-w-2xl">
                    <h1 className="text-[#F5E6D3] text-5xl sm:text-6xl font-black leading-tight tracking-tight">
                      {t('hero.title')}
                    </h1>
                    <h2 className="text-[#F5E6D3] text-xl sm:text-2xl font-normal leading-relaxed">
                      {t('hero.subtitle')}
                    </h2>
                  </div>
                  <div className="w-full max-w-2xl">
                    <label className="flex flex-col sm:flex-row w-full gap-3">
                      <div className="flex-1 flex items-stretch rounded-md bg-[#F5E6D3] shadow-lg">
                        {/* Add input fields here */}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* How it works section */}
            <section className="py-24">
              <div className="text-center mb-16">
                <h2 className="text-[#4A0E0E] text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
                  {t('howItWorks.title')}
                </h2>
                <p className="text-[#4A0E0E] text-xl font-normal leading-relaxed max-w-3xl mx-auto">
                  {t('howItWorks.description')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: t('howItWorks.step1'), img: "https://cdn.usegalileo.ai/sdxl10/8c45bef2-4de7-4a0a-8266-ec028f1275ab.png" },
                  { title: t('howItWorks.step2'), img: "https://cdn.usegalileo.ai/sdxl10/6ed72c54-a1ef-4847-b163-da7af6fe3ab2.png" },
                  { title: t('howItWorks.step3'), img: "https://cdn.usegalileo.ai/sdxl10/fb3697f2-38c6-45c1-9342-37f3fe801058.png" },
                  { title: t('howItWorks.step4'), img: "https://cdn.usegalileo.ai/sdxl10/3103c16a-7dcd-4ed6-8b10-92b6f3405ff6.png" },
                ].map((step, index) => (
                  <div key={index} className="flex flex-col gap-6 group">
                    <div className="relative">
                      <div className="absolute top-4 left-4 w-10 h-10 bg-[#C45C26] text-[#F5E6D3] rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                        style={{ backgroundImage: `url("${step.img}")` }}
                      ></div>
                    </div>
                    <p className="text-[#4A0E0E] text-lg font-medium leading-snug">{step.title}</p>
                  </div>
                ))}
              </div>
            </section>

            <ServicesSection />

            {/* CTA Section */}
            <section className="py-24">
              <div className="bg-[#4A0E0E] rounded-lg overflow-hidden shadow-xl">
                <div className="flex flex-col lg:flex-row items-center">
                  <div
                    className="w-full lg:w-1/2 bg-center bg-no-repeat aspect-video bg-cover"
                    style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/a473fed3-1e7b-47a2-980d-e434c234c0cf.png")' }}
                  ></div>
                  <div className="w-full lg:w-1/2 p-10 lg:p-16">
                    <h2 className="text-[#F5E6D3] text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
                      {t('cta.title')}
                    </h2>
                    <p className="text-[#F5E6D3] text-xl font-normal leading-relaxed mb-10">
                      {t('cta.description')} <Link href="/signup" className="underline">{t('cta.signUpLink')}</Link>
                    </p>
                    <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-3 bg-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#A0522D] transition-colors">
                      {t('cta.getStarted')}
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};


interface ServiceProps {
  title: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
  icon: string;
}

const ServiceCard: React.FC<ServiceProps> = ({ title, description, backgroundImage, buttonText, buttonLink, icon }) => (
  <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
      style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`}}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
    <div className="relative flex flex-col h-full justify-end p-6 sm:p-8 text-[#F5E6D3]">
      <div className="mb-4 transform transition-transform duration-500 group-hover:translate-y-1">
        <span className="inline-block p-3 bg-white bg-opacity-20 rounded-full mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </span>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-sm mb-4">{description}</p>
      </div>
      <Link href={buttonLink}>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-[#C45C26] text-white rounded-lg hover:bg-[#A0522D] transition-colors text-sm font-semibold">
          {buttonText}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </div>
  </div>
);

const ServicesSection: React.FC = () => {
  const { data: session } = useSession();
  const t = useTranslations('services');

  const handleServiceClick = (buttonLink: string) => {
    if (session) {
      window.location.href = buttonLink;
    } else {
      signIn();
    }
  };

  const services: ServiceProps[] = [
    {
      title: t('voiceTranslation.title'),
      description: t('voiceTranslation.description'),
      backgroundImage: "https://cdn.usegalileo.ai/sdxl10/d74c0973-62d8-42bd-94fc-00483262dff2.png",
      buttonText: t('voiceTranslation.buttonText'),
      buttonLink: "/speak-translate",
      icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    },
    {
      title: t('textTranslation.title'),
      description: t('textTranslation.description'),
      backgroundImage: "https://cdn.usegalileo.ai/sdxl10/ceca814b-106b-4e28-881f-65ba72e8d7df.png",
      buttonText: t('textTranslation.buttonText'),
      buttonLink: "/type-translate",
      icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
    },
    {
      title: t('videoTranslation.title'),
      description: t('videoTranslation.description'),
      backgroundImage: "https://cdn.usegalileo.ai/sdxl10/1ca36009-ba00-419b-8f01-5252812f6269.png",
      buttonText: t('videoTranslation.buttonText'),
      buttonLink: "/watch-translate",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    }
  ];

  return (
    <section className="py-24 bg-[#4A0E0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#F5E6D3] text-center mb-12">
          {t('title')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} onClick={() => handleServiceClick(service.buttonLink)}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const t = useTranslations('footer');
  
  return (
    <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
      <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around ">
        <Link href="#" className="text-[#4A0E0E] text-l text-base font-normal leading-normal min-w-40">
          {t('helpCenter')}
        </Link>
        <Link href="#" className="text-[#4A0E0E] text-l text-base font-normal leading-normal min-w-40">
          {t('contactSupport')}
        </Link>
        <Link href="#" className="text-[#4A0E0E] text-l text-base font-normal leading-normal min-w-40">
          {t('productUpdates')}
        </Link>
        <Link href="#" className="text-[#4A0E0E] text-l text-base font-normal leading-normal min-w-40">
          {t('pricing')}
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="#">
          <div className="text-[#4A0E0E] text-l">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
            </svg>
          </div>
        </Link>
        <Link href="#">
          <div className="text-[#4A0E0E] text-l">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
            </svg>
          </div>
        </Link>
        <Link href="#">
          <div className="text-[#4A0E0E] text-l">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
            </svg>
          </div>
        </Link>
        <Link href="#">
          <div className="text-[#4A0E0E] text-l">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
            </svg>
          </div>
        </Link>
        <Link href="#">
          <div className="text-[#4A0E0E] text-l">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"></path>
            </svg>
          </div>
        </Link>
        </div>
      <p className="text-[#4A0E0E] text-l text-base font-normal leading-normal">
        {t('copyright')}
      </p>
    </footer>
  );
};

export default HomePage;