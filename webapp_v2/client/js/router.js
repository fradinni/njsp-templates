define(['backbone'], function (Backbone) {

  /**
  * Application main router
  */
  var Router = Backbone.Router.extend({

    initialize: function (options) {
      this.options = options || {};
      this.app = this.options.app;
      this.initRoutes();
    },

    initRoutes: function () {
      this.route('', 'home', this.home.bind(this));
    }

  });


  /**
  * Home route
  */
  Router.prototype.home = function () {
    console.log('[Router] Home route');
  };

  return Router;

});