import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Globe, Headphones, Video, Users, Book, Zap, ArrowLeft } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] to-[#E6D2B5] text-[#4A0E0E]">
        <HeroSection />
        <MainContent />
        <Footer />
      </div>
    </>
  );
}

function HeroSection() {
  const t = useTranslations('HeroSection');
  return (
    <div className="relative h-96 bg-[#4A0E0E] bg-opacity-90 backdrop-blur-md shadow-md overflow-hidden">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <BackToHomeButton />
        <LanguageSelector />
      </div>
      <div className="absolute inset-0 bg-opacity-50 bg-[url('/paisley-pattern.png')] mix-blend-overlay"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Image src="/logo.png" alt={t('logoAlt')} width={150} height={150} className="mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-[#F5E6D3] mb-4">{t('title')}</h1>
          <p className="text-2xl text-[#F5E6D3]">{t('subtitle')}</p>
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <MissionStatement />
      <Services />
      <ImpactSection />
      <CallToAction />
    </div>
  );
}

function BackToHomeButton() {
  const t = useTranslations('Navigation');
  return (
    <Link href="/" className="inline-flex items-center px-4 py-2 bg-[#F5E6D3] text-[#4A0E0E] rounded-md hover:bg-[#E6D2B5] transition-colors duration-300">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {t('backToHome')}
    </Link>
  );
}

function MissionStatement() {
  const t = useTranslations('MissionStatement');
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('title')}</h2>
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#4A0E0E]">
        <p className="text-lg mb-4">{t('paragraph1')}</p>
        <p className="text-lg">{t('paragraph2')}</p>
      </div>
    </section>
  );
}

function Services() {
  const t = useTranslations('Services');
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Globe className="h-12 w-12 text-[#FF9933]" />}
          title={t('textTranslation.title')}
          description={t('textTranslation.description')}
        />
        <FeatureCard
          icon={<Headphones className="h-12 w-12 text-[#FF9933]" />}
          title={t('audioTranslation.title')}
          description={t('audioTranslation.description')}
        />
        <FeatureCard
          icon={<Video className="h-12 w-12 text-[#FF9933]" />}
          title={t('videoTranslation.title')}
          description={t('videoTranslation.description')}
        />
        <FeatureCard
          icon={<Users className="h-12 w-12 text-[#FF9933]" />}
          title={t('communityDriven.title')}
          description={t('communityDriven.description')}
        />
        <FeatureCard
          icon={<Book className="h-12 w-12 text-[#FF9933]" />}
          title={t('educationalResources.title')}
          description={t('educationalResources.description')}
        />
        <FeatureCard
          icon={<Zap className="h-12 w-12 text-[#FF9933]" />}
          title={t('realTimeTranslation.title')}
          description={t('realTimeTranslation.description')}
        />
      </div>
    </section>
  );
}

function ImpactSection() {
  const t = useTranslations('Impact');
  const impactItems = t.raw('items');

  const getImpactArray = (items: any): string[] => {
    if (Array.isArray(items)) {
      return items;
    }
    if (typeof items === 'string') {
      return items.split(',').map(item => item.trim());
    }
    if (typeof items === 'object' && items !== null) {
      return Object.values(items).map(String);
    }
    console.warn('Unexpected type for impact items:', typeof items);
    return [];
  };

  const impactArray = getImpactArray(impactItems);

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('title')}</h2>
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#4A0E0E]">
        {impactArray.length > 0 ? (
          <ul className="list-disc pl-6 space-y-4">
            {impactArray.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No impact items available.</p>
        )}
      </div>
    </section>
  );
}

function CallToAction() {
  const t = useTranslations('CallToAction');
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold mb-6">{t('title')}</h2>
      <p className="text-lg mb-8">{t('description')}</p>
    </section>
  );
}

function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="flex flex-col gap-6 px-5 py-10 text-center @container bg-[#4A0E0E] bg-opacity-90 backdrop-blur-md shadow-md text-[#F5E6D3]">
      <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
        <Link href="#" className="text-l text-base font-normal leading-normal min-w-40">{t('helpCenter')}</Link>
        <Link href="#" className="text-l text-base font-normal leading-normal min-w-40">{t('contactSupport')}</Link>
        <Link href="#" className="text-l text-base font-normal leading-normal min-w-40">{t('productUpdates')}</Link>
        <Link href="#" className="text-l text-base font-normal leading-normal min-w-40">{t('pricing')}</Link>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <SocialIcon href="#" icon="twitter" />
        <SocialIcon href="#" icon="facebook" />
        <SocialIcon href="#" icon="instagram" />
        <SocialIcon href="#" icon="linkedin" />
        <SocialIcon href="#" icon="youtube" />
      </div>
      <p className="text-l text-base font-normal leading-normal">{t('copyright')}</p>
    </footer>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-[#4A0E0E] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold ml-4">{title}</h3>
      </div>
      <p>{description}</p>
    </div>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: string }) {
  const iconPaths: { [key: string]: string } = {
    twitter: "M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z",
    facebook: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z",
    instagram: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z",
    linkedin: "M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z",
    youtube: "M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"
  };

  return (
    <Link href={href}>
      <div className="text-l">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d={iconPaths[icon]}></path>
        </svg>
      </div>
    </Link>
  );
}
