/// <reference path="../../../../typings/tsd.d.ts" />

namespace com.sideplay.display {
    export class MasterGroup extends core.Group {
        // Class Field

        // Class Groups

        // Class Sprites

        /**
         * @name subscribeEvents
         * @description The group subscribes to events which are dispatched from controller.
         * @memberof PickTokenGroup
         */
        public subscribeEvents(): void {}

        /**
         * @name            constructor
         * @description     Creates a new Group.
         */
        public constructor() {
            super();

            this.subscribeEvents();

            core.game.add(this);
            this.displayScaleMode = core.DisplayScaleMode.FIT;

            console.log("finished!");

            this.create();
        }

        /**
         * @name            create
         * @description     Creates all display objects for this group.
         */
        public create(): void {
            let bg = new PIXI.Graphics();
            bg.beginFill(0xff0022, 0.5);
            bg.drawRect(0, 0, core.Game.NATIVE_WIDTH, core.Game.NATIVE_HEIGHT);
            this.addChild(bg);
        }
    }
}
