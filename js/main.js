$(document).ready(function() {
    //$('#example').DataTable();
	jQuery(".more-btn").click(function(){
		jQuery(".sub-cat").show();
	});
	
	$('.category-btn ul li').on('click', function(){
		$('.cat-btn label').removeClass('active');
		$(this).find('.cat-btn label').addClass('active');
		$('.sub-cat').attr('id','active-tab'+$(this).data('id'));
	});
});

var cat, subcat;
var jsonData ={};

/***********Chart create*****************/


jQuery(function(){
	_getStateData();
});
function _buildApiUrl ( ) {
	let url = 'json/340bChart.json';
	return url;
}
function _getStateData () {		
	fetch(_buildApiUrl()).then(function(response) {
			return response.json()
		}).then(function(json) {
		jsonData = json;
		 cat = $('.cat').val();
		 subcat = $('.subcat').val();
		_chartDataBind(jsonData,cat,subcat);
		
		}).catch(function(ex) {
		//console.log('parsing failed', ex);
		_setNotice('Unexpected error loading posts');
	})
}
function _setNotice (label) {
	//document.getElementById('notice').innerHTML = label;
}
var removeElements = function(text, selector) {
    var wrapped = $("<div>" + text + "</div>");  
    return wrapped.html();
}


function _chartDataBind(jsonData,cat,subcat){
	var mainarray = [];
	
	var i = 1;
	// states loop
	jQuery.each( jsonData, function( key, value ) {				
		
			// category loop	
			//cat = 'fee_service_duplicate';
			 
		chartArray = {};
			jQuery.each( value.service, function( catKey, catvalue ) {	
				
				chartArray['state'] = value.state;
				jQuery.each( catvalue[subcat], function( subcatKey, subcatvalue ) {	
				  

					
                     var catvalue1 = $('<p>'+subcatvalue+'</p>').text();
					 
					var catvalue1 = catvalue1.slice(0, 50) + (catvalue1.length > 50 ? "..." : "");
					
						chartArray[subcatKey] = catvalue1;
						
					});
					
					
			
			});
			
		mainarray.push(chartArray);
		
		i++;
	});
console.log(mainarray);
  
	 $('#example').DataTable( {
        "data": mainarray,
		  "columns" : [
            { "data" : "state" },
            { "data" : "fcd" },
            { "data" : "fdf" },
            { "data" : "fic" },
            { "data" : "mcd" },
            { "data" : "mdf" },
            { "data" : "mic" },
            { "data" : "que" },
                    
                ]  
    } ); 
}

$(document).ready(function() {
    
} );
 


$('.cat').change(function() {
	$(".cat"). prop("checked", false);	
	$(this). prop("checked", true);
	if(this.checked) {
		var cat = $(this).val();
        }else{
		var cat = $('.default-cat').val();
	}
	
	if(cat=='fee_service_duplicate'||cat == 'managed_service_duplicate'){
			$('.service_reimburse').hide();
			$('.service_duplicate').show();
			var subcat = $('.service_duplicate').find('.subcat2:checked').val();
			
			
	}else{
			$('.service_reimburse').show();
			$('.service_duplicate').hide();	
			var subcat = $('.subcat:checked').val();
		}
	console.log(subcat);	
	_chartDataBind(jsonData,cat,subcat);
});


$('.subcat2').change(function() {
	$(".subcat2"). prop("checked", false);
	$(this). prop("checked", true);
	
	if(this.checked) {
		var subcat = $(this).val();
        }else{
		var subcat = $(this+'.defaultsub-cat').val();
	}
	
	_chartDataBind(jsonData,cat,subcat);
});

$('.subcat').change(function() {
	$(".subcat"). prop("checked", false);
	$(this). prop("checked", true);
	
	if(this.checked) {
		var subcat = $(this).val();
        }else{
		var subcat = $(this+'.defaultsub-cat').val();
	}
	_chartDataBind(jsonData,cat,subcat);
});

