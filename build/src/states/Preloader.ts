/// <reference path="../../../typings/tsd.d.ts" />

namespace com.sideplay.state {
    export class Preloader extends core.State {
        /**
         * @name            create
         * @description     Called when BOOT is creates - should initialise anything pre-preload..
         */
        public create(): void {
            // Store loader..
            let gameLoader: loader.PIXILoader | loader.PhoenixLoader;

            // Set loader type..
            if (config.settings.loaderType == "pixi") {
                gameLoader = new loader.PIXILoader();
            } else if (config.settings.loaderType == "phoenix") {
                gameLoader = new loader.PhoenixLoader();
            }

            // Load!
            gameLoader.load(
                progress => {
                    // == On update ==
                },
                () => {
                    // == On Complete ==
                    window.focus();
                    core.listeners.manuallyFireListener(core.Listeners.orientationChange);
                    core.game.switchState("maingame");
                },
                () => {
                    // == On Error ==
                }
            );
        }
    }
}
