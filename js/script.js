console.log("Portfólio carregado com sucesso.");

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".menu");

if (menuToggle && siteMenu) {
    const closeMenu = () => {
        siteMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = siteMenu.classList.toggle("is-open");
        menuToggle.classList.toggle("is-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = siteMenu.contains(event.target) || menuToggle.contains(event.target);
        if (!clickedInsideMenu) {
            closeMenu();
        }
    });
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch((error) => {
            console.error("Falha ao registrar o service worker:", error);
        });
    });
}