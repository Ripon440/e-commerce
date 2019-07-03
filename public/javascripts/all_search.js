$(document).ready(function(){
    $('#search').keyup(function(){
        var search = $(this).val();
        //console.log('status details : '+ search);

    if(search != ''){
        $.ajax({
            url: "/search/",
            type: "post",
            crossDomain:true, 
            dataType: "json",
            data:{category:search},
            success: function(data){
               //console.log('inside data');
               //console.log(data);
            //    var searchResult = JSON.stringify(data);
            //    console.log(searchResult);
               
              
               //$('#test').html(country);
               var details = '';
               details += "<ul class='list-group' id='searchElement'>";
               if(data != ''){
                    for(var i = 0 ; i < data.length ; i++){
                            details += "<a href='/product-from-searchbar/"+ data[i].id +"' class='list-group-item'>" + data[i].title+" " + data[i].category + " "+ data[i].gender +"</a>";
                            //details += "<input type='text' value='"+data[i].categoryName+"' name='searchElement' id='searchElement' ";
                    }
                }else{
                    details += "<li class='list-group-item'>Product not found</li>";
                }
               details += " </ul>";
               $('#searchResult').fadeIn();
               $('#searchResult').html(details);
            },
            error:function(error){
               console.log('error thrown');
            }
        });
    }else{
        $('#searchResult').fadeOut();
        $('#searchResult').html("");
        console.log('empty filed!');
    }
        // var image = '' ;
        // image += "<img src=" + image_path + " alt='university image' style='width:300px;height:300px;'>";
        // $('#search-result').html(image);
    });
/*
    $(document).on('click','a',function(){
        var v = $(this).text();
        console.log('value: ' + v);
        $('#search').val($(this).text());
        $('#searchResult').fadeOut();
        $('#finalSearchResult').html("it work");



        if(v != ''){
            $.ajax({
                url: "/fromAll",
                type: "post",
                crossDomain:true, 
                dataType: "json",
                data:{category:v},
                success: function(data){
                   console.log('inside data');
                   console.log();
                //    var searchResult = JSON.stringify(data);
                //    console.log(searchResult);
                   
                  
                   //$('#test').html(country);
                   var details = '';
                   details += "<ul class='list-group' id='searchElement'>";
                   if(data != ''){
                        for(var i = 0 ; i < data.length ; i++){
                                details += "<li class='list-group-item'>" + data[i].title + "</li>";
                                //details += "<input type='text' value='"+data[i].categoryName+"' name='searchElement' id='searchElement' ";
                        }
                    }else{
                        details += "<li class='list-group-item'>Not found any product! Try again.</li>";
                    }
                   details += " </ul>";
                   $('#searchResult').fadeIn();
                   $('#searchResult').html(details);
                },
                error:function(error){
                   console.log('error thrown');
                }
            });
        }else{
            // $('#searchResult').fadeOut();
            // $('#searchResult').html("");
            console.log('empty filed!');
        }




    });*/
});