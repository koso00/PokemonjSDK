window.onerror = function (errorMsg,url, lineNumber) {
$("#bsod").show();
$("main").remove();
$('<p style="font-size: 0.8em;  margin-bottom: 1em;">' + errorMsg + ' on line ' + lineNumber +  '</span></p>').appendTo("#errorhook");
document.title = "The SDK ran into a problem, reload";
}


console['log'] = function(msg){
	$.Notify({
	caption: 'Console log',
	content: msg,
	type: 'success'
});
}
