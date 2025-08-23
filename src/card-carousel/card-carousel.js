// CardCarousel Library - instancia independiente por carrusel, compatible con navegadores antiguos

function CardCarousel(options) {
  options = options || {};
  this.carouselContainer = document.querySelector(options.selector);
  this.carouselGridContainer = this.carouselContainer.querySelector(".card-carousel-grid");
  this.cardList = this.carouselContainer ? this.carouselContainer.querySelectorAll('.card-carousel') : [];
  this.backwardButton = document.querySelectorAll(options.backwardButton);
  this.forwardButton = document.querySelectorAll(options.forwardButton);

  this.cardListSize = this.cardList.length;
  this.cardWidth = 0;
  this.slideWidth = 0;
  this.cardsPerSlide = options.cardsPerSlide || { sm: 1, md: 2, lg: 3 };
  this.slideSize = Math.ceil(this.cardListSize / this.getCardsPerSlide());
  this.slidesPosition = [];
  this.currentSlide = 0;
  this.autoPlay = typeof options.autoPlay === 'undefined' ? true : options.autoPlay;
  this.autoPlayInterval = options.autoPlayInterval || 3000;
  this.autoPlayIsRunning = null;
  this.onSlideChange = options.onSlideChange || function (currentSlide, slideSize) { };
  this.onLoaded = options.onLoaded || function (goToPage) { };

  if (!this.cardList || this.cardListSize === 0) {
    return console.error('CardCarousel: No cards found');
  }

  if (!options.backwardButton || this.backwardButton.length === 0) {
    console.log('CardCarousel: Backward button not added');
  }

  if (!options.forwardButton || this.forwardButton.length === 0) {
    console.log('CardCarousel: Forward button not added');
  }

  this.calculateCardSize();
  this.startAutoPlay();
  this.onResize();
  this.onBackwardClick();
  this.onForwardClick();

  if (typeof this.onLoaded === 'function') {
    this.onLoaded(this.goToPage.bind(this));
  }
}

CardCarousel.prototype.calculateCardSize = function () {
  this.getSlideWidth();
  this.getCardWidth();
  this.setGridStyles();
  this.getSlidesPosition();
}
CardCarousel.prototype.getSlideWidth = function () {
  if (!this.carouselContainer) {
    console.error("CardCarousel: Carousel container not found");
    this.slideWidth = 0;
  }

  var width = this.carouselContainer.offsetWidth;
  if (isNaN(width)) {
    console.log("CardCarousel: Carousel container width is NaN");
    this.slideWidth = 0;
  }

  this.slideWidth = width;
}

CardCarousel.prototype.getCardWidth = function () {
  if (this.slideWidth === 0) {
    console.error('CardCarousel: Carousel container width is zero');
    this.cardWidth = 0;
  }

  if (this.getCardsPerSlide() >= this.cardListSize) {
    console.error('CardCarousel: Cards per view exceeds available cards');
    this.cardWidth = 0;
  }

  if (this.getCardsPerSlide() <= 0) {
    console.error('CardCarousel: Cards per view must be greater than zero');
    this.cardWidth = 0;
  }

  if (this.getCardsPerSlide() === 1) {
    this.cardWidth = this.slideWidth;
  }

  var totalGapPerSlide = (this.getCardsPerSlide() - 1) * this.getGap();
  this.cardWidth = Math.ceil((this.slideWidth - totalGapPerSlide) / this.getCardsPerSlide())
};

CardCarousel.prototype.setGridStyles = function () {
  if (!this.carouselGridContainer) {
    console.error("CardCarousel: Carousel grid container not found");
    return 0;
  }

  this.carouselGridContainer.style.display = 'grid';
  this.carouselGridContainer.style.gridTemplateColumns = `repeat(${this.cardListSize}, ${this.cardWidth}px)`;

  this.carouselContainer.style.overflowX = 'hidden';
};
CardCarousel.prototype.getSlidesPosition = function () {
  this.slidesPosition = [];
  for (let slideNumber = 0; slideNumber < this.slideSize; slideNumber++) {

    if (slideNumber == 0) {
      this.slidesPosition.push(0);
      continue;
    }

    var cardNumber = slideNumber * this.getCardsPerSlide();
    if (this.cardList[cardNumber]) {
      var cardPosition = this.cardList[cardNumber].offsetLeft;
      this.slidesPosition.push(cardPosition);
    }
  }
}

