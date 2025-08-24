function createModalGallery(options) {
  if (!options || !options.idElement) {
    console.error('Element ID is required to create the modal gallery.');
    return;
  }

  var galleryContainer = renderModalGallery(options.idElement);
  var gridGalleryContainer = galleryContainer.querySelector(".gallery-carousel-grid");
  var bulletsContainer = galleryContainer.querySelector(".bullets-container");

  var images = options.images || [];
  var colorBullet = options.colorBullet || 'red';
  var autoPlayInterval = options.autoPlayInterval || 3000;

  if (!galleryContainer) {
    console.error('Modal gallery container is not defined.');
    return;
  }

  if (!gridGalleryContainer) {
    console.error('Gallery carousel grid is not defined.');
    return;
  }

  if (!bulletsContainer) {
    console.error('Bullets container is not defined.');
    return;
  }

  if (!Array.isArray(images) || images.length === 0) {
    console.error('No valid images provided for the gallery.');
    return;
  }

  gridGalleryContainer.innerHTML = images.map(function (image) {
    return '<div class="gallery-image card-carousel"><img src="' + image + '" alt="Gallery Image"></div>';
  }).join("");

  bulletsContainer.innerHTML = images.map(function (_, index) {
    return '<div class="bullet-button page-' + (index + 1) + ' ' + (index === 0 ? 'active' : '') + '" data-index="' + index + '"></div>';
  }).join("");
  bulletsContainer.querySelector(".active").style.backgroundColor = colorBullet;

  new CardCarousel({
    selector: ".gallery-carousel",
    cardsPerSlide: { sm: 1, md: 1, lg: 1 },
    autoPlay: true,
    autoPlayInterval: autoPlayInterval,
    onSlideChange: function (currentSlide, slideSize) {
      const bullets = bulletsContainer.querySelectorAll('.bullet-button');
      bullets.forEach(function (bullet) {
        bullet.classList.remove('active')
        bullet.style.backgroundColor = '#ffffff';
      });

      const activeBullet = bulletsContainer.querySelector(`.bullet-button.page-${currentSlide + 1}`);
      if (activeBullet) {
        activeBullet.classList.add('active');
        activeBullet.style.backgroundColor = colorBullet;
      };
    },
    onLoaded: function (goToPage) {
      bulletsContainer.querySelectorAll('.bullet-button').forEach((bullet, index) => {
        bullet.addEventListener('click', function () {
          goToPage(index);
        });
      });
    }
  });

  function renderModalGallery(idElement) {
    // Elimina cualquier galería previa
    var oldContainer = document.querySelector('#' + idElement + ' .modal-gallery-container');
    if (oldContainer) oldContainer.remove();

    // Crea el contenedor principal
    var container = document.createElement('div');
    container.id = idElement;
    container.className = 'modal-gallery-container';

    // Botón de cerrar
    var closeModal = document.createElement('div');
    closeModal.className = 'close-modal';
    closeModal.textContent = 'CERRAR';
    container.appendChild(closeModal);

    closeModal.addEventListener('click', function () {
      container.remove();
    });

    // Carrusel principal
    var galleryCarousel = document.createElement('div');
    galleryCarousel.className = 'gallery-carousel card-carousel-container';

    var galleryGrid = document.createElement('div');
    galleryGrid.className = 'gallery-carousel-grid card-carousel-grid';
    galleryCarousel.appendChild(galleryGrid);

    container.appendChild(galleryCarousel);

    // Bullets
    var bulletsContainer = document.createElement('div');
    bulletsContainer.className = 'bullets-container';
    container.appendChild(bulletsContainer);
    
    document.body.appendChild(container);

    // Evento para cerrar el modal con la tecla ESC
    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        container.remove();
        document.removeEventListener('keydown', escListener);
      }
    });

    // Retorna el contenedor para uso posterior
    return container;
  }
}