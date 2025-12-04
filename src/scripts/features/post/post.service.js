import { ENV } from "../../config/env.js";

export async function submitPost(payload) {
  const res = await fetch(ENV.POST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { ok: false, raw: text }; }

  if (!res.ok || !json.ok) throw new Error(json.error || "Submit post failed");
  return json;
}
