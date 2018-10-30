const fs = require('fs');
const parse = require('csv/lib/sync').parse;
// const xml = require('xml-parser');

// const locale = process.argv[2];

const localParser = (locale) => {
  const localeCSV = fs.readFileSync(`./Localization/${locale}.csv`, 'utf-8');

  const parsedLocale = parse(localeCSV, {
    delimiter: ';',
    rowDelimiter: '\r\n',
    quote: false,
  });

  const htLocale = parsedLocale.reduce((value, curr) => {
    const [key, field] = curr[0].split('_');
    const returnValue= { ...value };
    if (!value[key]) {
      returnValue[key] = {};
    }
    returnValue[key][field] = curr[1];
    return returnValue;
  }, {});
  
  return htLocale;
}


// fs.writeFile(`./${locale}.json`, JSON.stringify(htLocale, null, 2), 'utf-8', err => {
//   if (err) {
//     return console.error(err);
//   }
//   console.log('Successfully parsed!');
// });

module.exports = localParser;
