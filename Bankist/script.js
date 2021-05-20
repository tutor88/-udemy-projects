'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//smooth scroll
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation -> event delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     //default in this case scrolling to the anchor tag in html
//     e.preventDefault();
//     //important the href attribute is taken from the element that is clicked on
//     const id = this.getAttribute('href');
//     /// href attribute is used to scroll to
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//1. add event listener to common parent element
//2. determine what el orginated event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///tabbed component

tabsContainer.addEventListener('click', function (e) {
  ///wil find closest parent element with the class. Targets itself if it has the class
  const clicked = e.target.closest('.operations__tab');

  //Gaurd clause -> fixes the fact that if anywehre else then the buttons ic clicked within the container it will give null, when null is given. It will return immediately
  if (!clicked) return;
  /// clearing active tab on all
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  //adding active class to the one clicked
  clicked.classList.add('operations__tab--active');
  //remove active class for all content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  ///activate content. Important=> dataset is a number that can be dynamically read on the clicked element
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    // selecting link clicked as target
    const link = e.target;
    //selectig its siblings by moving up to the parent and down to slecting all siblings
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    //select logo by going up and sslecting img html tag
    const logo = link.closest('.nav').querySelector('img');
    //changing opacity of siblings and logo
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//advanced event handler with the callback function and next function binded. See below for easier function. In version below the 'this' variable in the function above would be 'opacity' and not this
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// //opposite of mouseover, when mouse leaves
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

///sticky nav
// const initialCords = section1.getBoundingClientRect();
// //fired each time you scroll om page, should be avoided because not efficient!
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

///sticky nav: Intersection Observer API
//calback function -> what will happen when the options of observing are met
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// //options what to look for. Root is the viewport and treshold the percentage it is in the viewport
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
// //create observer, arguments are the callback function and the options to look for
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// //on the observer call observe method and specify what it has to look for
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  treshold: 0,
  //margin of the header which is observed. the sticky nav will be activated 90 px before header is completely out of view
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //stop observing after effect is done
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

////Lazy loading images
///slect only images with the data source attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  ///remove lazy img class that blurs image
  //removes this class only when full pic is loaded. This is beacuse otherwise the old picture will be visible for people with slow internet when new pic is not loaded yet
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  //stop observing ones this is done
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  treshold: 0,
  ///rootmargin to already load the images before users notices
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/////slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');
///can use to make it more easy to see what you do
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

//starting slide is at 0, so for 0%, 100% 200% and 300%
let curSlide = 0;

//function calcs position of slide based on curslide
//same as before but now it has to be calculated by changing the order pf slides. first slide will be 0-1=-1 *100%
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
////createDots function to inset the dots and dataset
const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
    );
  });
};
const activateDot = function (slide) {
  //every time select all dots and remove the active class
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  ///find the dot with the right slidenumber based on the dataset then add the active class
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

//call to create
createDots();
//call activatedot to active the first dot when nothing is clicked yet
activateDot(0);
//set slides next to each other with 0%, 100%, 200% and 300%. Depending on how many images
goToSlide(0);

//define max slide to make it stop substracting 100% at the end of the slides
const maxSlide = slides.length - 1;

//nextSLide
///if curSlide is equal to maxslide set curSlide to 0 otherwise increase to next slide
const nextSlide = function () {
  curSlide === maxSlide ? (curSlide = 0) : curSlide++;
  goToSlide(curSlide);
  activateDot(curSlide);
};
const prevSlide = function () {
  curSlide === 0 ? (curSlide = maxSlide) : curSlide--;
  goToSlide(curSlide);
  activateDot(curSlide);
};

////button event next slide
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//key left and right to move slide
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// listen to parent container wwhen dots are clicked
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    //save which dot is clicked, so what the slide number is
    const slide = e.target.dataset.slide;
    ///or with destructurin
    ///const {slide} = e.target.dataset;
    //call the function with the slide clicked
    goToSlide(slide);
    activateDot(slide);
  }
});
//////////////////////////lectures
////selecting/creating/deleting

///selecting
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelectorAll('.section'));
// const allSections = document.querySelectorAll('.section');
// const [...arr] = document.querySelectorAll('.section');
// console.log(arr);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// document.getElementsByClassName('btn');

//creating and inserting elements
//.insertAdjacentHTML -> usefull if you already have the right html

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics.<button class="btn btn--close--cookie">Got it</button>';
// header.prepend(message);
// header.append(message);

// // delete elements
// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

////styles/attributes/ classes
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionality and analytics.<button class="btn btn--close--cookie">Got it</button>';
// header.prepend(message);
// header.append(message);
// //styles
// message.style.backgroundColor = '#37383D';
// message.style.width = '120%';
// console.log(message.style.height);
// console.log(getComputedStyle(message).color);
// // set to height to the height in the css sheet + 30 px. Works bij parsing the number of the string of the current height then adding 30 to that and then adding px again
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //attributes

// const logo = document.querySelector('.nav__logo');
// logo.alt = 'Beautiful minimalist logo';
// logo.setAttribute('company', 'bankist');
// console.log(logo.alt);
// console.log(logo.src);

// //data attributes
// console.log(logo.dataset.versionNumber);

// //classes
// logo.classList.add()
// logo.classList.remove()
// logo.classList.toggle()
// logo.classList.contains()
// //don't use
// logo.className= 'jonas' -> will remove all classes and adds this one

///smooth scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function () {
//   const s1coords = section1.getBoundingClientRect('');

//   //scrolling
//   /// first part 's1coords.left' is current position of element, 'window.pageXOffsett' is the current position of scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   //same as above accept more smooth scroll, you can add behavior smooth to scrolling
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });
//   //modern way of implementing scroll
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

///event and event handlers

// const h1 = document.querySelector('h1');

// const message = function (e) {
//   alert('addEventListener: Great! You are reading the heading');
//   //message will only come ones because here the event gets removed
//   h1.removeEventListener('mouseenter', message);
// };

// h1.addEventListener('mouseenter', message);
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading');
// };

///propagation in practice
//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target);
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Container', e.target);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target);
// });

/////dom traversing
// const h1 = document.querySelector('h1');
// //going downward:child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// ///going upward: parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// ///going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children);
// console.log([...h1.parentElement.children]);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
