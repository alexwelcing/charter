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
var chatData ={};

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
		chatData = json;
		 cat = $('.cat').val();
		 subcat = $('.subcat').val();
		_chartDataBind(chatData,cat,subcat);
		
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


function _chartDataBind(chatData,cat,subcat){
	var mainarray = [];
	
	var i = 1;
//	console.log(chatData);
	// states loop
	jQuery.each( chatData, function( key, value ) {				
		
			// category loop	
			//cat = 'fee_service_duplicate';
			 
		chartArray = {};
			jQuery.each( value.service, function( catKey, catvalue ) {	
				
				
				chartArray['state'] = value.state;
			
				
				jQuery.each( catvalue[subcat], function( subcatKey, subcatvalue ) {						
                     var catvalue1 = $('<p>'+subcatvalue+'</p>').text();
					
						if(subcatKey != 'que'){
							chartArray[subcatKey] = catvalue1;
							}
						
						
					});
					
					
			
			});
			
		mainarray.push(chartArray);
		
		i++;
	});
console.log(mainarray);
	
	$('#example').DataTable().clear();
	$('#example').DataTable().destroy();
	
	 $('#example').DataTable( {
		"lengthMenu": [[50, 100, 150, -1], [50, 100, 150, "All"]],
        "data": mainarray,		
		 
		"columns" : [
            { "data" : "state","defaultContent": "-" },
			{ "data" : "fic","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-"},
			{ "data" : "fdf","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },
            { "data" : "fcd","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },           
			{ "data" : "fdd","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },
			{ "data" : "mic","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },  
            { "data" : "mdf","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },
            { "data" : "mcd","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },                     
            { "data" : "mdd","render": $.fn.dataTable.render.ellipsis(20),"defaultContent": "-" },
		  ],
    } ); 
}

 


$('.cat').change(function() {
	$(".cat"). prop("checked", false);	
	$(this). prop("checked", true);
	if(this.checked) {
		var cat = $(this).val();
        }else{
		var cat = $('.default-cat').val();
	}
	
	if(cat=='fee_service_duplicate'||cat == 'managed_service_duplicate'){
		//	$('.service_reimburse').hide();
		//	$('.service_duplicate').show();
			var subcat = $('.service_duplicate').find('.subcat2:checked').val();
			
			
	}else{
		//	$('.service_reimburse').show();
		//	$('.service_duplicate').hide();	
			var subcat = $('.subcat:checked').val();
		}
	console.log(subcat);	
	_chartDataBind(chatData,cat,subcat);
});
jQuery(document).on('click','.more_text',function(event) {
	event.preventDefault();
	jQuery('.full_text').not($(this).parent('.full_text')).removeClass('less_text');
	jQuery(this).parent('.full_text').toggleClass('less_text');
});

$('.subcat2').change(function() {
	$(".subcat2"). prop("checked", false);
	$(this). prop("checked", true);
	
	if(this.checked) {
		var subcat = $(this).val();
        }else{
		var subcat = $(this+'.defaultsub-cat').val();
	}
	
	_chartDataBind(chatData,cat,subcat);
});

$('.subcat').change(function() {
	$(".subcat"). prop("checked", false);
	$(this). prop("checked", true);
	
	if(this.checked) {
		var subcat = $(this).val();
        }else{
		var subcat = $(this+'.defaultsub-cat').val();
	}
	_chartDataBind(chatData,cat,subcat);
});

