Typeahead
============

An extension of the Twitter Bootstrap Typeahead plugin (as of v2.0.2)<br />
<http://twitter.github.com/bootstrap/javascript.html#typeahead>

Demo
-----------------
http://tcrosen.github.com/twitter-bootstrap-typeahead/

Required
-----------------
* Twitter Bootstrap 2.0.2+
* jQuery 1.7.1+

About
-----
All the thanks in the world to [@mdo](https://twitter.com/#!/mdo) and [@fat](https://twitter.com/#!/fat) of [@twitter](https://twitter.com/) for the wonderful Bootstrap utility.<br />
I required more functionality out of the typeahead plugin so I created this simple extension.  I do plan to add more features in the future.

Changes from the Original
-------

**Methods:**

All original methods are now overridable:

matcher<br />
sorter<br />
highlighter<br />
select<br />
render<br />

**New Options:**

**valueProp**<br />
Default: *id*<br />
Description: The object value that is returned when an item is selected.

**matchProp**<br />
Default: *name*<br />
Description: The object property to match the query against.

**sortProp**<br />
Default: *name*<br />
Description: The object property to use when sorting the items.

**template**<br />
Default: *'<%= matchProp %>'*<br />
Description: An html string for the list item. Object properties can be supplied in ERB-style tags, 
and will be rendered from the source data passed in. matchProp is a magic property that converts to whatever the defined matchProp option is set to.<br />

**itemSelected**<br />
Default: *function (element, val, text, item) {}*<br />
Description: The callback function that is invoked when an item is chosen.<br />

+ element: the HTML element that was selected

+ val: value of the *valueProp* property

+ text: value of the *textProp* property

+ item: the source data object for the selected entry

Sample Usage
------------
    var cities = [
			{ID: 1, Name: 'Toronto', Country: 'Canada'},
			{ID: 2, Name: 'Montreal', Country: 'Canada'},
			{ID: 3, Name: 'New York', Country: 'USA'},
			{ID: 4, Name: 'Buffalo', Country: 'USA'},
			{ID: 5, Name: 'Boston', Country: 'USA'},
			{ID: 6, Name: 'Columbus', Country: 'USA'},
			{ID: 7, Name: 'Dallas', Country: 'USA'},
			{ID: 8, Name: 'Vancouver', Country: 'USA'},
			{ID: 9, Name: 'Seattle', Country: 'USA'},
			{ID: 10, Name: 'Los Angeles', Country: 'USA'}
	    ]

	$(function() {
		$('#myElement').typeahead({
			source: cities,
			matchProp: 'Name',
			sortProp: 'Name',
			valueProp: 'ID',
			itemSelected: function(element, val, text, item) {
				alert('You selected the city ' + text + '('+ item.Country +') with ID ' + val + '')
				console.log(item)
			}
		})
	})

A full working example is included in this project and is now available at http://tcrosen.github.com/twitter-bootstrap-typeahead/