import { submitPost } from "./post.service.js";

export function initPostPage() {
  const form = document.getElementById("postForm");
  const msg = document.getElementById("postMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Đang gửi...";

    const fd = new FormData(form);

    const amenities = String(fd.get("amenities") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const images = String(fd.get("images") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    try {
      await submitPost({
        contactName: fd.get("contactName"),
        phone: fd.get("phone"),
        zalo: fd.get("zalo"),
        title: fd.get("title"),
        address: fd.get("address"),
        district: fd.get("district"),
        city: fd.get("city"),
        price: Number(fd.get("price") || 0),
        area: Number(fd.get("area") || 0),
        type: fd.get("type"),
        amenities,
        description: fd.get("description"),
        images,
        pageUrl: window.location.href
      });

      msg.textContent = "✅ Gửi thành công! Bên mình sẽ duyệt và liên hệ lại.";
      form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = "❌ Gửi thất bại. Vui lòng thử lại.";
    }
  });
}
