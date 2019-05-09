if(document.documentElement.lang="en"){
	$("[lang=hi]").addClass("hide");
}else{
	$("[lang=en]").addClass("hide");
}

function changeLang(lang){
	console.log("[lang="+lang+"]");
	$("[lang="+lang+"]").removeClass("hide");
	$(".langf").not("[lang="+lang+"]").addClass("hide");
}

$( document ).ready(function() {
	$("#nav-menu-mobile-btn").on("click",function(){
		$("#nav-items-container").toggleClass("nav-items");
	});
});