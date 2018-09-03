'use strict';

module.exports = function (grunt) {


    // Project configuration.
    var tempManifest = '';
    var InjectMe = '';
    var minifyMe = '';
    var pkg = grunt.file.readJSON('MIWGbuild.json');
    var path = require('path');
    var timestamp = grunt.template.today("yyyy_mm_dd__h-MM-ss");
    var buildstamp = "0_0_1";
    //
    grunt.initConfig({
            pkg: function (_pkg) {
                pkg._____name = pkg._____name.replace(/ /g, '_');
                _pkg._____name = _pkg._____name.replace(/ /g, '_');
                return _pkg
                console.log(' pkg._____name', pkg._____name);
                console.log(' _pkg._____name', _pkg._____name);
            }(grunt.file.readJSON('MIWGbuild.json')),
            replace: {
                //**********************************************************************************************************
                //MANIFEST

                extractTemp_Manifest: {
                    //exstact _manifest
                    src: ['<%= pkg._____basepath %>/src/IwgIncludes.js'],
                    dest: 'bin/temp/includee.txt',
                    replacements: [{
                        from: /var.*_manifest.*=.*\[([^\)]+)\]/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            tempManifest = matchedWord.replace(/(var.*_manifest.*=.*\[)|(.*\].*)/igm, '');
                            return regexMatches;   //
                        }
                    }]

                },

                writeTemp_Manifest: {
                    //write tempManifest to includee.txt
                    src: ['bin/temp/includee.txt'],
                    overwrite: true,
                    replacements: [{
                        from: /([^]+)/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            return tempManifest;   //
                        }
                    }]

                },
                cleanTemp_Manifest: {
                    //clean includee.txt
                    src: ['bin/temp/includee.txt'],
                    overwrite: true,
                    replacements: [{
                        from: /^\s*[\r\n\s]/gm,
                        to: ''  //

                    }]
                },

                //^((?!src).)*$
                makeMinifyME: {
                    //these will be used to make the minified file
                    src: ['bin/temp/includee.txt'],
                    dest: 'bin/temp/minifyMe.txt',
                    replacements: [{
                        //^(?=.*?\bimports\b)(?=.*?\bmandatory\b)((?!avoid|illegal).)*$.
                        from: /^.*\b(imports|thirdParty|mp3|oog|png|jpg)\b.*$/gm,
                        to: ''
                    }]
                },
                clean_makeMinifyME: {
                    //clean includee.txt
                    src: ['bin/temp/minifyMe.txt'],
                    overwrite: true,
                    replacements: [{
                        from: /^\s*[\r\n\s]/gm,
                        to: ''  //

                    }]
                },
                make_MinifiyMeArray: {
                    //these will be re-injected into the manifest as they were excluded from the minification process

                    src: ['bin/temp/minifyMe.txt'],
                    overwrite: true,
                    replacements: [{
                        /**
                         /(([A-Z]*[a-z]*?)/).*(\.js)/igm //get js stings
                         */
                        from: /(([A-Z]*[a-z]*?)\/).*(\.js)/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            minifyMe += "@require <%= pkg._____basepath %>" + matchedWord + "\n"
                            return matchedWord;   //
                        }
                    }]
                },
                make_MinifiyMe_include_inc: {
                    //these will be re-injected into the manifest as they were excluded from the minification process

                    src: ['bin/temp/minifyMe.txt'],
                    dest: 'include.inc',
                    replacements: [{
                        from: /([^]+)/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            return minifyMe;   //
                        }
                    }]
                },
                makeInjectME: {
                    //these will be re-injected into the manifest as they were excluded from the minification process

                    src: ['bin/temp/includee.txt'],
                    dest: 'bin/temp/injectMe.txt',
                    replacements: [{
                        from: /^((?!imports|thirdParty|\.mp3|\.oog|\.png|\.jpg).)*$/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            return '';   //
                        }
                    }]
                },
                clean_InjectME: {
                    //clean includee.txt
                    src: ['bin/temp/injectMe.txt'],
                    overwrite: true,
                    replacements: [{
                        from: /^\s*[\r\n\s]/gm,
                        to: ''  //

                    }]
                },
                capture_InjectMe: {
                    //write tempManifest to includee.txt
                    src: ['bin/temp/injectMe.txt'],
                    overwrite: true,
                    replacements: [{
                        from: /([^]+)/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            InjectMe = matchedWord;
                            return tempManifest;   //
                        }
                    }]

                },

                makeLive_Manifest: {
                    //turn minifyMe into minifyMe.json
                    src: ['<%= pkg._____basepath %>/src/IwgIncludes.js'],
                    dest: 'bin/temp/IwgIncludes.js',
                    // destination directory or file
                    replacements: [{
                        from: /var.*_manifest.*=.*\[([^\)]+)\]/igm,
                        to: function (matchedWord, index, fullText, regexMatches) {
                            // matchedWord:  "world"
                            // index:  6
                            // fullText:  "Hello world"
                            // regexMatches:  ["ld"]
                            pkg._____name = pkg._____name.replace(/ /g, '_');
                            console.log(' pkg._____name', pkg._____name);
                            return 'var _manifest=[' + InjectMe +
                                '{"src":"src/<%= pkg._____name %>.min.js","id":"<%= pkg._____name %>"}]';   //
                        }
                    }]
                }
                //MANIFEST
                //**********************************************************************************************************
            },
            //**********************************************************************************************************
            //MAKE COMBINED GAME FILE
            concatinclude: {
                options: {
                    separator: ';'
                },
                iwg: {
                    files: {
                        'bin/temp/<%= pkg._____name %>.js': ['include.inc']
                    }
                },
            },

            //**********************************************************************************************************
            //UGLIFY GAME FILE
            uglify: {
                options: {
                    // the banner is inserted at the top of the output
                    banner: '/*!<%= pkg._____name %> ' + timestamp + ' __version__ <%= pkg._____version %>  : buildProcess_'+buildstamp+'*/\nvar timestamp_iwg=":::: <%= pkg._____name %> ' + timestamp + '\";'
                },
                dist: {
                    files: {
                        'bin/temp/<%= pkg._____name %>.min.js': ['bin/temp/<%= pkg._____name %>.js']
                    }
                }
            },
            jshint: {
                options: {
                    // options here to override JSHint defaults
                    ignores: ['**/*min.js'],
                    curly: true,
                    eqeqeq: true,
                    eqnull: true,
                    browser: true,
                    force: true,
                    noarg: true,
                    strict: true,
                    globals: {
                        jQuery: true,
                        console: true,
                        module: true,
                        document: true,
                        createjs: true,
                        TweenLite: true,
                        TweenMax: true,
                        miwgdefine: true,
                        miwgrequire: true

                    },
                    reporter: require('jshint-html-reporter'),
                    reporterOutput: 'bin/<%= pkg._____name %>_jshint-report.html'


                }, target: ['file.js'],
                all: [
                    '<%= pkg._____basepath %>/src/**/*.js',
                    '!<%= pkg._____basepath %>/src/thirdParty/**',
                    '!<%= pkg._____basepath %>/src/thirdparty/**',
                    '!<%= pkg._____basepath %>/src/imports/**',
                    '!<%= pkg._____basepath %>/src/out/**'
                ],
            },
            //**********************************************************************************************************
            //INFO.XML GAME FILE

            //**********************************************************************************************************
            //ZIP GAME FILE
            copy: {
                IWGfolder: {
                    files: [
                        // includes files within path
                        {
                            expand: true,
                            src: ['<%= pkg._____basepath %>/**/imports/**', '<%= pkg._____basepath %>/**/thirdParty/**', '<%= pkg._____basepath %>/**/thirdparty/**'],
                            dest: 'bin/temp/'
                        },


                    ]
                },
                baseFile_min: {
                    files: [
                        // includes files within path
                        {
                            expand: true, src: [
                            'bin/temp/<%= pkg._____name %>.min.js',
                            '<%= pkg._____basepath%>/<%= pkg._____src%>/<%= pkg._____gameCSS %>',
                            'bin/temp/IwgIncludes.js',
                            '<%= pkg._____basepath%>/<%= pkg._____src%>/browserMatrix.json'],
                            dest: 'bin/temp/<%= pkg._____basepath%>/<%= pkg._____src%>', flatten: true
                        },


                    ]
                },
                minifiedFolder: {
                    files: [
                        // includes files within path
                        {
                            expand: true,
                            src: ['**'],
                            dest: '<%=pkg._____minifiedUploadPath%>',
                            cwd: 'bin/temp/<%= pkg._____basepath%>'
                        },


                    ]
                }
            },

            compress: {
                'make_unminified_source_folder': {
                    options: {
                        mode: 'zip',
                        archive: 'bin/temp/<%= pkg._____name %>.zip'
                    },
                    src: ['<%= pkg._____basepath%>/**'],
                    filter: function (filepath) {
                        console.log('added to unminified_source_folder :', filepath);
                        return 'isFile'
                    }
                },
                'make_minified_source_folder': {
                    options: {
                        mode: 'zip',
                        archive: 'bin/temp/<%= pkg._____name %>_min.zip'
                    },
                    expand: true,
                    cwd: 'bin/temp/<%= pkg._____basepath%>/',
                    src: ['<%= pkg._____src%>/**'],
                    filter: function (filepath) {
                        console.log('added to minified_source_folder :', filepath);
                        return 'isFile'
                    }
                },
                'make_master_Zip': {
                    options: {
                        mode: 'zip',
                        archive: 'bin/<%= pkg._____name %>_' + timestamp + '.zip'
                    },
                    expand: true,
                    cwd: 'bin/temp/',
                    // Files will zip to 'hello.js' and 'world.js'
                    src: ['info.xml',
                        '../<%= pkg._____name %>*.html',
                        '<%= pkg._____name %>.zip',
                        '<%= pkg._____name %>_min.zip',
                        '<%= pkg._____name %>*.txt'],
                    filter: function (filepath) {
                        console.log('added to GTP zip :', filepath);
                        return 'isFile'
                    }
                }
            },
            clean: {
                start: {
                    src: ["bin/temp/", "bin/minified/", "include.inc"]
                },
                end: {
                    src: ["bin/temp/", "include.inc"]
                }
            }

        }
    )
    ;

