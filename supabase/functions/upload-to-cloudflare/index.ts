// This file runs in Deno environment, not Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Cloudflare credentials from Supabase secrets
    const CLOUDFLARE_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
    const CLOUDFLARE_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
    const CLOUDFLARE_ACCOUNT_HASH = Deno.env.get("CLOUDFLARE_ACCOUNT_HASH");

    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_HASH) {
      const missingSecrets = [];
      if (!CLOUDFLARE_ACCOUNT_ID) missingSecrets.push("CLOUDFLARE_ACCOUNT_ID");
      if (!CLOUDFLARE_API_TOKEN) missingSecrets.push("CLOUDFLARE_API_TOKEN");
      if (!CLOUDFLARE_ACCOUNT_HASH) missingSecrets.push("CLOUDFLARE_ACCOUNT_HASH");
      throw new Error(`Missing Cloudflare credentials: ${missingSecrets.join(", ")}`);
    }

    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upload to Cloudflare Images
    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", file);

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: cloudflareFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload to Cloudflare: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Failed to upload image to Cloudflare");
    }

    // Return the public URL
    const imageUrl = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${result.result.id}/public`;

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: imageUrl,
        cloudflareId: result.result.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
