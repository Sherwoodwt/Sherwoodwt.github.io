$(document).ready(function(){
    document.getElementById("textbox").focus();
    
    $(this).keypress(function(ev){
        if(ev.which == 13)
            $("#search").click();
    }); 
    
    $("#search").click(function(){
        var text = $("#textbox").val();
        location.href = "https://www.google.com/#q="+text;
    });
});