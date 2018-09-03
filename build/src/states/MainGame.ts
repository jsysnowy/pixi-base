/// <reference path="../../../typings/tsd.d.ts" />

namespace com.sideplay.state {
    export class MainGame extends core.State {
        private _gameBG: PIXI.Sprite = null;
        private _mg: display.MasterGroup = null;
        private _bgg: display.BackgroundGroup = null;

        /**
         * @name            create
         * @description     Called when BOOT is creates - should initialise anything pre-preload..
         */
        public create(): void {
            // Create the Controller for the game
            new controller.GameController();

            debug.fsm.setState(debug.States.gameLoaded);

            this._bgg = new display.BackgroundGroup();
            this.addChild(this._bgg);

            this._mg = new display.MasterGroup();
            this.addChild(this._mg);

            core.pause.init();
            this.addChild(core.pause.group);
        }
    }
}
