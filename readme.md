# Hatchling Map: Le Carte
### A *hatchdling* jQuery plugin for Google Map functionality

The core functionality of this plugin provides useful Google Map wrappers with
a jQuery plugin for quickly building maps directly from data provided in HTML
markup.

There is also a simple API for adding pins and popups that allow front end
developers to easily style many elements directly through CSS.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/hatchddigital/jquery.lecarte/master/dist/hatchling.map.min.js
[max]: https://raw.github.com/hatchddigital/jquery.lecarte/master/dist/hatchling.map.js

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
data- elements to provid a non-JS required implementation of Le Carte.

```html
<script src="jquery.js"></script>
<script src="dist/hatchling.map.min.js"></script>
...
<div class="lecarte" data-address="100 Hatchd Street, Perth"></div>
```

```javascript
<script>
jQuery(function($) {
  $('.lecarte').lecarte();
});
</script>
```

## Credits
Hatchd Digital <http://hatchd.com.au>
Jimmy Hillis <jimmy@hatchd.com.au>

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
