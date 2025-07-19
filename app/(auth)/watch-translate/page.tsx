// pages/translation-service.tsx
'use client'
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Star, Upload, Globe, Phone, Play } from 'phosphor-react';

const TranslationService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b fbg-gradient-to-b from-orange-100 to-red-100">
      <Head>
        <title>VaaniVista - Bridge of Indian Languages</title>
        <meta name="description" content="Translate your content into Indian regional languages with ease" />
      </Head>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />
        <HowItWorks />
        <RegionalLanguages />
     
      </main>
    </div>
  );
};

const HeroSection: React.FC = () => (
  <div className="relative h-[500px] rounded-3xl overflow-hidden mb-20 shadow-2xl">
    <Image
      src="https://cdn.usegalileo.ai/sdxl10/affa2011-1615-47c2-ac16-94d8af74d0cd.png"
      layout="fill"
      objectFit="cover"
      alt="Diverse Indian languages"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/70 to-blue-500/70" />
    <div className="absolute bottom-12 left-12 text-white max-w-2xl">
      <h1 className="text-6xl font-bold mb-6">VaaniVista</h1>
      <p className="text-2xl mb-8">Your voice in every language - Translate your content into Indian regional languages with ease</p>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-full text-xl transition duration-300 shadow-lg">
        Get Started
      </button>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const steps = [
    { icon: Upload, title: 'Upload Video', description: 'Upload your video content' },
    { icon: Globe, title: 'Choose Language', description: 'Select your desired regional language' },
    { icon: Phone, title: 'Select Voice', description: 'Pick a professional voice artist' },
    { icon: Play, title: 'Preview & Publish', description: 'Review and share your localized content' },
  ];

  return (
    <section className="mb-20">
      <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border-2 border-orange-200">
            <step.icon size={48} className="text-orange-500 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-blue-900">{step.title}</h3>
            <p className="text-gray-600 text-lg">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const RegionalLanguages: React.FC = () => {
  const languages = [
    { name: 'Hindi', nativeName: 'हिन्दी', imageId: 'a730c5fe-9c26-4b15-882d-8d524c41b3e0' },
    { name: 'Tamil', nativeName: 'தமிழ்', imageId: 'f626bf38-4dd3-4b92-9d15-a446005149cf' },
    { name: 'Bengali', nativeName: 'বাংলা', imageId: 'af68f04f-ed42-4002-a815-de4f9c526a3b' },
    { name: 'Telugu', nativeName: 'తెలుగు', imageId: '5701604f-9b7d-44de-b3fb-48594761b320' },
    { name: 'Marathi', nativeName: 'मराठी', imageId: '0ae42bbf-51a3-4bf4-93e3-1a0d10be67e7' },
    { name: 'Gujarati', nativeName: 'ગુજરાતી', imageId: '31eb8bf0-3d4a-4589-b49c-bdca9e077348' },
    { name: 'Kannada', nativeName: 'ಕನ್ನಡ', imageId: 'ac668a81-d62d-432d-92e3-5dad0a2d2f25' },
    { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', imageId: 'b8ab2394-5659-44c3-a597-77bf22b67e57' },
    { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', imageId: '8d1b06b0-bc39-4724-b96c-e04c3379aae8' },
  ];

  return (
    <section className="mb-20">
      <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">Indian Regional Languages</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-8">
        {languages.map((lang, index) => (
          <div key={index} className="text-center group">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition duration-300">
              <Image
                src={`https://cdn.usegalileo.ai/sdxl10/${lang.imageId}.png`}
                width={128}
                height={128}
                alt={lang.name}
                className="group-hover:scale-110 transition duration-300"
              />
            </div>
            <p className="font-semibold text-xl text-blue-900">{lang.name}</p>
            <p className="text-gray-600">{lang.nativeName}</p>
          </div>
        ))}
      </div>
    </section>
  );
};


export default TranslationService;