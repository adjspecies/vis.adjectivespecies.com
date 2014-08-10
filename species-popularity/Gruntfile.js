module.exports = function(grunt) {

  grunt.initConfig({

    /*
     * Creates a static file server to host the site locally at: http://localhost:8000
     */
    connect: {
      dev: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true
        }
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');

  // The default task does only what's needed for local development
  grunt.registerTask('default', ['connect:dev']);
};