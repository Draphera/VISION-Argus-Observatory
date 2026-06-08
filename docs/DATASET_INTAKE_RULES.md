# Dataset Intake Rules

External samples must not enter any public runtime pipeline.

Submission flow:

```text
submitted
-> quarantined
-> audited
-> accepted or rejected
-> private dataset only
-> sanitized aggregate report
-> public repository
```

## Required Checks

- sharing permission confirmed
- file remains private
- extension checked
- size checked
- binary content checked
- path traversal checked
- customer identifiers removed from public outputs

## No Auto-Certification

Submitted files are not certified automatically.

Submitted files do not update Canon, Lexicon, or ARGUS public data automatically.
