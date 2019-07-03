$(document).ready(function(){
    $('#details').on('click', function(){
        var image_path = $("#it").val();
        console.log('status details : '+ image_path);

        // var image = '' ;
        // image += "<img src=" + image_path + " alt='university image' style='width:300px;height:300px;'>";
        // $('#product_image').html(image);
    });

    $('#detai').change(function(){
        var region_name = $(this).val();
        console.log(region_name);
        
        $.ajax({
            type: "POST",
            url: "/search-region/",
            crossDomain:true, 
            dataType: "json",
            data:{region_name:region_name},
            success: function(data){
               console.log('inside data');
               console.log(data);
               //var jsonStr = JSON.stringify(data);
               //console.log(jsonStr);
               var country_list = [];
               for(var i = 0 ; i < data.length; i++){
                   var count = 1;
                   for(var j = 0 ; j < country_list.length; j++){
                       if(data[i].country == country_list[j]){
                           count = 0;
                           break;
                       }
                   }
                   if(count){
                       country_list.push(data[i].country);
                   }
               }

               console.log('country list: ');
               console.log(country_list);

               var country = '';
               for(var i = 0 ; i < country_list.length; i++){
                   country += "<option>" + country_list[i] + "</option>";
               }
               $('#country').html(country);
               //$('#test').html(country);
               var details = '';
               for(var i = 0 ; i < data.length ; i++){
                   details += "<div class='row white mt-3'>";
                        details += "<div class='col-sm-12 col-md-4 col-lg-4 pl-0 pr-0'>";
                            details += "<img src=" + data[i].image + " alt='university image' style='width:100%;height:100%'>";
                        details += "</div>";
                    details += "<div class='col-sm-12 col-md-8 col-lg-8 pl-0 pt-3 pr-1 pb-3'>";
                        details += "<div>";
                            details += "<h3 style='padding-left:15px;'>" + data[i].name +"</h3>";
                        details += "</div>";
                        details += "<div class='search-university'>";
                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>City:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].city + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Country:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].country + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Region:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].region + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Distance from capital:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].distance + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>University Email:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].email + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";
                        
                        details += "</div>";
                    details += "</div>";
                details += "</div>";
               }
               $('#university-list').html(details);
            },
            error:function(error){
               console.log('error thrown');
            }
        });

    });



    $('#country').change(function(){
        var country_name = $(this).val();
        console.log(country_name);
        
        $.ajax({
            type: "POST",
            url: "/search-university/",
            crossDomain:true, 
            dataType: "json",
            data:{country_name:country_name},
            success: function(data){
               console.log('inside data');
               console.log(data);
               //var jsonStr = JSON.stringify(data);
               //console.log(jsonStr);
               var university_list = [];
               for(var i = 0 ; i < data.length; i++){
                   var count = 1;
                   for(var j = 0 ; j < university_list.length; j++){
                       if(data[i].name == university_list[j]){
                           count = 0;
                           break;
                       }
                   }
                   if(count){
                    university_list.push(data[i].name);
                   }
               }

               var university = '';
               for(var i = 0 ; i < university_list.length; i++){
                university += "<option>" + university_list[i] + "</option>";
               }
               $('#university').html(university);
               //$('#test').html(country);

               var details = '';
               for(var i = 0 ; i < data.length ; i++){
                   details += "<div class='row white mt-3'>";
                        details += "<div class='col-sm-12 col-md-4 col-lg-4 pl-0 pr-0'>";
                            details += "<img src=" + data[i].image + " alt='university image' style='width:100%;height:100%'>";
                        details += "</div>";
                    details += "<div class='col-sm-12 col-md-8 col-lg-8 pl-0 pt-3 pr-1 pb-3'>";
                        details += "<div>";
                            details += "<h3 style='padding-left:15px;'>" + data[i].name +"</h3>";
                        details += "</div>";
                        details += "<div class='search-university'>";
                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>City:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].city + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Country:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].country + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Region:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].region + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Distance from capital:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].distance + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>University Email:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data[i].email + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";
                        
                        details += "</div>";
                    details += "</div>";
                details += "</div>";
               }
               $('#university-list').html(details);
            },
            error:function(error){
               console.log('error thrown');
            }
        });
    });

    $('#university').change(function(){
        var university_name = $(this).val();
        console.log(university_name);
        
        $.ajax({
            type: "POST",
            url: "/search-university-single/",
            crossDomain:true, 
            dataType: "json",
            data:{university_name: university_name},
            success: function(data){
               console.log('inside single data');
               console.log(data);

               var details = '';
                   details += "<div class='row white mt-3'>";
                        details += "<div class='col-sm-12 col-md-4 col-lg-4 pl-0 pr-0'>";
                            details += "<img src=" + data.image + " alt='university image' style='width:100%;height:100%'>";
                        details += "</div>";
                    details += "<div class='col-sm-12 col-md-8 col-lg-8 pl-0 pt-3 pr-1 pb-3'>";
                        details += "<div>";
                            details += "<h3 style='padding-left:15px;'>" + data.name +"</h3>";
                        details += "</div>";
                        details += "<div class='search-university'>";
                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>City:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data.city + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Country:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data.country + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Region:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data.region + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>Distance from capital:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data.distance + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";

                            details += "<div class='form-group row mb-0'>";
                                details += "<label for='staticEmail' class='col-sm-3 col-form-label'>University Email:</label>";
                                details += "<div class='col-sm-9'>";
                                    details += "<input type='text' value='" + data.email + "' class='form-control-plaintext' id='staticEmail' readonly>";
                                details += "</div>";
                            details += "</div>";
                        
                        details += "</div>";
                    details += "</div>";
                details += "</div>";
        
               $('#university-list').html(details);
            },
            error:function(error){
               console.log('error thrown');
            }
        });
    });
});