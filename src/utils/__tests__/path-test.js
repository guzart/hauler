jest.unmock('../path');

const utils = require('../path');

describe('pathJoin', () => {
  it('leaves the leading slash on the first piece', () => {
    expect(utils.pathJoin('/hello', 'world')).toBe('/hello/world');
    expect(utils.pathJoin('hello', 'world')).toBe('hello/world');
  });

  it('cleans any lagging slash', () => {
    expect(utils.pathJoin('hello', 'world/')).toBe('hello/world');
  });

  it('removes any leading or lagging spaces', () => {
    expect(utils.pathJoin('   hello  ', '   world  ')).toBe('hello/world');
  });

  it('removes duplicate slashes', () => {
    expect(utils.pathJoin('hello///', '///world///')).toBe('hello/world');
  });

  it('ignores null pieces', () => {
    expect(utils.pathJoin(null, 'hello', null, 'world', null)).toBe('hello/world');
  });
});
