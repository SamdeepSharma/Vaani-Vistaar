import whisper
import json
import sys
from itertools import groupby

def transcribe_audio(audio_path, output_path, speaker_segmentation=False):
    try:
        # Load the Whisper model
        print("Loading Whisper model...", file=sys.stderr)
        model = whisper.load_model("base")
        
        print(f"Transcribing audio file: {audio_path}", file=sys.stderr)
        # Transcribe the audio
        result = model.transcribe(audio_path)
        
        # Prepare the transcription data structure
        transcription_data = {
            'success': True,
            'text': result['text'],
            'segments': []
        }
        
        if speaker_segmentation:
            # Simulate speaker segmentation based on timestamps
            current_speaker = 0
            threshold = 5.0  # seconds between segments to assign a new speaker
            
            for i, segment in enumerate(result['segments']):
                if i > 0 and segment['start'] - result['segments'][i-1]['end'] > threshold:
                    current_speaker = (current_speaker + 1) % 2  # Alternate between speakers
                
                transcription_data['segments'].append({
                    'start': float(segment['start']),
                    'end': float(segment['end']),
                    'text': segment['text'].strip(),
                    'speaker': f"Speaker_{current_speaker + 1}"
                })
        else:
            for segment in result['segments']:
                transcription_data['segments'].append({
                    'start': float(segment['start']),
                    'end': float(segment['end']),
                    'text': segment['text'].strip()
                })

        # Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(transcription_data, f, ensure_ascii=False, indent=2)
        
        # Print to stdout for the API
        print(json.dumps(transcription_data))
        return True

    except Exception as e:
        error_response = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_response))
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Transcribe audio with optional speaker segmentation')
    parser.add_argument('audio_path', type=str, help='Path to the audio file')
    parser.add_argument('output_path', type=str, help='Path to the output JSON file')
    parser.add_argument('--speaker-segmentation', action='store_true', help='Enable speaker segmentation')
    
    args = parser.parse_args()
    
    success = transcribe_audio(args.audio_path, args.output_path, args.speaker_segmentation)
    sys.exit(0 if success else 1)