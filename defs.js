// should they be symbols or a specific type of object?
var add_symbol = CL.createSymbol("+");
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

// ref!!!
var add_function = CL.createFunction();
add_function.set_function(function (args) {

	if (!isArray2(args)) {
		console.log("Error: the function was expecting an array.");
		return false;
	}

	console.log("Add function called");
	console.log("Arguments: " + args.toString());

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

add_symbol.set_function(add_function);