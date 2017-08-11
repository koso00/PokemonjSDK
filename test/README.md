# osu! menu

## Features

### $.fn.OSUMenu
* An imitation to osu! song select UI
* Use like this: `$('#container').OSUMenu();`
* Add new item using `Menu.insertItem(title, options);`

#### Options

```javascript
{
	// Assign random color to inserted item
	randomColor: false,

	// Scroll back to active item if mouse moves out
	outScroller: true,

	// The height of each item
	itemHeight: "5em", 

	// The deepest overlap between items
	deepestOverlap: "1em", 

	// The default callback on click
	defaultCallback: null, 

	// The default background color
	defaultColor: "orange", 
	selectors: {
		wrapperName: ".osu-wrapper", // The item in the list
		listItem: ".osu-item", // The item in the list
		activeItem: ".osu-selected", // The item in the list which is selected
	}
}
```

#### Insert Item
First you need to grab the menu object
```javascript
// I am not familiar with jQuery Plugin convention
// Correct me if you are a developer of jQuery Plugin
// The plugin was splitted out from my other project
// The original form is vanilla js, so please forgive me
menu = $('#container').OSUMenu().data("OSUMenu");
```
And then insert it
```javascript
menu.insertItem(title, {
	subtitle: "", // The second line in the box
	callback: this.options.defaultCallback, // Called on click
	color: this.options.randomColor ? null : this.options.defaultColor, // The color to assigned to
});
```

## Notes
You may want to see a demo page at http://johnmave126.github.io/osu-menu/

Since the design is originally from osu! developed by peppy, the LICENSE of this project may change from time to time if I am requested to do so.

Finally, if you are a developer of other jQuery Plugins, you are cordily invited to polish my code.