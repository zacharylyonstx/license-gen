# license-gen

Generate LICENSE files from the command line. 10+ templates. Auto-fills year and author name.

## Quick Start

```bash
npx license-gen mit          # Generate MIT license
npx license-gen apache       # Apache 2.0
npx license-gen list         # Show all available licenses
```

## Features

- **10+ license templates** — MIT, Apache-2.0, GPL-3.0, BSD-2, BSD-3, ISC, MPL-2.0, Unlicense, CC0
- **Auto-detects author** — reads `git config user.name` or `package.json`
- **Current year** — auto-filled, override with `--year`
- **Zero dependencies** — pure Node.js
- **Works with npx** — no install needed

## Usage

```bash
# Basic
npx license-gen mit

# With overrides
npx license-gen apache --name "Jane Doe" --year 2025

# Custom output file
npx license-gen bsd-3 --output LICENSE.md

# List all licenses
npx license-gen list
```

## Available Licenses

| Command | License | SPDX |
|---------|---------|------|
| `mit` | MIT License | MIT |
| `apache` | Apache License 2.0 | Apache-2.0 |
| `gpl` | GNU GPL v3 | GPL-3.0-only |
| `bsd-2` | BSD 2-Clause | BSD-2-Clause |
| `bsd-3` | BSD 3-Clause | BSD-3-Clause |
| `isc` | ISC License | ISC |
| `mpl` | Mozilla Public License 2.0 | MPL-2.0 |
| `unlicense` | The Unlicense | Unlicense |
| `cc0` | CC0 1.0 Universal | CC0-1.0 |

## Why?

Because every new project needs a LICENSE file, and copying from GitHub templates is tedious. This takes 2 seconds.

## Support

If this saves you time:
- ⭐ [Star on GitHub](https://github.com/zacharylyonstx/license-gen)
- 💖 [GitHub Sponsors](https://github.com/sponsors/zacharylyonstx)

## License

MIT
