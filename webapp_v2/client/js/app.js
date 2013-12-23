define(['backbone', 'router'], function (Backbone, Router) {

  var Application = function (options) {
    this.options = options;
    this.router  = new Router({ app: this });
    console.log('[Application] Initialized');
  };


  Application.prototype.start = function() {
    Backbone.history.start();
    console.log('[Application] Started');
  };


  return Application;

});