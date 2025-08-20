// CardCarousel Library - instancia independiente por carrusel, compatible con navegadores antiguos

function CardCarousel(selector, cardsPerSlide, backwardButton, forwardButton) {

  this.carouselContainer = document.querySelector(selector);
  this.carouselGridContainer = document.querySelector(".card-carousel-grid");;
  this.cardList = this.carouselContainer ? this.carouselContainer.querySelectorAll('.card-carousel') : [];
  this.cardListSize = this.cardList.length;
  this.cardWidth = 0;
  this.slideWidth = 0;
  this.cardsPerSlide = cardsPerSlide || { sm: "1", md: "2", lg: "3" };
  this.slideSize = Math.ceil(this.cardListSize / this.getCardsPerSlide());
  this.currentSlide = 0;
  this.backwardButton = document.querySelectorAll(backwardButton);
  this.forwardButton = document.querySelectorAll(forwardButton);
  this.isScrolling = false;



  if (!this.cardList || this.cardListSize === 0) {
    return console.error('CardCarousel: No cards found');
  }

  if (backwardButton.length === 0) {
    return console.error('CardCarousel: Backward button selector is required');
  }

  if (forwardButton.length === 0) {
    return console.error('CardCarousel: Forward button selector is required');
  }


  this.calculateCardSize();
  this.onResize();
  this.onBackwardClick();
  this.onForwardClick();
}

CardCarousel.prototype.calculateCardSize = function (selector, options) {
  this.getSlideWidth();
  this.getCardWidth();
  this.setCardWidth();
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
    self.calculateCardSize();
  });
}

CardCarousel.prototype.onBackwardClick = function () {
  var self = this;

  self.backwardButton.forEach(function (button) {

    self.isScrolling = false
    button.addEventListener('click', function (event) {
      if (self.isScrolling) {
        console.log("CardCarousel: Scrolling in progress, ignoring backward click");
        return;
      }

      if (self.currentSlide > 0) {
        self.isScrolling = true;
        self.currentSlide--;

        var leftScroll = self.slideWidth + self.getGap();
        if (self.currentSlide === self.slideSize - 2 && (this.cardListSize % self.getCardsPerSlide() > 0)) {
          leftScroll = leftScroll = self.getWidthOfLastSlide();
        }

        self.carouselContainer.scrollBy({
          left: -leftScroll,
          behavior: 'smooth'
        });

        setTimeout(function () {
          self.isScrolling = false;
        }, 1000);
      }
    });
  });


}

CardCarousel.prototype.onForwardClick = function () {

  var self = this;
  self.forwardButton.forEach(function (button) {

    self.isScrolling = false
    button.addEventListener('click', function () {
      if (self.isScrolling) {
        console.log("CardCarousel: Scrolling in progress, ignoring forward click");
        return;
      }

      if (self.currentSlide < self.slideSize - 1) {
        self.isScrolling = true;
        self.currentSlide++;

        var leftScroll = self.slideWidth + self.getGap();
        if (self.currentSlide === self.slideSize - 1 && (self.cardListSize % self.getCardsPerSlide() > 0)) {
          leftScroll = leftScroll = self.getWidthOfLastSlide();
        }

        self.carouselContainer.scrollBy({
          left: leftScroll,
          behavior: 'smooth'
        });

        setTimeout(function () {
          self.isScrolling = false;
        }, 1000);
      }
    });

  });
}

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

CardCarousel.prototype.getWidthOfLastSlide = function () {
  var slideSize = (this.cardListSize / this.getCardsPerSlide());
  var percentFilled = slideSize - Math.floor(slideSize);
  return Math.ceil(percentFilled * this.slideWidth);
}

CardCarousel.prototype.getWidthOfForwardSlide = function () {
  var leftScroll = self.slideWidth + self.getGap();
  if (this.currentSlide === this.slideSize - 1 && (this.cardListSize % this.getCardsPerSlide() > 0)) {
    leftScroll = leftScroll = self.getWidthOfLastSlide();
  }


  // var slideSize = (this.cardListSize / this.getCardsPerSlide());
  // var percentFilled = slideSize - Math.floor(slideSize);
  // return Math.ceil(percentFilled * this.slideWidth);
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

  var totalGap = (this.getCardsPerSlide() - 1) * this.getGap();
  this.cardWidth = Math.ceil((this.slideWidth - totalGap) / this.getCardsPerSlide())
};

CardCarousel.prototype.setCardWidth = function () {
  for (var i = 0; i < this.cardList.length; i++) {

    this.cardList[i].style.width = this.cardWidth + 'px';
  }
};


if (typeof window.CardCarousel === 'undefined') {
  window.CardCarousel = CardCarousel;
}

// Ejemplo de uso:
// window.addEventListener('DOMContentLoaded', function () {
//   var carousel1 = new CardCarousel('.card-carousel-container', 400, 3);
//   var carousel2 = new CardCarousel('.otro-carousel', 300, 2);
// });
