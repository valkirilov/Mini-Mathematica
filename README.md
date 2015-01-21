Mini-Mathematica
======================

My Course Project for the Structures-of-Data-and-Algorythms course at FMI (Sofia University)
The calculator is using the Shunting Yard algorythm and RPN.

Supports:

	- arithmetic: + - * /
	- advanced - pow, sqrt, log
	- trigonometric - sin, cos, tan, cotg

# Demo
  [http://valkirilov.github.io/Mini-Mathematica/](http://valkirilov.github.io/Mini-Mathematica/)
  
## Examples

- 1 + 2 - 3 * 4 / 5 = 0.6000000000000001
- ((1+2)*(3+4))/(5+6)*7/8 = 1.6704545454545454
- (1+2) * pow(sqrt(4),log(10,50)) = 45.160373288900864

# Setup

    git clone https://github.com/valkirilov/Mini-Mathematica.git
    npm install
    bower install

# Run

    grunt

    > Running "connect:server" (connect) task
	> Started connect web server on http://0.0.0.0:8000

