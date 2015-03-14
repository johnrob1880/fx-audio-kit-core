var concat = require('concat-files');

concat([
    'lib/header.js',
    'dist/fx-audio-kit-core.min.js'
], 'dist/fx-audio-kit-core.min.js', function () {
    console.log('done');
});