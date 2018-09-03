(function () {
    var gameConfig = document.getElementById("game-configuration").innerText;
    var seedPacket = JSON.parse(gameConfig);
    seedPacket.currency = "CHF";
    seedPacket.languageCode = "fr_FR";
    new BOOM.GameManager(seedPacket); 
})();