namespace com.sideplay.helper.maths {
	/**
	 * @name radToDeg
	 * @description Takes number in radians, and returns the same number in degrees.
	 * @export
	 * @param {number} rad
	 * @returns {number}
	 */
	export function radToDeg(rad: number): number {
		return rad * (180 / Math.PI);
	}
}
