/*** DEFINE CORE OBJECTS ***/

// main object
var CL = {};

// base object for others to inherit from
CL.CLObject = {
	is_nil:      function () { return false },
	is_not_nil:  function () { return true  },
	is_t:        function () { return false },
	is_symbol:   function () { return false },
	is_number:   function () { return false },
	is_cons:     function () { return false },
	is_function: function () { return false	},
	type:        function () { return "CLObject" },
	toString:    function () { return "[CLObject]" }
}

// CL function prototype
CL.CLFunction             = Object.create(CL.CLObject);
CL.CLFunction.is_function = function () { return true };
CL.CLFunction.type        = function () { return "CLFunction" };

// CL number prototype
CL.CLNumber           = Object.create(CL.CLObject);
CL.CLNumber.is_number = function () { return true; };
CL.CLNumber.type      = function () { return "CLNumber"; };

// cons cell prototype
CL.CLCons         = Object.create(CL.CLObject);
CL.CLCons.is_cons = function () { return true };
CL.CLCons.type    = function () { return "CLCons" };

// symbol prototype
CL.CLSymbol           = Object.create(CL.CLObject);
CL.CLSymbol.is_symbol = function () { return true };
CL.CLSymbol.type      = function () { return "CLSymbol" };

// collection of all symbols
CL.symbols = {}; // imp. namespaces?

CL.toplevel = []; // or list?

// NIL
CL.nil            = Object.create(CL.CLObject);
CL.nil.is_nil     = function () { return true  };
CL.nil.is_not_nil = function () { return false };
CL.nil.toString   = function () { return "NIL" };
CL.nil.is_symbol  = function () { return true  }; // TODO: implement this correctly

CL.symbols["nil"] = CL.nil; // should it be a symbol?

// T
CL.t           = Object.create(CL.CLObject);
CL.t.is_t      = function () { return true };
CL.t.toString  = function () { return "T"  };
CL.t.is_symbol = function () { return true }; // TODO: implement this correctly

CL.symbols["t"] = CL.t; // should it be a symbol?

/*** DEFINE CONSTRUCTORS FOR CL OBJECTS ***/

// create a new symbol
CL.createSymbol = function (symbol_name) {
	if (!CL.symbols.hasOwnProperty(symbol_name)) {
		// symbol does not yet exist
		
		var sym_name = symbol_name;
		var sym_package = CL.nil;
		var sym_value = CL.nil;
		var sym_function = CL.nil;
		var sym_plist = CL.nil;

		var sym = Object.create(CL.CLSymbol);

		sym.name = function () { return sym_name };
		sym.pckg = function () { return sym_package }; //check if problems with reserved keyword
		sym.value = function () { return sym_value };
		sym.func = function () { return sym_function };
		sym.property_list = function () { return sym_plist };

		sym.value = function () { return sym_value };
		sym.set_value = function (value) { sym_value = value };

		sym.func = function () { return sym_function };
		sym.set_function = function (f) {
			if (!f.is_function()) {
				console.log("Error: trying to set symbol's function pointer to something other than a function.");
				return false;
			} else {
				sym_function = f;
				return true;
			}
		};
		sym.has_function = function () { return !sym_function.is_nil() };

		sym.is_symbol = function () { return true };
		sym.toString = function () { return sym_name.toUpperCase() };

		CL.symbols[symbol_name] = sym;
		return sym;

	} else {
		// symbol already exists
		console.log("The symbol already exists: " + symbol_name);
		return CL.symbols[symbol_name];
	}
}

// create a new function
CL.createFunction = function (fun) {

	var assoc_func = CL.nil;

	if (typeof fun === 'function') { 
		assoc_func = fun; 
	} else {
		console.log("Error: object passed to createFunction is not a valid JavaScript function.");
		return false;
	}

	var f = Object.create(CL.CLFunction);

	f.set_function = function (f) {
		if (!typeof f === 'function') {
			console.log("Error: Argument to set_function is not a JavaScript function object.");
			return false;
		}
		assoc_func = f;
	};

	f.func = function () {
		return assoc_func;
	};

	f.call = function (args) {
		// check the argument is an array
		if (!(args && typeof args === 'object' && args.constructor === Array)) {
			console.log("Error: argument to the function is not an array;");
			return false;
		}
		return assoc_func(args);
	};

	f.toString = function () {
		return "CLFunction";
	};

	return f;
}

