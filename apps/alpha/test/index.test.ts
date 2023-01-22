import { foo } from '../src/index';

describe('tests foo', () => {
  it('returns 2 for 1 + 1', () => {
    expect(foo(1, 1)).toEqual(2);
  });
});
