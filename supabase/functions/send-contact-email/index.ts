const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const recipient = "reklamartiklaruf@gmail.com";

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Metoden stöds inte." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const cartSummary = typeof body.cartSummary === "string" ? body.cartSummary.trim() : "";

    if (!name || !email || !message || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Fyll i namn, giltig e-post och meddelande." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "E-posttjänsten är inte ansluten ännu." }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ReklamArtiklar UF <onboarding@resend.dev>",
        to: [recipient],
        reply_to: email,
        subject: `Ny kontaktförfrågan från ${name}`,
        text: `Namn: ${name}\nE-post: ${email}\n\nMeddelande:\n${message}${cartSummary ? `\n\nKundvagn:\n${cartSummary}` : ""}`,
      }),
    });

    if (!emailResponse.ok) {
      return new Response(JSON.stringify({ error: "Meddelandet kunde inte skickas just nu." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Meddelandet kunde inte skickas just nu." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
