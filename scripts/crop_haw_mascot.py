from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets/hungry-alien-worms-frame100.png')
target = Path('/home/ubuntu/webdev-static-assets/hungry-alien-worms-mascot-crop.png')

image = Image.open(source).convert('RGBA')
pixels = image.load()
points = []
for y in range(image.height):
    for x in range(image.width):
        r, g, b, a = pixels[x, y]
        if a > 30 and min(r, g, b) < 220:
            points.append((x, y))

if not points:
    raise RuntimeError('No mascot pixels detected')

xs, ys = zip(*points)
margin = 28
left = max(0, min(xs) - margin)
top = max(0, min(ys) - margin)
right = min(image.width, max(xs) + margin)
bottom = min(image.height, max(ys) + margin)

crop = image.crop((left, top, right, bottom))
crop.save(target)
print(f'{target} {crop.width}x{crop.height}')
