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
		
		 services = $(".service:checkbox:checked").map(function(){
			  return $(this).val();
			}).get(); 
			
		subcat = $(".subcat:checkbox:checked").map(function(){
			  return $(this).val();
			}).get(); 
			
		delivery_system = $(".delivery_system:checkbox:checked").map(function(){
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

function chartData(value){
	console.log(value);
	jQuery.each( value.service, function( catKey, catvalue ) {				
				
				chartArray['state'] = value.state;				
				jQuery.each( catvalue[subcat], function( subcatKey, subcatvalue ) {						
                     var catvalue1 = $('<p>'+subcatvalue+'</p>').text();
					
						 if(subcatKey != 'que'){
							chartArray[subcatKey] = subcatvalue;
							}
							//if(jQuery.inArray(subcatKey, services) !== -1){							
								//	chartArray[subcatKey] = subcatvalue;
							//}
						
					});
			});
}

function _chartDataBind(chatData,subcat,services){
	var mainarray = [];
	var mainarray1 = [];
	
	var i = 1;
	
	// states loop
	

	jQuery.each( chatData, function( key, value ) {				
		
			// category loop	
			//cat = 'fee_service_duplicate';
			 
		
		
		if (selectedState && selectedState.length > 0) {				
				if(jQuery.inArray(value.state, selectedState) !== -1){	
					chartArray = {};
					jQuery.each( value.service, function( catKey, catvalue ) {	
							chartArray['state'] = value.state;
							jQuery.each( subcat, function( ca, su ) {
							
							//console.log(catvalue[su]);

							jQuery.each( catvalue[su], function( subcatKey, subcatvalue ) {					
								 var catvalue1 = $('<p>'+subcatvalue+'</p>').text();					
									 if(subcatKey != 'que'){
										chartArray[subcatKey+'_'+ca] = subcatvalue;
										}						
								});	
								
							});
					});
					mainarray.push(chartArray);
				}
				
		}else{
			chartArray = {};
			
				jQuery.each( value.service, function( catKey, catvalue ) {	
					chartArray['state'] = value.state;
					
					jQuery.each( subcat, function( ca, su ) {
						
						jQuery.each( catvalue[su], function( subcatKey, subcatvalue ) {						
						 var catvalue1 = $('<p>'+subcatvalue+'</p>').text();					
							 if(subcatKey != 'que'){
							chartArray[subcatKey+'_'+ca] = subcatvalue;
								}						
						});	
						
					});	
				//mainarray1.push(chartArray);
			});
			mainarray.push(chartArray);
		}
		
			
		
		
		i++;
	});

var column = {};

	jQuery.each( delivery_system, function( k, v ) {
		if(v=='f'){		
				jQuery.each( services, function( ks, vs ) {
					column[v+vs] = v+vs;
				});
			
			}else{			
				jQuery.each( services, function( ks, vs ) {
					column[v+vs] = v+vs;
				});							
			}			
	});
		
	
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

		/* if(jQuery.inArray(ke, services) !== -1){
			var visible = true;		
		}else{
			var visible = false;
		} */
		var visible = true;	
		jQuery.each( subcat, function( ca, su ) {
			var heading = head[su];
		
			data.push({ "data" : ke+'_'+ca,"defaultContent": "-","visible": visible ,"title":val+' '+(heading)})
		});
					
	});
	
		console.log(data);
//console.log(subcat);
console.log(services);
console.log(column);
//console.log(mainarray);

	$('#example').DataTable().clear();
	$('#example').DataTable().destroy();
	$('#example thead').remove();
	 table = $('#example').DataTable( {
		"lengthMenu": [[60, 120, 180, -1], [60, 120, 180, "All"]],
        "data": mainarray,
		"columns" : data,
		
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

