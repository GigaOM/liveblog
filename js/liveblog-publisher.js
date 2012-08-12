( function( $ ) {
	if ( typeof( liveblog ) === 'undefined' )
		return;

	liveblog.publisher = {}

	// TODO: fire after liveblog.init
	liveblog.publisher.init = function() {
		liveblog.disable_nag();

		liveblog.publisher.$entry_text   = $( '#liveblog-form-entry'        );
		liveblog.publisher.$entry_button = $( '#liveblog-form-entry-submit' );
		liveblog.publisher.$nonce        = $( '#liveblog_nonce'             );
		liveblog.publisher.$spinner      = $( '#liveblog-submit-spinner'    );

		$( '.liveblog-entry-delete' ).click( liveblog.publisher.delete_click );
	}

	liveblog.publisher.delete_click = function( e ) {
		e.preventDefault();
		var id = $( e.target ).closest( '.liveblog-entry' ).attr( 'id' ).replace( 'liveblog-entry-', '' );
		if ( !id ) {
			return;
		}
		if ( !confirm( liveblog_settings.delete_confirmation ) ) {
			return;
		}
		liveblog.publisher.delete_entry( id );
 	}

	liveblog.publisher.insert_entry = function() {
		var entry_content = liveblog.publisher.$entry_text.val();

		if ( ! entry_content )
			return;

		var data = {
			action: 'liveblog_insert_entry',
			entry_content: entry_content,
			post_id: liveblog_settings.post_id
		}

		data[ liveblog_settings.nonce_key ] = liveblog.publisher.$nonce.val();
		NewEntryForm.disable()
		liveblog.publisher.show_spinner();
		liveblog.ajax_request( liveblog_settings.ajaxurl, data, liveblog.publisher.insert_entry_success, liveblog.publisher.insert_entry_error, 'POST' );
	}

	liveblog.publisher.insert_entry_success = function( response ) {
		NewEntryForm.enable();
		liveblog.publisher.hide_spinner();
		liveblog.publisher.$entry_text.val( '' );

		liveblog.reset_timer();
		liveblog.get_recent_entries_success( response );
	}

	liveblog.publisher.insert_entry_error = function( response ) {
		liveblog.add_error( response );
		NewEntryForm.enable();
		liveblog.publisher.hide_spinner();
	}

	liveblog.publisher.delete_entry = function( id ) {
		var data = {
			action: 'liveblog_insert_entry',
			post_id: liveblog_settings.post_id,
			replaces: id,
			entry_content: ''
		}
		data[ liveblog_settings.nonce_key ] = liveblog.publisher.$nonce.val();
		NewEntryForm.disable();
		liveblog.publisher.show_spinner();
		liveblog.ajax_request( liveblog_settings.ajaxurl, data, liveblog.publisher.insert_entry_success, liveblog.publisher.insert_entry_error, 'POST' );
 	}

	liveblog.publisher.show_spinner = function() {
		liveblog.publisher.$spinner.spin( 'small' );
	}

	liveblog.publisher.hide_spinner = function() {
		liveblog.publisher.$spinner.spin( false );
	}


	window.NewEntryFormView = Backbone.View.extend({
		events: {
			"click #liveblog-form-entry-submit": "submit",
		},
		initialize: function(options) {
			this.$text = this.$('textarea#liveblog-form-entry');
			this.$submit = this.$('input#liveblog-form-entry-submit');
		},
		submit: function( e ) {
			e.preventDefault();
			liveblog.publisher.insert_entry();
  		},
		disable: function() {
			this.$text.attr( 'disabled', 'disabled' );
			this.$submit.attr( 'disabled', 'disabled' );
  		},
		enable: function() {
			this.$text.attr( 'disabled', null );
			this.$submit.attr( 'disabled', null );
  		},
	});

	window.NewEntryForm = new window.NewEntryFormView({el: $('#liveblog-new-entry')});

	$( document ).ready( liveblog.publisher.init );
} )( jQuery );
