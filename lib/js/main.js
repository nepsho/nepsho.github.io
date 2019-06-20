if(document.documentElement.lang="en"){
	$("[lang=hi]").addClass("hide");
}else{
	$("[lang=en]").addClass("hide");
}

function changeLang(lang){
	if(lang == 'hi'){
		localStorage.setItem('lang','hi');
	} else if(lang == 'en'){
		localStorage.setItem('lang','en');
	}
	$("[lang="+lang+"]").removeClass("hide");
	$(".langf").not("[lang="+lang+"]").addClass("hide");
}

function getLanguage(){
	var lang = localStorage.lang;
	console.log(lang);
	if(lang && lang == 'hi'){
		changeLang('hi');
	} else if(lang && lang == 'en') {
		changeLang('en');
	}
}

getLanguage();

$( document ).ready(function() {
	$("#nav-menu-mobile-btn").on("click",function(){
		$("#nav-items-container").toggleClass("nav-items");
	});
});