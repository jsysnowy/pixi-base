var fs = require("fs");
var mkdirp = require("mkdirp");
var pathRead = "./BUILD/SRC/Loader/LoadedAssets.ts";
var pathWrite = "./CAMELOT/IWG/src/";
var fileName = "IwgIncludes.js";
var fileOut = "";
var curType = "";

fs.readFile(pathRead, "utf8", function (error, data) {
    if (error) {
        console.error("read error:  " + error.message);
    } else {
        generateData(data);
    }

    mkdirp(pathWrite, function (err) {
        fs.writeFile(pathWrite + fileName, fileOut, function (err, data) {
        });
    });
});

function generateData(dataIn) {
    // Add initial lines for file..
    fileOut += "/* global createjs */\n/*global miwgdefine */\n/*jslint nomen: true, browser: true, plusplus: true, devel: true, vars:true, eqeq: true*/\n";
    fileOut += "var _manifest = [\n";
    // Remove all spaces
    dataIn = dataIn.replace(/ /g, '');
    // Split the data array into new lines
    var dataArr = dataIn.split("\n");

    //Loop over all lines
    for (let i = 0; i < dataArr.length; i++) {
        // Parse data...
        if  (dataArr[i].indexOf("AUDIO=") != -1) {
            fileOut += "    // Audio:\n";
            curType = "audio";
        } else if  (dataArr[i].indexOf("AUDIOSPRITE=") != -1) {
            fileOut += "    // Audiosprites:\n";
            curType = "audiosprite";
        } else if  (dataArr[i].indexOf("BITMAP_FONTS=") != -1) {
            fileOut += "    // Bitmap Fonts:\n";
            curType = "bitmapfont";
        } else if  (dataArr[i].indexOf("IMAGES=") != -1) {
            fileOut += "    // Images:\n";
            curType = "image";
        } else if  (dataArr[i].indexOf("JSON=") != -1) {
            fileOut += "    // Json:\n";
            curType = "json";
        } else if  (dataArr[i].indexOf("SPINE=") != -1) {
            fileOut += "    // Spine:\n";
            curType = "spine";
        } else if  (dataArr[i].indexOf("SPRITESHEETS=") != -1) {
            fileOut += "    // Spritesheets:\n";
            curType = "spritesheet";
        } else if  (dataArr[i].indexOf("WEBFONTS=") != -1) {
            fileOut += "    // Webfonts:\n";
            curType = "webfont";
        }
        if (dataArr[i] != '\n' && dataArr[i][0] != "/" && dataArr[i].indexOf(":") != -1) {
            fileOut += generateIWGString(dataArr[i]);
        }
    }
    // Apend game loading
    fileOut += "    // Game:\n";
    fileOut += '    {"src": "src/game.js", "id": "Game"}\n';

     //Append needed IwgInclude text.
     fileOut += '];\nmiwgdefine(function () {\n'+
                '    "use strict";\n'+
                "    if (/firefox/.test(com.camelot.core.IWG.ame('get', 'UA_deviceDescription').toLowerCase())) {\n"+
                "        com.camelot.core.iwgLoadQ.preferXHR = false;\n"+
                "    }\n"+
                '    return _manifest;\n}\n);';
}

function generateIWGString( stringIn ) {
    // Splits the stringIn into [0] - ID | [1] - FilePath.
    var splitter = stringIn.split(":");
    var id = splitter[0];
    var filepath = '"src/imports/' + splitter[1].replace(/\r?\n|\r/, '').replace('"', '').replace(',', '');

    // Generate and return the Audio object as string..
    if ( curType == "audio" ) {
        return '    { "src": ' + filepath + ', "id": "' + id +'"},\n';
    } else if (curType == "audiosprite") {
        let dataPath = filepath.replace(".mp3", '.json');
        return '    { "src": ' + filepath + ', "id": "' + id +'"},\n' + '    { "src": ' + filepath.replace(".mp3", ".json") + ', "id": "' + id+"AudioData" +'"},\n';
    } else if ( curType == "bitmapfont") {
        var replacedXMLwithPNG = filepath.replace("xml", "png");
        return '    { "src": ' + filepath + ', "id": "' + id+"-data" +'"},\n    { "src": ' + replacedXMLwithPNG + ', "id": "' + id +'"},\n';
    } else if (curType == "image") {
        return '    { "src": ' + filepath + ', "id": "' + id +'"},\n';
    } else if (curType == "json") {
        return '    { "src": ' + filepath + ', "id": "' + id +'", type: createjs.LoadQueue.JSON },\n';
    } else if (curType == "spritesheet") {
        var replacedJSONwithPNG = filepath.replace("json", "png");
        return '    { "src": ' + replacedJSONwithPNG + ', "id": "' + id +'"},\n    { "src": ' + filepath + ', "id": "' + id+"-data" +'", type: createjs.LoadQueue.JSON },\n';
    } else if (curType == "webfont" ) {
        return "";
    } else if ( curType == "spine" ) {
        return '    { "src": ' + filepath + ', "id": "' + id +'"},\n' + '    { "src": ' + filepath.replace(".spine", ".atlas") + ', "id": "' + id+"Atlas" +'"},\n';
        return ret;
    }
}