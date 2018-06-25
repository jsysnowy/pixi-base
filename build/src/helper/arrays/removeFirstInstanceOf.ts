namespace com.sideplay.helper.arrays {
	/**
	 * @name removeFirstOInstanceOf
	 * @description Takes a thing to remove and an array, removes the first instance of the thing in the array then returns the array.
	 * @export
	 * @template T
	 * @param {T} thingToRemove
	 * @param {T[]} arrayOfThings
	 * @returns {T[]}
	 */
	export function removeFirstInstanceOf<T>(thingToRemove: T, arrayOfThings: T[]): T[] {
		// Remove all instances of thing.
		for (let i = 0; i < arrayOfThings.length; i++) {
			if (arrayOfThings[i] === thingToRemove) {
				arrayOfThings.splice(i, 1);
				return arrayOfThings;
			}
		}

		// Return the edited array
		return arrayOfThings;
	}
}
