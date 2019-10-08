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


/***********Chart create*****************/
var subcat={};
var chatData ={};
var services ={};
var delivery_system ={};
var delivery_system1 ={};
var table = '';
var columnLenght = 1;
var selectedState ={};

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


function _chartDataBind(chatData,subcat,services,delivery_system){
	var mainarray = [];
	var mainarray1 = [];
	var column = [];
var headers = {};
	var i = 1;

	var head = {
		"covered_entities_340B":"CE 340B",
		"contract_pharmacies_340B":"CP 340B",
		"covered_entities_non-340B":"CE N-340B",
		"contract_pharmacies_non-340B":"CP N-340B",
		"covered_entities":"CDD",
		"contract_pharmacies":"CDD",
	};
var drugs = {
		"fic":"FFS Ingredient Cost",
		"fdf":"FFS Dispensing Fee",
		"fcd":"FFS Clarifying Details",
		"mic":"MCO Ingredient Cost",
		"mdf":"MCO Dispensing Fee",
		"mcd":"MCO Clarifying Details",
	};
	
	jQuery.each( delivery_system, function( k, v ) {
		if(v=='f'){
			jQuery.each( services, function( ks, vs ) {
				column.push(v+vs);
			});
			}else{
			jQuery.each( services, function( ks, vs ) {
				column.push(v+vs);
			});
		}
	});


	// states loop


	jQuery.each( chatData, function( key, value ) {

		// category loop
		//cat = 'fee_service_duplicate';



		if (selectedState && selectedState.length > 0) {
			if(jQuery.inArray(value.state, selectedState) !== -1){
				chartArray = {};
				jQuery.each( value.service, function( catKey, catvalue ) {
					chartArray['state'] = '<a data-id="'+value.state+'" class="stateClick">'+value.abbreviation+'</a>';
					jQuery.each( subcat, function( ca, su ) {
						jQuery.each( catvalue[su], function( subcatKey, subcatvalue ) {
							var catvalue1 = $('<p>'+subcatvalue+'</p>').text();
							if($.inArray(subcatKey,column) !== -1){
								chartArray[subcatKey+'_'+ca] = subcatvalue;
								var ks = subcatKey+'_'+ca;
								headers[ks]=su;
							}
						});

					});
				});
				mainarray.push(chartArray);
			}

			}else{
			chartArray = {};

			jQuery.each( value.service, function( catKey, catvalue ) {
				chartArray['state'] = '<a data-id="'+value.state+'" class="stateClick">'+value.abbreviation+'</a>';

				jQuery.each( subcat, function( ca, su ) {

					jQuery.each( catvalue[su], function( subcatKey, subcatvalue ) {

						var catvalue1 = $('<p>'+subcatvalue+'</p>').text();
						if($.inArray(subcatKey,column) !== -1){
								chartArray[subcatKey+'_'+ca] = subcatvalue;
								var ks = subcatKey+'_'+ca;
								headers[ks]=su;
							}

						/* if(subcatKey != 'que'){
							chartArray[subcatKey+'_'+ca] = subcatvalue;
						} */
					});

				});
				//mainarray1.push(chartArray);
			});
			mainarray.push(chartArray);
		}


		i++;
	});


columnLenght = $.map(headers, function(el) { return el }).length;
if(columnLenght>6){
	alert('Limit exceeded! Please uncheck some categories');
	return false;
}
	var data = [];
	data.push({ "data" : "state","defaultContent": "-","visible": true ,"title":"States", "width": "100px" });

	jQuery.each( headers, function( ke, val ) {
		var heading = head[val];
		var drugName = ke.split("_");
		var system = val.replace('_',' ');
		var system = system.replace('_',' ');
		var heads = '<label data-title="'+system+' '+drugs[drugName[0]]+'">'+heading+' '+drugName[0]+'</label>';
		data.push({ "data" : ke,"defaultContent": "-","visible": true ,"title":heads})
	});
console.log(data);

	$('#example').DataTable().clear();
	$('#example').DataTable().destroy();
	$('#example thead').remove();
	table = $('#example').DataTable( {
		"lengthMenu": [[60, 120, 180, -1], [60, 120, 180, "All"]],
        "data": mainarray,
		"columns" : data,
		 "fixedHeader": {
            header: true,
            footer: false
        }
	} );
	//	table.columns.adjust().draw();

}



jQuery(document).on('change', '#statesMulti', function(){
	selectedState = jQuery(this).val();
	_chartDataBind(chatData,subcat,services,delivery_system);

});



$('.delivery_system').change(function() {

	$(".delivery_system1").prop("checked", false);

	delivery_system = $(".delivery_system:checkbox:checked").map(function(){
		return $(this).val();
	}).get();
	var parentClass = '.duplicate';
		refreshCategory(parentClass,this);

	_chartDataBind(chatData,subcat,services,delivery_system);
	event.preventDefault();
});


$('.delivery_system1').change(function() {
	delivery_system1 = $(".delivery_system1:checkbox:checked").map(function(){
		return $(this).val();
	}).get();
	$(".delivery_system").prop("checked", false);
	delivery_system = delivery_system1;


	var parentClass = '.reimbursement';
	refreshCategory(parentClass,this);

	_chartDataBind(chatData,subcat,services,delivery_system);
	event.preventDefault();
});

function refreshCategory(parentClass,$this){
	$(parentClass+" .subcat").prop("checked", false);
	$(parentClass+" .service").prop("checked", false);

	$($this).parents('.filterBox').find('.dcat').prop("checked", true);
	$($this).parents('.filterBox').find('.dcat').prop("checked", true);

	services = $(".service:checkbox:checked").map(function(){
		return $(this).val();
	}).get();

	subcat = $(".subcat:checkbox:checked").map(function(){
		return $(this).val();
	}).get();
}

$('.service').change(function() {
	event.preventDefault();

	services = $(".service:checkbox:checked").map(function(){
		return $(this).val();
	}).get();
	console.log(services);
	_chartDataBind(chatData,subcat,services,delivery_system);
});



jQuery(document).on('click','.more_text',function(event) {
	event.preventDefault();
	jQuery('.full_text').not($(this).parent('.full_text')).removeClass('less_text');
	jQuery(this).parent('.full_text').toggleClass('less_text');
});

$('.subcat2').change(function() {
	$(".subcat2").prop("checked", false);
	$(this). prop("checked", true);

	if(this.checked) {
		subcat = subcat.push($(this).val());

        }else{
		subcat = subcat.push($(this+'.defaultsub-cat').val());

	}

	_chartDataBind(chatData,subcat,services,delivery_system);
});

$('.subcat').change(function() {
	subcat = $(".subcat:checkbox:checked").map(function(){
		return $(this).val();
	}).get();
	var thisval = $(this).val();

	if(thisval=='contract_pharmacies')
	{
	if(jQuery.inArray('contract_pharmacies', subcat) !== -1){

		$(this).parent('label.container').find('.service').prop("checked", true);
	}else{

		$(this).parent('label.container').find('.service').prop("checked", false);
	}
	}
	if(thisval=='covered_entities')
	{
     if(jQuery.inArray('covered_entities', subcat) !== -1){

		$(this).parent('label.container').find('.service').prop("checked", true);
		}else{

		$(this).parent('label.container').find('.service').prop("checked", false);
	}
	}
	services = $(".service:checkbox:checked").map(function(){
		return $(this).val();
	}).get();


	_chartDataBind(chatData,subcat,services,delivery_system);
});

