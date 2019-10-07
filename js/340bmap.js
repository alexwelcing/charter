/////states pagevar HTML = [],
var STATES = [];
var current, jsonData;


jQuery(function(){
    loadAjax('340bstates.json');
});

function loadAjax(file){
    current = file;
    jQuery.ajax({
       // url: "./json/"+file,
       url:"json/"+file,
		type: 'GET',
		dataType: "json",
		data: [],
		success: showData
	});	
}

var STATESMulti = [];
function showData(data, status, xhr) {
	if(data.length){
	    switch(current){
	        case '340bstates.json':
			STATES.length = 0;
			STATES.push('<option value="">Select State</option>');
			for (var i = 0; i < data.length; i++) {				
				createStates(data[i]);	
				//STATESMulti.push({"id": data[i].name, "title": data[i].name});
			}
			
			jQuery('#states').html(STATES);
			jQuery('#statesMulti').html(STATESMulti);
			jQuery('#statesMulti').selectpicker('refresh');;
			
			
			loadAjax('sectiondata.json');
		
		
        	break;
            case 'sectiondata.json':
			//console.log(data);
			jsonData = data;
            break;
		}
	}
}


function createStates(arr) {
    var html='';
    if(arr.available == "1"){
     html = '<option value="'+arr.name+'">'+arr.name+'</option>';
   }else{
    html = '<option value="'+arr.name+'" disabled style="color: red">'+arr.name+'</option>';
   }
    STATES.push(html); 
    STATESMulti.push(html); 
}



function checkJson(abb){
	
    var thisData='';
    jQuery.each( jsonData, function( key, value ) {
        if(value.state===abb){
			// console.log(value);
            thisData = value;
		}   
	});
	
    jQuery('#state_data').html('');
    if(!thisData){
        return;
	}
    createData(thisData);
		jQuery(".state_container").show();
		jQuery(".chart_container").hide();
		jQuery(".map_container").hide();
		jQuery("#statesMulti").hide();
		jQuery("#states").show();
		jQuery(".bootstrap-select.show-tick").hide();
		
    $("html, body").animate({ scrollTop: 0 }, "slow");
   
    jQuery("#states option").each(function( index ) {
        var chk = jQuery(this).val();
        if(chk==abb){
            jQuery(this).attr('selected', 'selected');
		}
	});
    
}





