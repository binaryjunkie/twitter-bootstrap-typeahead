// ===============================================================================
//
//  Custom implementation of Twitter Bootstrap Typeahead plugin
//  http://twitter.github.com/bootstrap/javascript.html#typeahead
//
//  v1.0.1
//  Terry Rosen  -  @rerrify
//
//  Requires jQuery 1.7+ and Twitter Bootstrap
//
!
function($) {

  "use strict"

  var Typeahead = function(element, options) {
      this.$element =       $(element)
      this.options =        $.extend({}, $.fn.typeahead.defaults, options)
      this.options.template = this.options.template.replace("matchProp", this.options.matchProp)
      this.$menu =          $(this.options.menu).appendTo('body')      
      this.source =         this.options.source
      this.shown =          false
      this.matcher =        this.options.matcher      || this.matcher
      this.sorter =         this.options.sorter       || this.sorter
      this.highlighter =    this.options.highlighter  || this.highlighter
      this.select =         this.options.select       || this.select
      this.render =         this.options.render       || this.render  
      this.listen()
    }

  Typeahead.prototype = {

    constructor: Typeahead

    ,
    select: function() {
      var $selectedItem = this.$menu.find('.active')
      this.$element.val($selectedItem.text())
      this.options.itemSelected($selectedItem, $selectedItem.attr('data-value'), $selectedItem.text())
      return this.hide()
    }

    ,
    show: function() {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height,
        left: pos.left
      })

      this.$menu.show()
      this.shown = true

      return this
    }

    ,
    hide: function() {
      this.$menu.hide()
      this.shown = false

      return this
    }

    ,
    lookup: function(event) {
      var _this = this
      var items
      var q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function(item) {
        var propVal = item[_this.options.matchProp] || item
        if (_this.matcher(propVal)) return item
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

    ,
    matcher: function(val) {
      return ~val.toLowerCase().indexOf(this.query.toLowerCase())
    }

    ,
    sorter: function(items) {
      var _this = this
      var beginswith = []
      var caseSensitive = []
      var caseInsensitive = []
      var item

      while (item = items.shift()) {
        var propVal = item[_this.options.matchProp] || item
        if (!propVal.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~propVal.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

    ,
    highlighter: function(item) {
      return item.replace(new RegExp('(' + this.query + ')', 'ig'), function($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }


    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    ,
    _tmplCache: {}

    ,
    _tmpl: function(str,data) {
       // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str) ?
        this._templCache[str] = this._templCache[str] ||
          this._tmpl(document.getElementById(str).innerHTML) :
        
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
          
          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +
          
          // Convert the template into pure JavaScript
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
      
      // Provide some basic currying to the user
      return data ? fn( data ) : fn;
    }

    ,
    renderTemplate: function(item){
      //leverage underscore's implementation for templating if possible
      if (window._ != null && typeof window._.template === "function" ) {
         return _(this.options.template).template(item)
      //If they're working without underscore (really? wtf-sad-haxors :'( ),use
      // j.resigs super-dope micro-templating (which is coincidentally what underscore uses)
      } else {
        return this._tmpl(this.options.template, item);
      }
    }

    ,
    render: function(items) {
      var _this = this

      items = $(items).map(function(i, item) {
        i = $(_this.options.item).attr('data-value', item[_this.options.valueProp] || item)
        if (i) {
          var matchItem = $.extend({}, item);
          matchItem[_this.options.matchProp] = _this.highlighter(item[_this.options.matchProp] || item) //store as a prop on the item
          i.find('a').html(_this.renderTemplate(matchItem)); 
          return i[0]
        }
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

    ,
    next: function(event) {
      var active = this.$menu.find('.active').removeClass('active')
      var next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

    ,
    prev: function(event) {
      var active = this.$menu.find('.active').removeClass('active')
      var prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

    ,
    listen: function() {
      this.$element.on('blur', $.proxy(this.blur, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

    ,
    keyup: function(e) {
      e.stopPropagation()
      e.preventDefault()

      switch (e.keyCode) {
      case 40:
        // down arrow
      case 38:
        // up arrow
        break

      case 9:
        // tab
      case 13:
        // enter
        if (!this.shown) return
        this.select()
        break

      case 27:
        // escape
        this.hide()
        break

      default:
        this.lookup()
      }

    }

    ,
    keypress: function(e) {
      e.stopPropagation()
      if (!this.shown) return

      switch (e.keyCode) {
      case 9:
        // tab
      case 13:
        // enter
      case 27:
        // escape
        e.preventDefault()
        break

      case 38:
        // up arrow
        e.preventDefault()
        this.prev()
        break

      case 40:
        // down arrow
        e.preventDefault()
        this.next()
        break
      }
    }

    ,
    blur: function(e) {
      var _this = this
      e.stopPropagation()
      e.preventDefault()
      setTimeout(function() {
        _this.hide()
      }, 150)
    }

    ,
    click: function(e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

    ,
    mouseenter: function(e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('typeahead')
      var options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>', 
    template: '<%= matchProp %>', //matchProp is a magic template var switched to use the matchProp specified;
    matchProp: 'name',
    sortProp: 'name',
    valueProp: 'id',
    itemSelected: function() {}
  }

  $.fn.typeahead.Constructor = Typeahead


  /* TYPEAHEAD DATA-API
   * ================== */

  $(function() {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function(e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery)