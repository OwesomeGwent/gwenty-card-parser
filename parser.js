const fs = require('fs');
const { parseString } = require('xml2js');

const localeParser = require('./src/localeParser');
const abilityParser = require('./src/abilityParser');
const xml = fs.readFileSync('./data_definitions/Templates.xml', 'utf-8');

/* Templates필요 키 */
const NEED_KEY = [
  'Power',
  'Armor',
  'FactionId',
  'Rarity',
  'Provision',
  'Muligans',
  'Type',
  'Kind',
];

const locale = localeParser(process.argv[2] || 'ko-kr');
const parseTemplate = (acc, curr) => {
  const id = curr.$.Id;
  const Availability = curr.$.id;
  const need = {};
  NEED_KEY.map(key => (need[key] = curr[key]));
  return {
    ...acc,
    [id]: {
      Availability,
      ...need,
      $: undefined,
    },
  };
};

const mergeTemplate = templates => (acc, [key, value]) => {
  if (!templates[key]) return acc;
  return {
    ...acc,
    [key]: {
      ...value,
      ...templates[key],
    },
  };
};

parseString(xml, async (err, templates) => {
  if (err) {
    return console.error(err);
  }
  const {
    Templates: { Template },
  } = templates;
  const parsed = Template.reduce(parseTemplate, {});
  const abilityMerged = await abilityParser(locale.Cards);
  const merged = {
    ...locale,
    Cards: Object.entries(abilityMerged).reduce(mergeTemplate(parsed), {}),
  };
  fs.writeFileSync('./GwentDefinitions.json', JSON.stringify(merged, null, 2));
});
