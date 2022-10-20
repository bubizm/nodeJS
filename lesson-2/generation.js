const fs = require('fs');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

let ip = '';

const formatDate = (date) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = '0' + minute;
  }
  let second = date.getSeconds();
  if (second < 10) {
    second = '0' + second;
  }

  return [day, monthNames[monthIndex], year, hour, minute, second];
};

const writeInDoc = async (ip) => {
  const stats = fs.lstatSync('./data.txt');
  let fileSizeInBytes = stats.size;
  let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  const date = formatDate(new Date());
  const data = `${ip} - - [${date[0]}/${date[1]}/${date[2]}:${date[3]}:${date[4]}:${date[5]} +0000] "POST /baz HTTP/1.1" 200 0 "-" "curl/7.47.0"`;
  const writeStreamData = fs.createWriteStream('./data.txt', {
    flags: 'a',
    encoding: 'utf-8',
  });
  const writingFunc = async (query) =>
    new Promise((res, rej) => {
      writeStreamData.write(query, res);
    });

  if (fileSizeInMegabytes < 1) {
    await writingFunc(data + '\n');
    ip = '';
    if (fileSizeInMegabytes < 1) {
      ipGeneration(ip);
    }
    writeStreamData.end();
  } //else {
  //    console.log(Math.trunc(fileSizeInMegabytes));
  // }
};

const ipGeneration = (ip) => {
  for (let i = 0; i < 4; i++) {
    const num = Math.floor(Math.random() * 1000);
    if (num < 0 || num > 255) {
      i--;
      continue;
    }
    if (i < 3) {
      ip += num + '.';
    } else {
      ip += num;
      writeInDoc(ip);
    }
  }
};

rl.question('Введите интересующий вас IP-адрес: ', (answer) => {
  fs.readFile('./data.txt', (err, data) => {
    if (err) throw err;
    // const ip = '128.22.213.12';

    if (data.includes(answer)) {
      const findIP = data
        .toString('utf-8')
        .split('\n')
        .filter((el) => el.includes(answer))
        .toString();
      const writeStreamIP = fs.createWriteStream(
        `./logs/%${answer}%_requests.log`,
        {
          encoding: 'utf-8',
          flags: 'a',
        }
      );
      const writingFuncIP = async (query) => {
        new Promise((res, rej) => {
          writeStreamIP.write(query, res);
        });
      };
      writingFuncIP(findIP + '\n');
    }
  });
  rl.close();
});

ipGeneration(ip);
