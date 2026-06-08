const MAX_FIELD_LENGTH = 4000;

function sanitize(value) {
  return String(value || "")
    .replace(/\r/g, " ")
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

function htmlEscape(value) {
  return sanitize(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asBoolean(value) {
  return value === "on" || value === "true" || value === true;
}

function buildEmailHtml(payload) {
  const rows = [
    ["Name / company", payload.nameCompany],
    ["Email", payload.email],
    ["Vendor", payload.vendor],
    ["File family", payload.fileFamily],
    ["Machine / cutter", payload.machine],
    ["Notes", payload.notes],
    ["Rights confirmed", payload.rightsConfirmed ? "yes" : "no"],
    ["Quarantine acknowledged", payload.quarantineAcknowledged ? "yes" : "no"],
    ["Public metrics acknowledged", payload.publicMetricsAcknowledged ? "yes" : "no"]
  ];

  return `
    <h1>VISION Argus Observatory - Intake Request</h1>
    <p>Metadata-only contact request. No raw CAD file was uploaded through the public site.</p>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:14px;">
      ${rows.map(([label, value]) => `
        <tr>
          <th align="left">${htmlEscape(label)}</th>
          <td>${htmlEscape(value)}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

async function sendWithResend(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "draphera.team@gmail.com";
  const from = process.env.CONTACT_FROM || "VISION Argus Observatory <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `VISION ARGUS intake request - ${payload.vendor || "unknown vendor"}`,
      html: buildEmailHtml(payload)
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend rejected request: ${response.status} ${body}`);
  }
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  try {
    const body = request.body || {};
    if (sanitize(body.website).length > 0) {
      response.status(200).json({ ok: true, status: "ignored" });
      return;
    }

    const payload = {
      nameCompany: sanitize(body.name_company),
      email: sanitize(body.email),
      vendor: sanitize(body.vendor),
      fileFamily: sanitize(body.file_family),
      machine: sanitize(body.machine),
      notes: sanitize(body.notes),
      rightsConfirmed: asBoolean(body.rights_confirmed),
      quarantineAcknowledged: asBoolean(body.quarantine_acknowledged),
      publicMetricsAcknowledged: asBoolean(body.public_metrics_acknowledged)
    };

    const missingRequired =
      !payload.nameCompany ||
      !payload.email ||
      !payload.vendor ||
      !payload.fileFamily ||
      !payload.rightsConfirmed ||
      !payload.quarantineAcknowledged ||
      !payload.publicMetricsAcknowledged;

    if (missingRequired) {
      response.status(400).json({ ok: false, error: "missing_required_fields" });
      return;
    }

    await sendWithResend(payload);
    response.status(200).json({ ok: true, status: "sent" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ ok: false, error: "send_failed" });
  }
};
