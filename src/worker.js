/**
 * SIP-BPD Desa Pegandekan
 * Cloudflare Worker entry point.
 *
 * Cloudflare is used as the public entry point. The actual application
 * remains hosted by Google Apps Script because the current frontend
 * depends on google.script.run.
 *
 * Configure SIP_BPD_GAS_URL in Cloudflare Worker Settings > Variables.
 */
export default {
  async fetch(request, env) {
    const destination = (env.SIP_BPD_GAS_URL || "").trim();

    if (!destination) {
      return env.ASSETS.fetch(request);
    }

    let target;
    try {
      target = new URL(destination);
    } catch {
      return new Response("Konfigurasi SIP_BPD_GAS_URL tidak valid.", {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    if (
      target.protocol !== "https:" ||
      target.hostname !== "script.google.com" ||
      !target.pathname.includes("/macros/s/") ||
      !target.pathname.endsWith("/exec")
    ) {
      return new Response(
        "SIP_BPD_GAS_URL harus berupa URL Web App Google Apps Script yang berakhiran /exec.",
        {
          status: 500,
          headers: { "content-type": "text/plain; charset=utf-8" }
        }
      );
    }

    return Response.redirect(target.toString(), 302);
  }
};
