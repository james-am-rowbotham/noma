#!/usr/bin/env bash
# Cut Noma's basemap out of Protomaps' daily planet file.
#
# The planet is ~138 GB; this reads only the byte ranges it needs. ONE file covers every region in
# scripts/regions.geojson — all three volcanoes together are ~26 MB and about thirty seconds. No
# API key, no account, no per-view cost.
#
# Adding a volcano is a polygon in regions.geojson and a re-run. Nothing in the app changes.
#
# Data is OpenStreetMap under ODbL: attribution is required wherever the map is shown, and is set
# on the source in src/map/basemap.ts so restyling cannot lose it.
#
#   brew install pmtiles     # https://protomaps.com/docs/pmtiles
#   ./scripts/tiles.sh
#
# The output is NOT committed: it is generated, binary, and goes stale as OpenStreetMap changes.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
DAY="${DAY:-$(date -u -v-1d +%Y%m%d 2>/dev/null || date -u -d yesterday +%Y%m%d)}"
PLANET="${PLANET:-https://build.protomaps.com/${DAY}.pmtiles}"
OUT="$HERE/../public/tiles"

mkdir -p "$OUT"
pmtiles extract "$PLANET" "$OUT/volcanoes.pmtiles" \
    --region="$HERE/regions.geojson" --maxzoom="${MAXZOOM:-14}"
ls -lh "$OUT"
