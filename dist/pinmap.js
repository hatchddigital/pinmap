/*! Pinmap - v2.2.2 - 2013-06-04
* https://github.com/hatchddigital/pinmap
* Copyright (c) 2013 Hatchd Digital; Licensed MIT */

/* global google, define */
/* jshint laxcomma: true, laxbreak: true, camelcase: false */

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else {
        // Browser globals
        factory(jQuery);
    }

}(function ($) {

    /**
     * Attaches our  Google Map to an element in the DOM
     * and puts the default markers into the system ready for dealing
     * with moving around the page
     */
    var PinMap = function (element, options) {

        // Preset default options
        options = $.extend({
            // Perth represent
            latitude: -31.95391,
            longitude: 115.858512,
            popup: false
        }, options);

        // An element must be provided, else fail
        if (!element || !$(element).length) {
            return false;
        }

        var
        // Set local variable for access within helpers
            pinmap = this,
        // Set options for the google map (see Maps API v3.)
            google_map_options = $.extend({
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(
                    options.latitude, options.longitude)
            }, options);

        // Assign for all DOM related work
        this.$element = $(element);

        // Add google map within a wrap div so it doesn't delete
        // content within the PinMap $element. Important when
        // dealing with popups that are not part of the Google Map
        var $wrap = $('<div class="gm" style="width:100%;height:100%" />');
        this.google_map = new google.maps.Map($wrap[0], google_map_options);
        this.$element.append($wrap);

        // Setup an internal available markers on this map
        this.available_markers = [];

        // Single info window
        if (options.popup) {
            this.popup = options.popup;
        }

        return this;
    };

    /**
     * Puts a pin on the map with the provided details. Returns the
     * Google Map object for chaining.
     */
    PinMap.prototype.addMarker = function (location, title, id, marker_icon,
                                           description, type) {
        var pinmap = this,
            marker = new google.maps.Marker({
                position: location,
                map: this.google_map,
                title: title,
                icon: marker_icon,
                optimized: false
            });
        marker.id = id;
        marker.popup = this.popup;
        marker.description = description;
        marker.type = type || {};
        this.available_markers.push(marker);
        // Setup HTML popup for Marker
        google.maps.event.addListener(marker, 'click', function() {
            if (marker.popup) {
                if (pinmap.popup.getContent() === marker.description) {
                    pinmap.popup.close();
                }
                else {
                    marker.popup.setContent(marker.description);
                    marker.popup.open(marker.map, marker, pinmap);
                }
            }
        });
    };

    /**
     * Helper method to use Google Map panTo method.
     * @param  {google.map.LatLng} location Location to move the map to
     * @return null
     */
    PinMap.prototype.panTo = function(location) {
        return this.google_map.panTo(location);
    };

    /**
     * Monkey patch support for Google Maps to allow a panTo that takes
     * an offset in pixels and works accordingly.
     */
    PinMap.prototype.panToWithOffset = function(latlng, offsetX, offsetY) {
        var map = this.google_map;
        var ov = new google.maps.OverlayView();
        ov.onAdd = function() {
            var proj = this.getProjection();
            var aPoint = proj.fromLatLngToContainerPixel(latlng);
            aPoint.x = aPoint.x+offsetX;
            aPoint.y = aPoint.y+offsetY;
            map.panTo(proj.fromContainerPixelToLatLng(aPoint));
        };
        ov.draw = function() {};
        ov.setMap(map);
    };

    /**
     * Center the map on specified marker. Usually will be attached to a JS
     * user event (like a click) passing the ID or title
     */
    PinMap.prototype.centerOnMarker = function (settings) {
        var search_id = settings.id || false
          , search_title = settings.title || false
          , zoom = settings.zoom || false
          , pinmap = this;
        // Required settings not provided, return false and do nothing
        if (!search_id && !search_title) {
            return false;
        }
        // Search for the provided marker by title and ID and center
        $.each(this.available_markers, function(index, marker) {
            if (marker.title === search_title || marker.id === search_id) {
                pinmap.panTo(marker.position);
                if (pinmap.popup &&
                        pinmap.popup.getContent() !== marker.description) {
                    pinmap.popup.setContent(marker.description);
                    pinmap.popup.open(marker.map, marker, pinmap);
                    if (zoom) {
                        pinmap.google_map.setZoom(zoom);
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
                if (!action && this.popup.getContent() === marker.description) {
                    marker.popup.close();
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
                geocoder.geocode( {'address': address },
                function (results, status) {
                    var location;
                    if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                        location = results[0].geometry.location;
                        pinmap.panTo(location);
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

    return PinMap;

}));
