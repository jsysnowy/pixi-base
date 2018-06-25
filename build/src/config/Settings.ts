/*
* -= Settings.ts: =-
* - Stores all configuration settings for the game. Changes how framework handles the game.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Changelog added. [Snowy]
* - 14/4/18 - Added correctOrientation, changed pauseOnPortrait to pauseOnIncorrectOrientation. [Snowy]
* -=-
*/

namespace com.sideplay.config {
    /**
     * Settings object with all needed game params to make the game run/display properly
     * */
    export var settings = {
        // Game settings =
        // - Stores the native width  (Size assets are created for).
        nativeWidth: 1334,
        // - Stores the native height (Size assets are created for).
        nativeHeight: 750,
        // Stores what the correct orientation for the game is supposed to be ("landscape" | "portrait")
        correctOrientation: "landscape",
        // - ID on the parent div the game canvas will be added to.
        gameParentDivID: "gameArea",
        // - ID on the gameCanvas object itself.
        gameCanvasID: "gameCanvas",
        // - Stores how the game receives its availableHeight param.
        availHeight: window.innerHeight,
        // - Stores how the game receives its availableWidth param.
        availWidth: window.innerWidth,
        // - If the game will constantly resize to fill space.
        adaptiveScaling: true,
        // - Not currently implemented.
        alignVertically: true,
        // - Not currently implemented.
        alignHorizontally: true,

        // Client specific settings (Global) =
        // - If the game is in an iFrame, it will apply various fixes to make game still work.
        iframeSwipeFix: false,

        // Sound specific settings =
        // - If the game is using an audioSprite for audio.
        useAudioSprite: true,
        // - The defined key of the audioSprites you are using! Use an array for multiple. (pls just use one...)
        audioSpriteKey: "output",
        // - If the game should disable audio on Internet Explorer.
        noAudioOnIE: false,

        // Loader settings =
        // - Determines which type of loader is used. Normally this is pixi. Switches to phoenix (automatically) for CamUK build.
        loaderType: "pixi",

        // Developer settings =
        // - Stores if the game is in developerMode - this value is set using localStorage,
        developerMode: false,
        // - Whether or not the core logs are shown in developerMode.
        coreLogs: true,
        // - Whether or not console.log events are captured.
        captureConsoleLogs: false,
        // - Whether or not the errorOverlay displays upon game error.
        errorOverlay: true,

        // Fullscreen settings =
        // - Whether or not the game supports the frameworks fullscreen implementation.
        fullscreen: false,
        // - Whether or not the game will try to use the fullscreen API if it's available.
        useFSAPI: false,
        // - Whether or not the game will display a div when NOT in fullscreen.
        showFullscreenDiv: true,

        // Orientation Settings =
        // - Whether or not the game supports the frameworks orientation implementation.
        orientation: false,
        // Whether or not the game will display a div when NOT in correct orientation.
        showOrientationDiv: true,
        // The class name applied to the orientation div when displayed.
        orientationClass: "fr",
        // Adds a listener to innerHeight and innerWidth which will trigger orientation checks whenever these values change
        gameSizeChangeListeners: true,

        // OnUpdateChecks
        // - If the game will check when window.innerHeight or window.innerWidth change to call a resize event.
        addSizeUpdateFunction: false,
        // - If the game will check when document.hasFocus change to call a focusChanged event.
        addFocusUpdateFunction: true,

        // Pause Settings
        // - If the game will pause on incorrect orientation.
        pauseOnIncorrectOrientation: false,
        // - If the game will pause if the window is blurred.
        pauseOnBlur: false,
        // - If the game will pause if the window loses visibility.
        pauseOnVisLoss: false,
        // = Whether the user needs to click on the screen to unpause. (Else; automatic).
        unpauseOnClick: false,
        // - Which method of pause screen the game will show ("canvas"|"css"|"none")
        pauseOverlayType: "canvas",
        // - The sprite used as the pause symbol in the center of the pause screen. Only used when overlay type is "canvas".
        pauseSprite: "pause",
        // = The class name applied to the pause div when shown. Only used when overlay type is "css".
        pauseClass: null
    };
}
