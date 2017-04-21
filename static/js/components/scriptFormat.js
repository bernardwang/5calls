const html = require('choo/html');
const scriptLine = require('./scriptLine.js');

module.exports = (issue, state) => {
  const currentIndex = state.contactIndices[issue.id];
  const currentContact = issue.contacts[currentIndex];

  // Replacement regexes, ideally standardize copy to avoid complex regexs
  const titleReg = /\[REP\/SEN NAME\]|\[SENATOR\/REP NAME\]/gi;

  function format() {
    let script = issue.script;

    let title = '';
    if (currentContact.area == 'House') {
      title = 'Rep. ' + currentContact.name.split(' ').pop();
    } else if (currentContact.area == 'Senate') {
      title = 'Senator ' + currentContact.name.split(' ').pop();
    }

    if (title.length > 0) {
      script = script.replace(titleReg, title);
    }

    return script.split('\n').map((line) => scriptLine(line));
  }

  return html`
    <div class="call__script__body">
      ${format()}
    </div>
  `;
}