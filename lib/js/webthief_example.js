var server = "https://webgetdemo.herokuapp.com";
// var server = "http://localhost:3000";

var metaFields = [
    "logo",
    "description",
    "title",
    "keywords",
    "subject",
    "copyright",
    "language",
    "robots",
    "revised",
    "abstract",
    "topic",
    "summary",
    "author",
    "designer",
    "reply-to",
    "url",
    "category",
    "site_name",
    "email",
    "country-name",
    "phone_numbe"
];
function enableButtons(){
  $('#get_site_info_btn').removeAttr("disabled");
  $('#get_site_html_btn').removeAttr("disabled");
  stopLoader();
}
function disableButtons(){
  $('#get_site_info_btn').attr("disabled", true);
  $('#get_site_html_btn').attr("disabled", true);
}

function startLoader(){
  $("#init_loading_text").css("display","none");
  $("#main_loader").css("display","block");
}

function stopLoader(){
  $("#main_loader").css("display","none");
}

function resetAllSearch(){
  $(".html_output_container").css("display","none");
  $(".site_info_output_container").css("display","none");
  $(".site_info_table_container").css("display","none");
  $(".site_info_img_container").css("display","none");
  $("#error_container").css("display","none");
}

function server_is_live(status) {
  if(status){
    enableButtons();
    $("#main_loader").css("display","none");
  }
}

function removeEscapeSymbol(html){
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');
    return html
}

function validateUrl(url){
  if(typeof url === "string"){
    if(url.trim().length != 0){
      return true;
    }
  }
  return false;
}

function showError(msg){
  $("#error_msg").text(msg);
  $("#error_container").css("display","block");
}

function createTableHtml(metaObj,field){
    var html = "<tr><td class='table_field_head'>"+field+"</td>";
    if(
        (field && typeof field == "string") &&
        (
          metaObj[field] &&
          (typeof metaObj[field] === 'string') &&
          (metaObj[field].trim().length != 0) 
        )
    ){
        
        html += "<td class='output_found'>"+metaObj[field]+"</td>";

    } else {
      html += "<td class='output_not_found'>not found</td>";
    }
    html += "</tr>";
    return html;
}

function loadSiteLogo(url){
  $('<img/>').attr('src', url).on('load', function() {
    $("#output_logo_container").css("background-image","url("+url+")");
  })
}

function createMetaTableContent(metaObj){
    var html = "";
    $("#output_description").text("This site has no description.");
    $("#output_title").text("This site has no title.");
    $("#output_logo_container").css("background-image","url(../lib/img/nologo.svg)");
    for(var i = 0 ; i < metaFields.length ; i++){
      if(metaFields[i]!="logo"){
        html += createTableHtml(metaObj,metaFields[i]);
      }
      if(metaFields[i] == "description" && metaObj["description"] && metaObj["description"].trim().length!=0){
        $("#output_description").text(metaObj["description"]);
      }
      if(metaFields[i] == "title" && metaObj["title"] && metaObj["title"].trim().length!=0){
        $("#output_title").text(metaObj["title"]);
      }
      if(metaFields[i] == "logo" && metaObj["logo"] && metaObj["logo"].trim().length!=0){
        loadSiteLogo(metaObj['logo']);
      }
    }
    $("#table_inner_body").html(html);
}

function handleImageErr(e){
  var element = e.parentElement.parentElement;
  element.parentNode.removeChild(element);
}

function handleImageLoad(e){
  var w = e.width;
  var h = e.height;
  if(w < 50){
    if(h < 50){
      return handleImageErr(e);
    }
  }
  if(h < 50){
    if(w < 50){
      return handleImageErr(e);
    }
  }
  $(e).css({height:"250px"});
}

function showSiteImages(imagesArr){
  var html = '';
  if(Object.prototype.toString.call(imagesArr) == "[object Array]"){
    for(var i = 0 ; i < imagesArr.length ; i++){
      html += `
      <div class="col-lg-4 col-sm-6">
          <div class="thumbnail site-image-thumbnail">
            <div class="image-gaurd"></div>
            <img src="${imagesArr[i]}" onerror="handleImageErr(this)" onload="handleImageLoad(this)">
           
          </div>
      </div>`;
    }

    if(html.trim().length === 0)
    {
      html += '<center><h1>No images found on this website</h1></center>';
    }
    document.getElementById('show-images-main-row').innerHTML = html;
  } else{
    showError("Something went wrong try after sometime");
  }
}


function getHtml(searchUrl){
    disableButtons();
    startLoader();
    $.ajax({
      type: "POST",
      url: server + "/get_html",
      data:{url:searchUrl},
      success: function(data){
        if(data.success){
            html = removeEscapeSymbol(data.html);
            $("#html_output_box").html(html);
            $(".html_output_container").css("display","block");
            Prism.highlightAll();
        } else {
          showError(data.detail);
        }
        enableButtons();
      },
      error: function (textStatus, errorThrown) {
            enableButtons();
      }
    });
}

function getMeta(searchUrl){
    disableButtons();
    startLoader();
    $.ajax({
      type: "POST",
      url: server + "/get_meta",
      data:{url:searchUrl},
      success: function(data){
        if(!data){
          alert("Something went wrong please try after some time");
        }else{
          if(data.success==false && data.detail){
            showError(data.detail);
          }else{
            createMetaTableContent(data.response);
            $(".site_info_output_container").css("display","block");
            $(".site_info_table_container").css("display","block");
          }
        }
        enableButtons();
      },
      error: function (textStatus, errorThrown) {
          enableButtons();
      }
    });
}

function getImages(searchUrl){
    disableButtons();
    startLoader();
    $.ajax({
      type: "POST",
      url: server + "/get_images",
      data:{url:searchUrl},
      success: function(data){
        if(data.success){
            showSiteImages(data.response);
            $(".site_info_img_container").css("display","block");
        } else {
          showError(data.detail);
        }
        enableButtons();
      },
      error: function (textStatus, errorThrown) {
            enableButtons();
      }
    });
}

$("#get_site_info_btn").on("click",function(){
  var url = $("#urlinput").val();
  if(validateUrl(url)){
    resetAllSearch();
    getMeta(url);
  }else{
    alert("Website url can't be empty");
  }
});

$("#get_site_html_btn").on("click",function(){
  var url = $("#urlinput").val();
  if(validateUrl(url)){
    resetAllSearch();
    getHtml(url);
  }else{
    alert("Website url can't be empty");
  }
});

$("#get_site_images_btn").on("click",function(){
  var url = $("#urlinput").val();
  if(validateUrl(url)){
    resetAllSearch();
    getImages(url);
  }else{
    alert("Website url can't be empty");
  }
});


$.ajax({
      type: "GET",
      url: server,
      success: function(data){
        server_is_live(true);
      },
      error: function (textStatus, errorThrown) {
            server_is_live(false);
      }
});
