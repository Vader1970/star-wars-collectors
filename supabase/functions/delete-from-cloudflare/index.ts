// This file runs in Deno environment, not Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    // Get Cloudflare credentials from Supabase secrets
    const CLOUDFLARE_ACCOUNT_ID = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
    const CLOUDFLARE_API_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      const missingSecrets = [];
      if (!CLOUDFLARE_ACCOUNT_ID) missingSecrets.push("CLOUDFLARE_ACCOUNT_ID");
      if (!CLOUDFLARE_API_TOKEN) missingSecrets.push("CLOUDFLARE_API_TOKEN");
      throw new Error(`Missing Cloudflare credentials: ${missingSecrets.join(", ")}`);
    }
    // Get the image ID from the request body
    const { imageId } = await req.json();
    if (!imageId) {
      return new Response(
        JSON.stringify({
          error: "No image ID provided",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Delete from Cloudflare Images
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      // If the image is already deleted (404), treat as success
      if (response.status === 404) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Image already deleted or not found",
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
      const errorText = await response.text();
      throw new Error(`Failed to delete from Cloudflare: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error("Failed to delete image from Cloudflare");
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Image deleted successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image";
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
