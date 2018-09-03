module.exports = function(grunt)
{
	function lang(langIn){
		if(langIn == null){
			return "en_IE";
		} else {
			switch(langIn){
				default:
					return "en_IE";
			}
		}
    }
    // = Grunt file! =
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('../package.json'),
		connect: {
			server: {
                options: {
                    port: 1234,
                    base: "",
                    keepalive: true
                }
            }
        },
		clean: {
			prep: [
				"tmp",
				"rel"
			],
			tmp: [
				"tmp"
			],
			release: [
				["rel/sideplay*", "!rel/*.min.js"],
				"rel/imports", "rel/manifestEmpty.json", "rel/index_de.html", "rel/index_fr.html",
				"rel/initGameExport.js","rel/initGame_de.js", "rel/tsconfig.json","rel/index.html",
				"rel/game.js","rel/game.js.map","rel/indexLose.html","rel/indexWin.html","rel/ts"
			]
		},
        concat: {
			options: {
				seperator: ";"
			},
			conc: {
				src: ["./imports/bowser.js","./imports/chance.js",'./imports/webfontloader.js', './imports/phaser.js', './sideplayGame.js'],
				dest: './sideplayGame-concat.js',
				options: {
					sourceMap: false
				}
			},
		},
		uglify: {
			my_target: {
				files: {
					'./rel/sideplayGame-concat.min.js': ['./sideplayGame-concat.js']
				}
			}
		},
		'string-replace': {
			dist: {
				files: [
					{
						expand:false,
						src: './rel/manifestEmpty.json',
						dest:'./rel/manifest.json'
					},
					{
						expand:false,
						src: "./rel/initGameExport.js",
						dest:"./rel/initGame.js"
					}
				],
				options: {
					replacements:[
						{
							pattern: 'EMPTYNAME',
							replacement: '<%= pkg.gameName %>'
						},
						{
							pattern: 'EMPTYVERSION',
							replacement: '<%= pkg.gameVersion %>'
						},
						{
							pattern: 'EMPTYDATE',
							replacement: grunt.template.today('yyyy-mm-dd_HH-MM-ss')
						},
						{
							pattern: 'EMPTYAUTHOR',
							replacement: '<%= pkg.companyName %>'
						},
						{
							pattern: 'LANGUAGECODE',
							replacement: lang(grunt.option("language"))
						}
					]
				}
			}
		},
		compress: {
			dist: {
				options: {
					archive: "./" + grunt.template.today('yyyy-mm-dd_HH-MM-ss') + "_SidePlay_<%= pkg.gameName %>_<%= pkg.gameVersion %>_" + lang(grunt.option("language")) + ".zip",
					mode: "zip"
				},
				files: [
					{
						src: ["rel/**"],
						expand:true,
						cwd: "./",
						dest: "/"
					}
				]
			}
		}
	})
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-string-replace");
    
     grunt.registerTask('usetheforce_on',
        'force the force option on if needed', 
        function() {
        if ( !grunt.option( 'force' ) ) {
            grunt.config.set('usetheforce_set', true);
            grunt.option( 'force', true );
        }
    });
    grunt.registerTask('usetheforce_restore', 
        'turn force option off if we have previously set it', 
        function() {
        if ( grunt.config.get('usetheforce_set') ) {
            grunt.option( 'force', false );
        }
    });
    
	grunt.registerTask('server', ['connect:server']);
	grunt.registerTask('releaseserver', ['connect:releaseserver']);

	grunt.registerTask("release", ['clean:prep', 'copy:toTemp', "usetheforce_on","ts:dev", "usetheforce_restore", 'clean:tmp', 'replace:mapReferences', 'copy:assets', 'concat:conc', 'uglify','string-replace:dist', "clean:release", "compress:dist"]);

	grunt.registerTask("default", ['clean:prep', 'copy:toTemp', "usetheforce_on","ts:dev", "usetheforce_restore", 'clean:tmp', 'replace:mapReferences', 'copy:assets', 'concat:conc', 'uglify','string-replace:dist']);
	grunt.registerTask("quick", ['copy:toTemp', "usetheforce_on","ts:dev", "usetheforce_restore", 'clean:tmp', 'replace:mapReferences', 'string-replace:dist']);
}