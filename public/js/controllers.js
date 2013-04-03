'use strict';

var navTemplates = [
[{
	title: 'Admin',
	icon: 'icon-lock',
	href: 'admin'
}],
[{
	title: 'User',
	icon: 'icon-file',
	href: 'user'
}]];

function indexCtrl($rootScope, $scope, $location, $http, $q, Utils, User, messageService) {

	//Maybe temporary
	//Pull from a cookie?
	if(!$scope.loggedIn){
		$location.path('/home');
	}

	$rootScope.user = new User();
	$scope.login = function(form){
		var deferred = $q.defer();
		$http.post('/login', form).
		success(function(response){
			if(response){
				$rootScope.user = response;
				if($rootScope.user.role == 'Admin'){
					$scope.activeNavTemplates = navTemplates[0];
				}
				else if($rootScope.user.role == 'User'){
					$scope.activeNavTemplates = navTemplates[1];
				}
				$location.path('/' + $scope.activeNavTemplates[0].href);
				$scope.loggedIn = true;
				messageService.prepForBroadcast('Successful Login');
				deferred.resolve(true);
			}
			else{
				messageService.prepForBroadcast('Login Failed');
				$scope.loggedIn = false;
				deferred.reject(false);
			}
		}).error(function(response){
			$scope.loggedIn = false;
			messageService.prepForBroadcast(response.error);
			deferred.reject(false);
		});
		return deferred.promise;
	}

	$scope.logout = function(){
		var deferred = $q.defer();
		$http.post('/logout', $rootScope.user).
		success(function(response) {
			if(response){
				$rootScope.user = new User();
				$location.path('/home');
				$scope.loggedIn = false;
				messageService.prepForBroadcast('Successful Logout');
				deferred.resolve(true);
			}
			else{
				$scope.loggedIn = true;
				messageService.prepForBroadcast('Failed Logout');
				deferred.reject(false);
			}
		}).error(function(response){
			$scope.loggedIn = true;
			messageService.prepForBroadcast(response.error);
			deferred.reject(false);
		})
		return deferred.promise;
	};

	$scope.signup = function(form){
		var deferred = $q.defer();
		var newUser = new User();
		newUser.name = form.name;
		newUser.email = form.email;
		newUser.city = form.city;
		newUser.state = form.state;
		newUser.zip = form.zip;
		newUser.password = form.password;
		newUser.$save(function(response){
			if(response){
				messageService.prepForBroadcast('Successful Sign Up');
				deferred.resolve(true);
			}
			else{
				messageService.prepForBroadcast('Failed Sign Up');
				deferred.reject(false);
			}
		})
		return deferred.promise;
	}

	$scope.forget = function(email){
		var user = {};
		user.email = email;
		var deferred = $q.defer();
		$http.post('/resetPass', user).success(function(response){
			if(response.error){
				messageService.prepForBroadcast(response.error);
				deferred.reject(false);
			}
			else{
				messageService.prepForBroadcast(response.success);
				deferred.resolve(true);
			}
		}).error(function(response){
			messageService.prepForBroadcast('Unexpected Error');
			deferred.reject(false);
		})
		return deferred.promise;
	}
}

function homeCtrl($scope) {
}

function adminCtrl($scope, $http, Utils, messageService) {

	var userList = [];
	$scope.retrieveUsers = function(){
		var options = [];
		$http.post('/getUsers', options).
		success(function(data) {
			$scope.users = data;
			for(var i = 0; i < $scope.users.length; i++){
				setApproval($scope.users[i]);
				setRole($scope.users[i]);
			}
		});
	}
	$scope.retrieveUsers();

	$scope.updateUsers = function(){
		$http.post('/updateUsers', userList).
		success(function(data) {
			if(data){
				console.log(data);
			}
			else{
				messageService.prepForBroadcast('Update Failed');
			}
		}).
		error(function() {
			messageService.prepForBroadcast('Update Failed');
		});
	}

	// Helper method to maintain a lite user list 
	var updateUserList = function(user){
		var userLite = {}
		userLite.name = user.name;
		// userLite.email = user.email;
		userLite.approval = user.approval;
		userLite.role = user.role;
		var found = Utils.find(user, userList, 'name');
		if(found){
			userList.splice(found.index, 1, userLite);
		}
		else{
			userList.push(userLite);
		}
	}

	$scope.userSort = 'name';
	$scope.sortUser = function(type){
		if(type == $scope.userSort){
			$scope.userSort = '-'+type;
		}
		else{
			$scope.userSort = type;
		}
	}

	$scope.toggleRole = function(user){
		if(user.role == 'User'){
			user.role = 'Admin';
		}
		else if(user.role == 'Admin'){
			user.role = 'User';
		}
		setRole(user);
		updateUserList(user);
		$scope.updateUsers();
	}

	$scope.toggleApproval = function(user){
		user.approval = !user.approval;
		setApproval(user);
		updateUserList(user);
		$scope.updateUsers();
	}

	var setRole = function(user){
		if(user.role == 'User'){
			user.roleStyle = 'user';
		}
		else if(user.role == 'Admin'){
			user.roleStyle = 'admin';
		}
	}

	var setApproval = function(user){
		if(user.approval){
			user.approvalStyle = 'Approved';
			user.icon = 'icon-check';
		}
		else{
			user.approvalStyle = 'Unapproved';
			user.icon = 'icon-remove-sign';
		}
	}

	var toggle = false;
	$scope.approval = {};
	$scope.approval.icon = 'icon-remove-sign';
	$scope.toggleAll = function(){
		if(toggle){
			$scope.approval.icon = 'icon-remove-sign';
		}
		else{
			$scope.approval.icon = 'icon-check';
		}
		for(var i = 0; i < $scope.users.length; i++){
			if(toggle){
				$scope.users[i].approval = false;
				$scope.users[i].approvalStyle = 'Unapproved';
			}
			else{
				$scope.users[i].approval = true;
				$scope.users[i].approvalStyle = 'Approved';
			}
			$scope.users[i].icon = $scope.approval.icon;
			updateUserList($scope.users[i]);
		}
		toggle = !toggle;
		$scope.updateUsers();
	}
}

function userCtrl($scope, $http, Utils, messageService) {
}

function preferencesCtrl($scope, $http, Utils, messageService) {
}

function supportCtrl($scope, $http, Utils, messageService) {
}