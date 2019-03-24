
var app = angular.module('Forms.Controllers',['ui.grid']);
app.controller('formController',['$scope','FormServices',function($scope,FormServices){
	$scope.availableLocations = ['Kolkata','Bangalore','Chennai','Mumbai'];
	
	$scope.employees = [];
	
	$scope.gridOptions = {

			enableSorting: true,

			columnDefs: [
				{ field: 'fullName', displayName : 'NAME' , visible : true},
				{ field: 'address' , displayName : 'Address'},
				{ field: 'birthDay',displayName : 'DOB', cellFilter : 'date' },
				{ field: 'status' ,displayName : 'Status'},
				{ field: 'employeeLocation' ,displayName : 'Location'},
				{ field: 'experience' , displayName : 'Experience'}
			],
			data : []
	};
	//$scope.gridOptions.data = $scope.employees;
	
	$scope.saveDetails = function(){
		console.log('it is clicked');
		if(validateForm())
			return;
		var employee = {
				fullName : $scope.fullName,
				address : $scope.address,
				birthDay : $scope.birthDay,
				status : $scope.status,
				employeeLocation : $scope.employeeLocation,
				experience : $scope.exp
		};
		FormServices.saveEmployeeDetails(employee).then(function(response){
			response.data = employee;
			$scope.detailsSaved = true;
			$scope.employees.push(response.data);
		},function(response){
			response.data = employee;
			$scope.detailsSaved = true;//actually should be false
			response.data.experience = getExperience(response.data.experience);
			$scope.employees.push(response.data);
			$scope.gridOptions.data = $scope.employees;
			console.log(response);
		});
	};
	function getExperience (experience) {
		if(experience.basic)
			return '0-2 Yrs';
		else if(experience.inter)
			return '2-4 Yrs';
		else if(experience.advanced)
			return '4-6 Yrs';
		else if(experience.prof)
			return '6+ Yrs';
		else
			return 'Unavailable';
	}
	function validateForm(){
		var errorField = false;//No error if this field is set to true
		if(!$scope.fullName || !/^[a-zA-Z ]*$/.test($scope.fullName)){
			$scope.displayErrorName = true;
			errorField = true;
		}
		
		if(!$scope.address || /^[<>]$/.test($scope.address)){
			$scope.displayErrorAddress = true;
			errorField = true;
		}
		
		if(!$scope.birthDay || $scope.birthDay > new Date()){
			$scope.displayErrorDate = true;
			errorField = true;
		}
		
		if(!$scope.status){
			$scope.displayErrorStatus = true;
			errorField = true;
		}
		
		if(!$scope.employeeLocation){
			$scope.displayErrorLocation = true;
			errorField = true;
		}
		if(!$scope.exp || $scope.exp.length == 0){
			$scope.displayErrorExp  = true;
			errorField = true;
		}
		return errorField;
			
	}
}]);

app.factory('FormServices',function($http){
	var baseUrl = 'https://localhost:8070';
	var formServices = {
			saveEmployeeDetails : saveEmployeeDetails
	};
	function saveEmployeeDetails(empObj){
		console.log(empObj+" :Check Emp obj");
		return $http.get(baseUrl+'/abc.php/?info='+empObj);
		//return empObj;
	};
	return formServices;
})