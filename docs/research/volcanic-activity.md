# Etna's volcanic activity: what can be ingested, and what cannot

Checked 2026-09-24. Companion to [`standards.md`](standards.md) and
[`subsurface.md`](subsurface.md). Like those, it is largely a record of absences — and here the
absences are the point, because most of what a volcano observatory publishes is **pictures and PDFs
rather than numbers**, and no amount of engineering makes a PNG into a measurement.

Noma can only ingest what it may legally re-serve, so a licence is a hard gate, not a footnote.

## The one-line summary

| Data | State | Verdict |
|---|---|---|
| **INGV eruption catalogues** (DANTE, RESPIRA, OTETNA) | XLSX/CSV, **CC BY 4.0**, DOI-citable | **usable** |
| **GNSS position series** (RING) | `.pos`, per-epoch σ, **CC BY 4.0**, DOI `10.13127/ring` | **usable** |
| **NASA FIRMS thermal hotspots** | CSV, no key, attribution only | **usable** |
| **LiCSAR interferograms** | GeoTIFF, **OGL v3** + Copernicus attribution | usable, different licence |
| Volcanic tremor, operationally | **four PNG files**, refreshed every 5 minutes | not data |
| VONA notices and the ICAO colour code | **PDF only**, no feed | not data |
| MIROVA thermal | PNG only, non-commercial | blocked |
| INGV SO₂ flux | PDF bulletins | not data |
| **Smithsonian GVP eruptions** | non-commercial clause, endpoint unreachable | **blocked** |
| **Toulouse VAAC ash advisories** | best machine-readability found | **blocked: terms forbid systematic extraction** |

## Eruptions

**Nobody publishes Etna's eruptions through the earthquake standard.** QuakeML 1.2 defines
`volcanic eruption` as an event type and Noma's vocabulary already accepts it, but INGV's
fdsnws-event has no `eventtype` parameter at all, and every one of the 744 events in the Etna box
for 2021 — a year with 52 lava fountains — is typed `earthquake`. Measured here independently:
over five years, 2,969 `earthquake` and **1** `explosion`. USGS does fill that slot (74 volcanic
eruptions, mostly Kīlauea 2018). INGV does not. Do not wait for it to change.

**The Smithsonian Global Volcanism Program is the obvious source and cannot be used.** Its terms,
recovered from an archived copy because `volcano.si.edu` returns 403: *"You may not use the Content
for commercial purposes."* The database is stated to be uncopyrightable as US Government work, but
the same page carries a blanket non-commercial clause and the catalogue carries no CC0 mark. The
WFS endpoint could not be reached at all.

**INGV publishes three open Etna eruption datasets**, all CC BY 4.0 with an explicit redistribution
grant, discoverable through `https://oedatarep.ct.ingv.it/api/records?q=Etna` (47 records, each
carrying machine-readable rights):

| Dataset | What | Coverage | DOI |
|---|---|---|---|
| **DANTE** | historical eruptions | 66 rows 6th c. BC–1600, **260 rows 1600–2024** | `10.13127/etna/dante` |
| **RESPIRA** | lava-fountain source parameters | **141 events, 1986-09-24 → 2025-06-02** | `10.13127/etna/respira` |
| **OTETNA** | eruption onset times | 259 paroxysms, 1986–2022 | `10.13127/etna/otetna` |

DANTE's awkwardness is instructive rather than disqualifying: dates are prose (`"14 Feb-3 May"`,
`"≈500 BC"`), vents are crater codes rather than coordinates, the eruption-type vocabulary is
inconsistently cased, and lava volume is present in only 89 of 260 rows. Each of those forces
something Noma needs anyway — date precision as a modelled quantity, and "not reported" as a value
that can be said rather than a blank.

RESPIRA mixes provenance inside one table: column height is measured, while mass eruption rate and
total mass are derived from it. Those are different provenance classes in the same row.

INGV's *operational* bulletins are the opposite of its research datasets: the weekly and monthly
index serves 101 PDFs and zero machine-readable files.

## Volcanic tremor — the most-watched signal, and it is four images

Etna's tremor page embeds a viewer whose entire payload is a 5-minute meta-refresh and JavaScript
appending `0.png` … `3.png`. There are no numbers anywhere.

