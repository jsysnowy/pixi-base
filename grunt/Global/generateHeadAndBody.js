var fs = require("fs");
var mkdirp = require("mkdirp");
var pathRead = "./BUILD/index.html";
var pathWrite = "./GLOBAL/";
var headName = "head.html";
var headOut = "";
var bodyName = "body.html";
var bodyOut = "";
var fullIndexName = "index.html";
var fullIndexOut = "";

fs.readFile(pathRead, "utf8", function (error, data) {
    if (error) {
        console.error("read error:  " + error.message);
    } else {
        generateData(data);
    }

    mkdirp(pathWrite, function (err) {
        fs.writeFile(pathWrite + headName, headOut, function (err, data) {
        });
    });

    mkdirp(pathWrite, function (err) {
        fs.writeFile(pathWrite + bodyName, bodyOut, function (err, data) {
        });
    });

    mkdirp(pathWrite, function (err) {
        fs.writeFile(pathWrite + fullIndexName, fullIndexOut, function (err, data) {
        });
    });
});

function generateData(dataIn) {
    // Add initial lines for header file..

    // Split the data array into new lines
    var dataArr = dataIn.split("\n");

    // Stores if reading inside head section..
    var inHead = false;
    var inBody = false;

    //Loop over all lines
    for (var i = 0; i < dataArr.length; i++) {
        // Check if the line contains anything useful
        if (dataArr[i].indexOf("<") != -1) {
            if ( dataArr[i].indexOf("</head>") != -1) {         //<- No longer reading inside head element
                inHead = false;
            } else if ( inHead ) {                  // <- Output line to head file
                // Dont include any title or script tags!
                if ( dataArr[i].indexOf("<title>") == -1 && dataArr[i].indexOf('<script src=') == -1) {
                    headOut += dataArr[i] + "\n";
                }
            } else if ( dataArr[i].indexOf("<head>") != -1) {   // <- Now reading inside head element
                inHead = true;
            }

            if ( dataArr[i].indexOf("</body>") != -1) {         //<- No longer reading inside body element
                inBody = false;
            } else if ( inBody ) {                  // <- Output line to body file
                // Dont include any script tags!
                if ( dataArr[i].indexOf('<script src=') == -1) {
                    bodyOut += dataArr[i] + "\n";
                }
            } else if ( dataArr[i].indexOf("<body>") != -1) {   // <- Now reading inside body element
                inBody = true;
            }
        }
    }

    // Append Global specific lines to end of body.
    bodyOut += '<script src="sideplayGame-concat.min.js"></script>' +"\n";
    bodyOut += '<script src="initGame.js" defer></script>';

    // Generate full index page!
    fullIndexOut += "<!DOCTYPE html>\n<html>\n    <head>\n" + headOut + "\n</head>\n<body>\n" + bodyOut + '<script type="application/json" id="game-configuration">{"winningPrizeIndex":0,"selection":"{\\"playerSelection\\":3}","playMode":"NORMAL","customerId":"pli_uat2","gameVersion":"0-1-829","gameId":"mmultiplierx20equal","seed":173184338}</script>\n' + "</body>\n</html>"
}