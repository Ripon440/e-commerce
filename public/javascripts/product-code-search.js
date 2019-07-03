$(document).ready(function(){
    $('#product_code').keyup(function(){
        const code = $(this).val();
        //console.log(code);
        
        if(code !=''){
            $.ajax({
                url: "/products/product-code-search/",
                type: "post",
                crossDomain:true, 
                dataType: "json",
                data:{code:code},
                success: function(data){
                // console.log('inside data');
                // console.log(data);
                   
                    var details = '';
                    
                   if(data){
                        details += "<small class='form-text' style='color:red;'>";
                            details += "Code already exist. Choose another code.";
                        details += "</small>";
                        $('#codeSearchResult').fadeIn();
                        $('#codeSearchResult').html(details);
                    }else{
                        $('#codeSearchResult').fadeOut();
                        $('#codeSearchResult').html("");
                    }
                },
                error:function(error){
                   console.log('error thrown');
                }
            });
        }else{
            $('#codeSearchResult').fadeOut();
            $('#codeSearchResult').html("");
            console.log('empty filed!');
        } 
    });
});