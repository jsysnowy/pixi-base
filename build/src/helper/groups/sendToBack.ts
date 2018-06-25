namespace com.sideplay.helper.groups {
	/**
	 * @name sendToBack
	 * @description Sends an objects passed in as param to the back of its parent group.
	 * @export
	 * @param {PIXI.Container} object
	 */
	export function sendToBack(object: PIXI.Container): void {
		var parent = object.parent;
		var objectsInOrder = [];
		parent.removeChild(object);
		parent.children.forEach(c => {
			objectsInOrder.push(c);
		});
		parent.removeChildren();
		parent.addChild(object);
		objectsInOrder.forEach(obj => {
			parent.addChild(obj);
		});
	}
}
