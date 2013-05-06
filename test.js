function testList() {
	var a = CL.createSymbol("a");
	var b = CL.createSymbol("b");
	var c = CL.createSymbol("c");
	var d = CL.createSymbol("d");
	var e = CL.createSymbol("e");

	//CL.printSymbols();

	var last = CL.cons(e, CL.nil);
	var fourth = CL.cons(d, last)
	var third = CL.cons(c, fourth)
	var second = CL.cons(b, third);
	var first = CL.cons(a, second);

	CL.printList(first);
}

testList();