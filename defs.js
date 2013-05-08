CL.createSymbol("+");
CL.createSymbol("-");
CL.createSymbol("*");
CL.createSymbol("/");

CL.createSymbol("quote");
CL.createSymbol("atom");
CL.createSymbol("eq");
CL.createSymbol("car");
CL.createSymbol("cdr");
CL.createSymbol("cons");
CL.createSymbol("cond");
CL.createSymbol("lambda");
CL.createSymbol("if");
CL.createSymbol("setf");

// + function
var add_function = CL.createFunction(function (args) {

	if (!isArray2(args)) {
		console.log("Error: the function '+' was expecting an array.");
		return false;
	}

	var sum = 0;
	var i;
	for (i = 0; i < args.length; i++) {
		if (!args[i].is_number()) {
			console.log("Error: argument passed to '+' is not a number.");
			return false;
		}
		sum += args[i].number(); // add check to see if the value returned is a JS number
	}
	return CL.createNumber(sum);
});

CL.symbols["+"].set_function(add_function);

// - function
var subtract_function = CL.createFunction(function (args) {

	if (!isArray2(args)) {
		console.log("Error: the function '-' was expecting an array.");
		return false;
	}

	if (args.length === 1) {
		if (!args[0].is_number()) {
			console.log("Error: the argument to '-' is not a number.");
			return false;
		} else {
			return CL.createNumber(-args[0].number());	
		}

	} else if (args.length > 1) {

		var result = args[0].number();

		var i;
		for (i = 1; i < args.length; i++) {
			if (!args[i].is_number()) { // !args[i].hasOwnProperty("is_number") || 
				console.log("Error: the argument to '-' is not a number.");
				return false;
			}
			result -= args[i].number();
		}

		return CL.createNumber(result);

	} else {
		console.log("Error: invalid number of arguments to '-': " + args.length);
		return false;
	}

});

CL.symbols["-"].set_function(subtract_function);

// * function
var multiply_function = CL.createFunction(function (args) {

	if (!isArray2(args)) {
		console.log("Error: the function '*' was expecting an array.");
		return false;
	}

	if (args.length < 1) {
		console.log("Error: wrong number of arguments to '*': " + args.length);
		return false;
	}

	var product = 1;

	var i;
	for (i = 0; i < args.length; i++) {
		if (!args[i].is_number()) {
			console.log("Error: the argument to * is not a number.");
			return false;
		}
		product *= args[i].number();
	}

	return CL.createNumber(product);

});

CL.symbols["*"].set_function(multiply_function);

// '/' function
var divide_function = CL.createFunction(function (args) {

	if (!isArray2(args)) {
		console.log("Error: the function '/' was expecting an array.");
		return false;
	}

	if (args.length === 1) {
		if (!args[0].is_number()) {
			console.log("Error: the argument to '/' is not a number.");
			return false;
		} else {
			return CL.createNumber(1/args[0].number());	
		}

	} else if (args.length > 1) {

		var result = args[0].number();

		var i;
		for (i = 1; i < args.length; i++) {
			if (!args[i].is_number()) {
				console.log("Error: the argument to '/' is not a number.");
				return false;
			}
			result = result/args[i].number();
		}

		return CL.createNumber(result);

	} else {
		console.log("Error: invalid number of arguments to '/': " + args.length);
		return false;
	}

});

CL.symbols["/"].set_function(divide_function);