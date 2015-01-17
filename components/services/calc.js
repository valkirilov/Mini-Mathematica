'use strict';

angular.module('myApp.services.calc', [])
.service('CalcService', function () {
  
  var BRACKETS = ['(', ')'];
  var CONSTANTS = ['pi', 'e'];
  var ARITHMETIC = ['+', '-', '*', '/'];
  var FUNCTIONS = ['log', 'pow', 'sqrt', 'sin', 'cos', 'tan', 'cotg'];

  var calculate = function(input) {
    //console.log('Input:');
    //console.log(input);


    var splited = splitInput(input);
    //console.log('Splited:');
    //console.log(splited);
    if (splited === false) {
      return false;
    }

    var rpn = convertToRPN(splited);
    //console.log('RPN:');
    //console.log(rpn);    
    if (rpn === false) {
      return false;
    }

    var result = calculateWithReversePolishNotation(rpn);
    //console.log('Result:');
    //console.log(result);

    return result;
  };

  var convertToRPN = function(input) {

    var stack = [],
        queue = [],
        number,
        errorFound = false;

    input.forEach(function(token) {
      //console.log(token);

      if (isNumeric(token)) {
        queue.push(token);
      }
      else if (FUNCTIONS.indexOf(token) > -1) {
        stack.push(token);
      }
      else if (token === ',') {
        if (stack.indexOf('(') === -1 || stack.length === 0) {
          console.error('Invalid function separator');
          errorFound = true;
          return false;
        }

        while(stackTop(stack) !== '(') {
          queue.push(stack.pop());
        }
      }
      else if (ARITHMETIC.indexOf(token) > -1) {
        while(stack.length > 0 && ARITHMETIC.indexOf(stackTop(stack)) > -1 && checkPrecedence(token) <= checkPrecedence(stackTop(stack))) {
          queue.push(stack.pop());
        }

        stack.push(token);
      }
      else if (token === '(') {
        stack.push(token);
      }
      else if (token === ')') {
        if (stack.indexOf('(') === -1 || stack.length === 0) {
          console.error('Stack has no (');
          errorFound = true;
          return false;
        }        

        while(stack.length > 0 && stackTop(stack) !== '(') {
          queue.push(stack.pop());
        }
        stack.pop();

        if (FUNCTIONS.indexOf(stackTop(stack)) > -1 ) {
          queue.push(stack.pop()); 
        }
      }
    });

    while (stack.length > 0) {
      if (BRACKETS.indexOf(stackTop(stack)) > -1) {
        console.error('Invalid expression');
        errorFound = true;
        return false;
      }
      queue.push(stack.pop());
    }

    return errorFound === true ? false : queue;
  };

  var calculateWithReversePolishNotation = function(queue) {
    
    var stack = [];
    var errorFound = false;

    queue.forEach(function(token) {
      if (isNumeric(token)) {
        stack.push(token);
      }
      else if (ARITHMETIC.indexOf(token) > -1 || FUNCTIONS.indexOf(token) > -1) {
        if (token === '+' || token === '*') {
          if (stack.length < 2) {
            console.error('Not enough arguments');
            errorFound = true;
            return false;
          }

          var fisrtArgument = stack.pop(),
              secondArgument = stack.pop();

          stack.push(eval(fisrtArgument + token + secondArgument));
        }
        else if (token === '-' || token === '/') {
          if (stack.length < 2) {
            console.error('Not enough arguments');
            errorFound = true;
            return false;
          }

          var fisrtArgument = stack.pop(),
              secondArgument = stack.pop();
          stack.push(eval(secondArgument + token + fisrtArgument));
        }
        else if (token === 'pow') {
          if (stack.length < 2) {
            console.error('Not enough arguments');
            errorFound = true;
            return false;
          }

          var fisrtArgument = stack.pop(),
              secondArgument = stack.pop();
          stack.push(Math.pow(secondArgument, fisrtArgument));
        }
        else if (token === 'sqrt' || token === 'sin' || token === 'cos' || token === 'tg') {
          if (stack.length < 1) {
            console.error('Not enough arguments');
            errorFound = true;
            return false;
          }

          var fisrtArgument = stack.pop();
          stack.push(eval('Math.'+token+'('+fisrtArgument+')'));
        }
        else if (token === 'log') {
          if (stack.length < 2) {
            console.error('Not enough arguments');
            errorFound = true;
            return false;
          }

          var fisrtArgument = stack.pop(),
              secondArgument = stack.pop();
          stack.push(Math.log(fisrtArgument, secondArgument));
        }
        else if (token === 'cotg') {
          if (stack.length < 1) {
            console.error('Not enough arguments');
            errorFound = true;
            return false;
          }

          var fisrtArgument = stack.pop();
          stack.push(1/Math.tan(fisrtArgument));
        }
      }
    });

    if (stack.length !== 1 || errorFound) {
      console.error('Invalid result');
      return false;
    }
    else  {
      return stack.pop();
    }
  };

  /**
   * Utils
   */
  function splitInput(input) {
    var trimmed = input.replace(/\s/g,''),
        splited = [],
        number = '';

    var i, currentChar;
    for (i=0; i<trimmed.length; i++) {
      currentChar = trimmed[i];

      if (currentChar === '-' && (i === 0 || trimmed[i-1] === ',' || trimmed[i-1] === '(')) {
        // We have a negative number on the first poistion
        //console.log('Starting a negative number: ' + currentChar);
        number += currentChar;
      }
      else if (isNumeric(currentChar) || currentChar === '.') {
        // We have a digit or a dot
        //console.log('Adding a digit to a number: ' + currentChar);
        number += currentChar;
      }
      else if (!isNumeric(currentChar) && currentChar !== '.' && number.length > 0) {
        //console.log('Finishing a number: ' + number);
        splited.push(number);
        number = '';
        //i--;
      }
      
      if (number.length === 0) {
        //console.log('Continue with sign check');
        // Check for brackets
        if (BRACKETS.indexOf(currentChar) > -1) {
          //console.log('Pushing a bracket: ' + currentChar);
          splited.push(currentChar);
        }
        // Check for arithmetic operators 
        else if (ARITHMETIC.indexOf(currentChar) > -1) {
          //console.log('Pushing an arithmetic: ' + currentChar);
          splited.push(currentChar);
        }
        // For 3 letter functions
        else if (i+2 < trimmed.length && FUNCTIONS.indexOf(trimmed.substr(i, 3)) > -1) {
          //console.log('Pushing a function 3: ' + trimmed.substr(i, 3));
          splited.push(trimmed.substr(i, 3));
          i += 2;
        }
        // For 4 letter functions
        else if (i+3 < trimmed.length && FUNCTIONS.indexOf(trimmed.substr(i, 4)) > -1) {
          //console.log('Pushing a function 4: ' + trimmed.substr(i, 4));
          splited.push(trimmed.substr(i, 4));
          i += 3;
        }
        else if (currentChar === ',') {
          //console.log('Pushing a separator: ' + currentChar);
          splited.push(currentChar);
        }
        else if (currentChar === 'e') {
          //console.log('Pushing constant E: ' + Math.E);
          splited.push(Math.E);
        }
        else if (i+1 < trimmed.length && trimmed.substr(i, 2) === 'pi') {
          //console.log('Pushing constant PI: ' + Math.PI);
          splited.push(Math.PI);
          i++;
        }
        else {          
          console.error('Invalid expression');
          return false;
        }
      }
    }

    if (number.length > 0) {
      splited.push(number);
    }

    return splited;
  }

  function isNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
  }

  function checkPrecedence(operator) {
    if (operator === '+' || operator === '-') 
      return 1;
    else return 2;
  }

  function stackTop(stack) {
    return stack[stack.length-1];
  }

  this.calculate = calculate;
});