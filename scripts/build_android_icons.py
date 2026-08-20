from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
source = Image.open(root / "client/public/assets/hungry-alien-worms-mascot-crop.png").convert("RGBA")
android_res = root / "android/app/src/main/res"
densities = {"mipmap-mdpi": 48, "mipmap-hdpi": 72, "mipmap-xhdpi": 96, "mipmap-xxhdpi": 144, "mipmap-xxxhdpi": 192}

for folder, size in densities.items():
    target_dir = android_res / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGBA", (size, size), "#e8fff3")
    draw = ImageDraw.Draw(canvas)
    inset = max(2, size // 18)
    draw.ellipse((inset, inset, size - inset, size - inset), fill="#b9f5cf", outline="#0f8d7c", width=max(1, size // 28))
    mascot = source.copy()
    mascot.thumbnail((int(size * 0.82), int(size * 0.72)), Image.Resampling.LANCZOS)
    x = (size - mascot.width) // 2
    y = (size - mascot.height) // 2
    canvas.alpha_composite(mascot, (x, y))
    canvas.convert("RGB").save(target_dir / "ic_launcher.png")
    canvas.convert("RGB").save(target_dir / "ic_launcher_round.png")

    foreground = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fg_mascot = source.copy()
    fg_mascot.thumbnail((int(size * 0.70), int(size * 0.62)), Image.Resampling.LANCZOS)
    foreground.alpha_composite(fg_mascot, ((size - fg_mascot.width) // 2, (size - fg_mascot.height) // 2))
    foreground.save(target_dir / "ic_launcher_foreground.png")
