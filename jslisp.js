if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}

// var CLConsole = {};

var CL = {};

// base object for others to inherit from
CL.CLObject = {
	is_nil: function () { // should change to camelcase?
		return false;
	},
	is_symbol: function () {
		return false;
	},
	is_number: function () {
		return false
	},
	is_cons: function () {
		return false;
	},
	is_function: function () {
		return false;
	},
	type: function () {
		return "CLObject";
	},
	name: function () {
		return "CLObject";
	}
}

// need to add CLObject as prototype
/*
CL.CLFunction = {
	is_function: function () {
		return true;
	},
	type: function () {
		return "CLFunction";
	}
}
*/

var CLF = Object.create(CL.CLObject);
CLF.is_function = function () { return true; }; // remove ; if works
CLF.type = function () { return "CLFunction"; };
CL.CLFunction = CLF;

CL.CLNumber = {
	is_number: function () {
		return true;
	},
	type: function () {
		return "CLNumber";
	}
}

function displayObject(obj) {
	console.log("Displaying object properties:");
	for (a in obj) {
		console.log(a);
	}
}

var CLC = Object.create(CL.CLObject);
CLC.is_cons = function () { return true };
CLC.type = function () { return "CLCons" };
CL.CLCons = CLC;

/*
CL.CLSymbol = {
	is_symbol: function () {
		return true;
	},
	type: function () {
		return "CLSymbol";
	}
}
*/

var CLS = Object.create(CL.CLObject);
CLS.is_symbol = function () { return true };
CLS.type = function () { return "CLSymbol" };
CL.CLSymbol = CLS;

// namespace?
CL.symbols = {}

CL.createSymbol = function (symbol_name) {
	if (!CL.symbols.hasOwnProperty(symbol_name)) {
		// symbol does not already exist
		
		/*
		CL.symbols[symbol_name] = { // make it inherit from a CL object
			"name": symbol_name,
			"package": "pckg",
			"property_list": "plist",
			"function": "func", // will point to a function object
			is_symbol: function () {
				return true;
			}
		}
		*/
		
		// maybe should move all these into a closure
		var sym = Object.create(CL.CLSymbol);
		sym["name"] = symbol_name; // might be better to use other syntax? like sym.name
		sym["package"] = "pckg";
		sym["property_list"] = "plist";
		sym["function"] = "func";
		sym.is_symbol = function () {
			return true;
		}
		CL.symbols[symbol_name] = sym;
		return sym;
	}
	else {
		// symbol already exists
		console.log("The symbol already exists: " + symbol_name);
	}
}

CL.printSymbols = function () {
	for (symbol_name in CL.symbols) {
		console.log("Symbol: " + CL.symbols[symbol_name]);
	}
}

CL.createFunction = function () {
	var func = Objec.create(CL.CLFunction);
}

CL.printList = function(cons) {
	console.log("printing list...");
	if (cons.is_cons()) {
		console.log("Input is a cons cell.");
		var current_cons = cons;
		var its = 0;
		while (true) {
			//displayObject(cons);
			if (current_cons.is_nil()) {
				console.log("Nil reached.");
				break;
			} else if (its > 20) {
				console.log("Reached max iterations: " + its);
				break;
			} else {
				console.log("List element: " + current_cons.car().type() + " " + current_cons.car().name);
				current_cons = current_cons.cdr();
			}
			its++;
		}
	} else {
		console.log("Error: argument to printList is not a cons cell.");
		return false;
	}
}

// to create CL objects
// for example functions would be of type CLFunction
// and they themselves have the JS function and know how to call it exactly
CL.create = function () { // could have arguments the type and name, like CL.create("function","setf")

}

CL.createFunction = function () {

}

CL.print = function (string) {
	$("#terminal").append("<div>" + string + "</div>"); // try to take out from here
}

CL.read = function (input) {
	console.log("parsing input...");
	CL.parse(input);
}

CL.eval = function() {

}

/*
CL.nil = {
	is_nil: function () {
		return true;
	}
}
*/

// NIL
var n = Object.create(CL.CLObject);
n.is_nil = function () { return true };
n.name = function () { return "nil" };
CL.nil = n;

CL.symbols["nil"] = CL.nil;

CL.is_nil = function (obj) {
	if (obj === CL.nil)
		return true;
	else
		return false;
}

