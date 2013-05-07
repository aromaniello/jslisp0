$(function () {

	$("#prompt-inner").keypress(function (e) {
		if (e.which === 13) {
			e.preventDefault();
			var input = $("#prompt-inner").text();
			CL.print("<span style=\"margin-right:10px;\">></span>" + input);
			CL.read(input);
			var output = "";
			CL.print(output);
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