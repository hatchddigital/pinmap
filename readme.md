# Le Carte
### A *hatchdling* jQuery plugin for Google Map functionality

The Mapping functionality provided sets up some useful boilerplate and a
jQuery plugin for quickly building maps directly from markup. It also has a
simple JS API for adding pins and popups that allow for easily styled (CSS)
elements on your map.

## Usage

### Requirements
[jQuery 1.7+](jquery.com)
[Google Maps API v3](https://developers.google.com/maps/documentation/javascript/reference)

### HTML Markup
The only required markup is the element where the map will be placed. Be aware
this element REQUIRES a height and width set for Google Maps to function
correctly.

You may also apply the address or geo co-ordinates directly to the element as
data- elements to provid a non-JS required implementation of Le Carte.

*Note*: I'm using HAML markup for simplicity, and because it's useful to know.

    .lecarte[data-address="100 Hatchd Street, Perth"]

### JavaScript attach
Simple jQuery plugin attach for any tabbed elements you've built. You can
pass any Google Map options that you would like to have them applied during
initialization. See [Google Maps APIv3](https://developers.google.com/maps/documentation/javascript/reference#MapOptions)
for more information.

This plugin, using Google Maps requires the Google Maps APIv3 and should be
included before you include the `lecarte.js` script.

## Credits
Hatchd Digital <http://hatchd.com.au>
Jimmy Hillis <jimmy@hatchd.com.au>
