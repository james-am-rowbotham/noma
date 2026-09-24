#!/usr/bin/env bash
# Cut a regional basemap out of Protomaps' daily planet file.
#
# The planet is ~138 GB; this reads only the byte ranges it needs over HTTP, so an Etna-sized
# extract is ~12 MB and takes about ten seconds. No API key, no account, no per-view cost.
# Data is OpenStreetMap under ODbL: attribution is required wherever the map is shown.
#
#   brew install pmtiles     # https://protomaps.com/docs/pmtiles
#   ./scripts/tiles.sh
#
# The output is NOT committed: it is generated, binary, and goes stale as OpenStreetMap changes.
set -euo pipefail

DAY="${DAY:-$(date -u -v-1d +%Y%m%d 2>/dev/null || date -u -d yesterday +%Y%m%d)}"
PLANET="${PLANET:-https://build.protomaps.com/${DAY}.pmtiles}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/tiles"
mkdir -p "$OUT"

extract() {   # name  west,south,east,north  maxzoom
  echo "==> $1"
  pmtiles extract "$PLANET" "$OUT/$1.pmtiles" --bbox="$2" --maxzoom="${3:-14}"
}

extract etna 14.7,37.4,15.4,38.0 14
# Kīlauea and Sakurajima follow when those systems do:
# extract kilauea    -155.5,19.2,-155.0,19.6 14
# extract sakurajima  130.5,31.4,130.8,31.7  14

ls -lh "$OUT"
