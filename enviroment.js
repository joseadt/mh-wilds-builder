var fs = require('fs')
const enviromentProd = "src/environments/environment.ts";
fs.readFile(enviromentProd, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace("DATA_URL", process.env['DATA_URL']);

  fs.writeFile(enviromentProd, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
