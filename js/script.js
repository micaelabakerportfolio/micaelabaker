// Micaela Studio Creativo - interacciones del portfolio

document.addEventListener("DOMContentLoaded", () => {
  // Cierra el menú móvil al elegir una sección.
  const menu = document.querySelector("#menuPrincipal");
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu && menu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Animación de entrada al desplazarse por la página.
  const animatedItems = document.querySelectorAll(
    ".section-heading, .about-grid, .folder-card, .work-card, .contact-form, .contact-aside"
  );
  animatedItems.forEach((item) => item.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animatedItems.forEach((item) => observer.observe(item));
  } else {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
  }


  // Carruseles de trabajos: las flechas laterales desplazan las tarjetas.
  document.querySelectorAll(".work-section .work-grid, .audiovisual-section .work-grid").forEach((grid) => {
    const carousel = document.createElement("div");
    carousel.className = "work-carousel";
    grid.parentNode.insertBefore(carousel, grid);
    carousel.appendChild(grid);

    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "work-carousel-arrow prev";
    previous.setAttribute("aria-label", "Ver trabajos anteriores");
    previous.innerHTML = "&#8249;";

    const next = document.createElement("button");
    next.type = "button";
    next.className = "work-carousel-arrow next";
    next.setAttribute("aria-label", "Ver más trabajos");
    next.innerHTML = "&#8250;";

    carousel.append(previous, next);
    const move = (direction) => {
      const card = grid.querySelector(":scope > div");
      const distance = card ? card.getBoundingClientRect().width : grid.clientWidth * 0.8;
      grid.scrollBy({ left: direction * distance, behavior: "smooth" });
    };
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
  });

  // Abre cada carpeta y muestra las imágenes y/o los enlaces que cargues en el HTML.
  const projectModalElement = document.querySelector("#projectModal");
  if (projectModalElement && window.bootstrap) {
    const projectModal = bootstrap.Modal.getOrCreateInstance(projectModalElement);
    const modalTitle = document.querySelector("#projectModalTitle");
    const modalDescription = document.querySelector("#projectModalDescription");
    const modalArtwork = document.querySelector("#projectModalArtwork");
    const modalVideos = document.querySelector("#projectModalVideos");

    const splitItems = (value) => (value || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    const openProject = (card) => {
      const title = card.querySelector("h3");
      const description = card.querySelector("p");
      const images = splitItems(card.dataset.images);
      const videos = splitItems(card.dataset.videos);
      const canvaLinks = splitItems(card.dataset.canva);
      const artwork = card.querySelector(".work-art, .media-art");

      modalTitle.textContent = title ? title.textContent : "Proyecto";
      modalDescription.textContent = description ? description.textContent : "";
      modalArtwork.innerHTML = "";
      modalVideos.innerHTML = "";

      if (images.length) {
        const gallery = document.createElement("div");
        gallery.className = "project-gallery";
        images.forEach((src) => {
          const image = document.createElement("img");
          image.src = src;
          image.alt = "Imagen del proyecto " + (title ? title.textContent : "");
          image.loading = "lazy";
          image.onerror = () => image.classList.add("image-not-found");
          gallery.appendChild(image);
        });
        modalArtwork.appendChild(gallery);
      } else if (artwork) {
  modalArtwork.appendChild(artwork.cloneNode(true));
}
if (canvaLinks.length) {
  const heading = document.createElement("h3");
  heading.textContent = "Diseños en Canva";
  modalVideos.appendChild(heading);

  canvaLinks.forEach((url) => {
    const link = document.createElement("a");
    link.className = "project-video-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ver proyecto en Canva ↗";
    modalVideos.appendChild(link);
  });
}
      if (videos.length) 
        if (videos.length) {
  const heading = document.createElement("h3");
  heading.className = "video-links-title";
  heading.textContent = "Mis cortometrajes";
  modalVideos.appendChild(heading);

  const videoGallery = document.createElement("div");
  videoGallery.className = "video-gallery";

  videos.forEach((url, index) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
    );

    const link = document.createElement("a");
    link.className = "video-card";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (match) {
      const image = document.createElement("img");
      image.src = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      image.alt = "Vista previa del cortometraje " + (index + 1);

      const play = document.createElement("span");
      play.className = "video-play";
      play.textContent = "▶";

      link.append(image, play);
    }

    const caption = document.createElement("span");
    caption.className = "video-card-title";
    caption.textContent = "Cortometraje " + (index + 1);

    link.appendChild(caption);
    videoGallery.appendChild(link);
  });

  modalVideos.appendChild(videoGallery);
} else if (card.classList.contains("media-card")) {
  const note = document.createElement("p");
  note.className = "gallery-empty-note";
  note.textContent = "Todavía no agregaste enlaces de videos a esta carpeta.";
  modalVideos.appendChild(note);
}

      projectModal.show();
    };

    document.querySelectorAll(".work-open").forEach((card) => {
      card.addEventListener("click", () => openProject(card));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject(card);
        }
      });
    });
  }

  // Validación del formulario en el navegador. No envía datos a un servidor.
  const form = document.querySelector("#contactForm");
  const message = document.querySelector("#formMessage");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const name = document.querySelector("#nombre");
      const email = document.querySelector("#email");
      const consultation = document.querySelector("#consulta");

      name.setCustomValidity(name.value.trim().length >= 3 ? "" : "Ingresá tu nombre.");
      consultation.setCustomValidity(
        consultation.value.trim().length >= 10 ? "" : "Escribí una consulta un poco más detallada."
      );

      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        message.textContent = "Revisá los campos marcados antes de continuar.";
        message.style.color = "#5c173d";
        return;
      }

      message.textContent = "¡Gracias, " + name.value.trim() + "! El formulario está validado. Para enviar el mensaje de verdad, falta conectarlo a un servicio.";
      message.style.color = "#321727";
      form.reset();
      form.classList.remove("was-validated");
      name.setCustomValidity("");
      email.setCustomValidity("");
      consultation.setCustomValidity("");
    });

    // Limpia el estado personalizado cuando se corrigen los campos.
    ["nombre", "email", "consulta"].forEach((id) => {
      const field = document.getElementById(id);
      field.addEventListener("input", () => {
        field.setCustomValidity("");
        if (message.textContent) message.textContent = "";
      });
    });
  }
});
