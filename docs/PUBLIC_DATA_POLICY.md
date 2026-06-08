# Public Data Policy

## Allowed

The public repository may contain only sanitized aggregate data:

- vendor-level metrics
- command reduction percentages
- SP/LB aggregate usage
- risk distributions
- public observatory HTML
- parametric eco-impact summaries
- documentation

## Forbidden

The public repository must never contain:

- raw CAD files
- HPGL / HPGL2 source files
- VNF files
- coordinates
- customer filenames
- local filesystem paths
- private hashes tied to customer identity
- production machine output

## Rule

If a file can reveal customer geometry, customer identity, production details, or machine-ready output, it must not be committed.
