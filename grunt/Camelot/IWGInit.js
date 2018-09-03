//loader need to find a function at com.camelot.core.IWGInit(); so be able to start game.
//all game files should be in the namespace com.camelot.iwg

com.camelot.core.IWGInit = function IWGInit() {
    com.camelot.core.iwgLoadQ.installPlugin(createjs.Sound);
    createjs.Sound.alternateExtensions = ["ogg"];

    // Initialise settings for CAMELOT
    com.sideplay.config.settings.gameParentDivID = "IWGholder";
    com.sideplay.config.settings.gameCanvasID = "gameCanvas";
    com.sideplay.config.settings.loaderType = "phoenix";
    com.sideplay.config.settings.adaptiveScaling = true;
    com.sideplay.config.settings.availWidth = com.camelot.core.IWG.ame('get', 'availableWidth');
    com.sideplay.config.settings.availHeight = com.camelot.core.IWG.ame('get', 'availableHeight');
    com.sideplay.config.settings.showOrientationDiv = false;
    document.getElementById("IWGholder").removeChild(document.getElementById("IWGcanvas"));

    console.log("im here");

    // Remove IWGCanvas
    window.setTimeout(function() {
        new com.sideplay.core.Game("phoenix");
        // Stop game from pausing at the start.
        window.focus();
    }, 1000);
}
