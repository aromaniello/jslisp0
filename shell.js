$(function () {

	$("#prompt-inner").keypress(function (e) {
		if (e.which === 13) {
			e.preventDefault();
			var input = $("#prompt-inner").text();
			CL.printString("<span style=\"margin-right:10px;\">></span>" + input);
			//console.log("\"" + input + "\"");

			var parsed_list = CL.read(input);
			//console.log(typeof parsed_list === 'undefined');
			//console.log(parsed_list.toString());
			//CL.printList(parsed_list);

			var evaled_list = CL.eval(parsed_list);
			CL.print(evaled_list);

			$("#prompt-inner").text("");
		}
	});

	$("#prompt").click(function (e) {
		$("#prompt-inner").focus();
	});

	$("body").click(function () {
		$("#prompt-inner").focus();
	});

});