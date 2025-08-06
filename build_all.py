import subprocess
import sys

def run_script(script_name):
    print(f"Running {script_name}...")
    result = subprocess.run([sys.executable, script_name])
    if result.returncode != 0:
        print(f"{script_name} failed with exit code {result.returncode}")
        sys.exit(result.returncode)

if __name__ == "__main__":
    run_script("encrypt_images.py")
    run_script("make_audio_index.py")
    print("All tasks complete.")