CL.is_not_nil = function (obj) {
	return !CL.is_nil(obj);
}

CL.cons = function (first, second) {
	var a = first;
	var b = second;

	var c = Object.create(CL.CLCons);
	c.car = function () { return a };
	c.cdr = function () { return b };

	// could I do without setters?
	c.setCar = function (new_car) {
		a = new_car;
	};

	c.setCdr = function (new_cdr) {
		b = new_cdr;
	}

	return c;

	/*
	return {
		car: function () {
			return a;
		},
		cdr: function () {
			return b;
		},
		is_cons: function () {
			return true;
		}
	}
	*/
}

CL.findSymbol = function (sym) {
	if (CL.symbols.hasOwnProperty(sym)) {
		//console.log("Symbol found: " + sym);
		return CL.symbols[sym];
	}
	else {
		console.log("Symbol not found: " + sym);
	}
}

// should they be symbols or a specific type of object?
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

function extract(string) { // add as method to string
	return string.substring(0,1);
}

CL.parse = function parse(input) {
	var building = "none"
	var token = ""
	var list_level = 0;
	var first_cons = CL.nil;
	var current_cons = CL.nil;

	var parse_number = /^\d+$/
	var parse_letter = /^[a-z]$/i
	var parse_operators = /^[\+\-*\/=]$/

	for (var i=0; i < input.length; i++) {
		var current_char = input.substring(i,i+1); // extract a single character

		// if the character is a number
		if (parse_number.test(current_char)) {
			//console.log("Number matched: " + current_char);
			if (building === "none") {
				building = "number";
				token = current_char;
			}
			else if (building === "number") {
				token += current_char;
			}
			else if (building === "symbol") {
				token += current_char;
			}
		}
		// if the character is a letter
		else if (parse_letter.test(current_char)) {
			//console.log("Letter matched: " + current_char);
			if (building === "none") {
				building = "symbol";
				token = current_char;
				
				var cons = CL.cons(CL.nil,CL.nil);
				current_cons.setCdr(cons);
				current_cons = cons;
			}
			else if (building === "symbol") {
				token += current_char;
			}
		}
		// if the character is an operator
		else if (parse_operators.test(current_char)) {
			//console.log("Operator matched: " + current_char);
			if (building === "none") {
				console.log("Parsed operator: " + current_char);
				var symbol = CL.findSymbol(current_char);
				console.log("Symbol object found: " + symbol["name"]);
			}
			else {
				console.log("Unexpected character: " + current_char);
				break;
			}
		}
		// if the character is a left parentheses
		else if (current_char === "(") {
			console.log("Left parentheses matched: " + current_char);
			if (building === "none") {
				list_level++;
				first_cons = CL.cons(CL.nil,CL.nil);
				current_cons = first_cons;
			}
			else {
				console.log("Unexpected character '('.");
				break;
			}
		}
		// if the character is a right parentheses
		else if (current_char === ")") {
			console.log("Right parentheses matched: " + current_char);
			if (building === "symbol") {
				// finished parsing symbol
				console.log("Parsed symbol: " + token);
				var symbol = CL.findSymbol(token);
				console.log("Symbol object found: " + symbol["name"]); // try symbol.name
				token = "";
				building = "none";
			}
			else if (building === "number") {
				// finished parsing number
				console.log("Parsed number: " + token);
				token = "";
				building = "none";
			}
		}
		// if the character is a space
		else if (current_char === " ") { // could add comma here
			//console.log("Space matched.");
			if (building === "symbol") {
				// finished parsing symbol
				//console.log("Parsed symbol: " + token);
				var symbol = CL.findSymbol(token);
				//console.log("Symbol object found: " + symbol["name"]); // try symbol.name
				current_cons.setCar(symbol);
				//var cons = CL.cons()
				token = "";
				building = "none";
			}
			else if (building === "number") {
				// finished parsing number
				console.log("Parsed number: " + token);
				token = "";
				building = "none";
			}
		}
		// if the character is a comma
		else if (current_char === ",") {
			// ignore, it's whitespace
		}
		// if the character is invalid
		else {
			console.log("Invalid character: " + current_char);
			break;
			//throw {
			//	name: "InvalidCharacterException",
			//	message: "Invalid character: " + current_char
			//}

		}
	}
}