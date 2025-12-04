import { ENV } from "../../config/env.js";

export async function fetchListingById(id) {
  const res = await fetch(ENV.LISTINGS_ENDPOINT, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || "Cannot load listings");
  const items = json.data || [];
  return items.find(x => String(x.id) === String(id)) || null;
}
