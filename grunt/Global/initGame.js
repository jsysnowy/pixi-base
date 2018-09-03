(function () {
    var gameConfig = document.getElementById("game-configuration").innerText;
    var seedPacket = JSON.parse(gameConfig);
    seedPacket.currency = "CHF";
    seedPacket.languageCode = "FR";
    new com.sideplay.core.Game(seedPacket);
    // focus iframe
    window.focus();    
})();