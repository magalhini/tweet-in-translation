const fs = require('fs');

const readJSON = path => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (data) return resolve(JSON.parse(data));
    else return reject(err);
  });
});

module.exports = {
  readJSON
};
