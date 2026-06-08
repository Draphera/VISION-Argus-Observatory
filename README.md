# VISION Argus Observatory

Public sanitized observatory for industrial CAD / HPGL analysis metrics produced by VISION ARGUS.

## Purpose

This repository publishes aggregate, sanitized metrics only.

ARGUS observes CAD/HPGL-family outputs and reports structural indicators such as command reduction, vendor fingerprints, LB/SP usage, path efficiency, risk distribution, and parametric eco-impact estimates.

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

## Published Data

Only sanitized aggregate outputs are allowed:

- `data/public_summary.json`
- `data/public_summary.csv`
- `data/eco_impact_summary.json`
- `reports/global_observatory.html`
- `contact.html`
- public documentation

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
-> Watchdog / ARGUS full analysis
-> sanitized public export
-> VISION Argus Observatory
```

ARGUS is read-only. Public data is aggregate and sanitized.

## Status

Public observatory scaffold.

## Local Static Preview

Open `index.html` directly or deploy the repository as a static Vercel project.

## Contact Form

The contact form posts metadata only to `/api/contact`.

Required Vercel environment variables:

```text
RESEND_API_KEY=<resend-api-key>
CONTACT_TO=draphera.team@gmail.com
CONTACT_FROM=VISION Argus Observatory <verified-sender@your-domain>
```

The form does not accept file uploads.

Detailed deployment notes are in `docs/CONTACT_FORM_DEPLOYMENT.md`.
