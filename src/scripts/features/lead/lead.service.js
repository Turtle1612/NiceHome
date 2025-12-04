import { ENV } from "../../config/env.js";

export async function submitLead(payload) {
  const res = await fetch(ENV.LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { ok: false, raw: text }; }
  if (!res.ok || !json.ok) throw new Error(json.error || "Submit failed");
  return json;
}





// import { ENV } from "../../config/env.js";

// export async function submitLead(payload) {
//   const res = await fetch(ENV.LEAD_ENDPOINT, {
//     method: "POST",
//     headers: { "Content-Type": "text/plain;charset=utf-8" }, 
//     // Apps Script đôi khi kén CORS với application/json, text/plain ổn định hơn
//     body: JSON.stringify(payload)
//   });

//   const text = await res.text();
//   let json;
//   try { json = JSON.parse(text); } catch { json = { ok: false, raw: text }; }

//   if (!res.ok || !json.ok) {
//     throw new Error(json.error || "Submit failed");
//   }
//   return json;
// }
