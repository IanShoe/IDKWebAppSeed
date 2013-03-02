'use strict';

var seed = angular.module('seedApp', ['ngResource', 'ui', 'messageCenter', 'loginModule', 'tabModule']);

/* Routing */
seed.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
	when('/home', {
		templateUrl: 'partials/home.html',
		controller: homeCtrl
	}).
	when('/admin', {
		templateUrl: 'partials/admin.html',
		controller: adminCtrl
	}).
	when('/user', {
		templateUrl: 'partials/user.html',
		controller: userCtrl
	}).
    when('/preferences', {
        templateUrl: 'partials/preferences.html',
        controller: preferencesCtrl
    }).
    when('/support', {
        templateUrl: 'partials/support.html',
        controller: supportCtrl
    }).
    otherwise({
      redirectTo: '/home'});
    $locationProvider.html5Mode(true);
}]);

/* Directives */
seed.
directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

/* Service */ 
seed.value('version', 'Alpha Version 0.1');

/* Providers */
seed.
provider('Utils', function(){
    this.$get = function(){
        return {
            setProperty: function(instance, instanceList, instanceProperty) {
                if(instance) {
                    instance = find(instance, instanceList, instanceProperty).item
                }
                else {
                    instance = instanceList[0];
                }
                return instance;
            },
            find: function(instance, list, property) {
                var found = {};
                for (var i = 0; i < list.length; i++) {
                    if (list[i][property] === instance[property] || list[i][property] === instance) {
                        found.index = i;
                        found.item = list[i];
                        return found;
                    }
                }
                return false;
            },
            advancedFind: function(instance, list, properties) {
                var found = {};
                for (var i = 0; i < list.length; i++) {
                    var finding = true;
                    for(var j= 0; j < list.length; j++){
                        if (list[i][properties[j]] === instance[properties[j]] || list[i][properties[j]] === instance) {
                            continue;
                        }
                        else{
                            finding = false;
                            break;
                        }
                    }
                    if(finding){
                        found.index = i;
                        found.item = list[i];
                        return found;
                    }
                }
                return false;
            }
        }
    }
});

seed.
factory('User', function($resource){return $resource('User')});