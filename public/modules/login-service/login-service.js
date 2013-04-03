function loginCtrl ($scope, $attrs) {
    //set $scope.loggedIn variable to either a cookie or a request?
    $scope.loggedIn = false;
    $scope.signUp = {}
    $scope.signUp.form = {};
    $scope.formLogin = {};

    $scope.forgetForm = {};
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
        // where's mah scope at?
        // debugger;
        // $scope.signupForm.$setPristine();
    }

    // Had to do some stupid jquery look ups to toggle dropdown for now

    $scope.cancelSignUp = function(){
        $scope.resetSignUp();
        $(".dropdown").removeClass('open');
    }

    $scope.submitSignUp = function(){
        $scope.signup({form: $scope.signUp.form}).then(function(val){
            if(val){
                $scope.resetSignUp();
                $(".dropdown").removeClass('open');
            }
        });
    }

    $scope.resetPass = function(){
        $scope.forget({email: $scope.forgetForm.email}).then(function(val){
            if(val){
                $scope.forgetForm.email = '';
                $scope.forgetForm = {};
                $(".dropdown").removeClass('open');
            }
        });
    }
}
angular.module('loginModule', []).
directive('loginCenter', function () {
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