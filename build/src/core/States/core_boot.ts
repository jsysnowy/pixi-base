/*
* -= core_boot.ts: =-
* - Landing code which initialises all settings for the game prior to preloading.

* - Changelog:
* - 11/06/18 - Created. [Snowy] -=-
*/

namespace com.sideplay.core {
    export class core_boot extends State {
        /**
         * Called after everything has been preloaded:
         * @memberof core_boot
         */
        public create(): void {
            // Generic settings initialises:
            this.initGenericSettings();

            // Specific settings initialises:
            if (bowser.mobile) {
                // Setup settings specific for mobile.
                this.initDeviceOnlySettings();
            } else if (bowser.tablet) {
                // Setup settings specific for tablet.
                this.initTabletOnlySettings();
            } else {
                // Setup settings specific for desktop.
                this.initDesktopOnlySettings();
            }

            // Core settings initialise:
            this._initCoreSettings();
        }

        /**
         * Initialises any game/client specific settings.
         * @memberof core_boot
         */
        public initGenericSettings(): void {}

        /**
         * Initialises settings for a game being loaded on a desktop
         * @memberof core_boot
         */
        public initDesktopOnlySettings(): void {}

        /**
         * Initialises settings for a game being loaded on a tablet.
         * @memberof core_boot
         */
        public initTabletOnlySettings(): void {}

        /**
         * Initialises settings for a game being loaded on a device.
         * @memberof core_boot
         */
        public initDeviceOnlySettings(): void {}

        /**
         * Called after the settings are all initialised, this will kick the game off into actually loading:
         * @memberof core_boot
         */
        public boot(): void {}

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * These core settings are required to be initialised on all games, and should not be tampered with.
         * @private
         * @memberof core_boot
         */
        private _initCoreSettings(): void {
            // Setup scaling stuff
            core.scale.setNativeDimentions(config.settings.nativeWidth, config.settings.nativeHeight);
            core.scale.setCanvasByID(config.settings.gameCanvasID);
            core.scale.setDivByID(config.settings.gameParentDivID);
            core.scale.verticallyAlignOnPage(config.settings.alignVertically);
            core.scale.horizontallyAlignOnPage(config.settings.alignHorizontally);

            // Setup settings:
            core.device.orientation = config.settings.orientation;
            core.device.fullscreen = config.settings.fullscreen;
            core.device.useProperFullscreen = config.settings.useFSAPI;
            core.pause.pauseOnIncorrectOrientation = config.settings.pauseOnIncorrectOrientation;
            core.pause.pauseOnBlur = config.settings.pauseOnBlur;
            core.pause.pauseOnVisibilityLoss = config.settings.pauseOnVisLoss;

            // Initialise SCALE and PAUSE with set configs..
            core.listeners.init();
            core.scale.init();
            core.device.init();
            core.device.update();

            // FSM Generated:
            new debug.GameStates();

            // Check if config says we should apply swipe up fixes.
            if (config.settings.iframeSwipeFix) {
                // Apply fixes!
                core.game.renderer.plugins.interaction.autoPreventDefault = false;
                core.game.renderer.view.style["touch-action"] = "pan-y";
            }

            // If showLogs is false...
            if (config.settings.captureConsoleLogs) {
                // ... overwrite console functions with empty lambdas.
                console.log = () => {};
                console.warn = () => {};
                console.info = () => {};
                console.assert = () => {};
                console.trace = () => {};
            }

            // Loads webfonts..
            var webFontsToLoad = [];
            for (var key in loader.WEBFONTS) {
                if (loader.WEBFONTS.hasOwnProperty(key)) {
                    webFontsToLoad.push(key);
                    loader.WEBFONTS[key] = key;
                }
            }
            var font: WebFont.Config = {
                custom: {
                    families: webFontsToLoad
                },
                active: () => {
                    this.boot();
                },
                timeout: 2000,
                inactive: () => {
                    this.boot();
                }
            };

            if (webFontsToLoad.length != 0) {
                WebFont.load(font);
            } else {
                this.boot();
            }
        }
    }
}
