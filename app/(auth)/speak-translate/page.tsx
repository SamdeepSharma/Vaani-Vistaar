'use client'

import React, { useState } from 'react';
import { ArrowRight, Globe, Mic, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const TranslateComponent: React.FC = () => {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('hindi');

  const handleTranslate = () => {
    console.log('Translating:', textToTranslate, 'from', fromLanguage, 'to', toLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-red-100 px-6 py-12 md:px-40 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl w-full border-4 border-yellow-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-red-700">
            Language Translator
          </h1>
         
        </div>
        <p className="text-lg text-orange-700 mb-8 text-center">Bridging cultures through words</p>
        
        <div className="mb-8">
          <label className="block text-orange-800 text-lg font-semibold mb-3">
            What would you like to translate?
          </label>
          <textarea
            className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-300 transition duration-200 resize-none h-44 placeholder-gray-400"
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
            placeholder="Enter your text here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-orange-800 text-lg font-semibold mb-3">
              From language
            </label>
            <div className="relative">
              <select
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-300 transition duration-200 appearance-none text-orange-800"
                value={fromLanguage}
                onChange={(e) => setFromLanguage(e.target.value)}
              >
                <option value="auto">Auto-detect</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
                <option value="bengali">Bengali</option>
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600" size={24} />
            </div>
          </div>
          
          <div>
            <label className="block text-orange-800 text-lg font-semibold mb-3">
              To language
            </label>
            <div className="relative">
              <select
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-300 transition duration-200 appearance-none text-orange-800"
                value={toLanguage}
                onChange={(e) => setToLanguage(e.target.value)}
              >
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
                <option value="bengali">Bengali</option>
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            className="bg-red-600 hover:bg-red-700 text-yellow-100 font-semibold py-3 px-8 rounded-full transition duration-200 flex items-center shadow-lg"
            onClick={handleTranslate}
          >
            Translate <ArrowRight className="ml-3" size={20} />
          </button>
        </div>

        <div className="text-center text-orange-700">
          <button className="flex items-center justify-center mx-auto text-red-600 hover:text-red-700 transition duration-200 font-semibold">
            <Mic className="mr-2" size={20} />
            Or translate by speaking
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslateComponent;