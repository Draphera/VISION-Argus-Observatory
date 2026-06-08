const MAX_FIELD_LENGTH = 4000;
const CONTACT_TO_DEFAULT = "draphera.team@gmail.com";
const CONTACT_FROM_DEFAULT = "VISION Argus Observatory <onboarding@resend.dev>";

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
  const to = (process.env.CONTACT_TO || CONTACT_TO_DEFAULT)
    .split(",")
    .map((value) => sanitize(value))
    .filter(Boolean);
  const from = process.env.CONTACT_FROM || CONTACT_FROM_DEFAULT;

  if (!apiKey) {
    const error = new Error("RESEND_API_KEY is not configured.");
    error.code = "provider_not_configured";
    throw error;
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
      html: buildEmailHtml(payload),
      text: buildEmailText(payload)
    })
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Resend rejected request: ${response.status} ${body}`);
    error.code = "provider_rejected";
    error.providerStatus = response.status;
    error.providerBody = body;
    throw error;
  }
}

function buildEmailText(payload) {
  return [
    "VISION Argus Observatory - Intake Request",
    "",
    "Metadata-only contact request. No raw CAD file was uploaded through the public site.",
    "",
    `Name / company: ${payload.nameCompany}`,
    `Email: ${payload.email}`,
    `Vendor: ${payload.vendor}`,
    `File family: ${payload.fileFamily}`,
    `Machine / cutter: ${payload.machine || "-"}`,
    `Notes: ${payload.notes || "-"}`,
    `Rights confirmed: ${payload.rightsConfirmed ? "yes" : "no"}`,
    `Quarantine acknowledged: ${payload.quarantineAcknowledged ? "yes" : "no"}`,
    `Public metrics acknowledged: ${payload.publicMetricsAcknowledged ? "yes" : "no"}`
  ].join("\n");
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
    console.error("VISION_ARGUS_CONTACT_SEND_FAILED", {
      code: error.code || "send_failed",
      providerStatus: error.providerStatus || null,
      providerBody: error.providerBody || null
    });

    response.status(500).json({
      ok: false,
      error: error.code || "send_failed",
      providerStatus: process.env.CONTACT_DEBUG === "true" ? error.providerStatus || null : undefined
    });
  }
};
