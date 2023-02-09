import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';

/**
 * Maps over the keys of an object or an array and returns a new or modified object/array
 * baseed upon the passed arguments.
 *
 * Time Complexity: O(n)
 *
 * @param [o] - object to be mapped and modified
 * @param [fn] - transformer to be applied on the keys
 * @param [mutateOriginal] - should the function modify the original object
 * @returns argument passed mutated or created new with transformation function applied on keys
 */
export function mapKeys<T extends object>(
  o: T,
  fn: (arg: string) => string,
  mutateOriginal?: boolean,
): T {
  o = mutateOriginal ? o : cloneDeep(o);

  // Loop over and call recursively on each object inside
  if (Array.isArray(o)) {
    for (const _o of o) {
      mapKeys(_o, fn);
    }
  } else if (isObject(o)) {
    const keys = Object.keys(o);

    for (const key of keys) {
      /**
       * We need to explicitly reassign the type of `o` here, what we expect here is
       * ```
       * { key_0: 'primitive', key_1: { key_1_0: 'primitive' } }
       * ```
       * That's why we have an explicit `unknown` since the value at the key could
       * be anything.
       */
      if (isObject((o as Record<string, unknown>)[key])) {
        // Here we are sure that `o[key]` is an `object`
        mapKeys((o as Record<string, object>)[key], fn);
      } else if (Array.isArray((o as Record<string, unknown>)[key])) {
        // In case the value is an array we wanna map that too
        for (const _o of (o as Record<string, T[]>)[key]) {
          mapKeys(_o, fn);
        }
      } else {
        // Attach the same value with the transformed key and delete the key
        const transformedKey = fn(key);
        const valueAtKey = (o as Record<string, unknown>)[key];
        (o as Record<string, unknown>)[transformedKey] = valueAtKey;

        delete (o as Record<string, unknown>)[key];
      }
    }
  }

  return o;
}
