/**
 * HATCHD DIGITAL PINMAP with Google Maps API v3
 *
 * This set of code allows us to manage Mapping functionality using Google
 * Maps to add/remove/hide and play with icons and boxes in an easily-styled
 * and pretty way.
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au
 *
 * FOR DEVELOPERS:
 *
 * The code in this file should always be well formatted and never be
 * used in production systems. Your site should always use disc/*-.min.js
 * which contains a packed and minified version of the script
 * prepended with all dependencies.
 *
 * REQUIRED FRAMEWORKS
 *
 * @required jquery (v1.8.0+)
 * -- (http://jquery.com)
 * @required Google Maps API v3
 * -- (http://developers.google.com/maps/documentation/javascript/)
 *
 * VALIDATION
 *
 * All code must validate with JSHint (http://www.jshint.com/) before
 * commiting this repo. NO debug code should remain in your final
 * versions. Ensure to remove every reference to console.log.
 *
 * STYLE
 *
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * CONTRIBUTORS
 *
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @author Niaal Holder <niaal@hatchd.com.au>
 *
 */

(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else {
        // Browser globals
        factory(window.jQuery);
    }

}(function ($) {
    'use strict';

    /**
     * Attaches our  Google Map to an element in the DOM
     * and puts the default markers into the system ready for dealing
     * with moving around the page
     */
    var PinMap = function (element, options) {

        // Preset default options
        this.options = $.extend({
            // Perth represent
            latitude: -31.95391,
            longitude: 115.858512,
            popup: false,
            centerOnMarker: true
        }, options);

        // An element must be provided, else fail
        if (!element || !$(element).length) {
            return false;
        }

        // Assign for all DOM related work
        this.$element = $(element);
        // Setup an internal available markers on this map
        this.markers = [];

        // Set options for the google map (see Maps API v3.)
        var google_map_options = $.extend({
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(
                    this.options.latitude, this.options.longitude)
            }, this.options);

        // Add wrap element div so it doesn't delete
        // content within the PinMap $element. Important when
        // dealing with popups that are not part of the Google Map
        var $wrap = $('<div class="gm" style="width:100%;height:100%;" />').appendTo(this.$element);
        this.google_map = new google.maps.Map($wrap[0], google_map_options);

        // Single info window
        if (this.options.popup) {
            this.popup = this.options.popup;
        }

        return this;
    };

    /**
     * Puts a pin on the map with the provided details. Returns the
     * Google Map object for chaining.
     */
    PinMap.prototype.addMarker = function (location, title, id, marker_icon,
                                           description, type) {
        var that = this;
        var marker = new google.maps.Marker({
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
        marker.current = false;
        this.markers.push(marker);
        // Setup HTML popup for Marker
        google.maps.event.addListener(marker, 'click', function() {
            if (marker.popup) {
                if (that.popup.getContent() === marker.description) {
                    that.popup.close();
                }
                else {
                    that.showMarker(marker);
                }
            }
        });
        return marker;
    };

    /**
     * Remove an existing pin (if found) from the map mapping
     * the provided ID.
     * @param string id Unique pin identifier
     * @return void
     */
    PinMap.prototype.removeMarker = function (id) {
        var i;
        for (i = this.markers.length - 1; i >= 0; i--) {
            if (this.markers[i].id === id) {
                this.markers[i].current = false;
                this.markers[i].setMap(null);
                this.markers.slice(i, 1);
            }
        }
    };

    /**
     * Show the provided marker within the pre-set popup.
     * @param google.maps.Marker marker Marker to show in popup
     * @return void
     */
    PinMap.prototype.showMarker = function (marker) {
        marker.popup.setContent(marker.description);
        if (this.options.centerOnMarker === true) {
            this.centerOnMarker({ 'id': marker.id });
        }
        // Wipe any other current marker
        for (var i = this.markers.length - 1; i >= 0; i--) {
            this.markers[i].current = false;
        }
        marker.current = true;
        marker.popup.open(marker.map, marker, this);
    };

    PinMap.prototype.currentMarker = function () {
        var that = this;
        var i;
        for (i = 0; i < this.markers.length; i++) {
            if (this.markers[i].current) {
                return this.markers[i];
            }
        }
        return null;
    };

    PinMap.prototype.nextMarker = function () {
        var that = this;
        var i;
        // Find the current marker
        for (i = 0; i < this.markers.length; i++) {
            if (this.markers[i].current) {
                return (typeof this.markers[i + 1] !== "undefined") ?
                    this.markers[i + 1] : this.markers[0];
            }
        }
    };

    PinMap.prototype.nextMarker = function () {
        var that = this;
        var i;
        // Find the current marker
        for (i = 0; i < this.markers.length; i++) {
            if (this.markers[i].current) {
                return (typeof this.markers[i + 1] !== "undefined") ?
                    this.markers[i + 1] : this.markers[0];
            }
        }
    };

    PinMap.prototype.previousMarker = function () {
        var that = this;
        var i;
        // Find the current marker
        for (i = 0; i < this.markers.length; i++) {
            if (this.markers[i].current) {
                return (typeof this.markers[i - 1] !== "undefined") ?
                    this.markers[i - 1] :
                    this.markers[this.markers.length-1];
            }
        }
    };

    /**
     * Helper method to use Google Map panTo method.
     * @param google.map.LatLng location Location to move the map to
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
     * Return a marker based on the ID value provided.
     * @param string The ID of the marker to be returned
     * @return google.maps.Marker
     */
    PinMap.prototype.findMarker = function (id) {
        for (var i = this.markers.length - 1; i >= 0; i--) {
            if (this.markers[i].id === id) {
                return this.markers[i];
            }
        };
    };

    /**
     * Center the map on specified marker. Usually will be attached to a JS
     * user event (like a click) passing the ID or title
     */
    PinMap.prototype.centerOnMarker = function (settings) {
        var search_id = settings.id || false;
        var search_title = settings.title || false;
        var zoom = settings.zoom || false;
        var popup = settings.popup || false;
        var that = this;
        // Required settings not provided, return false and do nothing
        if (!search_id && !search_title) {
            return false;
        }
        // Search for the provided marker by title and ID and center
        $.each(this.markers, function (index, marker) {
            if (marker.title === search_title || marker.id === search_id) {
                that.panTo(marker.position);
                if (zoom) {
                    that.google_map.setZoom(zoom);
                }
                if (popup) {
                    that.showMarker(marker);
                }
            }
        });
    };

    /**
     * Toggle visibility of a specific type (or all) markers
     * on currently on the map.
     */
    PinMap.prototype.toggleMarkers = function (type, action) {
        type = type || false;
        $.each(this.markers, function(index, marker) {
            if (type && marker.type === type) {
                if (typeof action === 'boolean') {
                    marker.setVisible(action);
                }
                else {
                    marker.setVisible(!marker.visible);
                }
            }
        });
    };

    /**
     * Locate the current user, where possible and center the map
     * on their position.
     *
     * Options include:
     * > Pan: if True then pan map to the user's current location
     * > Marker: if True add a marker ar user's current location
     * > Icon: if Marker is True use provided image URL as icon for user's
     *         current location
     *
     * @return void
     */
    PinMap.prototype.locateUser = function (options, callback) {
        var that = this;
        var deferred = $.Deferred();
        options = $.extend({
            'pan': true,
            'marker': true,
            'icon': null
        }, options);
        callback = callback || false;
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (location) {
                that.user_coordinates = new google.maps.LatLng(
                    location.coords.latitude, location.coords.longitude);
                // Resolve .promise() successfull
                deferred.resolve(that.user_coordinates);
                if (options.pan) {
                    that.panTo(that.user_coordinates);
                }
                if (options.marker) {
                    that.addMarker(that.user_coordinates, 'Current Location',
                                   null, options.icon);
                }
                if (callback) {
                    callback(that.user_coordinates, that);
                }
            }, function (error) {
                // Reject .promise() error
                deferred.reject(error);
                if (callback) {
                    callback(false, that, error);
                }
            });
        }
        else {
            var error = 'Device does not support geolocation lookup.';
            // Reject .promise() error
            deferred.reject(error);
            if (callback) {
                callback(false, that, error);
            }
        }
        return deferred;
    };

    /**
     * Return a URL which can be used by the current device to open
     * a native map application (or Google maps) with directions mapped
     * out between the provided points.
     *
     * Compatible devices include:
     * - Desktop Chrome
     * - Desktop Safari
     * - Desktop Firefox
     * - iOS Chrome
     * - iOS Safari
     * - Android Browser
     * - Android Chrome
     */
    PinMap.prototype.buildDirectionsUrl = function (source, destination) {
        var directions_url = 'http://maps.apple.com';
        if (!source && !destination) {
            return directions_url;
        }
        if (source && destination) {
            directions_url = directions_url + '?saddr=' + encodeURIComponent(source);
            directions_url = directions_url + '&daddr=' + encodeURIComponent(destination);
        }
        else {
            directions_url = directions_url + '?saddr=' + encodeURIComponent(source || destination);
        }
        return directions_url;
    };

    /**
     * jQuery plugin to build Hatchling Maps on provided element blocks.
     *
     * > USAGE:
     * > var map = $('#element_id').map({ ... });
     * > map.addMarker({ ... });
     *
     * @param object options Key/pair options to be use on a Google Map
     *                       as described http://goo.gl/PwWXs
     */
    $.fn.pinmap = function(options, callback) {
        options = options || {};
        callback = typeof callback === 'function' ? callback : false;
        this.each(function() {
            var $this = $(this);
            var geocoder = new google.maps.Geocoder();
            var pinmap = $this.data('pinmap');
            var address = (($this.attr('data-address') !== undefined) ?
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
