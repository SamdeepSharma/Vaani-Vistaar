import googletrans
import gtts
from pydub import AudioSegment
from IPython.display import Audio
import whisper

# Initialize translator
translator = googletrans.Translator()

def transcribe_audio(audio_file_path, source_language):
    # Load Whisper model (Choose 'base', 'small', 'medium', or 'large')
    model = whisper.load_model("base")
    # Transcribe audio directly from the MP3 file
    result = model.transcribe(audio_file_path)
    return result["text"]

def translate_text(text, target_language):
    translation = translator.translate(text, dest=target_language)
    return translation.text

def generate_audio(translated_text, target_language):
    # Convert translated text to audio in the target language
    converted_audio = gtts.gTTS(translated_text, lang=target_language)
    translated_audio_path = "translated_audio.mp3"
    converted_audio.save(translated_audio_path)
    return translated_audio_path