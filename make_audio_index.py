import json
from pathlib import Path

# Settings
audio_folder = Path(__file__).parent / "Audio" / "Music"
output_file = audio_folder / "songs.json"

def generate_audio_index(folder: Path):
    mp3_files = [f.name for f in folder.rglob("*.mp3")]
    #mp3_files.sort()  # optional: sort alphabetically
    return mp3_files

if __name__ == "__main__":
    if not audio_folder.exists():
        print(f"ERROR: Audio folder does not exist: {audio_folder}")
        exit(1)

    audio_list = generate_audio_index(audio_folder)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(audio_list, f, indent=2)

    print(f"Generated {output_file} with {len(audio_list)} songs.")