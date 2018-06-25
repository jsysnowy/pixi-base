namespace com.sideplay.helper.arrays {
	/**
	 * @name removeAllInstanceOf
	 * @description Takes a thing to remove, and array.  Returns an array without and things to remove inside it.
	 * @export
	 * @template T
	 * @param {T} thingToRemove
	 * @param {T[]} arrayOfThings
	 * @returns {T[]}
	 */
	export function removeAllInstanceOf<T>(thingToRemove: T, arrayOfThings: T[]): T[] {
		// Remove all instances of thing.
		for (let i = 0; i < arrayOfThings.length; i++) {
			if (arrayOfThings[i] === thingToRemove) {
				arrayOfThings.splice(i, 1);
				i--;
			}
		}

		// Return the edited array
		return arrayOfThings;
	}
}
