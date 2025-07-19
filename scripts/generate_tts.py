from TTS.api import TTS
import sys
import torch
import os

def generate_speech(text, output_path, speaker_reference, language):
    try:
        # Use CPU if CUDA is not available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}", file=sys.stderr)

        # Initialize TTS model with specific model name
        print("Loading TTS model...", file=sys.stderr)
        model_name = "tts_models/multilingual/multi-dataset/your_tts"
        
        # Initialize TTS with specific settings
        tts = TTS(
            model_name=model_name,
            progress_bar=False,
            gpu=torch.cuda.is_available()
        ).to(device)

        # Map input language codes to supported codes
        language_mapping = {
            'hi': 'en',    # Hindi -> English
            'en': 'en',    # English -> English
            'fr': 'fr-fr', # French -> French
            'pt': 'pt-br'  # Portuguese -> Brazilian Portuguese
        }

        # Get the supported language code, default to 'en' if not found
        supported_language = language_mapping.get(language.lower().split('-')[0], 'en')

        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Check if speaker reference exists
        if not os.path.exists(speaker_reference):
            print(f"Speaker reference file not found: {speaker_reference}", file=sys.stderr)
            return False

        print(f"Generating speech for text: {text[:50]}...", file=sys.stderr)
        print(f"Original language: {language}", file=sys.stderr)
        print(f"Mapped language: {supported_language}", file=sys.stderr)
        print(f"Output path: {output_path}", file=sys.stderr)
        print(f"Speaker reference: {speaker_reference}", file=sys.stderr)

        # Generate speech with explicit settings
        tts.tts_to_file(
            text=text,
            file_path=output_path,
            speaker_wav=speaker_reference,
            language=supported_language,
            decoder_iterations=30
        )

        if os.path.exists(output_path):
            print(f"Successfully generated speech file: {output_path}", file=sys.stderr)
            return True
        else:
            print(f"Failed to generate speech file", file=sys.stderr)
            return False

    except Exception as e:
        import traceback
        print(f"Error generating speech: {str(e)}", file=sys.stderr)
        print("Full traceback:", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: generate_tts.py <text> <output_path> <speaker_reference> <language>")
        sys.exit(1)

    text = sys.argv[1]
    output_path = sys.argv[2]
    speaker_reference = sys.argv[3]
    language = sys.argv[4]

    success = generate_speech(text, output_path, speaker_reference, language)
    sys.exit(0 if success else 1)