$(function () {

	$("#prompt-inner").keypress(function (e) {
		if (e.which === 13) {
			e.preventDefault();
			var input = $("#prompt-inner").text();
			printToConsole("<span style=\"margin-right:10px;\">></span>" + input);
			
			var parsed_list = CL.read(input); // read
			var evaled_list = CL.eval(parsed_list); // eval

			printToConsole(CL.print(evaled_list)); // print

			$("#prompt-inner").text("");
		}
	});

	$("#prompt").click(function (e) {
		$("#prompt-inner").focus();
	});

	$("body").click(function () {
		$("#prompt-inner").focus();
	});

	var printToConsole = function printToConsole(string) {
		$("#terminal").append("<div>" + string + "</div>");
	};

});