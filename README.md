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