CardCarousel.prototype.getGap = function () {
  if (!this.carouselGridContainer) {
    return 0;
  }

  var gap = parseInt(getComputedStyle(this.carouselGridContainer).gap, 10);
  if (isNaN(gap)) {
    return 0;
  }

  return gap;
}

CardCarousel.prototype.onResize = function () {
  var self = this;
  window.addEventListener('resize', function () {
    self.currentSlide = 0;
    self.carouselContainer.scrollTo({ left: 0 });
    self.calculateCardSize();
  });
}

CardCarousel.prototype.onBackwardClick = function () {
  var self = this;
  self.backwardButton.forEach(function (button) {
    button.addEventListener('click', function () {
      self.stopAutoPlay();
      if (self.currentSlide > 0) {

        self.carouselContainer.scrollTo({
          left: self.slidesPosition[--self.currentSlide],
          behavior: 'smooth'
        });

        if (typeof self.onSlideChange === 'function') {
          self.onSlideChange(self.currentSlide, self.slideSize);
        }
      }
    });
  });
}

CardCarousel.prototype.onForwardClick = function () {
  var self = this;
  self.forwardButton.forEach(function (button) {
    button.addEventListener('click', function () {
      self.stopAutoPlay();
      if (self.currentSlide < self.slideSize - 1) {

        self.carouselContainer.scrollTo({
          left: self.slidesPosition[++self.currentSlide],
          behavior: 'smooth'
        });

        if (typeof self.onSlideChange === 'function') {
          self.onSlideChange(self.currentSlide, self.slideSize);
        }
      }
    });

  });
}

CardCarousel.prototype.goToPage = function (pageNumber) {
  console.log({ pageNumber });

  if (pageNumber < 0 || pageNumber >= this.slideSize) {
    console.error('CardCarousel: Invalid page number');
    return;
  }

  this.stopAutoPlay();
  this.currentSlide = pageNumber;
  this.carouselContainer.scrollTo({
    left: this.slidesPosition[this.currentSlide],
    behavior: 'smooth'
  });

  if (typeof this.onSlideChange === 'function') {
    this.onSlideChange(this.currentSlide, this.slideSize);
  }
}

CardCarousel.prototype.startAutoPlay = function () {
  var self = this;
  if (!this.autoPlay) return;

  var forward = true;
  this.autoPlayIsRunning = setInterval(function () {
    if (forward) {
      if (self.currentSlide < self.slideSize - 1) {
        self.currentSlide++;
      } else {
        forward = false;
        self.currentSlide--;
      }
    } else {
      if (self.currentSlide > 0) {
        self.currentSlide--;
      } else {
        forward = true;
        self.currentSlide++;
      }
    }

    self.carouselContainer.scrollTo({
      left: self.slidesPosition[self.currentSlide],
      behavior: 'smooth'
    });


    if (typeof self.onSlideChange === 'function') {
      self.onSlideChange(self.currentSlide, self.slideSize);
    }
  }, this.autoPlayInterval);
}

CardCarousel.prototype.stopAutoPlay = function () {
  if (this.autoPlayIsRunning) {
    clearInterval(this.autoPlayIsRunning);
    this.autoPlayIsRunning = null;
  }
};

CardCarousel.prototype.getCardsPerSlide = function () {
  var windowwidth = window.innerWidth;

  if (windowwidth <= 767) {
    return this.cardsPerSlide.sm;
  } else if (windowwidth > 767 && windowwidth <= 1024) {
    return this.cardsPerSlide.md;
  } else {
    return this.cardsPerSlide.lg;
  }
};

// Ejemplo de uso:
// window.addEventListener('DOMContentLoaded', function () {
//   new CardCarousel({
//     selector: '.card-carousel-container',
//     backwardButton: '.backward-button',
//     forwardButton: '.forward-button',
//     cardsPerSlide: { sm: 1, md: 2, lg: 3 },
//     autoPlay: true,
//     autoPlayInterval: 3000,
//     onSlideChange: function (currentSlide, slideSize) {
//       console.log('Current slide:', currentSlide, 'Slide size:', slideSize);

//       const bullets = document.querySelectorAll('.bullet-container .bullet');
//       bullets.forEach(bullet => bullet.classList.remove('active'));
//       const activeBullet = document.querySelector(`.bullet.page-${currentSlide + 1}`);
//       if (activeBullet) {
//         activeBullet.classList.add('active');
//       };
//     },
//     onLoaded: function (goToPage) {
//       document.querySelectorAll('.bullet-container .bullet').forEach((bullet, index) => {
//         bullet.addEventListener('click', function () {
//           goToPage(index);
//         });
//       });
//     }
//   });
// });
