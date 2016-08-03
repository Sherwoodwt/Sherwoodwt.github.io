$(document).ready(function(){
    var dim = 16;
    var size = 500;
    
    function setGrid(){
        var cellSize = size/dim;
        for(var i=0; i<dim;i++){
            var $row = $("<div></div>");
            $row.addClass("row");
            for(var j=0; j<dim; j++){
                var $div = $("<div></div>");
                $div.addClass("cell");
                $div.css("width", cellSize);
                $div.css("height", cellSize);
                $div.css("min-height", cellSize);
                $div.hover(function(){
                    $(this).css("background-color", "#ff0000");
                });
                $row.append($div);
            }
            $("#table").append($row);
        }
    };

    function emptyGrid(){
        $table = $("#table");
        $table.empty();
    };
    
    setGrid();
    $("#reset").click(function(){
        var pro
        do{
            pro = prompt("enter a width");
        }while(isNaN(dim));
        emptyGrid();
        dim = pro;
        setGrid();
    });
});