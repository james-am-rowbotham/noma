# Standards Noma can lean on

Checked 2026-09-18 against the standards bodies' own sites and by live requests to the services.
Where a line says *(summary)*, the page was only seen through a fetch tool's summary, so treat it
with less confidence. Where it says *could not verify*, nothing below should be relied on.

This is a snapshot, not a decision. What Noma DOES with these lives in
`docs/architecture/domain-model.md` and, once settled, a decision record.

## The short version

| Concern | Standard | Version | JSON? |
|---|---|---|---|
| Earthquake events | QuakeML (ETH/SED, FDSN) | 1.2, 2013-02-14 | **No** official JSON |
| Getting earthquake data | FDSN web services | fdsnws-event 1.2, 2019-06-27 | spec defines only `xml` and `text` |
| Any measurement | OGC Observations, Measurements & Samples = ISO 19156:2023 | v3.0.0, 2023-05-26 | **No** approved JSON |
| Instruments and series | OGC SensorThings API Part 1 | 1.1, 2021-08-04 | yes, native |
| Provenance | W3C PROV-O | Recommendation 2013-04-30 | PROV-JSON is only a Member Submission |
| Rasters and model outputs, catalogued | STAC | 1.1.0, 2024-09-11; OGC Community Standard 2025 | yes, native (an Item is a GeoJSON Feature) |
| Raster files | Cloud Optimized GeoTIFF | OGC Standard 1.0, 2023-07-14 | n/a |
| Gridded data | NetCDF CF Conventions | CF-1.13, 2025-12-17 | n/a |
| Units | UCUM | 2.2, 2024-06-17 | n/a |
| Volcano identity | Smithsonian GVP Volcano Number | database VOTW 5.4.0 *(unconfirmed)* | WFS serves GeoJSON |
| Organisations | ROR | API v2 | yes |
| Aviation ash products | WMO IWXXM | 2025-2, 2025-11-19 | XML only |

## What changes how we build

**1. The standards give us names, not a JSON format.** Neither QuakeML nor the general observation
standard has an official JSON encoding. Whatever TypeScript types and tables Noma has will be ours,
using their vocabulary. There is nothing to "just adopt".

**2. A simulation IS an observation, according to the standard.** OGC 20-082r4 §8.2.2: "the terms
'observation', 'interpretation', 'forecast' and 'simulation' do correspond to this definition."
Annex D.2.4: "there is no conceptual distinction between observations, interpretations and
simulations." Table B.3 maps a simulator to `procedure`. SOSA's 2023 draft widens Sensor the same
way. So Noma's OBSERVED / MODELLED / FORECAST distinction must be Noma's own required field — the
standard will not enforce it and would happily erase it.

**3. GeoJSON from an earthquake service is not standard.** The fdsnws-event spec says the format is
"either xml (default) or text". GeoJSON is each provider's own invention and the two differ: INGV
uses `eventId`, `originId` and an ISO time string; USGS uses `mag`, epoch milliseconds and `status`.
And the `text` format cannot carry more than one origin or magnitude per event. An adapter that
honours "one event, several measurements" reads QuakeML XML.

**4. Depth will bite.** QuakeML depth is in **metres**, positive downward, and **may be negative**.
FDSN text output is in **kilometres**. Earthquakes above sea level inside a volcano are real: USGS
returned a depth of 0.04 km near Kīlauea. Both providers also put depth-in-km-positive-down in
GeoJSON's third coordinate, where RFC 7946 says "height in meters above or below the WGS 84
reference ellipsoid" — observed: `[14.776, 37.776, 16.1]` and `[-155.28, 19.42, 0.04]`.

**5. Coordinate order differs.** GeoJSON and CRS84 are longitude first. FDSN text is latitude first.

**6. Catalogues are revised.** By default a service returns only the *preferred* origin, and which
one is preferred is "data center dependent". USGS exposes `updated` and `status`. Keep
`updatedafter` so a re-sync is possible — and this is what `resultTime` is for.

**7. A product name is not a catalogue identity.** GVP has no entry for Sakurajima. It is filed under
**Aira, 282080**. (Etna is 211060; Kīlauea is 332010, spelled "Kilauea".) A System therefore needs
its own identity with external identifiers and names hanging off it, not a GVP number as its key.

**8. Licences differ per source, and one blocks us.** INGV: CC BY 4.0 (attribution is a legal
requirement, not a courtesy). USGS: US public domain, credit requested. WOVOdat: contributors own
the data, 2-year embargo, non-commercial only, **redistribution prohibited** *(summary)* — so it
cannot be bulk-ingested. A Source carries its licence.

**9. Magnitude type is free text, and the case differs.** INGV writes `ML`, USGS writes `ml`. Store
the type beside the value. *That the types are not comparable is standard seismology but was NOT
found stated in the spec; it needs a seismology reference before it goes in a record.*

**10. Unknown formats are not rejected uniformly.** INGV answered `format=json` with HTTP 200 and
QuakeML XML. Validate the content type, not the status code.

## Detail

### QuakeML 1.2
Spec: https://quake.ethz.ch/quakeml/Documents (`QuakeML-BED-20130214b.pdf`). `EventParameters`
contains `Event`; each holds `Origin` [0..*], `Magnitude` [0..*], `FocalMechanism`, `Pick`,
`Amplitude`, `StationMagnitude`. `Event` carries `preferredOriginID`, `preferredMagnitudeID`,
`preferredFocalMechanismID`. `CreationInfo`: `agencyID`, `agencyURI`, `author`, `authorURI`,
`creationTime`, `version`. Quantities: `value`, `uncertainty`, `lowerUncertainty`,
`upperUncertainty`, `confidenceLevel`. QuakeML 2.0 is not released — "an umbrella term for a
collection of several data models/schemas", with a request for comments and a user survey open to
2026-09-30. Design to 1.2.

