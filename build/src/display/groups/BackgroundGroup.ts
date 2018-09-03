namespace com.sideplay.display {
    export class BackgroundGroup extends core.Group {
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

            this.displayScaleMode = core.DisplayScaleMode.FILL;

            this.create();
        }

        /**
         * @name            create
         * @description     Creates all display objects for this group.
         */
        public create(): void {}
    }
}
