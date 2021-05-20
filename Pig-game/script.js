'use strict';

const diceRoll = document.querySelector('.btn--roll');
const hold = document.querySelector('.btn--hold');
const newGame = document.querySelector('.btn--new');
const dice = document.querySelector('.dice');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const scorePlayer0 = document.querySelector('#current--0');
const scorePlayer1 = document.querySelector('#current--1');
const currentScorePlayer1 = document.querySelector('#score--1');
const currentScorePlayer0 = document.querySelector('#score--0');
const myPix = [
  'dice-1.png',
  'dice-2.png',
  'dice-3.png',
  'dice-4.png',
  'dice-5.png',
  'dice-6.png',
];
let randomNum = Math.trunc(Math.random() * myPix.length);
let score = 0;
let currentScore0 = 0;
let currentScore1 = 0;
let playing = true;

diceRoll.addEventListener('click', function () {
  if (playing) {
    dice.src = myPix[randomNum];

    if (player0.classList.contains('player--active')) {
      score = score + randomNum + 1;
      scorePlayer0.textContent = score;
    } else if (player1.classList.contains('player--active')) {
      score = score + randomNum + 1;
      scorePlayer1.textContent = score;
    }
    if (randomNum === 0) {
      score = 0;
      if (player0.classList.contains('player--active')) {
        player0.classList.remove('player--active');
        player1.classList.add('player--active');
        scorePlayer1.textContent = '0';
        scorePlayer0.textContent = '0';
      } else if (player1.classList.contains('player--active')) {
        player0.classList.add('player--active');
        player1.classList.remove('player--active');
        scorePlayer0.textContent = '0';
        scorePlayer1.textContent = '0';
      }
    }
    randomNum = Math.trunc(Math.random() * myPix.length);
  }
});

hold.addEventListener('click', function () {
  if (player0.classList.contains('player--active')) {
    currentScore0 = score + currentScore0;
    currentScorePlayer0.textContent = currentScore0;
    scorePlayer0.textContent = '0';
    player0.classList.remove('player--active');
    player1.classList.add('player--active');
    score = 0;
    if (currentScore0 > 99) {
      player0.classList.add('player--winner');
      playing = false;
    }
  } else if (player1.classList.contains('player--active')) {
    currentScore1 = score + currentScore1;
    currentScorePlayer1.textContent = currentScore1;
    scorePlayer1.textContent = '0';
    player0.classList.add('player--active');
    player1.classList.remove('player--active');
    score = 0;
    if (currentScore1 > 99) {
      player1.classList.add('player--winner');
      playing = false;
    }
  }
});

newGame.addEventListener('click', function () {
  playing = true;
  score = 0;
  currentScore1 = 0;
  currentScore0 = 0;
  player0.classList.add('player--active');
  player1.classList.remove('player--active');
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
  scorePlayer1.textContent = '0';
  scorePlayer0.textContent = '0';
  currentScorePlayer1.textContent = '0';
  currentScorePlayer0.textContent = '0';
});
