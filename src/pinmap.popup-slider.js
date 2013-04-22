/* globals jQuery */

window.PopupSlider = (function ($) {
    'use strict';

    /**
     * InfoSlider popup extension for PinMap
     * @param {[type]} $pinmap [description]
     */
    var PopupSlider = function ($element) {
        // Must provide an existing PinMap element for
        // adding required DOM controls
        if (!$element.length) {
            return false;
        }
        // Create InfoSlider element if not already existing
        this.$element = $element.find('.infoslider');
        if (!this.$element.length) {
            this.$element = $('<div class="popup-infoslider"></div>');
            $element.append(this.$element);
        }
        return this;
    };
    PopupSlider.prototype.setContent = function (content) {
        this.$element.html(content);
    };
    PopupSlider.prototype.getContent = function() {
        return this.$element.html();
    };
    PopupSlider.prototype.open = function() {
        this.$element.show();
    };
    PopupSlider.prototype.close = function() {
        this.$element.hide();
    };

    return PopupSlider;

}(jQuery));
