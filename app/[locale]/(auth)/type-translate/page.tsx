'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Mic, FileAudio, Upload, ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


const LANGUAGE_CODES = {
    'English': 'en',
    'Hindi': 'hi',
    'Tamil': 'ta',
    'Bengali': 'bn',
    'Punjabi': 'pa',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Japanese': 'ja',
    'Korean': 'ko',
} as const;

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_RECORDING_DURATION = 30000;

interface TranslationProgress {
    stage: 'idle' | 'converting' | 'translating' | 'generating' | 'complete';
    percent: number;
}

export default function AudioTranslator() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [sourceLanguage, setSourceLanguage] = useState('English');
    const [targetLanguage, setTargetLanguage] = useState('Hindi');
    const [translatedAudio, setTranslatedAudio] = useState<string | null>(null);
    const [translatedText, setTranslatedText] = useState<string>('');
    const [progress, setProgress] = useState<TranslationProgress>({ stage: 'idle', percent: 0 });
    const [showPreview, setShowPreview] = useState(false);

    const { toast } = useToast();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const recordingTimerRef = useRef<NodeJS.Timeout>();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const cleanupAudioResources = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        if (translatedAudio) {
            URL.revokeObjectURL(translatedAudio);
        }
    }, [audioUrl, translatedAudio]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast({
                title: "File too large",
                description: "Please select a file smaller than 20MB",
                variant: "destructive",
            });
            return;
        }

        const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/m4a'];
        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please select a valid audio file (MP3, WAV, or M4A)",
                variant: "destructive",
            });
            return;
        }

        cleanupAudioResources();
        const newAudioUrl = URL.createObjectURL(file);
        setAudioFile(file);
        setAudioUrl(newAudioUrl);
        setTranslatedAudio(null);
        setTranslatedText('');

        toast({
            title: "File selected",
            description: `Selected file: ${file.name}`,
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                cleanupAudioResources();
                const newAudioUrl = URL.createObjectURL(audioBlob);
                const newFile = new File([audioBlob], 'recorded_audio.wav', { type: 'audio/wav' });

                setAudioFile(newFile);
                setAudioUrl(newAudioUrl);
                setIsRecording(false);
                setRecordingTime(0);

                stream.getTracks().forEach(track => track.stop());

                toast({
                    title: "Recording completed",
                    description: "Your audio has been recorded successfully.",
                });
            };

            setIsRecording(true);
            mediaRecorderRef.current.start();

            let time = 0;
            recordingTimerRef.current = setInterval(() => {
                time += 100;
                setRecordingTime(time);
                if (time >= MAX_RECORDING_DURATION) {
                    stopRecording();
                }
            }, 100);

        } catch (err) {
            toast({
                title: "Recording failed",
                description: "Microphone access denied or not available",
                variant: "destructive",
            });
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        }
    };

    const handleTranslate = async () => {
        if (!audioFile) {
            toast({
                title: "No audio file",
                description: "Please upload an audio file or record audio first",
                variant: "destructive",
            });
            return;
        }
    
        setProgress({ stage: 'converting', percent: 0 });
    
        try {
            // Step 1: Convert audio to text
            setProgress({ stage: 'converting', percent: 25 });
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('language', LANGUAGE_CODES[sourceLanguage as keyof typeof LANGUAGE_CODES]);
    
            const speechResponse = await fetch('/api/speech-to-text', {
                method: 'POST',
                body: formData,
            });
    
            if (!speechResponse.ok) {
                const error = await speechResponse.json();
                throw new Error(error.error || 'Speech to text conversion failed');
            }
    
            const { text } = await speechResponse.json();
            console.log('Speech to text result:', text); // Debug log
    
            if (!text) {
                throw new Error('No text was transcribed from the audio');
            }
    
            setTranslatedText(text);
    
            // Step 2: Translate text
            setProgress({ stage: 'translating', percent: 50 });
            const translateResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    targetLanguage: LANGUAGE_CODES[targetLanguage as keyof typeof LANGUAGE_CODES],
                }),
            });
    
            if (!translateResponse.ok) {
                const error = await translateResponse.json();
                throw new Error(error.error || 'Translation failed');
            }
    
            const { translatedText } = await translateResponse.json();
            console.log('Translation result:', translatedText); // Debug log
    
            if (!translatedText) {
                throw new Error('No translation was generated');
            }
    
            setTranslatedText(translatedText);
    
            // Step 3: Convert translated text to speech
            setProgress({ stage: 'generating', percent: 75 });
            const ttsResponse = await fetch('/api/text-to-speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: translatedText,
                    language: LANGUAGE_CODES[targetLanguage as keyof typeof LANGUAGE_CODES],
                }),
            });
    
            if (!ttsResponse.ok) {
                const error = await ttsResponse.json();
                throw new Error(error.error || 'Text-to-speech conversion failed');
            }
    
            const audioBlob = await ttsResponse.blob();
            if (!audioBlob.size) {
                throw new Error('Generated audio is empty');
            }
    
            // Step 4: Create downloadable URL
            cleanupAudioResources();
            const url = URL.createObjectURL(audioBlob);
            setTranslatedAudio(url);
            setProgress({ stage: 'complete', percent: 100 });
    
            toast({
                title: "Translation completed",
                description: "Your audio has been translated successfully.",
            });
        } catch (error) {
            console.error('Translation error:', error);
            setProgress({ stage: 'idle', percent: 0 });
            toast({
                title: "Translation failed",
                description: error instanceof Error ? error.message : "Failed to translate audio. Please try again.",
                variant: "destructive",
            });
        }
    };

    React.useEffect(() => {
        return () => {
            cleanupAudioResources();
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        };
    }, [cleanupAudioResources]);


    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-100 to-red-100 p-6">
            <div className="max-w-4xl mx-auto">
                <Card className="border-4 border-yellow-500">
                    <CardHeader>
                        <Link href="/" className="inline-flex items-center text-red-700 hover:text-red-800">
                            <ArrowLeft className="mr-2" size={20} />
                            Back to Home
                        </Link>
                        <CardTitle className="text-4xl text-red-700 text-center mt-4">
                            Audio Translator
                            <span className="block text-lg text-orange-700 mt-2">
                                Translate your audio between {Object.keys(LANGUAGE_CODES).length} languages
                            </span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6">
                            {/* File Upload Area */}
                            <div className="rounded-lg border-2 border-dashed border-orange-300 p-6 bg-orange-50">
                                <label htmlFor="audio-upload" className="flex flex-col items-center cursor-pointer">
                                    <Upload className="h-12 w-12 text-orange-600 mb-4" />
                                    <span className="text-sm text-orange-700 font-medium">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-xs text-orange-600 mt-1">
                                        MP3, WAV, or M4A (MAX. 20MB)
                                    </span>
                                    <input
                                        id="audio-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="audio/*"
                                    />
                                </label>
                                {audioFile && (
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-orange-700">
                                            Selected: {audioFile.name}
                                        </p>
                                        {audioUrl && (
                                            <audio
                                                ref={audioRef}
                                                controls
                                                className="mt-2 w-full max-w-md mx-auto"
                                                src={audioUrl}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Language Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-orange-700">Source Language</label>
                                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select source language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(LANGUAGE_CODES).map((lang) => (
                                                <SelectItem key={lang} value={lang}>
                                                    {lang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-orange-700">Target Language</label>
                                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(LANGUAGE_CODES).map((lang) => (
                                                <SelectItem key={lang} value={lang}>
                                                    {lang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Progress Indicator */}
                            {progress.stage !== 'idle' && (
                                <div className="space-y-2">
                                    <Progress value={progress.percent} className="w-full" />
                                    <p className="text-sm text-center text-orange-700">
                                        {progress.stage === 'converting' && 'Converting speech to text...'}
                                        {progress.stage === 'translating' && 'Translating text...'}
                                        {progress.stage === 'generating' && 'Generating translated audio...'}
                                        {progress.stage === 'complete' && 'Translation complete!'}
                                        {' '}({progress.percent}%)
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row justify-center gap-4">
                                <Button
                                    onClick={handleTranslate}
                                    disabled={progress.stage !== 'idle' || !audioFile}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {progress.stage !== 'idle' ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FileAudio className="mr-2" size={20} />
                                            Translate Audio
                                        </>
                                    )}
                                </Button>

                                {translatedAudio && (
                                    <>
                                        <Button
                                            onClick={() => setShowPreview(true)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            <FileAudio className="mr-2" size={20} />
                                            Preview Translation
                                        </Button>

                                        <Button
                                            asChild
                                            className="bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            <a
                                                href={translatedAudio}
                                                download={`translated_${sourceLanguage}_to_${targetLanguage}.wav`}
                                            >
                                                <Download className="mr-2" size={20} />
                                                Download Translation
                                            </a>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Record Button */}
                            <div className="text-center space-y-2">
                                <Button
                                    variant="outline"
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={progress.stage !== 'idle'}
                                    className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${isRecording ? 'animate-pulse' : ''
                                        }`}
                                >
                                    <Mic className="mr-2" size={20} />
                                    {isRecording
                                        ? `Recording... (${((MAX_RECORDING_DURATION - recordingTime) / 1000).toFixed(1)}s)`
                                        : 'Record Audio'}
                                </Button>
                                {isRecording && (
                                    <p className="text-sm text-orange-600">
                                        Click again to stop recording
                                    </p>
                                )}
                            </div>

                            {/* Translation Preview Dialog */}
                            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Translation Preview</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {translatedText && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Translated Text:</p>
                                                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                                                    {translatedText}
                                                </p>
                                            </div>
                                        )}
                                        {translatedAudio && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Translated Audio:</p>
                                                <audio
                                                    controls
                                                    className="w-full"
                                                    src={translatedAudio}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Add API route for translation (pages/api/translate.ts or app/api/translate/route.ts)
export async function POST(req: Request) {
    try {
        const { text, targetLanguage } = await req.json();

        // In production, replace this with your preferred translation service
        // Example using Google Cloud Translation API:
        // const translation = await translateClient.translate(text, targetLanguage);

        // Mock translation for example
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
        );

        const data = await response.json();
        return new Response(JSON.stringify({ translatedText: data[0][0][0] }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Translation failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}