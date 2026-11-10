"use strict";
console.log("P10 JavaScript aktif");

const produkUmkm = [
    {
        id: 1,
        nama: "Kopi Tubruk Signature",
        kategori: "Kopi",
        harga: 18000,
        stok: 24,
        isUnggulan: true,
        gambar: "assets/images/kopi_tubruk_signature_nw.webp",
        deskripsi: "Biji kopi lokal Pekalongan, aroma rempah khas.",
    },
    {
        id: 2,
        nama: "Cold Brew Aren",
        kategori: "Kopi",
        harga: 22000,
        stok: 4,
        isUnggulan: false,
        gambar: "assets/images/cold_brew_aren_nw.webp",
        deskripsi: "Ekstraksi dingin 12 jam dengan gula aren.",
    },
    {
        id: 3,
        nama: "Matcha Latte Cream",
        kategori: "Non-Kopi",
        harga: 22000,
        stok: 0,
        isUnggulan: false,
        gambar: "assets/images/matcha_latte_cream_nw.webp",
        deskripsi: "Teh hijau Jepang dengan susu segar creamy.",
    },
    {
        id: 4,
        nama: "Es Kopi Palm Sugar",
        kategori: "Kopi",
        harga: 24000,
        stok: 15,
        isUnggulan: false,
        gambar: "assets/images/es_kopi_palm_sugar_nw.webp",
        deskripsi: "Kopi susu dingin dengan gula aren asli.",
    },
];

function formatRupiah(nilai) {
    const angka = Number(nilai);
    if (!Number.isFinite(angka)) {
        return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    })
        .format(angka)
        .replace(/\u00a0/g, " ");
}

function statusStok(stok) {
    if (stok <= 0) {
        return { label: "Habis", class: "stock-badge empty" };
    }
    if (stok <= 5) {
        return { label: "Stok terbatas", class: "stock-badge warning" };
    }
    return { label: "Tersedia", class: "stock-badge" };
}

function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);
    const badgeUnggulan = produk.isUnggulan
        ? `<span class="badge-unggulan">Unggulan</span>`
        : "";

    return `
      <article class="js-product-card" data-id="${produk.id}">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p>${produk.kategori} &middot; ${produk.deskripsi}</p>
        <p class="price">${formatRupiah(produk.harga)}</p>
        <span class="${status.class}">${status.label}</span>
        <p>Sisa stok: ${produk.stok}</p>
      </article>`;
}

function hitungStatistik(daftarProduk) {
    let totalNilaiStok = 0;
    let jumlahTerbatas = 0;

    for (const produk of daftarProduk) {
        totalNilaiStok += produk.harga * produk.stok;
        if (statusStok(produk.stok).label === "Stok terbatas") {
            jumlahTerbatas += 1;
        }
    }
    return { totalNilaiStok, jumlahTerbatas };
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    if (!grid || !ringkasan || !unggulan) {
        console.warn("renderProduk dilewati: kontainer render tidak ada di halaman ini.");
        return;
    }

    console.log("[1] Jumlah data awal:", produkUmkm.length);
    console.table(produkUmkm);

    const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
    console.log("[2] Hasil filter (tersedia):", produkTersedia.length, "dari", produkUmkm.length);
    console.table(produkTersedia.map(({ id, nama, stok }) => ({ id, nama, stok })));

    const daftarKartu = produkTersedia.map(buatKartuProduk);
    console.log("[3] Jumlah kartu HTML hasil map:", daftarKartu.length);

    const produkUnggulan = produkUmkm.find((produk) => produk.isUnggulan === true);
    console.log("[4] Hasil find (unggulan):", produkUnggulan);

    grid.innerHTML = "";
    daftarKartu.forEach((kartu, index) => {
        grid.insertAdjacentHTML("beforeend", kartu);
        console.log(`[5] Kartu #${index + 1} dirender:`, produkTersedia[index].nama);
    });

    const statistik = hitungStatistik(produkUmkm);
    console.log("[6] Statistik:", statistik);

    ringkasan.textContent =
        `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data. ` +
        `Total nilai stok: ${formatRupiah(statistik.totalNilaiStok)}.`;

    if (produkUnggulan) {
        unggulan.textContent = `Produk unggulan: ${produkUnggulan.nama}`;
    } else {
        unggulan.textContent = "Belum ada produk unggulan.";
    }
}

document.addEventListener("DOMContentLoaded", renderProduk);