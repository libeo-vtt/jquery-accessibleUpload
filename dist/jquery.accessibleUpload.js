(function($) {
    var AccessibleUpload = function(element, options) {
        this.accessibleUpload = $(element);

        // Default module configuration
        this.defaults = {};

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, (window.project ? window.project.classes : {}));

        // Merge default labels with window.project.labels
        this.labels = $.extend(true, this.defaults.labels, (window.project ? window.project.labels : {}));

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        this.init();
    };

    $.extend(AccessibleUpload.prototype, {

        // Component initialization
        init: function(options) {
            var holder = this._createFilenameHolder(this);

            $(holder).insertAfter(this.accessibleUpload);

            this.accessibleUpload.next('.lbo-aif').on('click', 'button', {
                input: this
            }, $.proxy(this._fileRemove, this));

            this.accessibleUpload.on('change.lbo-aif', '', {
                holder: holder
            }, $.proxy(this._change, this));

            this.accessibleUpload.change($.proxy(function() {
                this.accessibleUpload.trigger('change.aif');
            }, this));
        },

        destroy: function() {
            this.accessibleUpload.next('.aif').remove();
            this.accessibleUpload.unbind('.aif');
        },

        _createFilenameHolder: function(input) {
            return '<span class="lbo-aif" style="display: none;"><span class="lbo-aif-filename" aria-live="polite"></span></span>';
        },

        _change: function(event) {
            var label = '';

            if (this.title) {
                label = '<span class="visuallyhidden">' + this.title + '</span>';
            }

            var filename = this._getFilename($(event.currentTarget).val());

            this.accessibleUpload.hide();

            if (this.accessibleUpload.next('.lbo-aif').find('button').length === 0) {
                this.accessibleUpload.next('.lbo-aif').append('<button class="btn-supprimer"><span class="visuallyhidden">Supprimer<span class="visuallyhidden"> ' + filename + '.</span></span></button>');
            }

            this.accessibleUpload.next('.lbo-aif')
                .show()
                .find('.lbo-aif-filename')
                .html(label + ' ' + filename)
                .attr('tabindex', 0)
                .focus();
        },

        _getFilename: function(filename) {
            filename = filename.split('\\');
            return filename.pop();
        },

        _fileRemove: function(event) {
            event.preventDefault();
            this.accessibleUpload.next('.lbo-aif').remove();

            var clone = $(event.data.input.accessibleUpload).clone();
            $(event.data.input.accessibleUpload).replaceWith(clone);
            clone.show()
                .focus()
                .accessibleUpload();

            return false;
        }

    });

    $.fn.accessibleUpload = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('accessibleUpload')) return;

            // pass options to plugin constructor
            var accessibleUpload = new AccessibleUpload(this, options);

            // Store plugin object in this element's data
            element.data('accessibleUpload', accessibleUpload);
        });
    };
})(jQuery);
