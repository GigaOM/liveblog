jQuery(document).ready(function($) {
	new wp.Uploader({

	    /* Selectors */
		browser:   '#liveblog-new-entry legend',
	    dropzone:  '#liveblog-form-entry',

	    /* Callbacks */
	    success  : function( attachment ) {
			$( '#liveblog-form-entry'     ).val( $('#liveblog-form-entry' ).val() + '<img src="' + attachment.url + '" />' );
			$( '#liveblog-new-entry legend' ).html( attachment.filename + ' Finished' );
			$( '#liveblog-new-entry'        ).removeClass( 'uploading' );
	    },
 
		error    : function ( reason ) {
			$( '#liveblog-new-entry legend' ).html( reason );
		},

		added    : function() {
			$( '#liveblog-new-entry' ).addClass( 'uploading' );
		},

		progress : function( up, file ) {
			$( '#liveblog-new-entry legend' ).html( "Uploading: " + file.name + ' ' + file.percent + '%' );
		},

		complete : function() {
			$( '#liveblog-new-entry legend' ).html( 'All done!' );
		}
	});
});
