requirejs.config({
  paths: {
    'js'        : './',
    'libs'      : '../libs',
    'templates' : '../templates',
    'text'      : '../libs/requirejs-text/text',
    'jquery'    : '../libs/jquery/jquery',
    'backbone'  : '../libs/backbone/backbone',
    'underscore': '../libs/underscore/underscore'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    }
  }
});

define(['app'], function ( Application ) {

  var app = new Application({
    name    : 'Application Name',
    version : '0.0.1',
    author  : 'Your name'
  });
  app.start();

});