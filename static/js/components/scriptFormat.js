const html = require('choo/html');
const scriptLine = require('./scriptLine.js');

module.exports = (issue, state) => {
  const currentIndex = state.contactIndices[issue.id];
  const currentContact = issue.contacts[currentIndex];
  let script = issue.script;

  // Replacement regexes, ideally standardize copy to avoid complex regexs
  // location - [CITY, ZIP], [CITY, STATE]
  // title - [REP/SEN NAME], [SENATOR/REP NAME], [SEN/REP NAME]
  // sen - [SEN NAME], [SENATOR NAME]
  // rep - [REP NAME], [REP'S NAME]
  // attgen - [Attorney General Name]
  // bill - [Senate: S. 823; House: H.R. 1899], [House- HR 1180, Senate- S 801]
  const reg = {
    location: /\[CITY,\s?ZIP\]|\[CITY,\s?STATE\]/gi,
    title: /\[REP\/SEN NAME\]|\[SENATOR\/REP NAME\]|\[SEN\/REP NAME\]/gi,
    sen: /\[SEN NAME\]|\[SENATOR NAME\]/gi,
    rep: /\[REP NAME\]|\[REP'S NAME\]/gi,
    attgen: /\[ATTORNEY GENERAL NAME\]/gi,
  }

  const replace = {
    location: state.cachedCity,
    sen: '',
    rep: '',
    attgen: '',
  }

  for (let i = 0; i < issue.contacts.length; i++) {
    let curr = issue.contacts[i];
    if (curr.area == 'House') {
      replace.rep = 'Rep. ' + curr.name;
    } else if (curr.area == 'Senate') {
      replace.sen = 'Senator ' + curr.name;
    } else if (curr.area == 'AttorneyGeneral') {
      replace.attgen = 'Attorney General ' + curr.name;
    }
  }

  function format() {
    let script = issue.script;

    let title = '';
    if (currentContact.area == 'House') {
      title = replace.rep;
    } else if (currentContact.area == 'Senate') {
      title = replace.sen;
    }

    if (title) {
      script = script.replace(reg.title, replace.title);
      script = script.replace
    }
    if (sen) {
      script = script.replace(reg.sen, replace.sen);
    }
    if (rep) {
      script = script.replace(reg.rep, replace.rep);
    }
    if (attgen) {
      script = script.replace(reg.attgen, replace.attgen);
    }
    if (location) {
      script = script.replace(reg.location, replace.location);
    }

    return script.split('\n').map((line) => scriptLine(line));
  }

  return html`
    <div class="call__script__body">
      ${format()}
    </div>
  `;
};