"use strict";
console.log("P11 JavaScript aktif");

const produkUmkm = [
    { id: 1, nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 18000, stok: 24, isUnggulan: true, gambar: "assets/images/kopi_tubruk_signature_nw.webp", deskripsi: "Biji kopi lokal Pekalongan, aroma rempah khas." },
    { id: 2, nama: "Cold Brew Aren", kategori: "Kopi", harga: 22000, stok: 4, isUnggulan: false, gambar: "assets/images/cold_brew_aren_nw.webp", deskripsi: "Ekstraksi dingin 12 jam dengan gula aren." },
    { id: 3, nama: "Matcha Latte Cream", kategori: "Non-Kopi", harga: 22000, stok: 0, isUnggulan: false, gambar: "assets/images/matcha_latte_cream_nw.webp", deskripsi: "Teh hijau Jepang dengan susu segar creamy." },
    { id: 4, nama: "Es Kopi Palm Sugar", kategori: "Kopi", harga: 24000, stok: 15, isUnggulan: false, gambar: "assets/images/es_kopi_palm_sugar_nw.webp", deskripsi: "Kopi susu dingin dengan gula aren asli." },
    { id: 5, nama: "Bundling Hemat Kopi & Gula", kategori: "Bundling", harga: 40000, stok: 10, isUnggulan: false, gambar: "assets/images/kopi_tubruk_signature_nw.webp", deskripsi: "Paket bundling spesial berisi kopi signature dan gula aren murni." }
];

function formatRupiah(nilai) {
    const angka = Number(nilai);
    if (!Number.isFinite(angka)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    })
        .format(angka)
        .replace(/\u00a0/g, " ");
}

function statusStok(stok) {
    if (stok <= 0) return { label: "Habis", className: "empty" };
    if (stok <= 5) return { label: "Stok terbatas", className: "warning" };
    return { label: "Tersedia", className: "" };
}

function ambilProdukByKategori(kategori) {
    if (kategori === "Semua") return produkUmkm;
    return produkUmkm.filter((produk) => produk && produk.kategori === kategori);
}

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

let kategoriSaatIni = "Semua";

function buatEmptyState(pesan) {
    const empty = document.createElement("p");
    empty.classList.add("empty-state");
    empty.textContent = pesan;
    return empty;
}

function perbaruiSetelahSembunyikan() {
    if (!produkGrid || !produkStatus) return;

    const sisa = produkGrid.querySelectorAll(".product-card").length;
    const total = ambilProdukByKategori(kategoriSaatIni).length;

    if (sisa === 0) {
        produkGrid.append(buatEmptyState("Semua kartu disembunyikan. Klik tombol filter untuk menampilkannya kembali."));
    }
    produkStatus.textContent =
        `${sisa} dari ${total} produk kategori "${kategoriSaatIni}" ditampilkan (${total - sisa} disembunyikan sementara).`;
}

function buatElemenProduk(produk) {
    if (!produk) return null;

    const card = document.createElement("article");
    card.classList.add("product-card");

    const body = document.createElement("div");
    body.classList.add("product-body");

    const title = document.createElement("h3");
    title.textContent = produk.nama;

    const category = document.createElement("p");
    category.classList.add("category-note");
    category.textContent = produk.kategori;

    const desc = document.createElement("p");
    desc.classList.add("desc");
    desc.textContent = produk.deskripsi;

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = formatRupiah(produk.harga);

    const stock = document.createElement("span");
    const status = statusStok(produk.stok);
    stock.classList.add("stock-badge");
    if (status.className) stock.classList.add(status.className);
    stock.textContent = status.label;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Sembunyikan";
    removeButton.classList.add("ghost-button");
    removeButton.setAttribute("aria-label", `Sembunyikan ${produk.nama} dari tampilan`);

    removeButton.addEventListener("click", () => {
        card.remove();
        perbaruiSetelahSembunyikan();
    });

    body.append(title, category);
    if (produk.isUnggulan) {
        const badge = document.createElement("span");
        badge.classList.add("badge-unggulan");
        badge.textContent = "Unggulan";
        body.append(badge);
    }
    body.append(desc, price, stock, removeButton);
    card.append(body);
    return card;
}

function renderProduk(kategoriAktif = "Semua") {

    if (!produkGrid || !produkStatus) {
        console.warn("Target render produk (grid atau status) tidak ditemukan.");
        return;
    }
    if (!Array.isArray(produkUmkm)) {
        console.error("Data produkUmkm tidak valid.");
        return;
    }

    kategoriSaatIni = kategoriAktif;
    const produkTampil = ambilProdukByKategori(kategoriAktif);

    produkGrid.replaceChildren();

    if (produkTampil.length === 0) {
        produkGrid.append(buatEmptyState(`Belum ada produk pada kategori "${kategoriAktif}".`));
        produkStatus.textContent = `0 produk ditemukan untuk kategori "${kategoriAktif}".`;
        return;
    }

    produkTampil.forEach((produk) => {
        const elemenCard = buatElemenProduk(produk);
        if (elemenCard) produkGrid.append(elemenCard);
    });

    produkStatus.textContent =
        `${produkTampil.length} dari ${produkUmkm.length} produk ditampilkan (kategori: ${kategoriAktif}).`;
}

function setTombolAktif(tombolAktif) {
    tombolFilter.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
    });
    tombolAktif.classList.add("is-active");
    tombolAktif.setAttribute("aria-pressed", "true");
}

if (tombolFilter.length > 0) {
    tombolFilter.forEach((tombol) => {
        tombol.addEventListener("click", (event) => {
            const tombolAktif = event.currentTarget;
            const kategori = tombolAktif.dataset.filter;
            if (!kategori) return;

            setTombolAktif(tombolAktif);
            renderProduk(kategori);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProduk("Semua");
});