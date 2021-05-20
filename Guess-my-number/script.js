'use strict';

// document.querySelector('.message').textContent = 'Correct Number!';
// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;

/// Too make code DRY you can set duplicate code to function like this:

// const displayMessage = function(message) {
//     document.querySelector('.message').textContent = message
// }

// you can then call the function like: displayMessage('Correct, number!')

let secretNumber = Math.trunc(Math.random() * 20) + 1;
// document.querySelector('.number').textContent = secretNumber;
let score = 20;
let highScore = 0;
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  //when no input
  if (!guess) {
    document.querySelector('.message').textContent = 'Sukkel, 1 tot 20 toch!';

    //when player wins
  } else if (guess === secretNumber) {
    document.querySelector('.message').textContent = 'Correct, number!';
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = secretNumber;
    //updating highscore
    if (score > highScore) {
      document.querySelector('.highscore').textContent = score;
      highScore = score;
    }
  } //when guess wrong
  else if (guess !== secretNumber && guess < 21) {
    if (score > 1) {
      document.querySelector('.message').textContent =
        guess > secretNumber ? 'Too high!' : 'Too low!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      score--;
      document.querySelector('.score').textContent = 0;
      document.querySelector('.message').textContent = 'You lost!';
    }

    //when guess to high
    //   else if (guess > secretNumber && guess < 21) {
    //     if (score > 1) {
    //       document.querySelector('.message').textContent = 'Too high!';
    //       score--;
    //       document.querySelector('.score').textContent = score;
    //     } else {
    //       score--;
    //       document.querySelector('.score').textContent = 0;
    //       document.querySelector('.message').textContent = 'You lost!';
    //     }

    //     //when guess to low
    //   } else if (guess < secretNumber) {
    //     if (score > 1) {
    //       document.querySelector('.message').textContent = 'Too low!';
    //       score--;
    //       document.querySelector('.score').textContent = score;
    //     } else {
    //       document.querySelector('.score').textContent = 0;
    //       document.querySelector('.message').textContent = 'You lost!';
    //     }

    //when guess above 20
  } else if (guess > 20) {
    document.querySelector('.message').textContent = 'Sukkel, 1 tot 20 toch!';
  }
});

//when again button is clicked
document.querySelector('.again').addEventListener('click', function () {
  document.querySelector('.guess').value = '';
  document.querySelector('.message').textContent = 'Start guessing..';
  document.querySelector('.score').textContent = 20;
  score = 20;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '14rem';
  document.querySelector('.number').textContent = '?';

  secretNumber = Math.trunc(Math.random() * 20) + 1;
});
