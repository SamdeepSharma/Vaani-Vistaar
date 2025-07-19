import React from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

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

    const handleServiceClick = (buttonLink: string) => {
        if (session) {
            // User is signed in, allow them to proceed to the service
            window.location.href = buttonLink;
        } else {
            // User is not signed in, redirect to sign-in page
            signIn();
        }
    };


    const services: ServiceProps[] = [
      {
        title: "Voice Translation",
        description: "Convert spoken content between multiple regional and official languages instantly.",
        backgroundImage: "https://cdn.usegalileo.ai/sdxl10/d74c0973-62d8-42bd-94fc-00483262dff2.png",
        buttonText: "Start speaking",
        buttonLink: "/speak-translate",
        icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      },
      {
        title: "Text Translation",
        description: "Instantly translate written content into various regional and official languages.",
        backgroundImage: "https://cdn.usegalileo.ai/sdxl10/ceca814b-106b-4e28-881f-65ba72e8d7df.png",
        buttonText: "Start typing",
        buttonLink: "/type-translate",
        icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      },
      {
        title: "Video Translation",
        description: "Transform video content into multiple languages while preserving the original context.",
        backgroundImage: "https://cdn.usegalileo.ai/sdxl10/1ca36009-ba00-419b-8f01-5252812f6269.png",
        buttonText: "Start watching",
        buttonLink: "/watch-translate",
        icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      }
    ];

  return (
    <section className="py-24 bg-[#4A0E0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#F5E6D3] text-center mb-12">Our Services</h1>
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

export default ServicesSection;