### FDSN web services
https://www.fdsn.org/webservices/ — fdsnws-event 1.2, fdsnws-station 1.1, fdsnws-dataselect 1.1, all
2019-06-27. StationXML 1.2, 2022-02-25 *(summary)*. miniSEED 3 revision 2023-01-18, approval date
*could not verify*.

Live, 2026-09-18:

| | INGV `webservices.ingv.it/fdsnws/event/1/` | USGS `earthquake.usgs.gov/fdsnws/event/1/` |
|---|---|---|
| Responded | HTTP 200, 3 events near Etna | HTTP 200, near Kīlauea |
| `Access-Control-Allow-Origin` | `*` | `*` |
| Formats | `xml`, `text`, `geojson` | `quakeml`, `geojson`, `csv`, `kml`, `kmlraw`, `xml`, `text`, `cap` |
| Text `EventType` column (spec 1.2 requires it) | present | **omitted** |
| `format=json` | HTTP 200 + QuakeML XML | HTTP 400 |
| Licence | CC BY 4.0 — https://ingv.github.io/openapi/fdsnws/event/0.0.1/event.yaml | US public domain — https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits |

### Observations, Measurements & Samples (ISO 19156:2023)
https://docs.ogc.org/as/20-082r4/20-082r4.html — supersedes O&M 2.0 (2011). `Observation` has
`phenomenonTime`, `resultTime` (exactly one), `validTime`, `featureOfInterest`, `observedProperty`,
`result`, `observingProcedure`, `observer`, `host`. Also `ObservableProperty`, `Procedure`,
`ObservingProcedure`, `Observer`, `Host`, `Deployment`, `Sample` with `sampledFeature`.
`featureOfInterest` was kept; `proximateFeatureOfInterest` and `ultimateFeatureOfInterest` were
added. §8.2.4 Example 5: "The phenomenonTime is the time to which the result applies, while the
resultTime is the time at which the simulation was executed." `validTime` is "commonly required in
forecasting applications". No unit system mandated: "provision modality is to be defined by
communities".

### SensorThings API 1.1
https://docs.ogc.org/is/18-088/18-088.html — `Thing`, `Location`, `HistoricalLocation`,
`Datastream`, `MultiDatastream`, `Sensor`, `ObservedProperty`, `Observation`, `FeatureOfInterest`.
`unitOfMeasurement` "SHOULD follow the Unified Code for Unit of Measure (UCUM)". v2.0 is a draft
(23-019, v0.1, "This document is not an OGC Standard") that aligns with the 2023 observation model.

### SOSA/SSN
W3C Recommendation 2017-10-19 is still the only Recommendation. A "2023 Edition" is a Working Draft
dated 2026-09-14: https://www.w3.org/TR/vocab-ssn-2023/

### PROV
https://www.w3.org/TR/prov-o/ — `Entity`, `Activity`, `Agent`; `used`, `wasGeneratedBy`,
`wasDerivedFrom`, `wasAttributedTo`, `wasAssociatedWith`, `wasInformedBy`, `actedOnBehalfOf`,
`startedAtTime`, `endedAtTime`. `Plan` is an expanded term, a subclass of Entity.

### STAC, rasters, grids
STAC 1.1.0: https://github.com/radiantearth/stac-spec/releases · OGC Community Standard 25-004,
approved 2025-09-09: https://docs.ogc.org/cs/25-004/25-004.html · `Catalog`, `Collection`, `Item`,
`Asset`. COG: https://docs.ogc.org/is/21-026/21-026.html · CF-1.13, Standard Name Table v94
(2026-06-09, 5,071 entries, including `mass_concentration_of_volcanic_ash_in_air` and
`atmosphere_mass_content_of_sulfur_dioxide`): https://cfconventions.org/ · Zarr v3 core accepted
2023-05-15, current 3.1. GeoJSON RFC 7946, WGS84 only. OGC API – Features Part 1 v1.0.1, default
CRS84 (longitude, latitude): https://docs.ogc.org/is/17-069r4/17-069r4.html

### Volcano-specific
GVP web feature service: `https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows`, GeoJSON
output, layers include `Smithsonian_VOTW_Holocene_Volcanoes` and `..._Eruptions`. No CORS header
seen. **Terms of use: could not verify** — volcano.si.edu and si.edu returned 403 to every attempt.
The capabilities document's "Fees NONE / AccessConstraints NONE" is GeoServer's default text, not a
licence.

WOVOdat 2.0 *(all summary)*: MySQL plus a WOVOml XML schema, World Organization of Volcano
Observatories, hosted at the Earth Observatory of Singapore. Policy:
https://wovodat.org/populate/dataPolicy.php

IWXXM 2025-2: https://schemas.wmo.int/iwxxm/2025-2/ — `volcanicAshAdvisory.xsd`, `qvaci.xsd`
(quantitative ash concentration), `vona.xsd` (observatory notice for aviation); colour code list at
`codes.wmo.int/iwxxm/AviationColourCode`. ICAO's own definition text *could not verify*. The aviation
colour code is a separate scale from a ground alert level.

### Identifiers
ROR (https://ror.org/about/, data CC0): INGV `https://ror.org/00qps9a02`, USGS
`https://ror.org/035a68863`. FDSN networks (https://www.fdsn.org/networks/): `IV` = INGV national
network, DOI 10.13127/sd/x0fxnh7qfy; `HV` = Hawaiian Volcano Observatory, DOI 10.7914/SN/HV.
