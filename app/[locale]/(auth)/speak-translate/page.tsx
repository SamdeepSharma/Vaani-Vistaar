'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Mic } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const LANGUAGES = {
  'auto': 'Auto-detect',
  'en': 'English',
  'hi': 'Hindi',
  'ta': 'Tamil',
  'bn': 'Bengali',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'mr': 'Marathi',
  'pa': 'Punjabi',
  'te': 'Telugu',
  'ur': 'Urdu'
} as const;

interface TranscriptProps {
  transcript: string;
  resetTranscript: () => void;
  listening: boolean;
  browserSupportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
}

const TranslateComponent = () => {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('hi');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition() as TranscriptProps;

  useEffect(() => {
    if (transcript) {
      setTextToTranslate(transcript);
    }
  }, [transcript]);

  const handleTranslate = async () => {
    if (!textToTranslate.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/text-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToTranslate,
          source: fromLanguage,
          target: toLanguage,
        }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartListening = () => {
    setTextToTranslate('');
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: fromLanguage === 'auto' ? 'en-US' : fromLanguage });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  if (!isMicrophoneAvailable) {
    return <div>Please allow microphone access to use speech recognition.</div>;
  }

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
          <div className="relative">
            <textarea
              className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-300 transition duration-200 resize-none h-32 placeholder-gray-400"
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              placeholder="Enter your text here..."
            />
            <button
              className={`absolute bottom-3 right-3 p-2 rounded-full ${
                listening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-red-200 transition-colors duration-200`}
              onClick={listening ? handleStopListening : handleStartListening}
            >
              <Mic className={`${listening ? 'animate-pulse' : ''}`} size={20} />
            </button>
          </div>
          {listening && (
            <p className="text-sm text-red-600 mt-2">
              Listening... Click the microphone again to stop.
            </p>
          )}
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
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
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
                {Object.entries(LANGUAGES).filter(([code]) => code !== 'auto').map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600" size={24} />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button
            className="bg-red-600 hover:bg-red-700 text-yellow-100 font-semibold py-3 px-8 rounded-full transition duration-200 flex items-center shadow-lg disabled:opacity-50"
            onClick={handleTranslate}
            disabled={isLoading || !textToTranslate.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Translating...
              </span>
            ) : (
              <>
                Translate <ArrowRight className="ml-3" size={20} />
              </>
            )}
          </button>
        </div>

        {translatedText && (
          <div className="mb-8">
            <label className="block text-orange-800 text-lg font-semibold mb-3">
              Translation
            </label>
            <div className="w-full p-4 border-2 border-orange-300 rounded-xl bg-orange-50 min-h-[100px]">
              {translatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslateComponent;