namespace com.sideplay.helper.maths {
	/**
	 * @name degToRad
	 * @description Takes a number in degrees and returns the same number in radians.
	 * @export
	 * @param {number} deg
	 * @returns {number}
	 */
	export function degToRad(deg: number): number {
		return deg * (Math.PI / 180);
	}
}
