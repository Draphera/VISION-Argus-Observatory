# VISION Argus Observatory

![Static Site](https://img.shields.io/badge/runtime-static--site-7fb1d8)
![Read Only](https://img.shields.io/badge/ARGUS-read--only-7cc987)
![No Raw CAD](https://img.shields.io/badge/raw%20CAD-not%20published-d47772)
![Sanitized](https://img.shields.io/badge/public%20data-sanitized-c8aa62)
![Vercel](https://img.shields.io/badge/deploy-vercel-black)

Public sanitized observatory for industrial CAD / HPGL evidence produced by VISION ARGUS.

> Private CAD intelligence stays private. Public evidence stays useful. That boundary is the product.

## Public Evidence Contract

```text
0 raw files published
0 coordinates exposed
100% sanitized output boundary
read-only public observatory
```

This repository is a public evidence surface, not a production runtime.

## Current Public Snapshot

Status: first real sanitized Watchdog observatory snapshot

The current public data summarizes a private intake cycle:

- `163` files observed privately
- `162` files quarantined privately
- `0` suspicious files
- `22` safe observations
- `5` duplicate-only warnings
- `135` observations queued for controlled review

No raw files, coordinates, customer filenames, local paths, VNF artifacts, or
machine output are published.

## Live Surfaces

- `index.html` - public observatory landing page
- `reports/global_observatory.html` - sanitized ARGUS report surface
- `contact.html` - metadata-only safe intake request
- `data/public_summary.json` - aggregate public summary
- `data/public_summary.csv` - aggregate public summary CSV
- `data/eco_impact_summary.json` - parametric eco-impact summary

## Purpose

ARGUS observes CAD/HPGL-family outputs and reports structural indicators such as:

- command reduction
- vendor fingerprints
- LB/SP usage
- path efficiency
- risk distribution
- parametric eco-impact estimates

ARGUS evidence helps explain industrial CAD normalization without exposing customer geometry.

## Safety Boundary

This public repository does not contain:

- raw CAD files
- HPGL / HPGL2 source files
- VNF files
- customer geometry
- coordinates
- local paths
- identifiable customer filenames
- production machine output

If a file can reveal customer geometry, customer identity, production details, or machine-ready output, it must not be committed.

## Private Boundary

The following remain private:

- VISION core
- TITANO
- LEXICON
- THEMIS
- Watchdog raw intake
- ARGUS full analysis
- CAD raw files
- VNF files
- certification pipeline

## Architecture

```text
Private VISION
  -> Watchdog quarantine
  -> ARGUS full analysis
  -> sanitized public export
  -> VISION Argus Observatory
```

ARGUS is read-only. Public data is aggregate and sanitized.

## Repository Layout

```text
.
├── api/
│   └── contact.js
├── data/
│   ├── public_summary.json
│   ├── public_summary.csv
│   ├── eco_impact_parameters.json
│   └── eco_impact_summary.json
├── docs/
│   ├── ARGUS_OBSERVATORY_PREFREEZE.md
│   ├── CONTACT_FORM_DEPLOYMENT.md
│   ├── DATASET_INTAKE_RULES.md
│   ├── PUBLIC_DATA_POLICY.md
│   └── SECURITY_MODEL.md
├── reports/
│   └── global_observatory.html
├── scripts/
│   └── build-static.js
├── contact.html
├── index.html
├── package.json
└── vercel.json
```

## Local Build

```powershell
npm run build
```

The build writes the static deployment bundle to:

```text
public/
```

The build script blocks CAD/VNF-family extensions from the public bundle.

## Public Export Guard

Run before publishing:

```powershell
npm run guard:public
```

Full pre-publish check:

```powershell
npm run prepublish:check
```

The guard fails if the public repository contains forbidden CAD/VNF-family
extensions, local paths, raw HPGL references, or coordinate-like command
streams.

## Vercel Deployment

The project is configured as a static Vercel site with a serverless metadata contact endpoint.

Required environment variables:

```text
RESEND_API_KEY=<resend-api-key>
CONTACT_TO=draphera.team@gmail.com
CONTACT_FROM=VISION Argus Observatory <verified-sender@your-domain>
```

The contact form posts metadata only to:

```text
/api/contact
```

It does not accept file uploads.

Deployment notes:

- `docs/CONTACT_FORM_DEPLOYMENT.md`
- `docs/ARGUS_OBSERVATORY_PREFREEZE.md`

## Dataset Intake

External CAD samples must never enter the public runtime.

Correct flow:

```text
metadata request
-> private reply
-> quarantine channel
-> manual audit
-> private Watchdog / ARGUS analysis
-> sanitized aggregate public evidence
```

See:

- `docs/DATASET_INTAKE_RULES.md`
- `docs/PUBLIC_DATA_POLICY.md`
- `docs/SECURITY_MODEL.md`

## Public Data Rules

Allowed:

- vendor-level aggregate metrics
- command reduction percentages
- SP/LB aggregate usage
- risk distributions
- static observatory HTML
- parametric eco-impact summaries
- documentation

Forbidden:

- raw CAD
- HPGL / HPGL2 source
- VNF
- coordinates
- customer filenames
- local paths
- private hashes tied to customer identity
- production machine output

## Status

Pre-freeze public observatory.

ARGUS full analysis remains private. The public repository contains only sanitized evidence and documentation.
