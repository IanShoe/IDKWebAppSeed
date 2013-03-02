function loginCtrl ($scope, $attrs, loginService) {

    //set $scope.loggedIn variable to either a cookie or a request
    $scope.loggedIn = false;
    $scope.signupModal = {};
    $scope.signupModal.show = false;
    $scope.signUp = {}
    $scope.signUp.form = {};
    //Temporary
    $scope.formLogin = {};

    $scope.forgetForm = {};
    $scope.forgetForm.show = false;
    $scope.forgetForm.email = '';

    $scope.submitLogin = function(){
        $scope.login({form: this.formLogin}).then(function(val){
            if(val){
                $scope.loggedIn = true;
                $scope.formLogin = {};
            }
            else{
                $scope.loggedIn = false;
            }
        });
    }

    $scope.submitLogout = function(){
        $scope.logout().then(function(val){
            if(val){
                $scope.loggedIn = false;
                $scope.formLogin = {};
            }
            else{
                $scope.loggedIn = true;
            }
        });
    }

    /* SignUp Form */
    $scope.resetSignUp = function(){
        $scope.signUp.form = {};
        $scope.signUp.form.email = '';
        $scope.signUp.form.$pristine = true;
        $scope.signUp.form.$dirty = false;
        $scope.signUp.form.$invalid = true;
    }

    $scope.submitSignUp = function(){
        $scope.signup({form: $scope.signUp.form}).then(function(val){
            if(val){
                $scope.resetSignUp();
                $scope.signupModal.show = false;
            }
        });
    }

    $scope.cancelSignUp = function(){
        $scope.resetSignUp();
        $scope.signupModal.show = false;
    }

    $scope.resetPass = function(){
        $scope.forget({email: $scope.forgetForm.email}).then(function(val){
            if(val){
                console.log($scope.forgetForm);
                $scope.forgetForm.email = '';
                $scope.forgetForm.show = false;
            }
        });
    }
}

angular.module('loginModule', []).
factory('loginService', function ($rootScope) {
    // Example
    // var loginService = {};

    // loginService.login = function () {
    //     $rootScope.$broadcast('login');
    // };

    // loginService.logout = function () {
    //     $rootScope.$broadcast('logout');
    // }
    // return loginService;
}).
directive('loginCenter', function (loginService) {
    return {
        restrict: 'E',
        scope: {
            login: '&',
            logout: '&',
            signup: '&',
            user: '=user',
            forget: '&'
        },
        templateUrl: 'modules/login-service/partials/login-template.html',
        controller: loginCtrl
    }
}).
directive('passidate', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(attrs.passidate, function(newValue, oldValue){
                if(scope.$eval(attrs.ngModel) == newValue){
                    ctrl.$setValidity('passidate', true);
                }
                else{
                    ctrl.$setValidity('passidate', false);
                }
            }, true);
            scope.$watch(attrs.ngModel, function(newValue, oldValue){
                if(scope.$eval(attrs.passidate) == newValue){
                    ctrl.$setValidity('passidate', true);
                }
                else{
                    ctrl.$setValidity('passidate', false);
                }
            }, true)
        }
    }
});
//Couldn't get it to work
// directive('uiPopover', ['$compile', '$http', function($compile, $http) {
//     return {
//         restrict: 'A',
//         scope: {
//             hideDel : '&'
//         },
//         controller: loginCtrl,
//         link: function postLink(scope, element, attr, ctrl) {
//             $http.get(attr.uiPopover).success(function(data) {
//                 scope.popoverTemplate = data;
//             });
//             scope.showPopover = function(){
//                 var newScope = scope.$new(true);
//                 newScope.reset = function(){
//                     console.log('in');
//                     scope.hideDel({email: this.forget.email});
//                     this.forget.email = '';
//                     element.popover('hide');
//                     this.$destroy();
//                 }
//                 element.popover({
//                     content: $compile(scope.popoverTemplate)(newScope),
//                     html: true
//                 });
//                 element.popover('show');
//             }
//         }
//     }
// }]);