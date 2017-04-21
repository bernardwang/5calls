const scriptFormat = require('./scriptFormat.js');
const chai = require('chai');
const expect = chai.expect;

describe('scriptFormatter', () => {
  let id = 1;
  let location = {params: {issueid: 1}};
  let contactIndices = {};
  contactIndices[id] = 0;
  let stateDefault = {
    location,
    contactIndices
  };
  let issueDefault = {
    id: id,
    name: 'Call Bozo Blowhart',
    reason: 'Bozo is bad',
  };

  describe('title replacement', () => {
    it('should replace with senator title', () => {
      let contact = {
        name: 'Bozo B. Blowhart',
        area: 'Senate',
        party: 'Dem'
      };
      let script = 'Please vote against [REP/SEN NAME]. It will be bad if you dont vote against [Senator/Rep Name].';
      let issue = issueDefault;
      let state = stateDefault;
      issue['contacts'] = [contact];
      issue['script'] = script;
      state['issues'] = issue;
      let result = scriptFormat(issue, state);
      expect(result.textContent).to.contain('Please vote against Senator Blowhart. It will be bad if you dont vote against Senator Blowhart.');
    });
    it('should replace with rep title', () => {
      let contact = {
        name: 'Bozo B. Blowhart',
        area: 'House',
        party: 'Dem'
      };
      let script = 'Please vote against [REP/SEN NAME]. It will be bad if you dont vote against [Senator/Rep Name].';
      let issue = issueDefault;
      let state = stateDefault;
      issue['contacts'] = [contact];
      issue['script'] = script;
      state['issues'] = issue;
      let result = scriptFormat(issue, state);
      expect(result.textContent).to.contain('Please vote against Rep. Blowhart. It will be bad if you dont vote against Rep. Blowhart.');
    });
    it('should not replace title when not house or senate', () => {
      let contact = {
        name: 'Bozo B. Blowhart',
        area: '',
        party: 'Dem'
      };
      let script = 'Please vote against REP/SEN NAME. It will be bad if you dont vote against [Senator Name].';
      let issue = issueDefault;
      let state = stateDefault;
      issue['contacts'] = [contact];
      issue['script'] = script;
      state['issues'] = issue;
      let result = scriptFormat(issue, state);
      expect(result.textContent).to.contain(script);
    }); 
    it('should not replace when no valid replacement string', () => {
      let contact = {
        name: 'Bozo B. Blowhart',
        area: 'Senates',
        party: 'Dem'
      };
      let script = 'Please vote against [REP/SEN NAME]. It will be bad if you dont vote against [Senator/Rep Name].';
      let issue = issueDefault;
      let state = stateDefault;
      issue['contacts'] = [contact];
      issue['script'] = script;
      state['issues'] = issue;
      let result = scriptFormat(issue, state);
      expect(result.textContent).to.contain(script);
    }); 
  });
});