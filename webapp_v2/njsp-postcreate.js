var fs = require('fs');
var spawn = require('child_process').spawn;

module.exports = function (options, callback) {
  console.log('Execute post creation script');

  // If heroku
  if(options.heroku) {
    // Generate Procfile
    fs.writeFileSync(options.projectPath+'/Procfile', 'web: node server/server.js\n');
  }

  console.log('Installing project dependencies...');
  // Execute npm install...
  var install = spawn('npm', ['install'], {cwd: options.projectPath});
  install.on('close', function () {
    return callback(null);
  });
};