// create a new number object
CL.createNumber = function (number) {

	var num = number;

	var n = Object.create(CL.CLNumber);
	n.number = function () { return num };
	n.toString = function () { return num + "" };

	return n;
}

// convenience function, see if needed
CL.create = function (type, arg) {

	if (type === "symbol") {
		// TODO: check type of arg
		return CL.createSymbol(arg);
	} else if (type === "function") {
		// TODO: check type of arg
		return CL.createFunction(arg);
	} else if (type === 'number') {
		// TODO: check type of arg
		return CL.createNumber(arg);
	} else {
		console.log("Error: invalid type passed to 'create' function.");
		return false;
	}

};

// create a new cons cell
CL.cons = function cons(first, second) {

	var a = first;
	var b = second;

	// if arguments are undefined set them to nil (test!)
	if (!first)  a = CL.nil;
	if (!second) b = CL.nil;

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

	c.toString = function () { //test this
		return CL.listToString(c);
	}

	return c;

};

/*** UTILITIES ***/

CL.isCLObject = function (obj) {
	return CL.CLObject.isPrototypeOf(obj);
};

// find an existing symbol or create it
CL.findSymbol = function (sym) {
	if (CL.symbols.hasOwnProperty(sym)) {
		return CL.symbols[sym];
	}
	else {
		console.log("Symbol not found: " + sym + ". Creating it.");
		return CL.createSymbol(sym);
	}
};

/*** CORE EVAL FUNCTION ***/

CL.eval = function eval(obj, quoted) {

	if (!obj && typeof obj === 'undefined') {
		console.log("Error: object passed to eval is undefined.");
		return false;
	} else if (!CL.isCLObject(obj)) {
		console.log("Error: object passed to eval is not a valid CL object.");
	}

	// a number evaluates to itself
	if (obj.is_number()) {
		return obj;

	// a symbol evaluates to the value it contains
	} else if (obj.is_symbol()) {
		return obj.value();

	// nil evaluates to itself
	} else if (obj.is_nil()) {
		return CL.nil;

	// a cons cell
	} else if (obj.is_cons()) {
		// if the list is unquoted, evaluate normally
		if (!quoted) {

			if (!obj.car().is_symbol()) {
				console.log("Error: first element of list does not contain a symbol.");
				return false;
			} else if (!obj.car().has_function()) {
				console.log("Error: symbol in first position has no associated function.");
				return false;
			} else {
				var func = obj.car().func(); // CLFunction object representing the function to be called

				if (!func || !func.is_function()) {
					console.log("Error: Was expecting a CLFunction object.");
					return false;
				}

				var current_cons = obj.cdr();

				if (current_cons.is_nil()) { // might actually happen some times, should check with the function
					console.log("Error: function called with no arguments.");
					return false;
				}

				// place all other elements in the list into the arguments array
				var args = [];
				while (current_cons.is_not_nil()) {
					args.push(eval(current_cons.car())); // evaluate each argument and place it into the array
					current_cons = current_cons.cdr();
				}

				return func.call(args);
			}
			
		// if the list is quoted, do not evaluate the first element as a function
		} else {

		}
		
	} else {
		console.log("Error: argument to eval is invalid.");
		return false;
	}
}

/*** READING AND PARSING FUNCTIONS ***/

CL.read = function (input) {
	return CL.parse(input);
};

// create a buffer for the parser
CL.createBuffer = function (input) {

	if (typeof input !== 'string') {
		console.log("Error: argument to createBuffer is not a string.");
		return false;
	}

	var buffer = input;

	return {
		consume: function () {
			var c = buffer.substr(0,1); // get first character from buffer
			buffer = buffer.substring(1); // remove first character from buffer
			return c;
		},
		is_empty: function () {
			return buffer === ""; // or buffer is not a string, or add check before
		},
		contents: function () {
			return buffer;
		},
		// should find better solution
		prepend: function(str) {
			buffer = str + buffer;
		}
	}
}

// wrapper function for the parser
CL.parse = function (input) {
	var buffer = CL.createBuffer(input);
	return CL.parseString(buffer);
}

