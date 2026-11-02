"use strict";
console.log("P09 JavaScript aktif");

const produkUmkm = [
    { nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 18000, stok: 24, isUnggulan: true, diskonPersen: 0, deskripsi: "Biji kopi lokal Pekalongan, aroma rempah khas." },
    { nama: "Cold Brew Aren", kategori: "Kopi", harga: 22000, stok: 4, isUnggulan: true, diskonPersen: 10, deskripsi: "Ekstraksi dingin 12 jam dengan gula aren." },
    { nama: "Matcha Latte Cream", kategori: "Non-Kopi", harga: 22000, stok: 0, isUnggulan: false, diskonPersen: 0, deskripsi: "Teh hijau Jepang dengan susu segar creamy." },
    { nama: "Es Kopi Palm Sugar", kategori: "Kopi", harga: 24000, stok: 15, isUnggulan: false, diskonPersen: 15, deskripsi: "Kopi susu dingin dengan gula aren asli." },
];

const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

function hitungHargaAkhir(harga, diskonPersen = 0) {
    const hargaAman = Number(harga);
    let diskon = Number(diskonPersen);

    if (!Number.isFinite(hargaAman) || hargaAman < 0) {
        return 0;
    }
    if (!Number.isFinite(diskon)) {
        diskon = 0;
    }
    diskon = Math.min(Math.max(diskon, 0), 100);

    return Math.round((hargaAman * (100 - diskon)) / 100);
}

function statusStok(stok) {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    } else if (stok <= 5) {
        return { label: "Terbatas", className: "warning" };
    }
    return { label: "Tersedia", className: "" };
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }
    console.table(produkUmkm);

    let jumlahTersedia = 0; 
    let markup = "";        

    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
        const adaDiskon = hargaAkhir < produk.harga;

        if (produk.stok > 0) {
            jumlahTersedia++;
        }

        const badgeUnggulan = produk.isUnggulan
            ? `<span class="badge-unggulan">Unggulan</span>`
            : "";

        const hargaMarkup = adaDiskon
            ? `<p class="price"><s class="price-normal">${formatRupiah.format(produk.harga)}</s>
         <span class="price-promo">${formatRupiah.format(hargaAkhir)}</span>
         <span class="diskon-label">-${produk.diskonPersen}%</span></p>`
            : `<p class="price">${formatRupiah.format(produk.harga)}</p>`;

        markup += `
      <article class="js-product-card">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p>${produk.kategori} &middot; ${produk.deskripsi}</p>
        ${hargaMarkup}
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p>${produk.stok > 0 ? "Siap dipesan" : "Hubungi admin"}</p>
      </article>`;
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);