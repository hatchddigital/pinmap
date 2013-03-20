/*! Hatchling Map - v2.0.0 - 2013-03-20
* https://github.com/hatchddigital/jquery.lecarte
* Copyright (c) 2013 Jimmy Hillis; Licensed MIT */

(function($) {
    "use strict";
    /*global google:true, InfoBox:true*/

    /**
     * Attaches our  Google Map to an element in the DOM
     * and puts the default markers into the system ready for dealing
     * with moving around the page
     */
    var Map = function (element, options) {

        // Preset default options
        options = $.extend({
            latitude: -31.95391,
            longitude:  115.858512
        }, options);

        // An element MUST be provided to attach the Google Map into the DOM
        if (!element || !$(element).length) {
            return false;
        }

        var

        // all available markers (facilities) for messing with
        // default options for the google map (see Maps API v3.)
            google_map_options = $.extend({
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
        this.infowindow = new InfoBox({
            alignBottom: true,
            pixelOffset: new google.maps.Size(60, 100),
            closeBoxURL: 'images/map-close.png',
            closeBoxMargin: '10px',
            infoBoxClearance: new google.maps.Size(40, 40)
        });
        return this;
    };

    /**
     * Puts a pin on the map with the provided details. Returns the
     * Google Map object for chaining.
     */
    Map.prototype.addMarker = function (location, title, id, marker_icon,
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
    Map.prototype.centerOnMarker = function (settings) {
        var search_id = settings.id || false
          , search_title = settings.title || false
          , zoom = settings.zoom || false
          , that = this;
        // Required settings not provided, return false and do nothing
        if (!search_id && !search_title) {
            return false;
        }
        // Search for the provided marker by title and ID and center
        $.each(this.available_markers, function(index, marker) {
            if (marker.title === search_title ||
                    marker.id === search_id) {
                that.google_map.panTo(marker.position);
                if (that.infowindow.getContent() !== marker.description) {
                    that.infowindow.setContent(marker.description);
                    that.infowindow.open(marker.map, marker);
                    if (zoom) {
                        that.google_map.setZoom(zoom);
                    }
                }
            }
        });
    };

    /**
     * Toggle visibility of a specific type (or all) markers
     * on currently on the map.
     */
    Map.prototype.toggleMarkers = function (settings) {
        var type = settings.type || false
          , action = settings.action || false;
        $.each(this.available_markers, function(index, marker) {
            if (!type || marker.type === type) {
                marker.setVisible(action);
                if (!action &&
                    this.infowindow.getContent() === marker.description) {
                    marker.infowindow.close();
                }
            }
        });
    };

    /**
     * jQuery plugin to build Hatchling Maps on provided element blocks.
     *
     * > USAGE:
     * > var map = $('#element_id').map({ ... });
     * > map.addMarker({ ... });
     *
     * @param {object} options Key/pair options to be use on a Google Map
     *                         as described http://goo.gl/PwWXs
     */
    $.fn.map = function(options) {
        options = options || {};
        this.each(function() {
            var $this = $(this)
              , geocoder = new google.maps.Geocoder()
              , map = $this.data('map')
              , address = (($this.attr('data-address') !== undefined) ?
                              $this.attr('data-address') : false);
            // If we can't find an existing map, create and store
            if (!map) {
                $this.data('map', (map = new Map(this, options)));
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
        });
        // Single map attach return the created object
        if (this.length === 1) {
            return $(this).data('map');
        }
    };

}(window.jQuery));
