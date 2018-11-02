const path = require('path');
const fs = require('fs');
const { parseString } = require('xml2js');

const abilities = fs.readFileSync(
  path.join('data_definitions', 'Abilities.xml'),
  'utf-8',
);

const VAR_REG = /\{(.*?)\}/g;

const mergeAbility = temp => ability => {
  const id = ability.$.Template;
  if (!id || !temp[id]) {
    return;
  }
  const { tooltip } = temp[id];
  if (!tooltip) {
    return;
  }
  // tooltip 안에 {}
  const variables = tooltip.match(VAR_REG);
  if (!variables || variables.length <= 0) {
    return;
  }
  const tempVal = ability.TemporaryVariables[0];
  // abilities 안에 e0,e1 ... 값들
  const matches = Object.keys(tempVal).reduce((acc, curr) => {
    if (curr === '$') return acc;
    const val = tempVal[curr][0].$.V;
    if (!val) return acc;
    return [...acc, val];
  }, []);
  // 순서대로 replace
  let result = tooltip;
  variables.map(
    (variable, i) => (result = result.replace(variable, matches[i])),
  );
  temp[id].tooltip = result;
};

const abilityParser = async data => {
  try {
    const parsed = await new Promise(res => {
      parseString(abilities, (err, ability) => {
        if (err) {
          return console.error(err);
        }
        const {
          Abilities: { Ability },
        } = ability;
        const temp = { ...data };
        Ability.map(mergeAbility(temp));
        res(temp);
      });
    });
    return parsed;
  } catch (err) {
    console.error(err);
  }
};

module.exports = abilityParser;
