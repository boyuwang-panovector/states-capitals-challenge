import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path('/home/ubuntu/trailtrek-github')
GUIDES = ROOT / 'client/src/data/pronunciations.ts'
MODEL = ROOT / '.piper-voices/en_US-lessac-medium.onnx'
OUTPUT = ROOT / 'client/public/assets/pronunciation'
WORK = ROOT / '.pronunciation-work'

pattern = re.compile(
    r'\s{2}(\w+): \{ state: "[^"]+", capital: "[^"]+", stateSpeech: "([^"]+)", capitalSpeech: "([^"]+)" \},?'
)
entries = pattern.findall(GUIDES.read_text())
if len(entries) != 50:
    raise SystemExit(f'Expected 50 pronunciation entries, found {len(entries)}')

OUTPUT.mkdir(parents=True, exist_ok=True)
WORK.mkdir(parents=True, exist_ok=True)

def render(code: str, kind: str, phrase: str) -> None:
    wav = WORK / f'{code}-{kind}.wav'
    mp3 = OUTPUT / f'{code.lower()}-{kind}.mp3'
    subprocess.run(
        ['piper', '-m', str(MODEL), '-f', str(wav), '--length-scale', '0.92'],
        input=f'{phrase}.\n',
        text=True,
        check=True,
        stdout=subprocess.DEVNULL,
    )
    subprocess.run(
        ['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-codec:a', 'libmp3lame', '-q:a', '5', str(mp3)],
        check=True,
    )
    wav.unlink(missing_ok=True)

for code, state, capital in entries:
    render(code, 'state', state)
    render(code, 'capital', capital)

shutil.rmtree(WORK, ignore_errors=True)
print(f'Created {len(entries) * 2} Piper pronunciation clips in {OUTPUT}')
