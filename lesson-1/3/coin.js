const EventEmitter = require('events');
const { emit } = require('process');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
const emitterObject = new EventEmitter();

let answ = '';

const generateIntInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  if (result === 0) {
    console.log('Dropped out: eagle');
    emitterObject.emit('eagle', answ);
  } else {
    console.log('Dropped out: tails');
    emitterObject.emit('tails', answ);
  }
};

emitterObject.on('eagle', (answ) => {
  if (answ === 'eagle') {
    console.log('You are win!');
  } else console.log('You are lose(');
});
emitterObject.on('tails', (answ) => {
  if (answ === 'tails') {
    console.log('You are win!');
  } else console.log('You are lose(');
});

const question1 = () => {
  rl.question('What will fall out? \n', (answer) => {
    if (answer === 'eagle' || answer === 'tails') {
      answ = answer;
      generateIntInRange(0, 1);
      question2();
    } else {
      question1();
    }
  });
};

const question2 = () => {
  rl.question('Whant you game again? \n', (answer) => {
    if (answer === 'yes' || answer === 'y') {
      question1();
    } else process.exit();
  });
};

question1();
