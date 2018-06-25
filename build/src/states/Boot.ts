/*
* -= Boot.ts: =-
* - Initialises all Sideplay core files with information on the environment the code is loaded into (device type etc), before the game properly starts.
* - Sideplay core framework file.

* - Changelog:
* - 14/04/18 - Changelog added. [Snowy]
* - 14/04/18 - Listeners.ts now initialised in bootGame function. [Snowy]
* - 14/04/18 - Fixed typing issue where ( != ) read as (! =), causing the logic to fail and some parameters not being set correctly.. [Snowy]
* - 11/06/18 - Updated Boot to use core.boot so that replacing this file won't change any core engine stuff.
* -=-
*/

namespace com.sideplay.state {
    export class Boot extends core.core_boot {
        /**
         * @name initGenericSettings
         * @description The game will set any non device-specific settings.
         * @memberof Boot
         */
        public initGenericSettings(): void {
            // Edit config.settings here to change params across all platforms.
        }

        /**
         * @name initDesktopOnlySettings
         * @description Only called when detected device is desktop. Sets up configs.
         * @memberof Boot
         */
        public initDesktopOnlySettings(): void {
            // Edit config.settings here to change params only when on desktop.
        }

        /**
         * @name initTabletOnlySettings
         * @description Only called when detected device is a tablet. Sets up configs.
         * @memberof Boot
         */
        public initTabletOnlySettings(): void {
            // Edit config.settings here to change params only when on tablet.

            // Overwrite Interaction values to touch-screen friendly values.
            Interaction.pointerdown = "touchstart";
            Interaction.pointerup = "touchend";
            Interaction.mouseover = "";
            Interaction.mouseout = "";
        }

        /**
         * @name initDeviceOnlySettings
         * @description Only called when detected device is a device. Sets up configs.
         * @memberof Boot
         */
        public initDeviceOnlySettings(): void {
            // Edit config.settings here to change params only when on device.

            // Overwrite Interaction values to touch-screen friendly values.
            Interaction.pointerdown = "touchstart";
            Interaction.pointerup = "touchend";
            Interaction.mouseover = "";
            Interaction.mouseout = "";
        }

        /**
         * @name bootGame
         * @description After the game has initialised, this will boot the game.
         * @memberof Boot
         */
        public boot(): void {
            // Requests games configuration.
            core.ticket.requestConfig(() => {
                // Set language of spritesheet to load.

                // Requests ticket.
                core.ticket.requestTicket(() => {
                    // Switch game to preloader.
                    core.Game.instance.switchState("preloader");
                });
            });
        }
    }
}
