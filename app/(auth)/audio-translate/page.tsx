'use client'

import React, { useState } from 'react';
import { Mic, FileText, Globe, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AudioToTextConverter: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState('Hindi');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [transcriptionStyle, setTranscriptionStyle] = useState('Verbatim');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0]);
    }
  };

  const handleConvert = () => {
    // Implement conversion logic here
    console.log('Converting:', { audioFile, sourceLanguage, targetLanguage, transcriptionStyle });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-red-100 px-6 py-12 md:px-40 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl w-full border-4 border-yellow-500">
        <Link href="/type-translate" className="inline-flex items-center text-red-700 hover:text-red-800 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to Text to Audio
        </Link>

        <h1 className="text-4xl font-extrabold text-red-700 mb-8 text-center">
          Audio to Text Converter
          <span className="block text-lg text-orange-700 mt-2">Transform your audio into text</span>
        </h1>
        
        <div className="mb-8">
          <label className="block text-orange-800 text-lg font-semibold mb-3">
            Upload your audio file
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-orange-300 border-dashed rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-orange-600" />
                <p className="mb-2 text-sm text-orange-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-orange-600">MP3, WAV, or M4A (MAX. 20MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="audio/*" />
            </label>
          </div>
          {audioFile && (
            <p className="mt-2 text-sm text-orange-700">Selected file: {audioFile.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard 
            icon={<Globe size={24} />} 
            title="Source Language" 
            description={
              <select 
                className="w-full p-3 border border-orange-300 rounded-md text-orange-800 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                <option>Hindi</option>
                <option>English</option>
                <option>Tamil</option>
                <option>Bengali</option>
              </select>
            } 
          />
          <InfoCard 
            icon={<Globe size={24} />} 
            title="Target Language" 
            description={
              <select 
                className="w-full p-3 border border-orange-300 rounded-md text-orange-800 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Bengali</option>
              </select>
            } 
          />
          <InfoCard 
            icon={<FileText size={24} />} 
            title="Transcription Style" 
            description={
              <select 
                className="w-full p-3 border border-orange-300 rounded-md text-orange-800 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                value={transcriptionStyle}
                onChange={(e) => setTranscriptionStyle(e.target.value)}
              >
                <option>Verbatim</option>
                <option>Clean Read</option>
                <option>Intelligent Verbatim</option>
              </select>
            } 
          />
        </div>

        <div className="flex justify-center mb-8">
          <button
            className="bg-red-600 hover:bg-red-700 text-yellow-100 font-semibold py-3 px-8 rounded-full transition duration-200 flex items-center shadow-lg"
            onClick={handleConvert}
          >
            Convert to Text <FileText className="ml-3" size={20} />
          </button>
        </div>

        <div className="text-center text-orange-700">
          <button className="flex items-center justify-center mx-auto text-red-600 hover:text-red-700 transition duration-200 font-semibold">
            <Mic className="mr-2" size={20} />
            Or record your voice
          </button>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-orange-400 bg-orange-50 p-5 transition duration-200 hover:border-orange-500 hover:bg-orange-100 shadow-sm">
    <div className="text-red-600">{icon}</div>
    <h2 className="text-orange-800 text-lg font-semibold text-center">{title}</h2>
    <div className="w-full text-orange-700 text-sm text-center">{description}</div>
  </div>
);

export default AudioToTextConverter;