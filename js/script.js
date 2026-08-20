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

const expandableImages = document.querySelectorAll("main img:not(.no-lightbox)");

if (expandableImages.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Fechar imagem">&times;</button>' +
        '<img class="lightbox-image" src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    const openLightbox = (img) => {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt || "";
        lightbox.classList.add("is-open");
        document.body.classList.add("lightbox-open");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        document.body.classList.remove("lightbox-open");
        lightboxImage.src = "";
    };

    expandableImages.forEach((img) => {
        img.classList.add("is-expandable");
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", (img.alt || "Imagem") + " — clique para ampliar");

        img.addEventListener("click", () => openLightbox(img));
        img.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(img);
            }
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
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