import { ENV } from "../../config/env.js";

export async function fetchListings() {
  const res = await fetch(ENV.LISTINGS_ENDPOINT, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || "Cannot load listings");
  return json.data || [];
}





// export async function fetchListings() {
//   const res = await fetch("/src/scripts/data/listings.mock.json", { cache: "no-store" });
//   if (!res.ok) throw new Error("Cannot load listings.mock.json");
//   return res.json();
// }