// parse a string and turn it into a list
CL.parseString = function parseString(buffer) {

	var building = "none"
	var token = ""
	var first_cons = CL.nil;
	var current_cons = CL.nil;
	var parsing_list = false;

	var parse_number = /^\d+$/
	var parse_letter = /^[a-z]$/i
	var parse_operators = /^[\+\-*\/=]$/

	var attachCons = function attachCons(obj) {
		if (current_cons.is_nil()) {
			// first object in the list
			first_cons = CL.cons(obj, CL.nil);
			current_cons = first_cons;
		} else {
			// another object in the list, so attach to the last one
			var cons = CL.cons(obj, CL.nil)
			current_cons.setCdr(cons);
			current_cons = cons;
		}
	}

	var i;
	for (i = 0; i < 1000; i++) { // loop iterations to prevent an infinite loop, might remove afterwards

		if (buffer.is_empty()) {
			console.log("Error: the buffer run out and a list was left incomplete."); // could use this to do multi-line expressions
			break;
		} else {
			var current_char = buffer.consume();	
		}

		// if the character is a number [0-9]
		if (parse_number.test(current_char)) {
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

		// if the character is a letter [a-zA-Z]
		else if (parse_letter.test(current_char)) {
			if (building === "none") {
				// start building new symbol
				building = "symbol";
				token = current_char;

			} else if (building === "symbol") {
				// continue building symbol
				token += current_char;

			} else {
				// error when building symbol
				console.log("Unexpected letter \'" + current_char + "\' found when building: " + building);
				break;
			}
		}

		// if the character is an operator [+-*/]
		else if (parse_operators.test(current_char)) {
			if (building === "none") {
				attachCons(CL.findSymbol(current_char));
			}
			else {
				console.log("Unexpected character: " + current_char);
				break;
			}
		}

		// if the character is a left parentheses (
		else if (current_char === "(") {
			if (building === "none" && !parsing_list) {
				// begin new list
				parsing_list = true;

			} else if (building === "none" && parsing_list) {
				// found nested list, parse it recursively
				buffer.prepend("("); // necessary?
				var cons = CL.cons(parseString(buffer), CL.nil); // recursive call
				current_cons.setCdr(cons);
				current_cons = cons;
			}
			else {
				console.log("Unexpected character '('");
				break;
			}
		}

		// if the character is a right parentheses )
		else if (current_char === ")") {
			if (building === "symbol") {
				// finished parsing symbol

				attachCons(CL.findSymbol(token));

				token = "";
				building = "none";

				return first_cons; // finished parsing list
			}
			else if (building === "number") {
				// finished parsing number

				attachCons(CL.createNumber(parseInt(token)));

				token = "";
				building = "none";

				return first_cons; // finished parsing list

			} else if (building === "none" && parsing_list) {
				return first_cons;
			} else {
				console.log("Error: unexpected \')\'");
				break;
			}
		}

		// if the character is a space or comma
		else if (current_char === " " || current_char === ",") {
			if (building === "symbol") {
				// finished parsing symbol

				attachCons(CL.findSymbol(token));
				
				token = "";
				building = "none";
			}
			else if (building === "number") {
				// finished parsing number

				attachCons(CL.createNumber(parseInt(token)));

				token = "";
				building = "none";
			}
			// if anything else, ignore it
		}

		// if the character is invalid
		else {
			console.log("Invalid character: " + current_char);
			break;
		}
	}
}

/*** PRINTING FUNCTIONS ***/

CL.print = function print(obj) {

	if (!CL.isCLObject(obj)) {
		return "[invalid JavaScript object]";
	} else {
		return obj.toString();
	}

};

// turn list into a string
CL.listToString = function listToString(cons) {
	var str = "";
	if (cons.is_cons()) {
		var current_cons = cons;
		var its = 0;
		str += "("
		while (true) {
			if (current_cons.is_nil()) {
				str += ")";
				break;
			} else if (its > 200) { // in case there is no nil
				console.log("Reached max iterations: " + its);
				break;
			} else {
				//console.log(current_cons.toString());
				if (current_cons.car().is_cons()) {
					console.log("Recursive call in listToString");
					str += listToString(current_cons.car()); // recursive call
				} else {
					if (str.substring(str.length-1) === "(") {
						str += current_cons.car().toString();
					} else {
						str += " " + current_cons.car().toString();		
					}
				}
				current_cons = current_cons.cdr();
			}
			its += 1;
		}
		return str;
	} else {
		console.log("Error: argument to listToString is not a cons cell.");
		return "";
	}
}