# scripts/translate_audio.py
import sys
import speech_recognition as sr
from googletrans import Translator
from gtts import gTTS
import os

def translate_audio(input_path, output_path, source_lang, target_lang):
    try:
        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Read the audio file
        with sr.AudioFile(input_path) as source:
            audio_data = recognizer.record(source)
            
        # Convert speech to text
        text = recognizer.recognize_google(audio_data, language=get_language_code(source_lang))
        
        # Translate text
        translator = Translator()
        translation = translator.translate(text, dest=get_language_code(target_lang))
        
        # Convert translated text to speech
        tts = gTTS(translation.text, lang=get_language_code(target_lang))
        tts.save(output_path)
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return False

def get_language_code(language):
    """Convert language names to ISO 639-1 codes"""
    language_codes = {
        'English': 'en',
        'Hindi': 'hi',
        'Tamil': 'ta',
        'Bengali': 'bn',
        'Punjabi': 'pa'
    }
    return language_codes.get(language, 'en')

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python translate_audio.py input_path output_path source_lang target_lang")
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    source_lang = sys.argv[3]
    target_lang = sys.argv[4]
    
    success = translate_audio(input_path, output_path, source_lang, target_lang)
    sys.exit(0 if success else 1)