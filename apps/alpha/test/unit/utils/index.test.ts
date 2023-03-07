import { EXPECTED_COMPLEX_OBJECT, INPUT_COMPLEX_OBJECT } from './complex-object';
import { mapKeys } from '@/utils';

function mockFn(s: string) {
  return s.toUpperCase();
}

describe('utility functions', () => {
  describe('mapKeys', () => {
    it('works with deeply nested objects', () => {
      const input = {
        user: {
          posts: [
            { title: 'Foo', comments: ['Good one!', 'Interesting...'] },
            { title: 'Bar', comments: ['Ok'] },
            { title: 'Baz', refs: [{ userOne: 'ref$1' }, { userTwo: 'ref$2' }] },
          ],
        },
      };

      const expected = {
        USER: {
          POSTS: [
            { TITLE: 'Foo', COMMENTS: ['Good one!', 'Interesting...'] },
            { TITLE: 'Bar', COMMENTS: ['Ok'] },
            { TITLE: 'Baz', REFS: [{ USERONE: 'ref$1' }, { USERTWO: 'ref$2' }] },
          ],
        },
      };

      const result = mapKeys(input, mockFn);
      expect(result).toEqual(expected);
    });

    it('handles array of objects', () => {
      const input = [{ name: 'Sourav' }, { name: 'Chris' }];
      const expected = [{ NAME: 'Sourav' }, { NAME: 'Chris' }];

      const result = mapKeys(input, mockFn);
      expect(result).toEqual(expected);
    });

    it('handles the complex object', () => {
      const result = mapKeys(INPUT_COMPLEX_OBJECT, mockFn);
      expect(result).toEqual(EXPECTED_COMPLEX_OBJECT);
    });
  });
});
