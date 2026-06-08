# VISION Argus Observatory - Contact Form Deployment

Status: public metadata intake  
Runtime: Vercel serverless function  
Endpoint: `/api/contact`

## Purpose

The contact form sends metadata-only intake requests to the Draphera mailbox.

It does not accept CAD files, ZIP files, HPGL files, VNF files, coordinates, or customer geometry.

## Required Vercel Environment Variables

Configure these in:

```text
Vercel Project Settings -> Environment Variables
```

Required:

```text
RESEND_API_KEY=<your Resend API key>
CONTACT_TO=draphera.team@gmail.com
CONTACT_FROM=VISION Argus Observatory <verified-sender@your-domain>
```

For early tests, Resend can use its sandbox sender, but production should use a verified Draphera domain sender.

## Runtime Behavior

The browser posts JSON metadata to:

```text
/api/contact
```

The serverless function:

1. validates required fields
2. checks the honeypot field
3. sanitizes values
4. sends an email through Resend
5. returns JSON status to the browser

## Safety Boundary

The public form must never:

- upload raw CAD files
- accept ZIP attachments
- execute TITANO
- run ARGUS analysis
- update LEXICON
- certify files
- expose private customer geometry

The form only starts the human quarantine conversation.

## Failure Modes

If `RESEND_API_KEY` is missing, the function returns:

```json
{ "ok": false, "error": "send_failed" }
```

If required fields are missing, the function returns:

```json
{ "ok": false, "error": "missing_required_fields" }
```

If the honeypot field is filled, the function returns success and silently ignores the request.

## Deployment Checklist

1. Push the repository to GitHub.
2. Connect the repository to Vercel.
3. Add `RESEND_API_KEY`, `CONTACT_TO`, and `CONTACT_FROM`.
4. Redeploy.
5. Submit a test request from `/contact.html`.
6. Confirm email arrives at `draphera.team@gmail.com`.

## Troubleshooting

Use the production alias, not an immutable preview deployment URL:

```text
https://vision-argus-observatory.vercel.app/contact
```

If the browser shows:

```text
Request could not be sent.
```

check Vercel:

```text
Project -> Functions -> /api/contact -> Logs
```

Expected log prefix:

```text
VISION_ARGUS_CONTACT_SEND_FAILED
```

Common causes:

- `RESEND_API_KEY` is missing or configured only for Preview but not Production.
- `CONTACT_FROM` is not a verified Resend sender.
- Resend sandbox sender is being used with an unverified recipient.
- The site is being tested from an old preview deployment URL.

For production, use a verified sender domain. Example:

```text
CONTACT_FROM=VISION Argus Observatory <intake@draphera.com>
```

If you need temporary diagnostics, add:

```text
CONTACT_DEBUG=true
```

Then redeploy. The API response will include the Resend HTTP status code, while detailed provider output remains in Vercel logs.

## Notes

This is not a production file intake system.

Real files must enter through a private quarantine channel and manual audit workflow.
