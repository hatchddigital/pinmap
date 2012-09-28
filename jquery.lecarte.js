/**
 * HATCHD DIGITAL EMPTY COOP WEB APPLICATION FRAMEWORK
 *
 * ATTRIBUTION-NONCOMMERCIAL-SHAREALIKE 3.0 UNPORTED
 *
 * THE WORK (AS DEFINED BELOW) IS PROVIDED UNDER THE TERMS OF THIS CREATIVE
 * COMMONS PUBLIC LICENSE ("CCPL" OR "LICENSE"). THE WORK IS PROTECTED BY
 * COPYRIGHT AND/OR OTHER APPLICABLE LAW. ANY USE OF THE WORK OTHER THAN AS
 * AUTHORIZED UNDER THIS LICENSE OR COPYRIGHT LAW IS PROHIBITED.
 *
 * BY EXERCISING ANY RIGHTS TO THE WORK PROVIDED HERE, YOU ACCEPT AND AGREE
 * TO BE BOUND BY THE TERMS OF THIS LICENSE. TO THE EXTENT THIS LICENSE MAY
 * BE CONSIDERED TO BE A CONTRACT, THE LICENSOR GRANTS YOU THE RIGHTS
 * CONTAINED HERE IN CONSIDERATION OF YOUR ACCEPTANCE OF SUCH TERMS AND
 * CONDITIONS.
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au
 *
 * DEVELOPER USAGE:
 *
 * ALL external libraries and should be imported here, using a buildout
 * application e.g. CodeKit. This vesion of the file should be pretty,
 * well formatted, and only contain code that is unique to your OWN app.
 * Your site should always use /app-min.js when loading, which contains
 * a minified version of this script prepended with all external scripts.
 *
 * REQUIRED
 * @required jquery (v1.7.0+)
 *
 * IMPORTS
 * @import hatchdlings.module.js
 *
 * VALIDATION
 * All code must validate with JSHint (http://www.jshint.com/) to be launched
 * within a LIVE web application. NO debug code should remain in your final
 * versions e.g. remove EVERY reference to window.console.log().
 *
 * STYLE
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * jshint = { "laxcomma": true, "laxbreak": true, "browser": true }
 *
 * HATCHDLING LE CARTE MODULE
 *
 * This set of code allows us to manage Mapping functionality using Google
 * Maps to add/remove/hide and play with icons and boxes in an easily-styled
 * and pretty way.
 *
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @see http://hatchd.com.au
 *
 */

;(function() {

    /**
     * Attaches our Facilities Google Map to an element in the DOM
     * and puts the default markers into the system ready for dealing
     * with moving around the page
     */
    var Carte = function (element, options) {

        // Check provided options and set defaults where required
        options = options || {};
        element = element || options.element;

        // Set default map position to Perth, Western Australia!
        options.latitude = options.latitude || -31.95391;
        options.longitude = options.longitude || 115.858512;

        // An element MUST be provided to attach the Google Map into the DOM
        if (!element || !$(element).length) {
            return false;
        }

        // Required data
        var that = this

        // element that's used to attach the map into the DOM
          , $element = $(element) || false

        // all available markers (facilities) for messing with
        // default options for the google map (see Maps API v3.)
          , google_map_options = $.extend({
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(
                    options.latitude, options.longitude)
            }, options);

        // Build the Google Maps objects and plot the default center point.
        this.google_map = new google.maps.Map(element, google_map_options);

        // Setup an internal available markers on this map
        this.available_markers = [];

        // Single info window
        this.infowindow = new google.maps.InfoWindow({
            'pixelOffset': new google.maps.Size(30, -30)
        });

        return this;

    };

    /**
     * Puts a pin on the map with the provided details. Returns the
     * Google Map object for chaining.
     */
    Carte.prototype.addMarker = function (location, title, id, marker_icon,
                                          description, type) {

        var marker = new google.maps.Marker({
                position: location,
                map: this.google_map,
                title: title,
                icon: marker_icon,
                optimized: false
            });

        marker.id = id;
        marker.infowindow = this.infowindow;
        marker.description = description;
        marker.type = type || {};
        this.available_markers.push(marker);

        // Setup HTML popup for Marker
        google.maps.event.addListener(marker, 'click', function() {
            marker.map.panTo(marker.position);
            marker.infowindow.setContent(marker.description);
            marker.infowindow.open(marker.map, marker);
        });

    };

    /**
     * Center the map on specified marker. Usually will be attached to a JS
     * user event (like a click) passing the ID or title
     */
    Carte.prototype.centerOnMarker = function (settings) {
        var search_id = parseInt(settings.id, 10) || false
          , search_title = settings.title || false
          , that = this;
        // Required settings not provided, return false and do nothing
        if (!search_id && !search_title) {
            return false;
        }
        // Search for the provided marker by title and ID and center
        $.each(this.available_markers, function(index, this_marker) {
            if (this_marker.title === search_title ||
                this_marker.id === search_id) {
                that.google_map.panTo(this_marker.position);
                if (that.infowindow.getContent() !== this_marker.description) {
                    that.infowindow.setContent(this_marker.description);
                    that.infowindow.open(this_marker.map, this_marker);
                }
            }
        });
    };

    /**
     * Toggle visibility of a specific type (or all) markers
     * on currently on the map.
     */
    Carte.prototype.toggleMarkers = function (settings) {
        var type = settings.type || false
          , action = settings.action || false;
        $.each(this.available_markers, function(index, this_marker) {
            if (!type || this_marker.type === type) {
                this_marker.setVisible(action);
                if (!action && this.infowindow.getContent() === this_marker.description) {
                    this_marker.infowindow.close();
                }
            }
        });
    };

    /**
     * jQuery plugin attaches map to a specific DOM elements
     */
    $.fn.lecarte = function(options) {

        options = options || {};

        this.each(function() {

            var $this = $(this)
              , address = ($this.attr('data-address') !== undefined) ? $this.attr('data-address') : false
              , geocoder = new google.maps.Geocoder()
              , map_options = {
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
              , map = $this.data('carte');

            // If we can't find an existing modal, create a new one
            if (!map) {
                $this.data('carte', (map = new Carte(this, options)));
            }

            // Geocode the address, and create the map
            if (address) {
                geocoder.geocode( {'address': address }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                            map.google_map.panTo(results[0].geometry.location);
                            if (options.addPin) {
                                map.addMarker(results[0].geometry.location, address);
                            }
                        }
                    }
                });
            }

            // Add a loop link back to the element in the DOM
            map.$element = $this;

        });

        if (this.length === 1) {
            return $(this).data('carte');
        }

    };

}(window.jQuery));
