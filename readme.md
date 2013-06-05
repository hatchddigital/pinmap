# Hatchling PinMap
### A *hatchdling* jQuery plugin for Google Map functionality

The core functionality of this plugin provides useful Google Map wrappers with
a jQuery plugin for quickly building maps directly from data provided in HTML
markup.

There is also a simple API for adding pins and popups that allow front end
developers to easily style many elements directly through CSS.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/hatchddigital/hatchling.pinmap/master/dist/hatchling.pinmap.min.js
[max]: https://raw.github.com/hatchddigital/hatchling.pinmap/master/dist/hatchling.pinmap.js

Include file within your project through HTML (or preferably a single JS file)
with minification.

### JavaScript Requirements
[jQuery 1.7+](jquery.com)
[Google Maps API v3](https://developers.google.com/maps/documentation/javascript/reference)

### Required markup
The only required markup is the element where the map will be placed. Be aware
this element REQUIRES a height and width set for Google Maps to function
correctly.

You may also apply the address or geo co-ordinates directly to the element as
data- elements to provid a non-JS required implementation of the Map.

```html
<script src="jquery.js"></script>
<script src="dist/hatchling.pinmap.min.js"></script>
...
<div class="pinmap" data-address="100 Hatchd Street, Perth"></div>
```

```javascript
<script>
jQuery(function($) {
  $('.pinmap').pinmap();
});
</script>
```

## Popup example

The library now allows users to develop their own popup modules to use within
this projects to increase the customization required. For popup support you
must provide an object with the following methods:

-- open:: Shows the popup on the screen
-- setContent:: Sets the content to a provided string
-- getContent:: Returns the current content of the popup as provided by set

Support exists for InfoBox which was the previously used popup object.

### InfoBox
To use Google Maps Utility InfoBox all that is require is for you to include
the library within your code (see: https://code.google.com/p/google-maps-utility-library-v3/)
and initialize in the following way:

```javascript
<script>
var popup = new InfoBox({
    alignBottom: true,
    infoBoxClearance: new google.maps.Size(40, 40)
});
jQuery(function($) {
  $('.pinmap').pinmap({
    'popup': popup
  });
});
</script>
```

This will allow you to use InfoBox exactly the same previous versions without
the fake

## Credits + Contributors
Hatchd Digital <http://hatchd.com.au>
Jimmy Hillis <jimmy@hatchd.com.au>
Niaal Holder <niaal@hatchd.com.au>

## Release History
v2.2.4 New features include:
- locateUser method for geo-encoding the current user and providing a callback support.
- Added buildDirectionsUrl to provide URLs for native mapping apps or browser based fallback
v2.2.3 Fix bug with centerOnMarker that stopped the zoom property from working
v2.2.2 Return PinMap object for requreJS AMD loading.
v2.2.1 Added support for requireJS and AMD loading.
v2.2.0 Removed InfoBox functionality. All pinmap usage requires you to pass
  your own popup now which allows us to remove all external dependencies.
  Examples using InfoBox are now provided within the documentation to continue
  working the same as before.
v2.1.0 Renamed the project and code to be Pinmap to fix a conflict with jQuery
v2.0.0 Updated version with Grunt support
