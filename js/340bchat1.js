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

var subcat={};
var chatData ={};
var services ={};
var delivery_system ={};
var table = '';
var selectedState ={};
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
		
		 delivery_system = $(".delivery_system:checkbox:checked").map(function(){
			  return $(this).val();
			}).get(); 
			
		 services = $(".service:checkbox:checked").map(function(){
			  return $(this).val();
			}).get(); 
			
		subcat = $(".subcat:checkbox:checked").map(function(){
			  return $(this).val();
			}).get(); 
				
		_chartDataBind(chatData,subcat,services,delivery_system);
		
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



function _chartDataBind(chatData,subcat,services,delivery_system){
	var mainarray = [];
	var mainarray1 = [];
	
	var i = 1;
	
	console.log(delivery_system);
	console.log(subcat);
	console.log(services);
	
	// states loop
	

	jQuery.each( chatData, function( key, value ) {				
		
		if (delivery_system && delivery_system.length > 0) {
		
			if(jQuery.inArray(value.state, selectedState) !== -1){
			console.log('select states');
				
			}else{
				chartArray = {};
				
				//jQuery.each( value.service, function( catKey, catvalue ) {	
						jQuery.each( delivery_system, function( dsKey, dsVal ) {
						
							jQuery.each( value.service[dsVal], function( sKey, svalue ) {
								console.log(svalue);
							jQuery.each( subcat, function( ca, su ) {
							
							jQuery.each( svalue[su], function( subcatKey, subcatvalue ) {	
											
								 var catvalue1 = $('<p>'+subcatvalue+'</p>').text();					
									 if(subcatKey != 'que'){
										chartArray[subcatKey+'_'+ca] = subcatvalue;
										}						
								});	
								
							});
							
							});
						});
						mainarray.push(chartArray);
					
			//});
			}		
		
		}else{
			console.log('select delivery system');
		}
		return false;
		i++;
	});


		//console.log(mainarray);
		
		
	var column = {
		"fic":"FFS IC",
		"fdf":"FFS DF",
		"fcd":"FFS Info",
		"fdd":"FFS DDM",
		"mic":"MCO IC",
		"mdf":"MCO DF",
		"mcd":"MCO Info",
		"mdd":"MCO DDM"};
		
	var head = {
		"covered_entities_340-B":"CE 340B",
		"contract_pharmacies_340-B":"CP 340B",
		"covered_entities_non-340-B":"CE N-340B",
		"contract_pharmacies_non-340-B":"CP N-340B"
	};
	//var column_heading = ["FFS IC","FFS DF","FFS Info","FFS DDM","MCO IC","MCO DF","MCO Info","MCO DDM"];
	var data = [];
	data.push({ "data" : "state","defaultContent": "-","visible": true ,"title":"States", "width": "100px" });

	jQuery.each( column, function( ke, val ) {		
	
		if(jQuery.inArray(ke, services) !== -1){
			var visible = true;		
		}else{
			var visible = false;
		}
		
		jQuery.each( subcat, function( ca, su ) {
			var heading = head[su];
		
			data.push({ "data" : ke+'_'+ca,"defaultContent": "-","visible": visible ,"title":val+' '+(heading)})
		});
					
	});
	
	
console.log(data);

	$('#example').DataTable().clear();
	$('#example').DataTable().destroy();
	$('#example thead').remove();
	 table = $('#example').DataTable( {
		"lengthMenu": [[60, 120, 180, -1], [60, 120, 180, "All"]],
        "data": mainarray,
		"columns" : data,
		"columnDefs": [
			  { "width": "50px", "targets": 0 },
			],
    } ); 
//	table.columns.adjust().draw();
	
}



jQuery(document).on('change', '#statesMulti', function(){
				selectedState = jQuery(this).val();
				_chartDataBind(chatData,subcat,services);
				
});
	
$('.delivery_system').change(function() {
	event.preventDefault();
	
  delivery_system = $(".delivery_system:checkbox:checked").map(function(){
      return $(this).val();
    }).get(); 
   _chartDataBind(chatData,subcat,services,delivery_system); 
});	

$('.service').change(function() {
	event.preventDefault();
	
  services = $(".service:checkbox:checked").map(function(){
      return $(this).val();
    }).get(); 
   _chartDataBind(chatData,subcat,services); 
});


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
	//console.log(subcat);	
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
	 subcat = subcat.push($(this).val());
		
        }else{
		subcat = subcat.push($(this+'.defaultsub-cat').val());
	
	}
	
	_chartDataBind(chatData,subcat,services);
});

$('.subcat').change(function() {
	subcat = $(".subcat:checkbox:checked").map(function(){
      return $(this).val();
    }).get();
	_chartDataBind(chatData,subcat,services);
});

