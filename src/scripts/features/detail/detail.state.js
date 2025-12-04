import { fetchListingById } from "./detail.service.js";
import { renderDetail, bindLeadForm } from "./detail.ui.js";

export async function initDetailPage() {
  const wrap = document.getElementById("detailWrap");
  const id = new URLSearchParams(window.location.search).get("id");
  if (!wrap) return;

  if (!id) {
    wrap.innerHTML = `<div class="empty-state" style="display:block;">
      <h3>Thiếu id phòng</h3>
      <p>Vui lòng quay lại danh sách và chọn lại phòng.</p>
    </div>`;
    return;
  }

  try {
    const item = await fetchListingById(id);
    renderDetail(wrap, item);
    bindLeadForm(item);
  } catch (err) {
    console.error(err);
    wrap.innerHTML = `<div class="empty-state" style="display:block;">
      <h3>Lỗi tải dữ liệu</h3>
      <p>Mở Console (F12) để xem chi tiết.</p>
    </div>`;
  }
}
