// Build file
module.exports = function (grunt) {
    // ==== Servers ====
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            // setup a local server on port localhost:1234
            server: {
                options: {
                    port: 1234,
                    base: "BUILD",
                    keepalive: true
                }
            },
            serverglobal: {
                options: {
                    port: 1234,
                    base: 'GLOBAL',
                    keepalive: true
                }
            },
            camserver: {
                options: {
                    port: 12345,
                    base: "CAMELOT/IWG",
                    keepalive: true
                }
            }
        },

        // ==== Camelot UK Build process ====
        clean: {
            camelotFolder: {
                src: ["./CAMELOT/IWG/"]
            },
            globalFolder: {
                src: ["./GLOBAL/"]
            },
        },
        execute: {
            buildIwgIncludes: {
                src: ["grunt/Camelot/generateIwgIncludes.js"]
            },
            generateHeadAndBody: {
                src: ["grunt/Global/generateHeadAndBody.js"]
            },
            generateLanguageSplit: {
                src: ["grunt/Global/generateLanguageSplit.js"]
            }
        },
        concat: {
            generateCamelotJS: {
                src: ["BUILD/includes/pixi.js", "BUILD/includes/pixi-spine.js", "BUILD/includes/pixi-particles.js",
                    "BUILD/includes/bowser.js", "BUILD/includes/TweenMax.js", "BUILD/includes/webfontloader.js",
                    "BUILD/includes/EventEmitter.js", "BUILD/includes/chance.js",
                    "BUILD/includes/chai.js", "BUILD/game.js", "grunt/Camelot/IWGInit.js"],
                dest: "CAMELOT/IWG/src/game.js"

            },
            appendCamelotLogs: {
                src: ["grunt/appendLogs.js", "CAMELOT/IWG/src/game.js"],
                dest: "CAMELOT/IWG/src/game.js"
            },
            generateGlobalJS: {
                src: ["BUILD/includes/pixi.js", "BUILD/includes/pixi-spine.js", "BUILD/includes/pixi-particles.js",
                    "BUILD/includes/bowser.js", "BUILD/includes/TweenMax.js", "BUILD/includes/webfontloader.js",
                    "BUILD/includes/EventEmitter.js", "BUILD/includes/howler.js", "BUILD/includes/chance.js",
                    "BUILD/includes/chai.js", "BUILD/game.js"],
                dest: "GLOBAL/sideplayGame-concat.js"
            },
            appendGlobalLogs: {
                src: ["grunt/appendLogs.js", "GLOBAL/sideplayGame-concat.min.js"],
                dest: "GLOBAL/sideplayGame-concat.min.js"
            }
        },
        copy: {
            camelotImports: {
                files: [{ expand: true, cwd: "BUILD/includes", src: ["*.*","!*.js"], dest: "CAMELOT/IWG/src/imports" }]
            },
            camelotAssets: {
                files: [{ expand: true, cwd: "BUILD/", src: ["assets/**","!assets/ticket/**"], dest: "CAMELOT/IWG/src/imports/" }]
            },
            camelotBuildProcess: {
                files: [{ expand: true, cwd: "grunt/Camelot/", src: ["build/**"], dest: "CAMELOT/"}]
            },
            camelotFiles: {
                files: [{ expand: true, cwd: "grunt/Camelot", src: ["browserMatrix.json", "camelotgame.css"], dest: "CAMELOT/IWG/src/" }]
            },
            ticketFile: {
                files: [{ expand: true, cwd: "BUILD/assets/ticket/", src: ["ticket.xml"], dest: "CAMELOT/IWG/" }]
            },
            indexFile: {
                files: [{ expand: true, cwd: "grunt/Camelot", src: ["index.html"], dest: "CAMELOT/IWG/" }]
            },
            globalAssets: {
                files: [{ expand: true, cwd: "BUILD/", src: ["assets/**"], dest: "GLOBAL/" }]
            },
            globalFiles: {
                files: [{ expand: true, cwd: "grunt/Global", src: ["game.json", "initGame.js", "manifestEmpty.json"], dest: "GLOBAL/" }]
            },
            globalIndex: {
                files: [{ expand: true, cwd: "grunt/Global", src: ["index.html"], dest: "GLOBAL/" }]
            },
        },
        replace: {
            index: {
                src: ["CAMELOT/IWG/index.html"],
                dest: "CAMELOT/IWG/index.html",
                replacements: [{
                    from: "{{gamename}}",
                    to: grunt.option("gameName")
                }, {
                    from: "{{author}}",
                    to: grunt.option("author")
                }, {
                    from: "{{version}}",
                    to: grunt.option("gameVersion")
                }, {
                    from: "{{time}}",
                    to: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                }]
            },
            game: {
                src: ["CAMELOT/IWG/src/game.js"],
                dest: "CAMELOT/IWG/src/game.js",
                replacements: [{
                    from: "{{gamename}}",
                    to: grunt.option("gameName")
                }, {
                    from: "{{author}}",
                    to: grunt.option("author")
                }, {
                    from: "{{version}}",
                    to: grunt.option("gameVersion")
                }, {
                    from: "{{time}}",
                    to: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                }]
            }
        },
        uglify: {
            global: {
                files: {
                    './GLOBAL/sideplayGame-concat.min.js': ['./GLOBAL/sideplayGame-concat.js']
                }
            }
        },
        compress: {
            dist: {
                options: {
                    archive: "./" + grunt.template.today('yyyy-mm-dd_HH-MM-ss') + "_SidePlay_<%= pkg.gameName %>_<%= pkg.gameVersion %>_" + grunt.option("language") + ".zip",
                    mode: "zip"
                },
                files: [
                    {
                        src: ["rel/**"],
                        expand: true,
                        cwd: "./",
                        dest: "/"
                    }
                ]
            }
        }
        // ===============================
    })
    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-string-replace");
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Register tasks
    grunt.registerTask('server', ['connect:server']);
    grunt.registerTask('serverglobal', ['connect:serverglobal']);
    grunt.registerTask('globalserver', ['connect:serverglobal']);
    grunt.registerTask('camserver', ['connect:camserver']);
    grunt.registerTask('servercamelot', ['connect:camserver']);
    grunt.registerTask('camelotserver', ['connect:camserver']);
    grunt.registerTask('camelot', ["clean:camelotFolder", "execute:buildIwgIncludes", "concat:generateCamelotJS", "copy:camelotBuildProcess", "copy:camelotImports", "copy:camelotAssets", "copy:camelotFiles", "copy:ticketFile", "copy:indexFile", "concat:appendCamelotLogs", "replace:index", "replace:game"]);
    grunt.registerTask('global', ["clean:globalFolder", "execute:generateHeadAndBody", "concat:generateGlobalJS", "copy:globalAssets", "copy:globalFiles", "uglify:global", "execute:generateLanguageSplit"]);

}