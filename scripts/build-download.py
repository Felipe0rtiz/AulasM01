"""Build the standalone game without runtime dependencies or a local server."""
import argparse
import base64
import os
from pathlib import Path

repo = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=Path(os.environ.get('WORKSPACE_ROOT', repo)) / 'output' / 'tiger-club.html')
args = parser.parse_args()
html = (repo / 'index.html').read_text()
css = '\n'.join(line for line in (repo / 'styles.css').read_text().splitlines() if not line.startswith('@import '))
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + css + '</style>')
tiger = 'data:image/svg+xml;base64,' + base64.b64encode((repo / 'assets/tiger.svg').read_bytes()).decode()
html = html.replace('assets/tiger.svg', tiger)
symbols = (repo / 'assets/symbols.svg').read_text()
symbols = symbols[symbols.index('>') + 1:symbols.rindex('</svg>')]
html = html.replace('<body>', '<body><svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0" aria-hidden="true">' + symbols + '</svg>')
engine = (repo / 'game-engine.mjs').read_text().replace('export ', '')
app = (repo / 'app.mjs').read_text().split('\n', 1)[1]
html = html.replace('<script type="module" src="app.mjs"></script>', '<script>' + engine + '\n' + app + '</script>')
html = html.replace('assets/symbols.svg#', '#').replace('href="./"', 'href="#"')
html = html.replace('</style>', '.slot-symbol svg,.payout-item svg,.wild-icon svg,.brand-mark svg{stroke:none}</style>')
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(html)
print(args.output)
print(f'{args.output.stat().st_size:,} bytes; assets, styles and game logic embedded.')
