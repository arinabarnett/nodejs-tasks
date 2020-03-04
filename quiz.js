const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const helpers = require('./helpers');

const QUESTIONS_FOLDER_PATH = 'quiz-questions';
const AMOUNT_OF_QUESTIONS = 5; // Set the amount of questions asked during the game

let filesWithQuestions;

try {
  filesWithQuestions = fs.readdirSync(QUESTIONS_FOLDER_PATH);
} catch (err) {
  throw new Error(`Ошибка чтения директории - ${QUESTIONS_FOLDER_PATH}`, err);
}
// Simple filter for .txt
filesWithQuestions = filesWithQuestions.filter(item => {
  return path.extname(item) === '.txt';
});

if (
  filesWithQuestions.length === 0 ||
  filesWithQuestions.length < AMOUNT_OF_QUESTIONS
) {
  throw new Error(
    `Ошибка! Отсутствуют необходимое количество файлов вопросов в директории - ${QUESTIONS_FOLDER_PATH}. Необходимое количество файлов - ${AMOUNT_OF_QUESTIONS}`
  );
}

let uniqueRandomKeys = helpers.getRandomUniqueNumbers(
  filesWithQuestions.length,
  AMOUNT_OF_QUESTIONS
);

let arrayOfQuestions = uniqueRandomKeys.map(value => {
  let filePath = path.join(QUESTIONS_FOLDER_PATH, filesWithQuestions[value]);
  let dataFromFile;

  try {
    dataFromFile = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Ошибка чтения файла -', filePath, err);
  }

  let arrayOfLinesFromFile = dataFromFile.split('\n');

  return {
    question: arrayOfLinesFromFile[0],
    rightAnswer: parseInt(arrayOfLinesFromFile[1]),
    answers: arrayOfLinesFromFile.splice(2),
  };
});

console.log(
  `Добро пожаловать в игру "Викторина". Вам предстоит ответить на 5 вопросов. Поехали! \n`
);

let numberOfCorrectAnswers = 0;

for (let i = 0; i < arrayOfQuestions.length; i++) {
  console.log(
    `\n ========================================= Вопрос №${i +
      1} ================================================ \n`
  );
  console.log(arrayOfQuestions[i].question);
  console.log('\nВыберите правильный ответ из доступных вариантов: \n');
  let index = readlineSync.keyInSelect(
    arrayOfQuestions[i].answers,
    'Введите цифру: '
  );

  if (index + 1 === arrayOfQuestions[i].rightAnswer) {
    numberOfCorrectAnswers++;
  }

  if (index === -1) {
    console.log('Вы пропустили вопрос!');
  }
}

console.log(
  `Ура! Вы прошли викторину, количество правильных ответов - ${numberOfCorrectAnswers} `
);
