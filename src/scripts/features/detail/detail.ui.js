import { submitLead } from "../lead/lead.service.js";

export function renderDetail(root, item) {
  const dTitle = document.getElementById("dTitle");
  const dSub = document.getElementById("dSub");

  if (!item) {
    if (dTitle) dTitle.textContent = "Không tìm thấy phòng";
    if (dSub) dSub.textContent = "Tin không tồn tại hoặc đã bị ẩn.";
    root.innerHTML = `<div class="empty-state" style="display:block;">
      <h3>Không tìm thấy phòng phù hợp</h3>
      <p>Vui lòng quay lại danh sách và chọn phòng khác.</p>
    </div>`;
    return;
  }

  const priceText = formatVND(item.price ?? 0) + " / tháng";
  const areaText = (item.area ?? "?") + " m²";
  const locText = [item.district, item.city].filter(Boolean).join(", ");

  if (dTitle) dTitle.textContent = item.title || "Chi tiết phòng";
  if (dSub) dSub.textContent = `${locText || ""} • ${priceText} • ${areaText}`;

  root.innerHTML = `
    <article class="room-card" style="cursor: default;">
      <div class="room-media">
        <div class="room-media-bg"></div>
        <div class="room-media-top">
          <span class="room-time">${esc(item.createdAt ? "Mới đăng" : "—")}</span>
          <span class="room-type">${esc(item.type || "phong_tro")}</span>
        </div>
        <div class="room-media-bottom">
          <span class="room-price">${esc(priceText.replace("đ", "đ"))}</span>
          <span class="room-meta-mini">${esc(areaText + " · " + (item.district || ""))}</span>
        </div>
      </div>

      <div class="room-body">
        <div class="room-body-top">
          <h3 class="room-title">${esc(item.title || "")}</h3>
          <div class="room-tags">
            <span class="room-tag"><span>📍</span>${esc(item.address || locText || "—")}</span>
            ${(item.amenities || []).slice(0, 6).map(a => `<span class="room-tag room-tag-accent">${esc(a)}</span>`).join("")}
          </div>
        </div>

        <div class="room-body-bottom" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
          <div class="room-owner">
            Chủ trọ: <strong>${esc(item.owner?.name || "—")}</strong>
          </div>

          <div class="room-cta" style="gap:8px;">
            ${item.owner?.phone ? `<a class="btn btn-mini" href="tel:${encodeURIComponent(String(item.owner.phone))}">Gọi</a>` : ""}
            ${(item.owner?.zalo || item.owner?.phone) ? `<a class="btn btn-mini" target="_blank" rel="noreferrer"
              href="https://zalo.me/${encodeURIComponent(String(item.owner.zalo || item.owner.phone))}">Zalo</a>` : ""}
            <button class="btn btn-mini" type="button" id="scrollToLead">Đặt lịch</button>
          </div>
        </div>
      </div>
    </article>
  `;

  root.querySelector("#scrollToLead")?.addEventListener("click", () => {
    document.getElementById("leadForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function bindLeadForm(item) {
  const form = document.getElementById("leadForm");
  const msg = document.getElementById("leadMsg");
  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Đang gửi...";

    const fd = new FormData(form);
    try {
      await submitLead({
        name: fd.get("name"),
        phone: fd.get("phone"),
        time: fd.get("time"),
        note: fd.get("note"),
        listingId: item?.id || "",
        listingTitle: item?.title || "",
        pageUrl: window.location.href
      });
      msg.textContent = "✅ Gửi thành công! Bên mình sẽ liên hệ sớm.";
      form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = "❌ Gửi thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp.";
    }
  });
}

function formatVND(n) {
  try { return new Intl.NumberFormat("vi-VN").format(Number(n) || 0) + "đ"; }
  catch { return String(n) + "đ"; }
}

function esc(s="") {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}
