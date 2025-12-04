export function renderDistrictOptions(selectEl, listings) {
  if (!selectEl) return;
  const districts = [...new Set(listings.map(x => x.district).filter(Boolean))]
    .sort((a,b)=>String(a).localeCompare(String(b)));
  selectEl.innerHTML =
    `<option value="">Tất cả quận / huyện</option>` +
    districts.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join("");
}

export function renderList({
  roomListEl,
  emptyStateEl,
  pageInfoEl,
  prevBtn,
  nextBtn,
  listSubtitleEl,
  countTextEl,
  totalCountTextEl,
  all,
  filtered,
  page,
  pageSize
}) {
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);

  if (totalCountTextEl) totalCountTextEl.textContent = `${all.length} phòng đang có sẵn`;
  if (countTextEl) countTextEl.textContent = String(total);
  if (pageInfoEl) pageInfoEl.textContent = `Trang ${safePage}/${totalPages}`;

  if (prevBtn) prevBtn.disabled = safePage === 1;
  if (nextBtn) nextBtn.disabled = safePage === totalPages;

  if (total === 0) {
    if (roomListEl) roomListEl.innerHTML = "";
    if (emptyStateEl) emptyStateEl.style.display = "block";
    return safePage;
  } else {
    if (emptyStateEl) emptyStateEl.style.display = "none";
  }

  if (listSubtitleEl) {
    listSubtitleEl.textContent = total === all.length
      ? "Lọc theo từ khóa và bộ lọc bên trái."
      : `Đang hiển thị ${total} phòng theo bộ lọc của bạn.`;
  }

  if (roomListEl) {
    roomListEl.innerHTML = pageItems.map(renderRoomCard).join("");
    roomListEl.querySelectorAll(".room-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        if (!id) return;
        window.location.href = `/src/pages/listing-detail/index.html?id=${encodeURIComponent(id)}`;
      });
    });
  }

  return safePage;
}

function renderRoomCard(r) {
  const priceTrieu = (Number(r.price || 0) / 1_000_000);
  const priceText = Number.isFinite(priceTrieu) ? `${priceTrieu.toFixed(1)} triệu/tháng` : "—";

  const timeLabel = r.createdAt ? "Mới đăng" : "—";
  const type = r.type || "phong_tro";
  const district = r.district || "";
  const ward = ""; // sheet hiện chưa có ward
  const tag = (r.amenities && r.amenities[0]) ? r.amenities[0] : "Tin mới";
  const owner = (r.owner && r.owner.name) ? r.owner.name : "Chủ trọ";
  const isHot = false;

  const hotBadge = isHot ? `<span class="room-hot">HOT</span>` : "";

  const am = (r.amenities || []).map(x => String(x).toLowerCase());
  let furniture = "basic";
  if (am.some(x => x.includes("full"))) furniture = "full";
  if (am.some(x => x.includes("trống") || x.includes("empty"))) furniture = "empty";

  let furnitureClass = "badge-furniture";
  let furnitureText = "Nội thất cơ bản";
  if (furniture === "full") { furnitureClass += " full"; furnitureText = "Full nội thất"; }
  else if (furniture === "empty") { furnitureClass += " empty"; furnitureText = "Nhà trống"; }

  return `
    <article class="room-card" data-id="${esc(r.id || "")}">
      <div class="room-media">
        <div class="room-media-bg"></div>
        <div class="room-media-top">
          <span class="room-time">${esc(timeLabel)}</span>
          <span class="room-type">${esc(type)}</span>
        </div>
        <div class="room-media-bottom">
          <span class="room-price">${esc(priceText)}</span>
          <span class="room-meta-mini">${esc((r.area || "?") + " m² · " + district)}</span>
        </div>
      </div>

      <div class="room-body">
        <div class="room-body-top">
          <h3 class="room-title">${esc(r.title || "")}${hotBadge}</h3>
          <div class="room-tags">
            <span class="room-tag"><span>📍</span>${esc((ward ? ward + ", " : "") + district)}</span>
            <span class="room-tag room-tag-accent">${esc(tag)}</span>
            <span class="${furnitureClass}">${esc(furnitureText)}</span>
          </div>
        </div>

        <div class="room-body-bottom">
          <div class="room-owner">Đăng bởi <strong>${esc(owner)}</strong> · ID #${esc(String(r.id || ""))}</div>
          <div class="room-cta">
            <span class="room-views"> </span>
            <button class="btn btn-mini" type="button">Xem chi tiết</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function esc(s="") {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}
