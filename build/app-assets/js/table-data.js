$(function() {
	'use strict'
	
	//Data table example
	var table = $('#exportexample').DataTable( {
		lengthChange: false,
		buttons: [ 'copy', 'excel', 'pdf', 'colvis' ]
	} );
	table.buttons().container()
	.appendTo( '#exportexample_wrapper .col-md-6:eq(0)' );
	
	
	$('#example1').DataTable({
      "pageLength": 25,
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
			lengthMenu: '_MENU_ items/page',
		}
	});
	
});