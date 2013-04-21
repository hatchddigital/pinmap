/*! Pinmap - v2.1.4 - 2013-04-21
* https://github.com/hatchddigital/pinmap
* Copyright (c) 2013 Hatchd Digital; Licensed MIT */

/* global google, InfoBox */
/* jshint laxcomma: true, laxbreak: true, camelcase: false */

(function($) {
    'use strict';

    /**
     * Attaches our  Google Map to an element in the DOM
     * and puts the default markers into the system ready for dealing
     * with moving around the page
     */
    var PinMap = function (element, options) {

        // Preset default options
        options = $.extend({
            latitude: -31.95391,
            longitude:  115.858512,
            popup_close_icon: null,
            popup_close_margin: '0px',
            popup_offset: new google.maps.Size(60, 100)
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
            pixelOffset: options.popup_offset,
            closeBoxURL: options.popup_close_icon,
            closeBoxMargin: options.popup_close_margin,
            infoBoxClearance: new google.maps.Size(40, 40)
        });
        return this;
    };

    /**
     * Puts a pin on the map with the provided details. Returns the
     * Google Map object for chaining.
     */
    PinMap.prototype.addMarker = function (location, title, id, marker_icon,
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

    PinMap.prototype.panTo = function(location) {
        this.google_map.panTo(location);
        this.google_map.setZoom(12);
    };

    /**
     * Center the map on specified marker. Usually will be attached to a JS
     * user event (like a click) passing the ID or title
     */
    PinMap.prototype.centerOnMarker = function (settings) {
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
    PinMap.prototype.toggleMarkers = function (settings) {
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
    $.fn.pinmap = function(options, callback) {
        options = options || {};
        callback = typeof callback === 'function' ? callback : false;
        this.each(function() {
            var $this = $(this)
              , geocoder = new google.maps.Geocoder()
              , pinmap = $this.data('pinmap')
              , address = (($this.attr('data-address') !== undefined) ?
                              $this.attr('data-address') : false);
            // If we can't find an existing map, create and store
            if (!pinmap) {
                $this.data('pinmap', (pinmap = new PinMap(this, options)));
            }
            // Geocode the address, and create the pinmap
            if (address) {
                geocoder.geocode( {'address': address }, function (results, status) {
                    var location;
                    if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                        location = results[0].geometry.location;
                        pinmap.google_map.panTo(location);
                        if (options.addPin) {
                            pinmap.addMarker(location, address);
                        }
                    }
                });
            }
            if (callback) {
                callback.call(this, pinmap);
            }
        });
    };

    window.PinMap = PinMap;

}(window.jQuery));
