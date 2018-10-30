const path = require('path');
const fs = require('fs');
const parse = require('csv/lib/sync').parse;

const localParser = locale => {
  const localeCSV = fs.readFileSync(
    path.join(
      'data_definitions',
      'Localization',
      `${locale}.csv`,
    ),
    'utf-8'
  );

  const parsedLocale = parse(localeCSV, {
    delimiter: ';',
    rowDelimiter: '\r\n',
    quote: false
  });

  const htLocale = parsedLocale.reduce((acc, curr) => {
    const [key, field] = curr[0].split('_');
    const returnValue = { ...acc };
    returnValue[key] = returnValue[key] || {};
    returnValue[key][field] = curr[1];
    return returnValue;
  }, {});

  // for temporary data
  delete htLocale['card'];
  // extract factions
  const Factions = {
    1: htLocale['100'], //Neutral
    2: htLocale['101'], // Monster
    4: htLocale['102'], // Nilfgaard
    8: htLocale['103'], // Northern Realm
    16: htLocale['104'], // Scoiatael
    32: htLocale['105'] // Skellige
  };
  const Keywords = { ...htLocale.keyword };
  // clean Factions
  for (let i = 0; i < 6; i++) {
    delete htLocale[`10${i}`];
  }

  return { Factions, Cards: htLocale, Keywords };
};

module.exports = localParser;