// https://github.com/yoniholmes/grunt-text-replace
    grunt.loadNpmTasks('grunt-text-replace');

//https://www.npmjs.com/package/grunt-concat-include#includeinc-file
    grunt.loadNpmTasks('grunt-concat-include');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //https://github.com/gruntjs/grunt-contrib-compress
    grunt.loadNpmTasks('grunt-contrib-compress');

//https://github.com/gruntjs/grunt-contrib-copy
    grunt.loadNpmTasks('grunt-contrib-copy');
//   https://github.com/gruntjs/grunt-contrib-clean
    grunt.loadNpmTasks('grunt-contrib-clean');

//https://www.npmjs.com/package/grunt-pngmin
// grunt.loadNpmTasks('grunt-pngmin');

//https://www.npmjs.com/package/logfile-grunt
//https://www.npmjs.com/package/gulp-jshint-html-reporter
    grunt.file.setBase('../')
    grunt.registerTask('default', [
        'buildlog',
        'clean:start',
        'replace',
        'jshint',
        'addInfo',
        'concatinclude:iwg',
        'uglify',
        'copy:IWGfolder',
        // 'pngmin:optPng_' + grunt.file.readJSON('build/MIWGbuild.json')._____PNGopt,
        'copy:baseFile_min',
        'copy:minifiedFolder',
        'compress:make_unminified_source_folder',
        'compress:make_minified_source_folder',
        'compress:make_master_Zip',
        'clean:end'
    ]);
    grunt.registerTask('addInfo', 'default task description', function () {

        var _info = "";
        _info += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        _info += "<htmlindex>";
        _info += "	<headcss>";

        _info += "		<file pathType=\"relativeGlobal\">scripts\/js\/mobile\/" + pkg._____iwg_loader_MAJOR + "\/" + pkg._____iwg_loader_CSS + "<\/file>";
        _info += "		<file pathType=\"relativeGame\">src\/" + pkg._____gameCSS + "<\/file>";
        _info += "	<\/headcss>";
        _info += "	<headjs>";
        if (pkg._____SOUNDJSopt === true) {
            _info += "		<file pathType=\"relativeGlobal\">scripts\/js\/mobile\/" + pkg._____iwg_loader_MAJOR + "\/thirdParty/" + pkg._____SOUNDJSversion + "<\/file>";
        }
        _info += "		<file pathType=\"relativeGlobal\">scripts\/js\/mobile\/" + pkg._____iwg_loader_MAJOR + "\/" + pkg._____iwg_loader_MINOR + "<\/file>";
        _info += "	<\/headjs>";
        _info += "	<bodyhtml>";
        _info += "		<![CDATA[";
        _info += "	           <div id=\"IWGholder\">";
        _info += "  				  <canvas id=\"IWGcanvas\" class=\"IWGcanvas\"><\/canvas>";
        _info += "					<\/div>";
        _info += "					<div id=\"wm\" class=\"warningMessage clearfix\"><\/div>";
        _info += "	        ]]>";
        _info += "	<\/bodyhtml>";
        _info += "	<orientation>" + pkg._____orientation + "<\/orientation>";
        _info += "	<type>" + pkg._____ticketLanguage + "<\/type>";
        _info += "<\/htmlindex>";
        _info += "";
        grunt.file.write('bin/temp/info.xml', _info)
        grunt.file.write('bin/temp/' + pkg._____name + '_' + timestamp + ' __version__' + pkg._____version + '.txt', 'creation timestamp')
    });

    grunt.task.registerTask('buildlog', 'Create a new release build log files on each run.', function () {
        require('logfile-grunt')(grunt, {filePath: 'bin/' + pkg._____name + '_build.log', clearLogFile: true});
    });


}
;