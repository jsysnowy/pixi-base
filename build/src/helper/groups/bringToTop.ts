namespace com.sideplay.helper.groups {
	/**
	 * @name bringToTop
	 * @description Brings an object passed in as param to the top of it parent group.
	 * @export
	 * @param {PIXI.Container} object
	 */
	export function bringToTop(object: PIXI.Container): void {
		var parent = object.parent;
		parent.removeChild(object);
		parent.addChild(object);
	}
}
