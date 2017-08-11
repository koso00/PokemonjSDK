/*
 * OSU Menu for jQuery JavaScript Library
 *
 * Copyright (c) 2013, johnmave126
 * All rights reserved.
 * Distributed Under BSD 2-clause License
 *
 * Author: John Tan
 * Version: 0.1
 */

(function($) {

  // Adapted from jquery.jPlayer.js (2.4.1):
  // Further Adapted from jquery.ui.widget.js (1.8.7):
  $.fn.OSUMenu = function(options) {
    var name = "OSUMenu";
    var isMethodCall = typeof options === "string",
      args = Array.prototype.slice.call(arguments, 1),
      returnValue = this;

    //Merge options
    options = !isMethodCall && args.length ?
      $.extend.apply(null, [true, options].concat(args)) :
      options;

    //Never called from internal methods
    if (isMethodCall && options.charAt(0) === "_") {
      return returnValue;
    }

    if (isMethodCall) {
      this.each(function() {
        var instance = $(this).data(name),
          methodValue = instance && $.isFuncction(instance[options]) ?
          instance[options].apply(instance, args) :
          instance;
        if (methodValue !== instance && methodValue !== undefined) {
          returnValue = methodValue;
          return false;
        }
      });
    } else {
      this.each(function() {
        var instance = $(this).data(name);
        if (instance) {
          //Apply Options
          instance.options(options || {});
        } else {
          $(this).data(name, new $.OSUMenu(options, this));
        }
      });
    }

    return returnValue;
  };

  $.OSUMenu = function(options, element) {
    if (arguments.length) {
      this.element = $(element);
      this.options = $.extend(true, {},
        this.options,
        options
      );
      var self = this;
      self.element.bind("remove.OSUMenu", function() {
        self.destroy();
      });
      self._init();
    }
  };
  // End of: (Adapted from jquery.jPlayer.js (2.4.1))

  $.OSUMenu.spec = {
    transform: [
      "webkitTransform",
      "MozTransform",
      "msTransform",
      "OTransform",
      "transform"
    ]
  };

  $.OSUMenu.colors = [
    "red",
    "blue",
    "light-blue",
    "orange",
    "pink"
  ];

  $.OSUMenu.prototype = {
    count: 0,

    version: { // Static
      script: "0.1"
    },

    options: { // Static
      randomColor: false, // Assign random color to inserted item
      outScroller: true, // Scroll back to active item if mouse moves out
      itemHeight: "50px", // The height of each item
      deepestOverlap: "1em", // The deepest overlap between items
      defaultCallback: null, // The default callback on click
      defaultColor: "orange", // The default background color
      selectors: {
        wrapperName: ".osu-wrapper", // The item in the list
        listItem: ".osu-item", // The item in the list
        activeItem: ".osu-selected", // The item in the list which is selected
      }
    },

    internal: {
      ready: false,
      activeItem: null
    },

    _init: function() {
      var self = this;

      self.internal = $.extend({}, this.internal);
      self.domNode = this.element.get(0);
      self.listElement = this.element.children(".osu-list-wrapper");
      self.listNode = this.listElement.get(0);
      self.selector = ".osu-instance-" + this.count;
      this.count++;

      self.element.on("scroll", $.proxy(this._adjustItems, this));
      $(document.documentElement).on("resize", self.selector, $.proxy(this._adjustItems, this));
      self.listElement.children(this.options.selectors['listItem'])
        .css("height", this.options.itemHeight)
        .on("click", $.proxy(this._clickHandler, this))
        .on("click", this.options.defaultCallback);
      if (self.options.outScroller) {
        self.element.mouseleave($.proxy(this._outHandler, this));
      }
      self.element.trigger("scroll");
    },

    _clickHandler: function(e) {
      var self = this;
      self.activeItem = $(e.currentTarget);
      self.listElement.children(this.options.selectors['activeItem']).removeClass(this.options.selectors['activeItem'].substr(1));
      self.activeItem.addClass(this.options.selectors['activeItem'].substr(1));
      $.smoothScroll({
        scrollElement: this.element,
        scrollTarget: ".osu-top",
        offset: this.activeItem[0].offsetTop
      });
    },

    _outHandler: function(e) {
      // Using jquery.smooth-scroll.js
      this.activeItem && $.smoothScroll({
        scrollElement: this.element,
        scrollTarget: ".osu-top",
        offset: this.activeItem[0].offsetTop
      });
    },

    _adjustItems: function() {
      var self = this,
        inviewItems = this._getInView(),
        itemHeight = inviewItems[0] ?
        inviewItems[0].clientHeight :
        0,
        clientHeight = this.domNode.clientHeight,
        halfHeight = itemHeight + (clientHeight >> 1),
        viewCenter = this.domNode.scrollTop - (itemHeight >> 1);
      inviewItems.each(function() {
        var item = $(this),
          distance = viewCenter - this.offsetTop,
          absDistance = Math.abs(distance),
          transformText = "translateX(" +
          ((item.hasClass(self.options.selectors['activeItem'].substr(1)) ?
            10 : 20
          ) + (10 * absDistance / halfHeight)) + "%) " +
          "scale(1)",
          deepestOverlapLength = ~~(self.options["deepestOverlap"].match(/^\d+/)[0] || 1),
          deepestOverlapUnit = self.options["deepestOverlap"].match(/[a-zA-Z%]+$/)[0] || "em";
        $.each($.OSUMenu.spec.transform, function() {
          item.css(this, transformText);
        });
        item.css("margin-bottom", (-deepestOverlapLength / 2 +
          deepestOverlapLength * distance / clientHeight) + deepestOverlapUnit);
      });
    },

    _getInView: function() {
      var clientHeight = this.domNode.clientHeight,
        viewStart = this.domNode.scrollTop - (clientHeight >> 1),
        viewEnd = viewStart + clientHeight,
        allChildren = this.listElement.children(),
        itemHeight = allChildren[0].clientHeight,
        cumulativeTop = 0,
        start, end;
      for (start = 0; cumulativeTop < viewStart && start < allChildren.length; start++) {
        cumulativeTop += itemHeight;
      }
      for (end = start; cumulativeTop <= viewEnd && end < allChildren.length; end++) {
        cumulativeTop += itemHeight;
      }
      return allChildren.slice(Math.max(0, start - 1), end + 1);
    },

    destroy: function() {
      $(document.documentElement).off("resize", this.selector);
    },

    insertItem: function(title, options) {
      options = $.extend({
        subtitle: "",
        callback: this.options.defaultCallback,
        color: this.options.randomColor ? null : this.options.defaultColor,
      }, options);
      var entry = $('<li class="osu-item loading"><div class="osu-item-title"></div><div class="osu-item-subtitle">Testing</div></li>');
      entry.children(".osu-item-title").text(title);
      entry.children(".osu-item-subtitle").text(options.subtitle);
      entry.css("height", this.options.itemHeight)
        .on("click", $.proxy(this._clickHandler, this))
        .on("click", this.options.defaultCallback);
      if (!options.color) {
        options.color = $.OSUMenu.colors[~~(Math.random() * $.OSUMenu.colors.length)];
      }
      entry.addClass("osu-" + options.color);
      this.listElement.append(entry);
      entry.removeClass("loading");
    }
  };

}(window.jQuery));



function pokedexlistpopulate() {
  for (i = 1; i < 10; i++) {
    $("#pokedexlist").append('<li class="osu-item"><div class="osu-item-title">'+i+'</div><div class="osu-item-subtitle">'+dbpokemon[i].Name+'</div></li>');
  }
  $(".right-panel").find("li")[0].remove();
  var menu;
  $(function() {
    menu = $('.right-panel').OSUMenu({
      defaultCallback: function() {
        pokedexpopulate($(this).find(".osu-item-title").text())
      }
    }).data("OSUMenu");
  });
}
