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
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Visualizador de imagens do projeto");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Fechar imagem">&times;</button>' +
        '<button class="lightbox-arrow lightbox-prev" type="button" aria-label="Imagem anterior">&#8249;</button>' +
        '<img class="lightbox-image" src="" alt="">' +
        '<button class="lightbox-arrow lightbox-next" type="button" aria-label="Próxima imagem">&#8250;</button>' +
        '<p class="lightbox-caption" aria-live="polite" aria-atomic="true"></p>';
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxClose = lightbox.querySelector(".lightbox-close");
    const lightboxPrev = lightbox.querySelector(".lightbox-prev");
    const lightboxNext = lightbox.querySelector(".lightbox-next");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    let images = [];
    let currentIndex = 0;
    let triggerImage = null;

    const imageSource = (img) => img.currentSrc || img.src;

    const showImage = () => {
        const img = images[currentIndex];
        lightboxImage.src = imageSource(img);
        lightboxImage.alt = img.alt || "";
        lightboxCaption.textContent = (img.alt || "Imagem") +
            (images.length > 1 ? " — " + (currentIndex + 1) + " / " + images.length : "");
        lightboxPrev.hidden = lightboxNext.hidden = images.length < 2;
    };

    const openLightbox = (img) => {
        triggerImage = img;
        const project = img.closest(".projects-preview");
        const candidates = project ? project.querySelectorAll("img:not(.no-lightbox)") : [img];
        const seen = new Set();
        // A capa e a galeria podem usar a mesma tela; exiba cada arquivo uma vez.
        images = Array.from(candidates).filter((candidate) => {
            const src = imageSource(candidate);
            if (seen.has(src)) return false;
            seen.add(src);
            return true;
        });
        currentIndex = images.findIndex((candidate) => imageSource(candidate) === imageSource(img));
        showImage();
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        lightboxImage.src = "";
        lightboxCaption.textContent = "";
        triggerImage?.focus();
    };

    const navigate = (direction) => {
        if (images.length < 2) return;
        currentIndex = (currentIndex + direction + images.length) % images.length;
        showImage();
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
    lightboxPrev.addEventListener("click", () => navigate(-1));
    lightboxNext.addEventListener("click", () => navigate(1));
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeLightbox();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            navigate(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Tab") {
            const buttons = [lightboxClose, lightboxPrev, lightboxNext].filter((button) => !button.hidden);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

const isLocalDevelopment = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

if ("serviceWorker" in navigator && !isLocalDevelopment && window.location.protocol !== "file:") {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch((error) => {
            console.error("Falha ao registrar o service worker:", error);
        });
    });
}