Machine-readable tremor exists only as **static research datasets** — `RMS_ECPN_EMFO_20_22`
(DOI `10.13127/etna/rmsecpnemfo2022`, CC BY 4.0), 5-minute RMS over 0.5–5.5 Hz, December 2020 to
February 2022, and then it stops. No EPOS tremor service was found.

The waveforms themselves are open (`IV.ECPN`, 3,038 m, Trillium 40S, 100 Hz, via
`webservices.ingv.it/fdsnws/dataselect`), so Noma could compute RMS itself — but that would be a
**CALCULATED** record with Noma as its source, which is a different claim from INGV's plot and must
be labelled as such (ADR-0005).

## Alert levels and aviation

INGV-OE issues Etna's VONA and its ICAO colour code, and publishes **only PDFs** at predictable
URLs. There is no feed: `?format=feed|atom|json` returns 404 and the directory listing 403. The
colour code exists only inside those documents.

**Toulouse VAAC is the best-engineered source found and is legally unusable.** Its advisories are
machine-readable with an archive back to 2006, and its terms state verbatim that *"only a private,
individual, and personal use is granted … expressly excluding any commercial or advertising
exploitation"* and prohibit *"repeated and systematic extraction."*

WMO's IWXXM schemas for ash advisories and volcano notices both exist and resolve — **and nobody
serves IWXXM for Etna.**

## Ground deformation

**RING** (`https://webring.gm.ingv.it:44324/`) serves GNSS position series with per-component
standard deviations. CC BY 4.0, DOI `10.13127/ring`. The `ESLN` series runs 2005-09-14 to
2026-01-21, daily, ~6,400 epochs, every row carrying σN ≈ 1.1 mm, σE ≈ 1.4 mm, σU ≈ 5.0 mm — so
vertical is roughly four times less certain than horizontal, the same pattern as earthquake depth.

**Two things must be said wherever this is shown.** First, the station moved ~38 cm east over 20
years and **most of that is the tectonic plate carrying Sicily, not Etna deforming** — volcano
signal is what remains after the regional field is removed, and raw motion presented beside a
volcano implies something untrue. Second, **Etna's summit GNSS is not openly published**: ESLN at
1,775 m is the highest open station, roughly 6 km from the craters.

Also open: Nevada Geodetic Laboratory processes the same stations (citation requested, no licence
stated), and **LiCSAR** covers Etna on two frames under **OGL v3** — note that the volcano portal's
*images* are CC BY-NC, which is a different thing from the products.

## Gas and thermal

**NASA FIRMS** is the one clean numeric feed: `SUOMI_VIIRS_C2_Europe_24h.csv`, no key, fire
radiative power in MW, attribution only, no non-commercial clause.

**HOTVOLC** (OPGC) is the most Noma-shaped thing found — CoverageJSON with UCUM units and QUDT
property URIs, a point series at Etna's summit, 15-minute cadence, CC BY-SA 4.0 — but its EPOS
endpoint ignored every time parameter tried and always returned the same 2021 sample.

Blocked or unusable: INGV FLAME SO₂ (PDF bulletins), MIROVA (PNG only, non-commercial), MOUNTS
(non-commercial), MODVOLC (no verified download URL).

## The alert level fits none of Noma's three families

It is not a measurement, not an event, and not a grid. It is **a categorical state asserted by a
named authority, valid until replaced**.

Modelling it as a datastream is wrong twice: there is no instrument, no unit and no uncertainty, and
interpolating between samples would invent an alert level that was never in force. Modelling it as
an event loses the interval — the *change* is an event but the *state* is the fact.

The honest shape is an interval-valued assertion: authority, scheme, value, valid from, valid to or
open, what superseded it, and the document it came from. And **two authorities can assert different
values at the same moment and both be correct** — an aviation colour code and a civil-protection
phase are different schemes, not a disagreement — which is domain-model point 10 appearing again in
a new place.

Its provenance class is awkward and should be settled before one is ever displayed: the assertion
itself is a fact, but what it asserts is a judgement. It is emphatically not FORECAST.

## Could not verify

Any GVP WFS response body. Etna's row in NASA's MSVOLSO2L4 SO₂ product (Earthdata login). A working
MODVOLC download URL. Any numeric export from MIROVA. Time-range querying of HOTVOLC through EPOS.
EGMS point density on Etna's summit.
