const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Promo: Beli 2 gratis 1!";
        console.log("Promo Kopi Nusa berhasil ditampilkan.");
    });
}

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#menu-utama");

if (navToggle && navMenu) {
    document.documentElement.classList.add("js");

    const setMenuOpen = (open) => {
        navToggle.setAttribute("aria-expanded", String(open));
        navMenu.classList.toggle("is-open", open);
    };

    navToggle.addEventListener("click", () => {
        setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            navToggle.focus();
        }
    });

    window.matchMedia("(min-width: 60rem)").addEventListener("change", (event) => {
        if (event.matches) {
            setMenuOpen(false);
        }
    });
}