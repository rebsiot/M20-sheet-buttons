"""Build and validate an installable Foundry module ZIP (no world data access)."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'module.json').read_text(encoding='utf-8'))
module_id = manifest['id']
version = manifest['version']
assert module_id == 'wod20-dodge-button', 'Module ID changed unexpectedly'
assert manifest['manifest'] == 'https://github.com/rebsiot/M20-sheet-buttons/releases/latest/download/module.json'
zip_name = f'{module_id}-{version}.zip'
assert manifest['download'] == f'https://github.com/rebsiot/M20-sheet-buttons/releases/download/v{version}/{zip_name}'

include = [
    'module.json', 'README.md', 'CHANGELOG.md', 'TEST-REPORT.md',
    'HANDOFF-UPDATE-0.1.0.md', 'HANDOFF-UPDATE-0.1.1.md',
    'ICONS-CREDITS.md', 'icons/LICENSE.txt', 'icons/dodge.svg', 'src/main.js',
]
include.extend(str(p.relative_to(ROOT)) for p in sorted((ROOT / 'tests').glob('*.test.js')))
for rel in include:
    assert (ROOT / rel).is_file(), f'Missing source file: {rel}'

outdir = ROOT / 'dist'
outdir.mkdir(exist_ok=True)
out = outdir / zip_name
with ZipFile(out, 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    for rel in include:
        archive.write(ROOT / rel, arcname=f'{module_id}/{rel}')
with ZipFile(out) as archive:
    assert archive.testzip() is None, 'Bad ZIP CRC'
    prefix = module_id + '/'
    assert prefix + 'module.json' in archive.namelist(), 'Manifest is missing or misplaced'
    inside = json.loads(archive.read(prefix + 'module.json'))
    assert inside == manifest, 'Manifest in ZIP differs from source'
    for rel in manifest.get('esmodules', []) + manifest.get('styles', []) + ['icons/dodge.svg', 'ICONS-CREDITS.md']:
        assert prefix + rel in archive.namelist(), f'Missing packaged dependency: {rel}'
print(out)