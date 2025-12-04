import { fetchListings } from "./listings.service.js";
import { renderDistrictOptions, renderList } from "./listings.ui.js";

export async function initListingsPage() {
  const keywordInput = document.getElementById("keywordInput");
  const districtSelect = document.getElementById("districtSelect");
  const priceSelect = document.getElementById("priceSelect");
  const areaSelect = document.getElementById("areaSelect");
  const furnishSelect = document.getElementById("furnishSelect");
  const typeSelect = document.getElementById("typeSelect");
  const sortSelect = document.getElementById("sortSelect");
  const quickChips = document.getElementById("quickChips");

  const countText = document.getElementById("countText");
  const totalCountText = document.getElementById("totalCountText");
  const listSubtitle = document.getElementById("listSubtitle");
  const roomList = document.getElementById("roomList");
  const emptyState = document.getElementById("emptyState");

  const resetBtn = document.getElementById("resetBtn");
  const searchBtn = document.getElementById("searchBtn");
  const pageInfo = document.getElementById("pageInfo");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

  const state = {
    keyword: "",
    district: "",
    priceRange: "",
    areaRange: "",
    furniture: "",
    type: "",
    sortBy: "newest",
    quickChip: "",
    page: 1,
    pageSize: 6
  };

  let all = [];
  try {
    all = await fetchListings();
  } catch (err) {
    console.error(err);
    if (roomList) roomList.innerHTML = `<div style="padding:12px">❌ Không tải được dữ liệu phòng.</div>`;
    return;
  }

  renderDistrictOptions(districtSelect, all);

  function clearQuickChip() {
    if (!quickChips) return;
    quickChips.querySelectorAll(".quick-chip").forEach(chip => chip.classList.remove("active"));
  }
  function setQuickChipActive(value) {
    if (!quickChips) return;
    quickChips.querySelectorAll(".quick-chip").forEach(chip => {
      chip.classList.toggle("active", chip.getAttribute("data-chip") === value);
    });
  }
  function applyQuickChipPreset(value) {
    if (value === "sv") {
      state.priceRange = "1-2";
      state.areaRange = "under20";
      state.furniture = "empty";
      state.district = "";
      if (priceSelect) priceSelect.value = "1-2";
      if (areaSelect) areaSelect.value = "under20";
      if (furnishSelect) furnishSelect.value = "empty";
      if (districtSelect) districtSelect.value = "";
    } else if (value === "full") {
      state.priceRange = "2-3";
      state.furniture = "full";
      state.areaRange = "";
      if (priceSelect) priceSelect.value = "2-3";
      if (furnishSelect) furnishSelect.value = "full";
      if (areaSelect) areaSelect.value = "";
    } else if (value === "center") {
      state.district = "Ninh Kiều";
      state.priceRange = "";
      if (districtSelect) districtSelect.value = "Ninh Kiều";
      if (priceSelect) priceSelect.value = "";
    } else if (value === "river") {
      state.district = "Cái Răng";
      state.priceRange = "";
      if (districtSelect) districtSelect.value = "Cái Răng";
      if (priceSelect) priceSelect.value = "";
    }
  }

  function applyFilters() {
    let filtered = all.slice();

    if (state.keyword.trim() !== "") {
      const kw = state.keyword.trim().toLowerCase();
      filtered = filtered.filter(r => {
        const hay = [
          r.title, r.address, r.district, r.city, r.type,
          ...(r.amenities || []),
          r.owner?.name
        ].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(kw);
      });
    }

    if (state.district !== "") filtered = filtered.filter(r => r.district === state.district);

    if (state.furniture !== "") {
      filtered = filtered.filter(r => {
        const am = (r.amenities || []).map(x => String(x).toLowerCase());
        if (state.furniture === "full") return am.some(x => x.includes("full"));
        if (state.furniture === "empty") return am.some(x => x.includes("trống") || x.includes("empty"));
        return true;
      });
    }

    if (state.type !== "") filtered = filtered.filter(r => String(r.type || "") === state.type);

    if (state.priceRange !== "") {
      filtered = filtered.filter(r => {
        const p = (Number(r.price || 0) / 1_000_000);
        switch (state.priceRange) {
          case "under1": return p < 1;
          case "1-2": return p >= 1 && p <= 2;
          case "2-3": return p > 2 && p <= 3;
          case "3-5": return p > 3 && p <= 5;
          case "5-7": return p > 5 && p <= 7;
          case "over7": return p > 7;
          default: return true;
        }
      });
    }

    if (state.areaRange !== "") {
      filtered = filtered.filter(r => {
        const a = Number(r.area || 0);
        switch (state.areaRange) {
          case "under20": return a < 20;
          case "20-30": return a >= 20 && a <= 30;
          case "30-40": return a > 30 && a <= 40;
          case "40-50": return a > 40 && a <= 50;
          case "over50": return a > 50;
          default: return true;
        }
      });
    }

    filtered.sort((a, b) => {
      if (state.sortBy === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
      if (state.sortBy === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      if (state.sortBy === "area-desc") return (b.area ?? 0) - (a.area ?? 0);
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });

    state.page = renderList({
      roomListEl: roomList,
      emptyStateEl: emptyState,
      pageInfoEl: pageInfo,
      prevBtn: prevPageBtn,
      nextBtn: nextPageBtn,
      listSubtitleEl: listSubtitle,
      countTextEl: countText,
      totalCountTextEl: totalCountText,
      all,
      filtered,
      page: state.page,
      pageSize: state.pageSize
    });
  }

  keywordInput?.addEventListener("input", (e) => { state.keyword = e.target.value; state.page = 1; applyFilters(); });
  districtSelect?.addEventListener("change", (e) => { state.district = e.target.value; state.page = 1; applyFilters(); });
  priceSelect?.addEventListener("change", (e) => { state.priceRange = e.target.value; state.page = 1; state.quickChip = ""; clearQuickChip(); applyFilters(); });
  areaSelect?.addEventListener("change", (e) => { state.areaRange = e.target.value; state.page = 1; state.quickChip = ""; clearQuickChip(); applyFilters(); });
  furnishSelect?.addEventListener("change", (e) => { state.furniture = e.target.value; state.page = 1; state.quickChip = ""; clearQuickChip(); applyFilters(); });
  typeSelect?.addEventListener("change", (e) => { state.type = e.target.value; state.page = 1; state.quickChip = ""; clearQuickChip(); applyFilters(); });
  sortSelect?.addEventListener("change", (e) => { state.sortBy = e.target.value; state.page = 1; applyFilters(); });

  searchBtn?.addEventListener("click", () => { state.page = 1; applyFilters(); });

  resetBtn?.addEventListener("click", () => {
    state.keyword = "";
    state.district = "";
    state.priceRange = "";
    state.areaRange = "";
    state.furniture = "";
    state.type = "";
    state.sortBy = "newest";
    state.quickChip = "";
    state.page = 1;

    if (keywordInput) keywordInput.value = "";
    if (districtSelect) districtSelect.value = "";
    if (priceSelect) priceSelect.value = "";
    if (areaSelect) areaSelect.value = "";
    if (furnishSelect) furnishSelect.value = "";
    if (typeSelect) typeSelect.value = "";
    if (sortSelect) sortSelect.value = "newest";
    clearQuickChip();

    applyFilters();
  });

  if (quickChips) {
    quickChips.addEventListener("click", (e) => {
      const btn = e.target.closest(".quick-chip");
      if (!btn) return;
      const value = btn.getAttribute("data-chip") || "";
      state.quickChip = value;
      setQuickChipActive(value);
      applyQuickChipPreset(value);
      state.page = 1;
      applyFilters();
    });
  }

  prevPageBtn?.addEventListener("click", () => { state.page = Math.max(1, state.page - 1); applyFilters(); });
  nextPageBtn?.addEventListener("click", () => { state.page = state.page + 1; applyFilters(); });

  applyFilters();
}
