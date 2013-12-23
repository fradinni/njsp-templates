var spawn = require('child_process').spawn;

module.exports = function (options, callback) {
  console.log('Webapp template post creation script...');
  console.log('Installing project dependencies...');
  // Execute npm install...
  var install = spawn('npm', ['install'], {cwd: options.projectPath});

  install.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  install.on('close', function () {
    return callback(null);
  });
};