function createData(arr) {
  
    var html='';
    var todayDate = new Date().toISOString().slice(0,10);
    var ab = new Array();
    var abcolor = "";
    var source = new Array();
    var source_arr = new Array();
    var source_link_arr = new Array();
    var source_link = new Array();
    var source_arr34 = new Array();
    var source_link34 = new Array();
    var i=0;
    html +='\
    <style> .col-md-3 { float: left;} .col-md-9 { float: left; }'+arr.theme_style+'</style>\
    <div class="chart_outr content_outr">\
	<div class="state_headings" >\
	<h3 >'+arr.state+'</h3>\
	</div><div class="box1">\
	<div class="col-md-9">\
	<div class="ques_ans">\
	';
	var source_arr = [];
	var source_link_arr = [];
	var $si = 1;
	
	jQuery.each( arr.sectiondatas, function( key, value ) {
		ab[key] = value.title;
		
        html +=' <div class="inner_data">\
        \<h5 id="section'+key+'" >'+value.title+'</h5>\
        ';
		
		
		html+= '\<h6 id="subsectionR'+key+'">Reimbursement Requirements</h6>';
		
		html +='</div><div class="table-responsive">\
		<table> <tr class="mobile_hide"><th ></th> <th >Ingredient Cost </th> <th >Dispensing Fee</th> <th >Clarifying Details</th></tr>';
		jQuery.each( value.table_one, function( key1,value1){
			var clerify = 'N/A';
		//	var string =value1.ingredient_cost;
         //   var new_string = string.replace('&#8226;','<br/>&#8226;');
        if(value1.clarifying_detail != null){
            clerify = value1.clarifying_detail;
        }
			html +='<tr>\
			<td>'+value1.question_title +'</td>\
			<td class="desktop_hide">Ingredient Cost</td>';
			if(value1.ingredient_cost != null){
		    html +='<td>'+value1.ingredient_cost;+'</td>';
			}else{
			    html += '<td></td>';
			}
			
			html +='<td class="desktop_hide">Dispensing Fee</td>';
			if(value1.dispensing_fee != null){
			html += '<td>'+value1.dispensing_fee+'</td>';
			}else{
			    html += '<td></td>';
			}
			html += '<td class="desktop_hide">Clarifying Details</td>';
			
		    html +=	'<td>'+clerify+'\
			';
			if(value1.source != '<p>No requirements located.</p>' && value1.source != null &&  value1.source !='' && value1.source !="<p>Unable to locate.</p>"
 && value1.source_link != null){ 
      var source_arr34 = new Array();
    var source_link34 = new Array();
    let string = value1.source;
    let string_link = value1.source_link;
    source_arr34  = string.split('|');
    source_link34 = string_link.split('|');
  
        jQuery.each( source_arr34, function( key34,value34){
				if ($.inArray(value34, source_arr) === -1){
					source_arr.push(value34);
					source_link_arr.push(source_link34[key34]);
					html += ' <a  class="state_check" href="#source'+$si+'">['+$si+']</a>';
					$si++;
					//console.log(value1.source);
				}else{
					var vi = 1;
				jQuery.each( source_arr, function( key,value){	
					if(value==value34){
						html += ' <a  class="state_check" href="#source'+vi+'">['+vi+']</a>';
						}
						vi++;
					});						
				}
     });
			}
			html +='</td></tr>';
			
			source[i]=value1.source;
			source_link[i]=value1.source_link;
			i++;
			
			//console.log(source_arr);
		});
		html +='</table></div>\
		';
		if(value.table_two.length > 0){
			html +=' <div class="inner_data">\
			';
			html+= '\<h6 id="subsectionD'+key+'" >Duplicate Discount Mechanism</h6>';
			html +='</div><div class="table-responsive">\
			<table> <tr><th ></th> <th class="mobile_hide">Answer </th> </tr>';
			
			jQuery.each( value.table_two, function( key2,value2){
			    var clerify = 'N/A';
				if(value2.clarifying_detail != null){
            clerify = value2.clarifying_detail;
              }
				source[i]=value2.source;
				source_link[i]=value2.source_link;
				html +='<tr>\
				<td>'+value2.question_title +'</td>\
				<td class="desktop-hide">Answer</td>\
				<td>'+clerify+'\
				';
				if(value2.source != '<p>No requirements located</p>' && value2.source != null  && value2.source !='' && value2.source !="<p>Unable to locate.</p>"){
				    var source_arr34 = new Array();
                    var source_link34 = new Array();
                    let string = value2.source;
                    let string_link = value2.source_link;
					if(string_link){
                    source_arr34  = string.split('|');
                    source_link34 = string_link.split('|');
                    jQuery.each( source_arr34, function( key34,value34){
				if ($.inArray(value34, source_arr) === -1){
					source_arr.push(value34);
					source_link_arr.push(source_link34[key34]);
					html += ' <a  class="state_check" href="#source'+$si+'">['+$si+']</a>';
					$si++;
				}else{
				var vi = 1;
				jQuery.each( source_arr, function( key,value){	
					if(value == value34){
						html += ' <a  class="state_check" href="#source'+vi+'">['+vi+']</a>';
						}
						vi++;
					});					
				}
				
                    });
					
					}
			}
				html +='</td></tr>';
				i++;
			});
			html +='</table></div>\
			';
		}
	});
	// console.log(ab);
	function unique(list) {
		var result = [];
		$.each(list, function(i, e) {
			if ($.inArray(e, result) == -1) result.push(e);
		});
		return result;
	}
	
	if(arr.state_content != null ){
	    html += arr.state_content;
	}
	
//	console.log(source);
	//console.log(source_link);
	source = unique(source);
	//source_link = unique(source_link);
	//console.log(source);
	//console.log(source_link);
	html +='</div></div><div class="col-md-3 hidden-sm hidden-xs">';
	
	html += '<div class="sidenav-wrapper is-sticky"><ul class="my-navbar">';
	jQuery.each( ab, function( key,value){
		html += '<li class="nav-item" >\
		<a class=" current-tab" href="#section'+key+'" data-scroll="section" style="color:'+arr.primarycolor+';hover:'+arr.secondrycolor+'">'+value+'</a>\
		</li>';
			html += '<li class="nav-item my-class" >\
	  	  <a class=" current-tab" href="#subsectionR'+key+'" data-scroll="section" style="color:'+arr.primarycolor+';hover:'+arr.secondrycolor+'">Reimbursement Requirements</a>\
		</li>';
		html += '<li class="nav-item my-class" >\
	  	  <a class=" current-tab" href="#subsectionD'+key+'" data-scroll="section" style="color:'+arr.primarycolor+';hover:'+arr.secondrycolor+'">Duplicate Discount Mechanism</a>\
		</li>';
	});
	
	html +='</ul></div></div></div>\
	</div></div>' ;
	
	html += '<section id="section" class="sources" data-anchor="section8">\
	<div class="section-title">\
	<h3 >Sources</h3>\
	</div>\
	<ol>'; 
	var $s = 1;
	jQuery.each( source_arr, function( key,value){					
					html += '<li id="source'+$s+'" data-tab="source'+$s+'" class=""><a href="'+source_link_arr[key]+'" target="_blank">'+value+'</a></li>';
				$s++;		
	});
	
	html +='</ol>\
	</section>\
	';
	
    
    jQuery('#state_data').html(html);
      $(".sidenav-wrapper").sticky({topSpacing:0,bottomSpacing:832});
}






