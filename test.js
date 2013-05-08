//testInit();
//testList();
//testNestedList();
//testNestedList2();
//testNestedParse();
//testParse();
//testNestedParse();
//testNestedParse2();
//testNestedParse3();
//testParsingNumbers();
//testParsingOperators();
//testEval1();

/*** tests ***/

function testEval1() {
	var test_str = "(+ 5 4)";
	var parsed_list = CL.parse(test_str);
	console.log(parsed_list);
	var result = CL.eval(parsed_list);
	
	console.log(CL.printCLObject(result));
}

function testParsingOperators() {
	var test_str = "(+ 5 3)";
	var result = CL.parse(test_str);

	CL.printList(result);
}

function testParsingNumbers() {
	CL.createSymbol("a");
	CL.createSymbol("b");
	CL.createSymbol("c");
	CL.createSymbol("d");
	CL.createSymbol("e");

	var test_str = "(a b 3 d 54)";
	var result = CL.parse(test_str);

	CL.printList(result);
}

function testParse() {
	CL.createSymbol("a");
	CL.createSymbol("b");
	CL.createSymbol("c");
	CL.createSymbol("d");
	CL.createSymbol("e");

	var test_str = "(a b c d e)";
	var result = CL.parse(test_str);

	CL.printList(result);
}

function testNestedParse() {
	CL.createSymbol("a");
	CL.createSymbol("b");
	CL.createSymbol("c");
	CL.createSymbol("d");
	CL.createSymbol("e");

	var test_str = "(a b (c d) e)";
	var result = CL.parse(test_str);

	CL.printList(result);
}

function testNestedParse2() {
	CL.createSymbol("aa");
	CL.createSymbol("bb");
	CL.createSymbol("cc");
	CL.createSymbol("dd");
	CL.createSymbol("ee");
	CL.createSymbol("ff");
	CL.createSymbol("gg");
	
	var test_str = "(aa (bb cc) dd (ee ff) gg)";
	var result = CL.parse(test_str);

	CL.printList(result);
}

function testNestedParse3() {
	CL.createSymbol("aa");
	CL.createSymbol("bb");
	CL.createSymbol("cc");
	CL.createSymbol("dd");
	CL.createSymbol("ee");
	CL.createSymbol("ff");
	CL.createSymbol("gg");
	
	var test_str = "(aa (bb cc (dd ee) ff) gg)";
	var result = CL.parse(test_str);

	CL.printList(result);
}

function testList() {
	var a = CL.createSymbol("a");
	var b = CL.createSymbol("b");
	var c = CL.createSymbol("c");
	var d = CL.createSymbol("d");
	var e = CL.createSymbol("e");

	var last = CL.cons(e, CL.nil);
	var fourth = CL.cons(d, last)
	var third = CL.cons(c, fourth)
	var second = CL.cons(b, third);
	var first = CL.cons(a, second);

	CL.printList(first);
}

function testNestedList() {

	var a = CL.createSymbol("a");
	var b = CL.createSymbol("b");
	var c = CL.createSymbol("c");
	var d = CL.createSymbol("d");
	var e = CL.createSymbol("e");

	var first = CL.cons(a, CL.nil);
	var second = CL.cons(b, CL.nil);

	var first_a = CL.cons(c, CL.nil);
	var second_a = CL.cons(d, CL.nil);

	var third = CL.cons(CL.nil, CL.nil);
	var fourth = CL.cons(e, CL.nil);

	first.setCdr(second);
	second.setCdr(third);
	third.setCdr(fourth);
	third.setCar(first_a);
	first_a.setCdr(second_a);

	CL.printList(first);
}

function testNestedList2() {

	var first = CL.cons(a, CL.nil);
	var second = CL.cons(b, CL.nil);

	var first_a = CL.cons(c, CL.nil);
	var second_a = CL.cons(d, CL.nil);
	var third_a = CL.cons(CL.nil, CL.nil);

	var first_b = CL.cons(e, CL.nil);
	var second_b = CL.cons(f, CL.nil);

	var third = CL.cons(CL.nil, CL.nil);
	var fourth = CL.cons(g, CL.nil);

	first.setCdr(second);
	second.setCdr(third);
	third.setCdr(fourth);

	third.setCar(first_a);
	first_a.setCdr(second_a);
	second_a.setCdr(third_a);

	third_a.setCar(first_b);
	first_b.setCdr(second_b);

	CL.printList(first);
}

/*** utility functions ***/

CL.printSymbols = function () {
	for (var symbol_name in CL.symbols) {
		console.log("Symbol: " + CL.symbols[symbol_name]);
	}
}