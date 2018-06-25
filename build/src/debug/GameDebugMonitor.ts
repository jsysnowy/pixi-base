/// <reference path="../../../typings/tsd.d.ts" />

namespace com.sideplay.debug {
	export class DebugMonitor extends PIXI.Container {
		// Class Field
		private _enabled: boolean = false;

		// Internal features
		private _bottomBar: PIXI.Graphics = null;
		private _updateUI: number = 0;

		// FPS Monitor
		private _storedDate: Date = null;
		private _fps: number = -1;
		private _avgFPS: number[] = [];
		private _fpsText: PIXI.Text = null;
		private _fpsGraph: PIXI.Graphics = null;

		public constructor() {
			super();
		}

		/**
		 * @name            enable
		 * @description     Turns on the Debug Monitor
		 */
		public enable(): void {
			core.Game.instance.add(this);

			this._bottomBar = new PIXI.Graphics();
			this._bottomBar.beginFill(0x333333, 0.6);
			this._bottomBar.drawRect(0, core.Game.NATIVE_HEIGHT - 50, core.Game.NATIVE_WIDTH, 50);
			this.addChild(this._bottomBar);

			this._fpsText = new PIXI.Text('FPS: ', {fill: 0xffffff});
			this._fpsText.position.set(40, core.Game.NATIVE_HEIGHT - 40);
			this.addChild(this._fpsText);

			TweenMax.ticker.addEventListener('tick', () => {
				this.onRaf();
			});
		}

		/**
		 * @name            onRaf
		 * @description     Called every raf frame.
		 */
		public onRaf(): void {
			if (this._storedDate != null) {
				var curDate = new Date().getMilliseconds();
				var elapsed = curDate - this._storedDate.getMilliseconds();
				this._avgFPS.push(+(1 / elapsed * 1000).toFixed(2));
				if (this._avgFPS.length == 150) {
					this._avgFPS.shift();
				}

				this._updateUI++;
				if (this._updateUI == 5) {
					this._updateUI = 0;
					var avg = 0;
					this._avgFPS.forEach(val => {
						avg += val;
					});
					avg /= this._avgFPS.length;

					this._fpsText.text = 'FPS: ' + (1 / elapsed * 1000).toFixed(2) + '.  Average: ' + avg.toFixed(2);

					if (this._fpsGraph != null) {
						this._fpsGraph.destroy();
					}

					this._fpsGraph = new PIXI.Graphics();
					this._fpsGraph.beginFill(0xffffff, 0.7);
					this._fpsGraph.drawRect(5, core.Game.NATIVE_HEIGHT - 155, 150, 100);
					this.addChild(this._fpsGraph);

					for (var i = 0; i < this._avgFPS.length; i++) {
						this._fpsGraph.beginFill(0xff0000);
						var h = -(100 / 60) * this._avgFPS[i];
						if (h < -100) {
							h = -100;
						}
						this._fpsGraph.drawRect(5 + i, core.Game.NATIVE_HEIGHT - 55, 1, h);
					}
				}
			}

			this._storedDate = new Date();
		}
	}
}
