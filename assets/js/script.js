function Carousel() {
  this.slide = document.querySelectorAll(".wrap-item");
  this.container = document.querySelector("#wrap");
  this.next = document.querySelector("#next");
  this.prev = document.querySelector("#prev");
  this.pointers = document.querySelectorAll(".pointer");
  this.buttonPause = document.querySelector("#pause");

  this.countSlide = 0;
  this.action = true;
  this.xDown = null;
  this.xUp = null;
  this.interaval = 1000;
  this.SLIDES_COUNT = this.slide.length;
}

Carousel.prototype = {
  //move slide
  goSlide(n) {
    this.slide[this.countSlide].className = "wrap-item";
    this.countSlide = (this.SLIDES_COUNT + n) % this.SLIDES_COUNT;
    this.slide[this.countSlide].className = "wrap-item active";
    this.changeActive();
  },

  //pause button
  pauseHandler() {
    if (this.action) {
      this.pauseAction();
    } else {
      this.playAction();
    }
  },

  pauseAction() {
    this.buttonPause.innerHTML = "Play";
    clearInterval(this.action);
    this.action = false;
  },

  //next slide
  nextHandler() {
    this.nextAndPause();
  },

  nextSlide() {
    this.goSlide(this.countSlide + 1);
  },

  playAction() {
    this.buttonPause.innerHTML = "Pause";
    this.action = setInterval(this.nextSlide.bind(this), this.interaval);
  },

  //previous slide
  prevHandler() {
    this.prevAndPause();
  },

  prevSlide() {
    this.goSlide(this.countSlide - 1);
  },

  //next+prev+pause
  nextAndPause() {
    this.nextSlide();
    this.pauseAction();
  },

  prevAndPause() {
    this.prevSlide();
    this.pauseAction();
  },

  //logic of pointers
  pointersHandler(p) {
    const index = [...this.pointers].indexOf(p.target);
    this.goSlide(index);
    this.pauseAction();
  },

  //add+remove active class
  changeActive() {
    this.pointers.forEach((p) => p.classList.remove("active"));
    this.pointers[this.countSlide].classList.add("active");
  },

  //manage keyboard
  keyHandler(e) {
    switch (e.key) {
      case "ArrowLeft":
        this.prevAndPause();
        break;
      case "ArrowRight":
        this.nextAndPause();
        break;
      case " ":
        if (this.action) {
          this.pauseAction();
        } else {
          this.playAction();
        }
    }
  },

  //slide mouse+finger
  swipeStart(e) {
    this.xDown = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
  },

  swipeEnd(e) {
    this.xUp =
      e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX;
    if (this.xDown - this.xUp > 100) this.prevAndPause();
    if (this.xDown - this.xUp < -100) this.nextAndPause();
  },

  intervalSet() {
    setInterval(this.nextSlide.bind(this), this.interaval);
  },

  listeners() {
    this.container.addEventListener("touchstart", this.swipeStart.bind(this));
    this.container.addEventListener("touchend", this.swipeEnd.bind(this));
    this.container.addEventListener("mousedown", this.swipeStart.bind(this));
    this.container.addEventListener("mouseup", this.swipeEnd.bind(this));
    this.prev.addEventListener("click", this.prevHandler.bind(this));
    this.next.addEventListener("click", this.nextHandler.bind(this));
    this.buttonPause.addEventListener("click", this.pauseHandler.bind(this));
    this.pointers.forEach((pointer) => {
      pointer.addEventListener("click", this.pointersHandler.bind(this));
    });
    document.addEventListener("keydown", this.keyHandler.bind(this));
  },

  //initialize
  init() {
    this.listeners();
    this.intervalSet();
  },
};
const carousel = new Carousel();
carousel.init();
