// main object
var CL = {};

// base object for others to inherit from
CL.CLObject = {
	is_nil: function () { return false; },
	is_symbol: function () { return false },
	is_number: function () { return false },
	is_cons: function () { return false },
	is_function: function () { return false	},
	type: function () { return "CLObject" },
	name: function () { return "CLObject" },
	toString: function () { return "GenericCLObject" }
}

// create CL function prototype
var CLF = Object.create(CL.CLObject);
CLF.is_function = function () { return true; }; // remove ; if works
CLF.type = function () { return "CLFunction"; };
CL.CLFunction = CLF;

// create CL number prototype
var CLN = Object.create(CL.CLObject);
CLN.is_number = function () { return true; };
CLN.type = function () { return "CLNumber"; };
CL.CLNumber = CLN;

CL.toplevel = []; // or list?

function displayObject(obj) {
	console.log("Displaying object properties:");
	for (a in obj) {
		console.log(a);
	}
}

// create cons cell prototype
var CLC = Object.create(CL.CLObject);
CLC.is_cons = function () { return true };
CLC.type = function () { return "CLCons" };
CL.CLCons = CLC;

// create symbol prototype
var CLS = Object.create(CL.CLObject);
CLS.is_symbol = function () { return true };
CLS.type = function () { return "CLSymbol" };
CL.CLSymbol = CLS;

// namespace?
CL.symbols = {}

CL.createSymbol = function (symbol_name) {
	if (!CL.symbols.hasOwnProperty(symbol_name)) {
		// symbol does not yet exist
		
		var sym_name = symbol_name;
		var sym_package = "pckg";
		var sym_plist = "plist";
		var sym_function = "func";

		var sym = Object.create(CL.CLSymbol);

		sym.name = function () { return sym_name };
		sym.pckg = function () { return sym_package }; //check if problems with reserved keyword
		sym.property_list = function () { return sym_plist };
		sym.func = function () { return sym_function };
		sym.is_symbol = function () { return true };
		sym.toString = function () { return "CLSymbol[" + sym_name + "]" };

		CL.symbols[symbol_name] = sym;
		return sym;
	}
	else {
		// symbol already exists
		console.log("The symbol already exists: " + symbol_name);
		return CL.symbols[symbol_name];
	}
}

CL.printSymbols = function () {
	for (symbol_name in CL.symbols) {
		console.log("Symbol: " + CL.symbols[symbol_name]);
	}
}

CL.createFunction = function () {
	var f = Objec.create(CL.CLFunction);
}

CL.printList = function (cons) {
	console.log(CL.listToString(cons));
}

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
				if (current_cons.car().is_cons()) {
					str += listToString(current_cons.car());
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

// to create CL objects
// for example functions would be of type CLFunction
// and they themselves have the JS function and know how to call it exactly
CL.create = function () { // could have arguments the type and name, like CL.create("function","setf")

}

CL.print = function (string) {
	$("#terminal").append("<div>" + string + "</div>"); // try to take out from here
}

CL.read = function (input) {
	console.log("parsing input...");
	CL.parse(input);
}

CL.eval = function(list) {

}

CL.createNumber = function (number) {

	var num = number;

	var o = Object.create(CL.CLNumber);
	o.number = function () { return num };
	o.toString = function () { return "CLNumber[" + num + "]" };
	return o;
}

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

}

CL.findSymbol = function (sym) {
	if (CL.symbols.hasOwnProperty(sym)) {
		return CL.symbols[sym];
	}
	else {
		console.log("Symbol not found: " + sym);
	}
}

CL.createBuffer = function (input) {

	var buffer = input; // copy or reference?

	return {
		consume: function () {
			var c = buffer.substr(0,1); // get first character from buffer
			buffer = buffer.substring(1); // remove first character from buffer
			//console.log(buffer);
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

CL.parse = function (input) {
	var buffer = CL.createBuffer(input);
	return CL.parseString(buffer);
}

CL.parseString = function parseString(buffer) {

	var building = "none"
	var token = ""
	var first_cons = CL.nil;
	var current_cons = CL.nil;
	var parsing_list = false;

	var parse_number = /^\d+$/
	var parse_letter = /^[a-z]$/i
	var parse_operators = /^[\+\-*\/=]$/

	var i; //?
	for (i = 0; i < 200; i++) { // can do while(true), but limiting iterations just in case for now
		//var current_char = input.substring(i,i+1); // extract a single character
		if (buffer.is_empty()) {
			console.log("the buffer run out");
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
				var symbol = CL.findSymbol(current_char);
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
				var cons = CL.cons(parseString(buffer), CL.nil);
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

				var symbol = CL.findSymbol(token);

				if (current_cons.is_nil()){
					// this is the first object in the list
					first_cons = CL.cons(symbol, CL.nil);
					current_cons = first_cons;
				} else {
					// this is just another object in the list
					var cons = CL.cons(symbol, CL.nil);
					current_cons.setCdr(cons);
					current_cons = cons;
				}

				token = "";
				building = "none";

				return first_cons; // finished parsing list
			}
			else if (building === "number") {
				// finished parsing number

				var num = CL.createNumber(parseInt(token));

				if (current_cons.is_nil()){
					first_cons = CL.cons(num, CL.nil);
					current_cons = first_cons;
				} else {
					var cons = CL.cons(num, CL.nil)
					current_cons.setCdr(cons);
					current_cons = cons;
				}

				token = "";
				building = "none";

				return first_cons; // finished parsing list
			} else {
				console.log("Unexpected \')\'");
				break;
			}
		}

		// if the character is a space
		else if (current_char === " ") { // could add comma here
			if (building === "symbol") {
				// finished parsing symbol
				
				var symbol = CL.findSymbol(token); // if not exists create? or only under certain circumstances? what in a let?
				// must check if parsing list
				if (current_cons.is_nil()){
					// this is the first object in the list
					first_cons = CL.cons(symbol, CL.nil);
					current_cons = first_cons;
				} else {
					// this is just another object in the list
					var cons = CL.cons(symbol, CL.nil)
					current_cons.setCdr(cons);
					current_cons = cons;
				}
				
				token = "";
				building = "none";
			}
			else if (building === "number") {
				// finished parsing number

				var num = CL.createNumber(parseInt(token));

				if (current_cons.is_nil()){
					first_cons = CL.cons(num, CL.nil);
					current_cons = first_cons;
				} else {
					var cons = CL.cons(num, CL.nil)
					current_cons.setCdr(cons);
					current_cons = cons;
				}

				token = "";
				building = "none";
			}
			// if anything else, ignore it
		}

		// if the character is a comma
		else if (current_char === ",") {
			// ignore, it's whitespace
		}

		// if the character is invalid
		else {
			console.log("Invalid character: " + current_char);
			break;
		}
	}
}