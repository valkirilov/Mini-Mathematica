'use strict';

angular.module('myApp.calculator', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calculator', {
    templateUrl: 'calculator/calculator.html',
    controller: 'CalculatorCtrl'
  });
}])

.controller('CalculatorCtrl', ['$rootScope', '$scope', '$document', 'CalcService', function($rootScope, $scope, $document, CalcService) {

	$scope.inputField = '';
  $scope.history = [];

  $scope.init = function() {

    $document.bind("keyup", function(event) {
      $scope.$apply(function() {
        $scope.keyUp(event);
      });
    });

  };
  $scope.init();

  $scope.keyUp = function($event) {
    if ($event.keyCode === 13) {
      $scope.calculate();
      $event.preventDefault();
      $event.stopPropagation();
    }
  };

	$scope.calculate = function() {
		var input = $scope.inputField;
    if (input.length === 0)
      return;

		var result = CalcService.calculate(input);

    $scope.history.push({
      expression: input,
      result: result
    });

		$scope.inputField = (result === false) ? 'Invalid expression' : result.toString();
    //$scope.$digest();
	};	

	$scope.clear = function() {
		$scope.inputField = '';
	};

  /** User for typing a numbers and moving the caret */
	$scope.type = function(symbol) {

    var field = document.getElementById('input-field'),
        caretPosition = doGetCaretPosition(field);

		$scope.inputField = spliceSlice($scope.inputField, caretPosition, 0, symbol.toString());
    //angular.element('#input-field').focus();
    setTimeout(function() {
      setCaretPosition(field, caretPosition+1);  
    }, 100);
	};

  /** User for typing a function and moving the caret to an anrgument position */
  $scope.typeSpecial = function(expression, offset) {
    var field = document.getElementById('input-field'),
        caretPosition = doGetCaretPosition(field);

    $scope.inputField = spliceSlice($scope.inputField, caretPosition, 0, expression.toString());
    //angular.element('#input-field').focus();
    setTimeout(function() {
      setCaretPosition(field, caretPosition+offset);  
    }, 100);
  };

  /** Utils functions */
	function doGetCaretPosition (ctrl) {

    var CaretPos = 0;
    // IE Support
    if (document.selection) {

        ctrl.focus ();
        var Sel = document.selection.createRange ();

        Sel.moveStart ('character', -ctrl.value.length);

        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = ctrl.selectionStart;

    return (CaretPos);

  }

  function setCaretPosition(ctrl, pos) {

    if(ctrl.setSelectionRange)
    {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
  }

  function spliceSlice(str, index, count, add) {
    var result = str.slice(0, index) + (add || "") + str.slice(index + count);

    return result;
  }


}]);