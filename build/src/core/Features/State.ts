namespace com.sideplay.core {
    export class State extends PIXI.Container {
        // Class Field
        public stateName: string = null;
        public onLoad: () => any;

        /**
         * @name            constructor
         * @description     Creates a new instance of State - this holds the various states the game can be in.
         *                  This usually consists of Boot, Preloader and MainGame.
         */
        public constructor(name: string) {
            super();
            this.stateName = name;
            core.Game.instance.states[name] = this;
            this.onLoad = () => {
                this.create();
            };
        }

        /**
         * @name            preload
         * @description     Preload is called before the state gets loaded and active.
         */
        public preload(): void {
            // By default, it just autoloads.
            this.onLoad();
        }

        /**
         * @name            create
         * @description     Create is called as soon as this state becomes active.
         */
        public create(): void {}

        /**
         * @name            update
         * @description     Update is called every frame of the game loop.
         */
        public update(): void {}
    }
}
