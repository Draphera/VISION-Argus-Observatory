# ARGUS Observatory Pre-Freeze Public Guide

Status: pre-freeze public documentation  
Scope: sanitized public observatory only

## What This Repository Is

This repository is the public ARGUS Observatory surface.

It publishes only sanitized, aggregate evidence generated from private VISION
analysis.

It is not the VISION runtime.

It is not TITANO.

It is not a CAD upload service.

It is not a certification service.

## Public Evidence Contract

The public repository must preserve this contract:

```text
0 raw files published
0 coordinates exposed
100% sanitized output boundary
read-only public observatory
```

This is the core promise of the public interface.

## Private vs Public Boundary

Private:

- Watchdog raw intake
- quarantine
- raw CAD / HPGL-family files
- ARGUS full analysis
- VNF
- certified HPGL2
- VISION core
- TITANO / LEXICON / THEMIS / TERMINUS

Public:

- aggregate metrics
- public summary JSON
- public summary CSV
- static observatory HTML
- documentation
- contact metadata form

## Allowed Public Files

- `index.html`
- `contact.html`
- `reports/global_observatory.html`
- `data/public_summary.json`
- `data/public_summary.csv`
- `data/eco_impact_summary.json`
- `docs/*.md`

## Forbidden Public Files

Never commit:

- `.hpgl`
- `.hpgl2`
- `.hpg`
- `.hp`
- `.plt`
- `.plx`
- `.astm`
- `.dxf`
- `.iso`
- `.aama`
- `.vnf`
- `.vnf.json`
- ZIP archives containing customer files
- raw customer exports
- screenshots revealing customer geometry
- local file paths

## Public Report Meaning

ARGUS public metrics are evidence.

They are not:

- certification claims
- production guarantees
- machine instructions
- Canon changes
- Lexicon promotions

## Contact Form Boundary

The public form collects metadata only.

It must never accept attachments.

If a customer wants to share a sample, the correct flow is:

```text
metadata request
-> private reply
-> quarantine channel
-> manual audit
-> private Watchdog / ARGUS analysis
-> sanitized aggregate public evidence
```

## Pre-Freeze Public Checklist

Before publishing:

- [ ] `npm run build` passes.
- [ ] no CAD/VNF extension exists under `public\`.
- [ ] no local path appears in public HTML/JSON/CSV.
- [ ] no customer filename appears in public HTML/JSON/CSV.
- [ ] `contact.html` is metadata-only.
- [ ] `reports/global_observatory.html` is sanitized.
- [ ] `data/public_summary.json` is aggregate-only.
- [ ] `data/public_summary.csv` is aggregate-only.

## Deployment

Build:

```powershell
npm run build
```

Push:

```powershell
git add .
git commit -m "Update ARGUS observatory documentation"
git push
```

Vercel serves the generated static output.

The public site must remain static except for the metadata-only contact
function.

