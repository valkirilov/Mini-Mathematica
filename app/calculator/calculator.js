'use strict';

angular.module('myApp.calculator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calculator', {
    templateUrl: 'calculator/calculator.html',
    controller: 'CalculatorCtrl'
  });
}])

.controller('CalculatorCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {

	$scope.inputField = '';

	$scope.calculate = function() {
		var input = $scope.inputField;
		var result = evalReversePolishNotationpn(input);

		$scope.inputField = result;
	};	
	$scope.clear = function() {
		$scope.inputField = '';
	};
	$scope.type = function(symbol) {
		$scope.inputField += symbol.toString();
	};

	function evalReversePolishNotationpn(input)  {
  		var stack,
  			token, 
  			x, y, z;

  		input = input.replace(/^\s*|\s*$/g,'');
  		input = input.length > 0 ? input.split(/\s+/) : [];
  		
  		stack = [];
  		for (var i=0; i < input.length; ++i) {
    		token = input[i];
    		if (/^[+-]?(\.\d+|\d+(\.\d*)?)$/.test(token)) {
      			z = parseFloat(token);
      		}
    		else  {
      			if (token.length>1 || '+-*/'.indexOf(token)==-1 || stack.length<2) break;
      			y = stack.pop();  x = stack.pop();
      			z = eval(x + token + ' ' +y);
    		}
    		stack.push(z);
  		}
  		return  i<input.length || stack.length>1 ? 'error' : stack.length==1 ? stack.pop() : '';
	}


}]);