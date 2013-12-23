var spawn = require('child_process').spawn;

module.exports = function (options, callback) {
  console.log('Webapp template post creation script...');
  console.log('Installing project dependencies !');
  // Execute npm install...
  var error = false;
  var install = spawn('npm', ['install'], {cwd: options.projectPath});

  install.on('close', function () {
    return callback(null);
  });
};