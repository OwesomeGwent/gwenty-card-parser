const fs = require('fs');
const { parseString } = require('xml2js');

const localeParser = require('./localeParser');

const xml = fs.readFileSync('Templates.xml', 'utf-8');

/* Templates필요 키 */
const NEED_KEY = ['Power', 'Armor', 'FactionId', 'Rarity', 'Provision', 'Muligans', 'Type', 'Kind'];

const locale = localeParser(process.argv[2] || 'ko-kr');

const parseTemplate = (acc, curr) => {
  const id = curr.$.Id;
  const need = {};
  NEED_KEY.map(key => need[key] = curr[key]);
  return {
    ...acc,
    [id]: {
      ...need,
      '$': undefined,
    }
  };
};
const mergeTemplate = templates => (acc, curr) => {
  return {
    ...acc,
    [curr]: {
      ...locale[curr],
      ...templates[curr],
    },
  };
}
parseString(xml, (err, templates) => {
  if (err) {
    return console.error(err);
  }
  const { Templates: { Template }} = templates;
  const parsed = Template.reduce(parseTemplate, {});
  const merged = Object.keys(locale).reduce(mergeTemplate(parsed), {});
  fs.writeFileSync('./templates.json', JSON.stringify(merged, null, 2));
});
