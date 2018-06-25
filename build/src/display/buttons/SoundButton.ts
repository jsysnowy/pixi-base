/// <reference path="../../../../typings/tsd.d.ts" />

namespace com.sideplay.display {
	export class SoundButton extends PIXI.Container {
		// Class Field
		private _isMuted: boolean = false;

		// Class Groups

		// Class Sprites
		private _soundButton: PIXI.Graphics = null;

		/**
		 * Creates an instance of SoundButton.
		 * @memberof SoundButton
		 */
		public constructor() {
			super();

			this._soundButton = new PIXI.Graphics();
			this._soundButton.beginFill(0xffffff, 1);
			this._soundButton.drawCircle(0, 0, 25);
			this.addChild(this._soundButton);
		}

		/**
		 * @name addMouseListeners
		 * @description Attatches mouse listeners onto the sound button.
		 * @memberof SoundButton
		 */
		public addMouseListeners(): void {
			this._soundButton.interactive = true;
			this._soundButton.on('pointerdown', () => {
				this.click();
			});
		}

		/**
		 * @name click
		 * @description Called when you click the button.
		 * @memberof SoundButton
		 */
		public click(): void {
			if (this._isMuted) {
				this._isMuted = false;
				this._soundButton.tint = 0xffffff;
				core.sound.unmute();
			} else {
				this._isMuted = true;
				this._soundButton.tint = 0xff3f3f;
				core.sound.mute();
			}
		}
	}
}
