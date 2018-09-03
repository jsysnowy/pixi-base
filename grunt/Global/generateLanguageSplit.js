var fs = require("fs");
var fse = require("fs-extra");
var mkdirp = require("mkdirp");
var packagePath = "package.json";
var pathWrite = "./GLOBAL/";
var pkg;
var index = 0;

fs.readFile(packagePath, "utf8", function (error, data) {
    if (error) {
        console.error("read error:  " + error.message);
    } else {
        pkg = JSON.parse(data);
        nextLanguage();
    }
});

var nextLanguage = function() {
    console.log(index);
    if ( index == pkg.languages.length) {
        console.log("done");
    } else {
        generateData(pkg.languages[index]);
        index++;
    }
}

function generateData(language) {
    console.log("Generating data in language: ", language);
    var dir = "GLOBAL/releases/game_" + language;
    mkdirp(dir, function (err) {
        copyFile("GLOBAL/body.html", dir + "/body.html", function (err) {
            copyFile("GLOBAL/head.html", dir + "/head.html", function (err) {
                copyFile("GLOBAL/game.json", dir + "/game.json", function (err) {
                    copyFile("GLOBAL/sideplayGame-concat.min.js", dir + "/sideplayGame-concat.min.js", function (err) {
                        generateManifest("GLOBAL/manifestEmpty.json", dir + "/manifest.json", function () {
                            generateInitGame("GLOBAL/initGame.js", dir + "/initGame.js", language, function () {
                                fse.copy("GLOBAL/assets", dir+"/assets", function(){
                                    nextLanguage();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

var generateManifest = function (manifestPath, outPath, cb) {
    fs.readFile(manifestPath, "utf8", function (error, data) {
        if (error) {
            console.error("read error:  " + error.message);
        } else {
            // Split data into lines....
            var lines = data.split("\n");
            var dataOut = "";
            // Go over each line
            for (var i = 0; i < lines.length; i++) {
                // Replace lines!
                if (lines[i].indexOf("name") != -1) {
                    lines[i] = lines[i].replace("EMPTYNAME", pkg.gameName);
                } else if (lines[i].indexOf("version") != -1) {
                    lines[i] = lines[i].replace("EMPTYVERSION", pkg.gameVersion);
                } else if (lines[i].indexOf("date") != -1) {
                    lines[i] = lines[i].replace("EMPTYDATE", getTimeWithFormat());
                } else if (lines[i].indexOf("authors") != -1) {
                    lines[i] = lines[i].replace("EMPTYAUTHOR", pkg.companyName);
                }
                dataOut += lines[i];
                dataOut += "\n";
            }

            fs.writeFile(outPath, dataOut, function (err, data) {
                cb();
            });
        }
    });
}

var generateInitGame = function (initGamePath, outPath, lang, cb) {
    fs.readFile(initGamePath, "utf8", function (error, data) {
        if (error) {
            console.error("read error:  " + error.message);
        } else {
            // Split data into lines....
            var lines = data.split("\n");
            var dataOut = "";

            // Go over each line
            for (var i = 0; i < lines.length; i++) {
                // Replace lines!
                if (lines[i].indexOf("seedPacket.currency") != -1) {
                    lines[i] = '    seedPacket.currency = "' + pkg.currency + '"'
                } else if (lines[i].indexOf("seedPacket.languageCode") != -1) {
                    lines[i] = '    seedPacket.languageCode = "' + lang.toUpperCase() + '"'
                }

                dataOut += lines[i];
                dataOut += "\n";
            }

            fs.writeFile(outPath, dataOut, function (err, data) {
                cb();
            });
        }
    });
}

var getTimeWithFormat = function () {
    var currentdate = new Date();
    return currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + "_"
        + currentdate.getHours() + "-"
        + currentdate.getMinutes() + "-"
        + currentdate.getSeconds();
}