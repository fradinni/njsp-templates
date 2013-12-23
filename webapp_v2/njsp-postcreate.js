var spawn = require('child_process').spawn;

module.exports = function (options, callback) {
  console.log('Webapp template post creation script...');

  // Execute npm install...
  var error = false;
  var install = spawn('npm', ['install'], {cwd: options.projectPath});

  install.stderr.on('data', function (data) {
    error = true;
    console.log(data.toString());
  });

  install.stdout.on('data', function (data) {
    console.log('\033[32m'+data.toString()+'\033[30m');
  });

  install.on('close', function () {
    if(error) {
      console.log('Error during initialisation !');
      return callback(error);
    }
    return callback(null);
  });
};