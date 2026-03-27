import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory rate limiter: max 5 requests per IP per 60 seconds
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "Unknown";

    if (ip !== "Unknown" && isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Rate limited", blocked: true, reason: "Too many requests" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
    const ipinfoToken = Deno.env.get("IPINFO_API_TOKEN");

    if (!botToken || !chatId) {
      throw new Error("Telegram credentials not configured");
    }

    const body = await req.json();
    const sanitize = (s: string | undefined, maxLen = 500) =>
      (s || "").replace(/[*_`\[\]()~>#+\-=|{}.!\\]/g, "").slice(0, maxLen);

    const userAgent = sanitize(body.userAgent);
    const timestamp = sanitize(body.timestamp, 50);
    const referrer = sanitize(body.referrer, 200);


    let org = "Unknown";
    let city = "";
    let region = "";
    let country = "";
    let isBlocked = false;
    let blockReason = "";
    let ipType = "unknown";

    if (ip !== "Unknown" && ipinfoToken) {
      try {
        const ipRes = await fetch(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          org = ipData.org || "Unknown";
          city = ipData.city || "";
          region = ipData.region || "";
          country = ipData.country || "";

          // Block non-US IPs
          if (country !== "US") {
            isBlocked = true;
            blockReason = `Non-US IP (${country})`;
            ipType = "Non-US";
          }

          // Block VPN/Proxy/Hosting/Tor/Relay
          const isVpn = ipData.privacy?.vpn === true;
          const isProxy = ipData.privacy?.proxy === true;
          const isHosting = ipData.privacy?.hosting === true;
          const isTor = ipData.privacy?.tor === true;
          const isRelay = ipData.privacy?.relay === true;

          if (isVpn || isProxy || isHosting || isTor || isRelay) {
            const flags = [];
            if (isVpn) flags.push("VPN");
            if (isProxy) flags.push("Proxy");
            if (isHosting) flags.push("Hosting/DC");
            if (isTor) flags.push("Tor");
            if (isRelay) flags.push("Relay");
            isBlocked = true;
            ipType = flags.join(", ");
            blockReason = blockReason
              ? `${blockReason} + ${ipType}`
              : ipType;
          }

          if (!isBlocked) {
            ipType = "Residential US";
          }
        }
      } catch {
        ipType = "lookup_failed";
      }
    }

    const location = [city, region, country].filter(Boolean).join(", ");
    const statusEmoji = isBlocked ? "🚫" : "✅";
    const statusText = isBlocked ? "BLOCKED" : "ALLOWED";

    const message = `${statusEmoji} *Documents Page — ${statusText}*\n\n` +
      `📅 *Time:* ${timestamp}\n` +
      `📍 *IP:* \`${ip}\`\n` +
      `🏷 *Type:* ${ipType}\n` +
      (isBlocked ? `⛔ *Reason:* ${blockReason}\n` : "") +
      `🏢 *Org:* ${org}\n` +
      `📌 *Location:* ${location || 'Unknown'}\n` +
      `🌐 *User Agent:* ${userAgent || 'Unknown'}\n` +
      `🔗 *Referrer:* ${referrer || 'Direct'}`;

    await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    return new Response(JSON.stringify({
      success: true,
      blocked: isBlocked,
      reason: blockReason || null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message, blocked: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
