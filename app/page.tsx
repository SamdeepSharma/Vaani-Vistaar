'use client'

import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, Menu, ChevronRight, Link } from 'lucide-react';


const LogoSection = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md transition-transform transform group-hover:scale-105">
        <img 
          src="/logo.png" 
          alt="VaaniVista" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E0E]/20 to-transparent" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-[#F5E6D3] text-2xl font-bold leading-tight tracking-tight group-hover:text-[#E6B587] transition-colors">
          VaaniVista
        </h2>
        <span className="text-[#F5E6D3]/80 text-xs font-medium leading-tight tracking-wider">
          TRANSLATE • CONNECT
        </span>
      </div>
    </div>
  );
};


const HomePage = () => {
  const { data: session } = useSession();

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#F5E6D3] to-[#E6D2B5] overflow-x-hidden font-serif">
      <header className="sticky top-0 z-10 bg-[#4A0E0E] bg-opacity-90 backdrop-blur-md shadow-md flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10">
        <LogoSection />
        <nav className="hidden md:flex flex-1 justify-end items-center gap-8">
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <a className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors" href="/speak-translate">Voice</a>
                <a className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors" href="/type-translate">Text</a>
                <a className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors" href="/watch-translate">Video</a>
                <a className="text-[#F5E6D3] text-sm font-medium leading-normal hover:text-[#E6B587] transition-colors" href="/about">About Us</a>
              </>
            ) : (
              <p className="text-[#F5E6D3] text-sm font-medium leading-normal">Please sign in to access services.</p>
            )}
          </div>
          <div className="flex gap-3">
            {session ? (
              <button onClick={() => signOut()} className="px-4 py-2 bg-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#A0522D] transition-colors">Sign out</button>
            ) : (
              <>

                <a className="px-4 py-2 bg-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#A0522D] transition-colors" href="/signup">Sign up</a>
                <button onClick={() => signIn()} className="px-4 py-2 border border-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#C45C26] hover:text-[#F5E6D3] transition-colors">Log in</button>
              </>
            )}
          </div>
        </nav>
        <button className="md:hidden text-[#F5E6D3]">
          <Menu size={24} />
        </button>
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
                    Translate, transcribe, subtitle, and voiceover
                  </h1>
                  <h2 className="text-[#F5E6D3] text-xl sm:text-2xl font-normal leading-relaxed">
                    We help creators, businesses, and individuals expand their audience by translating their content into multiple languages.
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

         
          <section className="py-24">
            <div className="text-center mb-16">
              <h2 className="text-[#4A0E0E] text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
                How it works
              </h2>
              <p className="text-[#4A0E0E] text-xl font-normal leading-relaxed max-w-3xl mx-auto">
                Upload your content or enter a URL, we'll translate it into the language of your choice. We also offer transcription, subtitling, and voiceover services.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Upload your content or enter a URL", img: "https://cdn.usegalileo.ai/sdxl10/8c45bef2-4de7-4a0a-8266-ec028f1275ab.png" },
                { title: "Choose the language you want to translate into", img: "https://cdn.usegalileo.ai/sdxl10/6ed72c54-a1ef-4847-b163-da7af6fe3ab2.png" },
                { title: "We'll translate your content and send it back to you", img: "https://cdn.usegalileo.ai/sdxl10/fb3697f2-38c6-45c1-9342-37f3fe801058.png" },
                { title: "Download your translated content or publish it directly", img: "https://cdn.usegalileo.ai/sdxl10/3103c16a-7dcd-4ed6-8b10-92b6f3405ff6.png" },
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

          
          <section className="py-24">
            <div className="bg-[#4A0E0E] rounded-lg overflow-hidden shadow-xl">
              <div className="flex flex-col lg:flex-row items-center">
                <div
                  className="w-full lg:w-1/2 bg-center bg-no-repeat aspect-video bg-cover"
                  style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/a473fed3-1e7b-47a2-980d-e434c234c0cf.png")' }}
                ></div>
                <div className="w-full lg:w-1/2 p-10 lg:p-16">
                  <h2 className="text-[#F5E6D3] text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
                    Connect with the world through translation
                  </h2>
                  <p className="text-[#F5E6D3] text-xl font-normal leading-relaxed mb-10">
                    With VanniVista, you can read, listen to, and watch content in multiple languages. <a href="/signup" className="underline">Sign up today</a> and start translating your content into over 100 languages.
                  </p>
                  <a href="/signup" className="inline-flex items-center gap-2 px-4 py-3 bg-[#C45C26] text-[#F5E6D3] rounded-md hover:bg-[#A0522D] transition-colors">
                    Get started
                    <ChevronRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
