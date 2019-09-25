$(document).ready(function() {
    $('#example').DataTable();
	 jQuery(".more-btn").click(function(){
   jQuery(".sub-cat").show();
  });
} );
$(document).ready(function(){
$('.category-btn ul li').on('click', function(){
$('.sub-cat').attr('id','active-tab'+$(this).data('id'));
});
});
