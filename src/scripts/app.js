import { initListingsPage } from "./features/listings/listings.state.js";
import { initDetailPage } from "./features/detail/detail.state.js";
import { initPostPage } from "./features/post/post.state.js";

const path = window.location.pathname;

if (path.includes("/pages/listings/")) initListingsPage();
if (path.includes("/pages/listing-detail/")) initDetailPage();
if (path.includes("/pages/post/")) initPostPage();







// import { initListingsPage } from "./features/listings/listings.state.js";

// console.log("app.js loaded", window.location.pathname);

// const path = window.location.pathname;
// if (path.includes("/pages/listings/")) {
//   initListingsPage();
// }






// console.log("app.js loaded ✅");

// document.getElementById("filters").innerHTML = `
//   <div class="card">JS đã chạy nè ✅</div>
// `;
