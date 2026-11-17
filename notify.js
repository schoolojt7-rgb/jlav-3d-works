// Vercel serverless function: emails you when someone clicks Email/Facebook (or visits, if enabled).
// Setup in Vercel > Project > Settings > Environment Variables:
//   RESEND_API_KEY = your key from resend.com
//   NOTIFY_TO      = mr.jleigh3d.personal.com@gmail.com
const EVENTS = {
  email_click: "Someone clicked the Email button on your portfolio",
  facebook_click: "Someone clicked the Facebook button on your portfolio",
  visit: "Someone visited your portfolio"
};
const recent = new Map(); // best-effort throttle (resets when the function restarts)

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  let body = req.body;
  try { if (typeof body === "string") body = JSON.parse(body); } catch { body = {}; }
  const event = body && body.event;
  if (!EVENTS[event]) return res.status(400).end();

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const key = ip + event, now = Date.now();
  if (now - (recent.get(key) || 0) < 60000) return res.status(204).end();
  recent.set(key, now);
  if (recent.size > 500) recent.clear();

  const place = [req.headers["x-vercel-ip-city"], req.headers["x-vercel-ip-country"]]
    .filter(Boolean).map(decodeURIComponent).join(", ") || "unknown";
  const time = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
  const text = `${EVENTS[event]}.\n\nTime: ${time} (PH)\nApprox. location: ${place}\nDevice: ${req.headers["user-agent"] || "unknown"}`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Portfolio Alerts <onboarding@resend.dev>",
        to: [process.env.NOTIFY_TO],
        subject: EVENTS[event],
        text
      })
    });
    return res.status(r.ok ? 204 : 502).end();
  } catch { return res.status(502).end(); }
};
