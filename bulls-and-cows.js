const readlineSync = require('readline-sync');
const heplers = require('./helpers');

let NUMBER_OF_ATTEMPTS = 10; // Number of given attempts to guess the number
const LENGTH_OF_GUESSED_NUMBER = 5;

const guessed_number = heplers
  .getRandomUniqueNumbers(9, LENGTH_OF_GUESSED_NUMBER)
  .join('');

let bulls = 0;
let cows = 0;
let bulls_arr = []; // Array of guessed numbers in the right position
let cows_arr = []; // Array of guessed numbers in the wrong position

let num = readlineSync.question(
  `Привет! Я загадал число из ${guessed_number.length} различающихся цифр. У вас есть ${NUMBER_OF_ATTEMPTS} попыток, чтобы угадать число. Введите число\n`
);

function guessNumber() {
  for (let i = 0; i < num.length; i++) {
    for (let j = 0; j < guessed_number.length; j++) {
      if (i === j && num[i] === guessed_number[j]) {
        if (!bulls_arr.includes(num[i])) {
          bulls++;
          bulls_arr.push(num[i]);
        }
      } else if (i !== j && num[i] === guessed_number[j]) {
        cows++;
        if (!cows_arr.includes(num[i])) {
          cows_arr.push(num[i]);
        } else {
          cows--;
        }
      }
    }
  }
}

// If the user didn't guess the number, set all to 0
function resetToZero() {
  bulls_arr.length = 0;
  cows_arr.length = 0;
  bulls = 0;
  cows = 0;
}

// If the user didn't guess the number and didn't exceed the number of attempts, ask to enter the number again
while (NUMBER_OF_ATTEMPTS !== 1 && num !== guessed_number) {
  guessNumber();
  NUMBER_OF_ATTEMPTS--;
  console.log(
    `\nCовпавших цифр не на своих местах - ${cows} - (${cows_arr}), цифр на своих местах - ${bulls} - (${bulls_arr})`
  );
  resetToZero();
  num = readlineSync.question('\nПопробуйте еще раз!\n');
  guessNumber();
}

if (num === guessed_number) {
  console.log('Поздравляю! Вы угадали');
} else {
  console.log('Вы не угадали!');
}
