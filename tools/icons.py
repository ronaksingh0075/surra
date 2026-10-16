"""Render Surra's app icons (PNG) from src/icons/icon.svg with headless Chromium."""
import pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'icons'
svg = (root / 'icon.svg').read_text()
# "any" icons get rounded corners; maskable and Apple icons stay full-bleed (the OS applies its own mask)
jobs = [('icon-192.png', 192, 0.22), ('icon-512.png', 512, 0.22), ('maskable-512.png', 512, 0), ('apple-touch-icon.png', 180, 0), ('favicon-32.png', 32, 0.22)]
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, size, radius in jobs:
        pg = b.new_page(viewport={'width': size, 'height': size})
        pg.set_content(f'<html><body style="margin:0;background:transparent"><div style="width:{size}px;height:{size}px;border-radius:{radius*size}px;overflow:hidden">{svg.replace("<svg ", f"<svg width=\"{size}\" height=\"{size}\" ")}</div></body></html>')
        pg.screenshot(path=str(root / name), omit_background=True)
        pg.close()
    # notification badge: a white bee on transparent; Android uses only its shape
    badge = (root / 'badge.svg').read_text().replace('<svg ', '<svg width="96" height="96" ')
    pg = b.new_page(viewport={'width': 96, 'height': 96})
    pg.set_content(f'<html><body style="margin:0;background:transparent">{badge}</body></html>')
    pg.screenshot(path=str(root / 'badge-96.png'), omit_background=True)
    pg.close()
    b.close()
print('icons written to', root)
