import argparse
import os
import torch
import json
import sys
from pathlib import Path
from TTS.api import TTS

def get_model_name_for_language(language: str) -> str:
    """Get the appropriate TTS model name for a given language code."""
    language_model_map = {
        'en': 'tts_models/en/ljspeech/tacotron2-DDC',
        'hi': 'tts_models/hi/fairseq/vits',  # Hindi model
        'es': 'tts_models/es/css10/vits',    # Spanish model
        'fr': 'tts_models/fr/css10/vits',    # French model
        'de': 'tts_models/de/thorsten/vits', # German model
        'it': 'tts_models/it/mai_female/vits', # Italian model
        'ja': 'tts_models/ja/kokoro/tacotron2-DDC', # Japanese model
        'zh': 'tts_models/zh-CN/baker/tacotron2-DDC-GST', # Chinese model
    }
    return language_model_map.get(language, 'tts_models/multilingual/multi-dataset/xtts_v2')

def generate_tts(text: str, output_path: str, language: str, speaker_wav: str = None) -> bool:
    try:
        # Ensure output directory exists
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Use CPU if CUDA is not available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        try:
            # Get the appropriate model for the target language
            model_name = get_model_name_for_language(language)
            
            # Initialize TTS model with error handling
            tts = TTS(model_name, progress_bar=False)
            tts = tts.to(device)
            
            print(json.dumps({
                "status": "initialized",
                "model": model_name
            }))
            
        except Exception as model_error:
            print(json.dumps({
                "success": False,
                "error": f"Failed to initialize TTS model: {str(model_error)}"
            }))
            return False

        # Generate audio with better error handling
        try:
            if speaker_wav:
                tts.tts_to_file(
                    text=text,
                    speaker_wav=speaker_wav,
                    file_path=output_path,
                    language=language
                )
            else:
                tts.tts_to_file(
                    text=text,
                    file_path=output_path,
                    language=language
                )

            if not os.path.exists(output_path):
                raise Exception("Audio file was not generated")

            print(json.dumps({
                "success": True,
                "output_path": output_path
            }))
            return True

        except Exception as tts_error:
            print(json.dumps({
                "success": False,
                "error": f"Failed to generate audio: {str(tts_error)}"
            }))
            return False

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        return False

if __name__ == "__main__":
    # Redirect all stderr to devnull to prevent it from corrupting our JSON output
    sys.stderr = open(os.devnull, 'w')
    
    parser = argparse.ArgumentParser(description='Generate TTS audio')
    parser.add_argument('--text', type=str, required=True, help='Text to synthesize')
    parser.add_argument('--output', type=str, required=True, help='Output audio file path')
    parser.add_argument('--language', type=str, required=True, help='Target language code')
    parser.add_argument('--speaker_wav', type=str, help='Path to speaker reference audio (optional)')
    
    args = parser.parse_args()
    generate_tts(args.text, args.output, args.language, args.speaker_wav)