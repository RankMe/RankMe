/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/
if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);





/*
 CanvasJS HTML5 & JavaScript Charts - v1.4.1 GA - http://canvasjs.com/ 
 Copyright 2013 fenopix
*/
(function(){function M(a,c){a.prototype=ua(c.prototype);a.prototype.constructor=a;a.parent=c.prototype}function ua(a){function c(){}c.prototype=a;return new c}function ka(a,c,b){"millisecond"===b?a.setMilliseconds(a.getMilliseconds()+1*c):"second"===b?a.setSeconds(a.getSeconds()+1*c):"minute"===b?a.setMinutes(a.getMinutes()+1*c):"hour"===b?a.setHours(a.getHours()+1*c):"day"===b?a.setDate(a.getDate()+1*c):"week"===b?a.setDate(a.getDate()+7*c):"month"===b?a.setMonth(a.getMonth()+1*c):"year"===b&&a.setFullYear(a.getFullYear()+
1*c);return a}function T(a,c){return x[c+"Duration"]*a}function G(a,c){var b=!1;0>a&&(b=!0,a*=-1);a=""+a;for(c=c?c:1;a.length<c;)a="0"+a;return b?"-"+a:a}function ca(a){if(!a)return a;a=a.replace(/^\s\s*/,"");for(var c=/\s/,b=a.length;c.test(a.charAt(--b)););return a.slice(0,b+1)}function va(a){a.roundRect=function(a,b,d,e,f,g,l,q){l&&(this.fillStyle=l);q&&(this.strokeStyle=q);"undefined"===typeof f&&(f=5);this.lineWidth=g;this.beginPath();this.moveTo(a+f,b);this.lineTo(a+d-f,b);this.quadraticCurveTo(a+
d,b,a+d,b+f);this.lineTo(a+d,b+e-f);this.quadraticCurveTo(a+d,b+e,a+d-f,b+e);this.lineTo(a+f,b+e);this.quadraticCurveTo(a,b+e,a,b+e-f);this.lineTo(a,b+f);this.quadraticCurveTo(a,b,a+f,b);this.closePath();l&&this.fill();q&&0<g&&this.stroke()}}function la(a,c){return a-c}function wa(a,c){return a.x-c.x}function B(a){var c=((a&16711680)>>16).toString(16),b=((a&65280)>>8).toString(16);a=((a&255)>>0).toString(16);c=2>c.length?"0"+c:c;b=2>b.length?"0"+b:b;a=2>a.length?"0"+a:a;return"#"+c+b+a}function X(a,
c,b){b=b||"normal";var d=a+"_"+c+"_"+b,e=ma[d];if(isNaN(e)){try{a="position:absolute; left:0px; top:-20000px; padding:0px;margin:0px;border:none;white-space:pre;line-height:normal;font-family:"+a+"; font-size:"+c+"px; font-weight:"+b+";";if(!O){var f=document.body;O=document.createElement("span");O.innerHTML="";var g=document.createTextNode("Mpgyi");O.appendChild(g);f.appendChild(O)}O.style.display="";O.setAttribute("style",a);e=Math.round(O.offsetHeight);O.style.display="none"}catch(l){e=Math.ceil(1.1*
c)}e=Math.max(e,c);ma[d]=e}return e}function K(a,c,b,d){if(a.addEventListener)a.addEventListener(c,b,d||!1);else if(a.attachEvent)a.attachEvent("on"+c,function(c){c=c||window.event;c.preventDefault=c.preventDefault||function(){c.returnValue=!1};c.stopPropagation=c.stopPropagation||function(){c.cancelBubble=!0};b.call(a,c)});else return!1}function na(a,c,b){a*=P;c*=P;a=b.getImageData(a,c,2,2).data;c=!0;for(b=0;4>b;b++)if(a[b]!==a[b+4]|a[b]!==a[b+8]|a[b]!==a[b+12]){c=!1;break}return c?a[0]<<16|a[1]<<
8|a[2]:0}function oa(a,c,b){var d;d=a?a+"FontStyle":"fontStyle";var e=a?a+"FontWeight":"fontWeight",f=a?a+"FontSize":"fontSize";a=a?a+"FontFamily":"fontFamily";d=""+(c[d]?c[d]+" ":b&&b[d]?b[d]+" ":"");d+=c[e]?c[e]+" ":b&&b[e]?b[e]+" ":"";d+=c[f]?c[f]+"px ":b&&b[f]?b[f]+"px ":"";c=c[a]?c[a]+"":b&&b[a]?b[a]+"":"";!v&&c&&(c=c.split(",")[0],"'"!==c[0]&&'"'!==c[0]&&(c="'"+c+"'"));return d+=c}function Q(a,c,b){return a in c?c[a]:b[a]}function Y(a,c,b){if(v&&pa){var d=a.getContext("2d");Z=d.webkitBackingStorePixelRatio||
d.mozBackingStorePixelRatio||d.msBackingStorePixelRatio||d.oBackingStorePixelRatio||d.backingStorePixelRatio||1;P=da/Z;a.width=c*P;a.height=b*P;da!==Z&&(a.style.width=c+"px",a.style.height=b+"px",d.scale(P,P))}else a.width=c,a.height=b}function $(a,c){var b=document.createElement("canvas");b.setAttribute("class","canvasjs-chart-canvas");Y(b,a,c);v||"undefined"===typeof G_vmlCanvasManager||G_vmlCanvasManager.initElement(b);return b}function I(a,c,b){this._defaultsKey=a;var d={};b&&(S[b]&&S[b][a])&&
(d=S[b][a]);this._options=c?c:{};this.setOptions(this._options,d)}function w(a,c){c=c||{};w.parent.constructor.call(this,"Chart",c,c.theme?c.theme:"theme1");var b=this;this._containerId=a;this._objectsInitialized=!1;this.overlaidCanvasCtx=this.ctx=null;this._indexLabels=[];this._panTimerId=0;this._lastTouchEventType="";this._lastTouchData=null;this.panEnabled=!1;this._defaultCursor="default";this.plotArea={canvas:null,ctx:null,x1:0,y1:0,x2:0,y2:0,width:0,height:0};this._dataInRenderedOrder=[];if(this._container=
document.getElementById(this._containerId)){this._container.innerHTML="";var d=0,e=0,d=this._options.width?this.width:0<this._container.clientWidth?this._container.clientWidth:this.width,e=this._options.height?this.height:0<this._container.clientHeight?this._container.clientHeight:this.height;this.width=d;this.height=e;this._selectedColorSet="undefined"!==typeof R[this.colorSet]?R[this.colorSet]:R.colorSet1;this._canvasJSContainer=document.createElement("div");this._canvasJSContainer.setAttribute("class",
"canvasjs-chart-container");this._canvasJSContainer.style.position="relative";this._canvasJSContainer.style.textAlign="left";this._canvasJSContainer.style.cursor="auto";v||(this._canvasJSContainer.style.height="0px");this._container.appendChild(this._canvasJSContainer);this.canvas=$(d,e);this.canvas.style.position="absolute";if(this.canvas.getContext){try{this.canvas.style.background=this.backgroundColor}catch(f){}this._canvasJSContainer.appendChild(this.canvas);this.ctx=this.canvas.getContext("2d");
this.ctx.textBaseline="top";va(this.ctx);v?this.plotArea.ctx=this.ctx:(this.plotArea.canvas=$(d,e),this.plotArea.canvas.style.position="absolute",this.plotArea.canvas.setAttribute("class","plotAreaCanvas"),this._canvasJSContainer.appendChild(this.plotArea.canvas),this.plotArea.ctx=this.plotArea.canvas.getContext("2d"));this.overlaidCanvas=$(d,e);this.overlaidCanvas.style.position="absolute";this._canvasJSContainer.appendChild(this.overlaidCanvas);this.overlaidCanvasCtx=this.overlaidCanvas.getContext("2d");
this.overlaidCanvasCtx.textBaseline="top";this._eventManager=new U(this);K(window,"resize",function(){b._updateSize()&&b.render()});this._toolBar=document.createElement("div");this._toolBar.setAttribute("class","canvasjs-chart-toolbar");this._toolBar.style.position="absolute";this._toolBar.style.top="0px";this._toolBar.style.right="0px";this._canvasJSContainer.appendChild(this._toolBar);this._toolBar.style.display="none";this.bounds={x1:0,y1:0,x2:this.width,y2:this.height};K(this.overlaidCanvas,"click",
function(a){b._mouseEventHandler(a)});K(this.overlaidCanvas,"mousemove",function(a){b._mouseEventHandler(a)});K(this.overlaidCanvas,"mouseup",function(a){b._mouseEventHandler(a)});K(this.overlaidCanvas,"mousedown",function(a){b._mouseEventHandler(a)});K(this.overlaidCanvas,"mouseout",function(a){b._mouseEventHandler(a)});K(this.overlaidCanvas,window.navigator.msPointerEnabled?"MSPointerDown":"touchstart",function(a){b._touchEventHandler(a)});K(this.overlaidCanvas,window.navigator.msPointerEnabled?
"MSPointerMove":"touchmove",function(a){b._touchEventHandler(a)});K(this.overlaidCanvas,window.navigator.msPointerEnabled?"MSPointerUp":"touchend",function(a){b._touchEventHandler(a)});K(this.overlaidCanvas,window.navigator.msPointerEnabled?"MSPointerCancel":"touchcancel",function(a){b._touchEventHandler(a)});this._creditLink||(this._creditLink=document.createElement("a"),this._creditLink.setAttribute("class","canvasjs-chart-credit"),this._creditLink.setAttribute("style","outline:none;margin:0px;position:absolute;right:3px;top:"+
(this.height-14)+"px;color:dimgrey;text-decoration:none;font-size:10px;font-family:Lucida Grande, Lucida Sans Unicode, Arial, sans-serif"),this._creditLink.setAttribute("tabIndex",-1),this._creditLink.setAttribute("target","_blank"));this._toolTip=new L(this,this._options.toolTip,this.theme);this.layoutManager=new V(this);this.axisY2=this.axisY=this.axisX=this.data=null;this.renderCount=0;this.sessionVariables={axisX:{internalMinimum:null,internalMaximum:null},axisY:{internalMinimum:null,internalMaximum:null},
axisY2:{internalMinimum:null,internalMaximum:null}}}}else window.console&&window.console.log('CanvasJS Error: Chart Container with id "'+this._containerId+'" was not found')}function qa(a,c){for(var b=[],d=0;d<a.length;d++)if(0==d)b.push(a[0]);else{var e,f,g;g=d-1;e=0===g?0:g-1;f=g===a.length-1?g:g+1;b[b.length]={x:a[g].x+(a[f].x-a[e].x)/c/3,y:a[g].y+(a[f].y-a[e].y)/c/3};g=d;e=0===g?0:g-1;f=g===a.length-1?g:g+1;b[b.length]={x:a[g].x-(a[f].x-a[e].x)/c/3,y:a[g].y-(a[f].y-a[e].y)/c/3};b[b.length]=a[d]}return b}
function V(a){this._rightOccupied=this._leftOccupied=this._bottomOccupied=this._topOccupied=0;this.chart=a}function F(a,c){F.parent.constructor.call(this,"TextBlock",c);this.ctx=a;this._isDirty=!0;this._wrappedText=null;this._lineHeight=X(this.fontFamily,this.fontSize,this.fontWeight)}function W(a,c){W.parent.constructor.call(this,"Title",c,a.theme);this.chart=a;this.canvas=a.canvas;this.ctx=this.chart.ctx;"undefined"===typeof this._options.fontSize&&(this.fontSize=this.chart.getAutoFontSize(this.fontSize));
this.height=this.width=null;this.bounds={x1:null,y1:null,x2:null,y2:null}}function aa(a,c,b){aa.parent.constructor.call(this,"Legend",c,b);this.chart=a;this.canvas=a.canvas;this.ctx=this.chart.ctx;this.ghostCtx=this.chart._eventManager.ghostCtx;this.items=[];this.height=this.width=0;this.orientation=null;this.horizontalSpacing=10;this.dataSeries=[];this.bounds={x1:null,y1:null,x2:null,y2:null};"undefined"===typeof this._options.fontSize&&(this.fontSize=this.chart.getAutoFontSize(this.fontSize));this.lineHeight=
X(this.fontFamily,this.fontSize,this.fontWeight)}function ea(a,c){ea.parent.constructor.call(this,c);this.chart=a;this.canvas=a.canvas;this.ctx=this.chart.ctx}function N(a,c,b,d,e){N.parent.constructor.call(this,"DataSeries",c,b);this.chart=a;this.canvas=a.canvas;this._ctx=a.canvas.ctx;this.index=d;this.maxWidthInX=this.noDataPointsInPlotArea=0;this.id=e;this.chart._eventManager.objectMap[e]={id:e,objectType:"dataSeries",dataSeriesIndex:d};this.dataPointIds=[];this.axisY=this.axisX=null;this.axisPlacement=
this.getDefaultAxisPlacement();"undefined"===typeof this._options.indexLabelFontSize&&(this.indexLabelFontSize=this.chart.getAutoFontSize(this.indexLabelFontSize))}function y(a,c,b,d){y.parent.constructor.call(this,"Axis",c,a.theme);this.chart=a;this.canvas=a.canvas;this.ctx=a.ctx;this.intervalStartPosition=this.maxHeight=this.maxWidth=0;this.labels=[];this._labels=null;this.dataInfo={min:Infinity,max:-Infinity,viewPortMin:Infinity,viewPortMax:-Infinity,minDiff:Infinity};"axisX"===b?(this.sessionVariables=
this.chart.sessionVariables[b],this._options.interval||(this.intervalType=null)):this.sessionVariables="left"===d||"top"===d?this.chart.sessionVariables.axisY:this.chart.sessionVariables.axisY2;"undefined"===typeof this._options.titleFontSize&&(this.titleFontSize=this.chart.getAutoFontSize(this.titleFontSize));"undefined"===typeof this._options.labelFontSize&&(this.labelFontSize=this.chart.getAutoFontSize(this.labelFontSize));this.type=b;"axisX"!==b||c&&"undefined"!==typeof c.gridThickness||(this.gridThickness=
0);this._position=d;this.lineCoordinates={x1:null,y1:null,x2:null,y2:null,width:null};this.labelAngle=(this.labelAngle%360+360)%360;90<this.labelAngle&&270>=this.labelAngle?this.labelAngle-=180:180<this.labelAngle&&270>=this.labelAngle?this.labelAngle-=180:270<this.labelAngle&&360>=this.labelAngle&&(this.labelAngle-=360);if(this._options.stripLines&&0<this._options.stripLines.length)for(this.stripLines=[],c=0;c<this._options.stripLines.length;c++)this.stripLines.push(new fa(this.chart,this._options.stripLines[c],
a.theme,++this.chart._eventManager.lastObjectId));this._absoluteMaximum=this._absoluteMinimum=this._titleTextBlock=null;this.hasOptionChanged("minimum")&&(this.sessionVariables.internalMinimum=this.minimum);this.hasOptionChanged("maximum")&&(this.sessionVariables.internalMaximum=this.maximum);this.trackChanges("minimum");this.trackChanges("maximum")}function fa(a,c,b,d){fa.parent.constructor.call(this,"StripLine",c,b);this._thicknessType="pixel";this.id=d;null!==this.startValue&&null!==this.endValue&&
(this.value=((this.startValue.getTime?this.startValue.getTime():this.startValue)+(this.endValue.getTime?this.endValue.getTime():this.endValue))/2,this.thickness=Math.max(this.endValue-this.startValue),this._thicknessType="value")}function L(a,c,b){L.parent.constructor.call(this,"ToolTip",c,b);this.chart=a;this.canvas=a.canvas;this.ctx=this.chart.ctx;this.currentDataPointIndex=this.currentSeriesIndex=-1;this._timerId=0;this._prevY=this._prevX=NaN;this._initialize()}function U(a){this.chart=a;this.lastObjectId=
0;this.objectMap=[];this.rectangularRegionEventSubscriptions=[];this.previousDataPointEventObject=null;this.ghostCanvas=$(this.chart.width,this.chart.height);this.ghostCtx=this.ghostCanvas.getContext("2d");this.mouseoveredObjectMaps=[]}function ra(a,c){var b;c&&ga[c]&&(b=ga[c]);W.parent.constructor.call(this,"CultureInfo",b,a.theme);this.chart=a;this.canvas=a.canvas;this.ctx=this.chart.ctx}var v=!!document.createElement("canvas").getContext,ha={Chart:{width:500,height:400,zoomEnabled:!1,backgroundColor:"white",
theme:"theme1",animationEnabled:v?!0:!1,colorSet:"colorSet1",culture:"en",creditHref:"http://canvasjs.com/",creditText:"CanvasJS.com",interactivityEnabled:!0},Title:{padding:0,text:null,verticalAlign:"top",horizontalAlign:"center",fontSize:20,fontFamily:"Calibri",fontWeight:"normal",fontColor:"black",fontStyle:"normal",borderThickness:0,borderColor:"black",cornerRadius:0,backgroundColor:null,margin:5},Legend:{name:null,verticalAlign:"center",horizontalAlign:"right",fontSize:14,fontFamily:"calibri",
fontWeight:"normal",fontColor:"black",fontStyle:"normal",cursor:null,itemmouseover:null,itemmouseout:null,itemmousemove:null,itemclick:null},ToolTip:{enabled:!0,borderColor:null,shared:!1,animationEnabled:!0,content:null},Axis:{minimum:null,maximum:null,interval:null,intervalType:null,title:null,titleFontColor:"black",titleFontSize:20,titleFontFamily:"arial",titleFontWeight:"normal",titleFontStyle:"normal",labelAngle:0,labelFontFamily:"arial",labelFontColor:"black",labelFontSize:12,labelFontWeight:"normal",
labelFontStyle:"normal",labelAutoFit:!1,labelWrap:!0,labelMaxWidth:null,prefix:"",suffix:"",includeZero:!0,tickLength:5,tickColor:"black",tickThickness:1,lineColor:"black",lineThickness:1,gridColor:"A0A0A0",gridThickness:0,interlacedColor:null,valueFormatString:null,margin:2,stripLines:[]},StripLine:{value:null,startValue:null,endValue:null,color:"orange",thickness:2,label:"",labelBackgroundColor:"#EEEEEE",labelFontFamily:"arial",labelFontColor:"orange",labelFontSize:12,labelFontWeight:"normal",labelFontStyle:"normal"},
DataSeries:{name:null,dataPoints:null,label:"",bevelEnabled:!1,cursor:null,indexLabel:"",indexLabelPlacement:"outside",indexLabelOrientation:"horizontal",indexLabelFontColor:"black",indexLabelFontSize:12,indexLabelFontStyle:"normal",indexLabelFontFamily:"Arial",indexLabelFontWeight:"normal",indexLabelBackgroundColor:null,indexLabelLineColor:null,indexLabelLineThickness:1,indexLabelMaxWidth:null,indexLabelWrap:!0,lineThickness:2,color:null,startAngle:0,type:"column",xValueType:"number",axisYType:"primary",
xValueFormatString:null,yValueFormatString:null,showInLegend:null,legendMarkerType:null,legendMarkerColor:null,legendText:null,markerType:"circle",markerColor:null,markerSize:null,markerBorderColor:null,markerBorderThickness:null,mouseover:null,mouseout:null,mousemove:null,click:null,toolTipContent:null,visible:!0},CultureInfo:{decimalSeparator:".",digitGroupSeparator:",",zoomText:"Zoom",panText:"Pan",resetText:"Reset",days:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),shortDays:"Sun Mon Tue Wed Thu Fri Sat".split(" "),
months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")},TextBlock:{x:0,y:0,width:null,height:null,maxWidth:null,maxHeight:null,padding:0,angle:0,text:"",horizontalAlign:"center",fontSize:12,fontFamily:"calibri",fontWeight:"normal",fontColor:"black",fontStyle:"normal",borderThickness:0,borderColor:"black",cornerRadius:0,backgroundColor:null,textBaseline:"top"}},ga={en:{}},R={colorSet1:"#369EAD #C24642 #7F6084 #86B402 #A2D1CF #C8B631 #6DBCEB #52514E #4F81BC #A064A1 #F79647".split(" "),
colorSet2:"#4F81BC #C0504E #9BBB58 #23BFAA #8064A1 #4AACC5 #F79647 #33558B".split(" "),colorSet3:"#8CA1BC #36845C #017E82 #8CB9D0 #708C98 #94838D #F08891 #0366A7 #008276 #EE7757 #E5BA3A #F2990B #03557B #782970".split(" ")},S={theme1:{Chart:{colorSet:"colorSet1"},Title:{fontFamily:v?"Calibri, Optima, Candara, Verdana, Geneva, sans-serif":"calibri",fontSize:33,fontColor:"#3A3A3A",fontWeight:"bold",verticalAlign:"top",margin:10},Axis:{titleFontSize:26,titleFontColor:"#666666",titleFontFamily:v?"Calibri, Optima, Candara, Verdana, Geneva, sans-serif":
"calibri",labelFontFamily:v?"Calibri, Optima, Candara, Verdana, Geneva, sans-serif":"calibri",labelFontSize:18,labelFontColor:"grey",tickColor:"#BBBBBB",tickThickness:2,gridThickness:2,gridColor:"#BBBBBB",lineThickness:2,lineColor:"#BBBBBB"},Legend:{verticalAlign:"bottom",horizontalAlign:"center",fontFamily:v?"monospace, sans-serif,arial black":"calibri"},DataSeries:{indexLabelFontColor:"grey",indexLabelFontFamily:v?"Calibri, Optima, Candara, Verdana, Geneva, sans-serif":"calibri",indexLabelFontSize:18,
indexLabelLineThickness:1}},theme2:{Chart:{colorSet:"colorSet2"},Title:{fontFamily:"impact, charcoal, arial black, sans-serif",fontSize:32,fontColor:"#333333",verticalAlign:"top",margin:10},Axis:{titleFontSize:22,titleFontColor:"rgb(98,98,98)",titleFontFamily:v?"monospace, sans-serif,arial black":"arial",titleFontWeight:"bold",labelFontFamily:v?"monospace, Courier New, Courier":"arial",labelFontSize:16,labelFontColor:"grey",labelFontWeight:"bold",tickColor:"grey",tickThickness:2,gridThickness:2,gridColor:"grey",
lineThickness:0},Legend:{verticalAlign:"bottom",horizontalAlign:"center",fontFamily:v?"monospace, sans-serif,arial black":"arial"},DataSeries:{indexLabelFontColor:"grey",indexLabelFontFamily:v?"Courier New, Courier, monospace":"arial",indexLabelFontWeight:"bold",indexLabelFontSize:18,indexLabelLineThickness:1}},theme3:{Chart:{colorSet:"colorSet1"},Title:{fontFamily:v?"Candara, Optima, Trebuchet MS, Helvetica Neue, Helvetica, Trebuchet MS, serif":"calibri",fontSize:32,fontColor:"#3A3A3A",fontWeight:"bold",
verticalAlign:"top",margin:10},Axis:{titleFontSize:22,titleFontColor:"rgb(98,98,98)",titleFontFamily:v?"Verdana, Geneva, Calibri, sans-serif":"calibri",labelFontFamily:v?"Calibri, Optima, Candara, Verdana, Geneva, sans-serif":"calibri",labelFontSize:18,labelFontColor:"grey",tickColor:"grey",tickThickness:2,gridThickness:2,gridColor:"grey",lineThickness:2,lineColor:"grey"},Legend:{verticalAlign:"bottom",horizontalAlign:"center",fontFamily:v?"monospace, sans-serif,arial black":"calibri"},DataSeries:{bevelEnabled:!0,
indexLabelFontColor:"grey",indexLabelFontFamily:v?"Candara, Optima, Calibri, Verdana, Geneva, sans-serif":"calibri",indexLabelFontSize:18,indexLabelLineColor:"lightgrey",indexLabelLineThickness:2}}},x={numberDuration:1,yearDuration:314496E5,monthDuration:2592E6,weekDuration:6048E5,dayDuration:864E5,hourDuration:36E5,minuteDuration:6E4,secondDuration:1E3,millisecondDuration:1,dayOfWeekFromInt:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")},ma={},O=null,sa=function(){var a=/D{1,4}|M{1,4}|Y{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,3}|t{1,2}|T{1,2}|K|z{1,3}|"[^"]*"|'[^']*'/g,
c="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),b="Sun Mon Tue Wed Thu Fri Sat".split(" "),d="January February March April May June July August September October November December".split(" "),e="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),f=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,g=/[^-+\dA-Z]/g;return function(l,q,k){var h=k?k.days:c,r=k?k.months:d,m=k?k.shortDays:
b,n=k?k.shortMonths:e;k="";var p=!1;l=l&&l.getTime?l:l?new Date(l):new Date;if(isNaN(l))throw SyntaxError("invalid date");"UTC:"===q.slice(0,4)&&(q=q.slice(4),p=!0);k=p?"getUTC":"get";var t=l[k+"Date"](),u=l[k+"Day"](),s=l[k+"Month"](),v=l[k+"FullYear"](),w=l[k+"Hours"](),z=l[k+"Minutes"](),E=l[k+"Seconds"](),D=l[k+"Milliseconds"](),x=p?0:l.getTimezoneOffset();return k=q.replace(a,function(a){switch(a){case "D":return t;case "DD":return G(t,2);case "DDD":return m[u];case "DDDD":return h[u];case "M":return s+
1;case "MM":return G(s+1,2);case "MMM":return n[s];case "MMMM":return r[s];case "Y":return parseInt(String(v).slice(-2));case "YY":return G(String(v).slice(-2),2);case "YYY":return G(String(v).slice(-3),3);case "YYYY":return G(v,4);case "h":return w%12||12;case "hh":return G(w%12||12,2);case "H":return w;case "HH":return G(w,2);case "m":return z;case "mm":return G(z,2);case "s":return E;case "ss":return G(E,2);case "f":return String(D).slice(0,1);case "ff":return G(String(D).slice(0,2),2);case "fff":return G(String(D).slice(0,
3),3);case "t":return 12>w?"a":"p";case "tt":return 12>w?"am":"pm";case "T":return 12>w?"A":"P";case "TT":return 12>w?"AM":"PM";case "K":return p?"UTC":(String(l).match(f)||[""]).pop().replace(g,"");case "z":return(0<x?"-":"+")+Math.floor(Math.abs(x)/60);case "zz":return(0<x?"-":"+")+G(Math.floor(Math.abs(x)/60),2);case "zzz":return(0<x?"-":"+")+G(Math.floor(Math.abs(x)/60),2)+G(Math.abs(x)%60,2);default:return a.slice(1,a.length-1)}})}}(),ia=function(a,c,b){if(null===a)return"";a=Number(a);var d=
0>a?!0:!1;d&&(a*=-1);var e=b?b.decimalSeparator:".",f=b?b.digitGroupSeparator:",",g="";c=String(c);var g=1,l=b="",q=-1,k=[],h=[],r=0,m=0,n=0,p=!1,t=0,l=c.match(/"[^"]*"|'[^']*'|[eE][+-]*[0]+|[,]+[.]|\u2030|./g);c=null;for(var u=0;l&&u<l.length;u++)if(c=l[u],"."===c&&0>q)q=u;else{if("%"===c)g*=100;else if("\u2030"===c){g*=1E3;continue}else if(","===c[0]&&"."===c[c.length-1]){g/=Math.pow(1E3,c.length-1);q=u+c.length-1;continue}else"E"!==c[0]&&"e"!==c[0]||"0"!==c[c.length-1]||(p=!0);0>q?(k.push(c),"#"===
c||"0"===c?r++:","===c&&n++):(h.push(c),"#"!==c&&"0"!==c||m++)}p&&(c=Math.floor(a),t=(0===c?"":String(c)).length-r,g/=Math.pow(10,t));0>q&&(q=u);g=(a*g).toFixed(m);c=g.split(".");g=(c[0]+"").split("");a=(c[1]+"").split("");g&&"0"===g[0]&&g.shift();for(u=p=l=m=q=0;0<k.length;)if(c=k.pop(),"#"===c||"0"===c)if(q++,q===r){var s=g,g=[];if("0"===c)for(c=r-m-(s?s.length:0);0<c;)s.unshift("0"),c--;for(;0<s.length;)b=s.pop()+b,u++,0===u%p&&(l===n&&0<s.length)&&(b=f+b);d&&(b="-"+b)}else 0<g.length?(b=g.pop()+
b,m++,u++):"0"===c&&(b="0"+b,m++,u++),0===u%p&&(l===n&&0<g.length)&&(b=f+b);else"E"!==c[0]&&"e"!==c[0]||"0"!==c[c.length-1]||!/[eE][+-]*[0]+/.test(c)?","===c?(l++,p=u,u=0,0<g.length&&(b=f+b)):b=1<c.length&&('"'===c[0]&&'"'===c[c.length-1]||"'"===c[0]&&"'"===c[c.length-1])?c.slice(1,c.length-1)+b:c+b:(c=0>t?c.replace("+","").replace("-",""):c.replace("-",""),b+=c.replace(/[0]+/,function(a){return G(t,a.length)}));d="";for(f=!1;0<h.length;)c=h.shift(),"#"===c||"0"===c?0<a.length&&0!==Number(a.join(""))?
(d+=a.shift(),f=!0):"0"===c&&(d+="0",f=!0):1<c.length&&('"'===c[0]&&'"'===c[c.length-1]||"'"===c[0]&&"'"===c[c.length-1])?d+=c.slice(1,c.length-1):"E"!==c[0]&&"e"!==c[0]||"0"!==c[c.length-1]||!/[eE][+-]*[0]+/.test(c)?d+=c:(c=0>t?c.replace("+","").replace("-",""):c.replace("-",""),d+=c.replace(/[0]+/,function(a){return G(t,a.length)}));return b+((f?e:"")+d)},ba=function(a){var c=0,b=0;a=a||window.event;a.offsetX||0===a.offsetX?(c=a.offsetX,b=a.offsetY):a.layerX||0==a.layerX?(c=a.layerX,b=a.layerY):
(c=a.pageX-a.target.offsetLeft,b=a.pageY-a.target.offsetTop);return{x:c,y:b}},pa=!0,da=window.devicePixelRatio||1,Z=1,P=pa?da/Z:1;I.prototype.setOptions=function(a,c){if(ha[this._defaultsKey]){var b=ha[this._defaultsKey],d;for(d in b)this[d]=a&&d in a?a[d]:c&&d in c?c[d]:b[d]}};I.prototype.updateOption=function(a){var c=ha[this._defaultsKey],b=this._options.theme?this._options.theme:this.chart&&this.chart._options.theme?this.chart._options.theme:"theme1",d={},e=this[a];b&&(S[b]&&S[b][this._defaultsKey])&&
(d=S[b][this._defaultsKey]);a in c&&(e=a in this._options?this._options[a]:d&&a in d?d[a]:c[a]);if(e===this[a])return!1;this[a]=e;return!0};I.prototype.trackChanges=function(a){this._options._oldOptions||(this._options._oldOptions={});this._options._oldOptions[a]=this._options[a]};I.prototype.isBeingTracked=function(a){this._options._oldOptions||(this._options._oldOptions={});return this._options._oldOptions[a]?!0:!1};I.prototype.hasOptionChanged=function(a){this._options._oldOptions||(this._options._oldOptions=
{});return this._options._oldOptions[a]!==this._options[a]};M(w,I);w.prototype._updateOptions=function(){var a=this;this.updateOption("width");this.updateOption("height");this.updateOption("theme");this.updateOption("colorSet")&&(this._selectedColorSet="undefined"!==typeof R[this.colorSet]?R[this.colorSet]:R.colorSet1);if(this.updateOption("backgroundColor"))try{this.canvas.style.background!==this.backgroundColor&&(this.canvas.style.background=this.backgroundColor)}catch(c){}this.updateOption("animationEnabled");
this._options.zoomEnabled?(this._zoomButton||(this._zoomButton=document.createElement("button"),this._zoomButton.appendChild(document.createTextNode("Pan")),this._toolBar.appendChild(this._zoomButton),K(this._zoomButton,"click",function(){a.zoomEnabled?(a.zoomEnabled=!1,a.panEnabled=!0,a._zoomButton.innerHTML=a._cultureInfo.zoomText):(a.zoomEnabled=!0,a.panEnabled=!1,a._zoomButton.innerHTML=a._cultureInfo.panText);a.render()})),this._resetButton||(this._resetButton=document.createElement("button"),
this._resetButton.appendChild(document.createTextNode("Reset")),this._toolBar.appendChild(this._resetButton),K(this._resetButton,"click",function(){a._toolTip.hide();a.zoomEnabled||a.panEnabled?(a.zoomEnabled=!0,a.panEnabled=!1,a._zoomButton.innerHTML=a._cultureInfo.panText,a._defaultCursor="default",a.overlaidCanvas.style.cursor=a._defaultCursor):(a.zoomEnabled=!1,a.panEnabled=!1);a.sessionVariables.axisX.internalMinimum=a._options.axisX&&a._options.axisX.minimum?a._options.axisX.minimum:null;a.sessionVariables.axisX.internalMaximum=
a._options.axisX&&a._options.axisX.maximum?a._options.axisX.maximum:null;a.resetOverlayedCanvas();a._toolBar.style.display="none";a.render()}),this.overlaidCanvas.style.cursor=a._defaultCursor),this.zoomEnabled||this.panEnabled||(this._zoomButton?(a._zoomButton.innerHTML===a._cultureInfo.zoomText?(this.panEnabled=!0,this.zoomEnabled=!1):(this.zoomEnabled=!0,this.panEnabled=!1),a._toolBar.style.display="inline"):(this.zoomEnabled=!0,this.panEnabled=!1))):this.panEnabled=this.zoomEnabled=!1;this.updateOption("culture");
this._cultureInfo=new ra(this,this._options.culture);if("none"!==this._toolBar.style.display){var b=this.panEnabled?a._cultureInfo.zoomText:a._cultureInfo.panText;a._zoomButton.innerHTML!==b&&(a._zoomButton.innerHTML=b);a._resetButton.innerHTML!==a._cultureInfo.resetText&&(a._resetButton.innerHTML=a._cultureInfo.resetText)}var b=this.updateOption("creditText"),d=this.updateOption("creditHref");if(0===this.renderCount||b||d)this._creditLink.setAttribute("href",this.creditHref),this._creditLink.innerHTML=
this.creditText;this.creditHref&&this.creditText?this._creditLink.parentElement||this._canvasJSContainer.appendChild(this._creditLink):this._creditLink.parentElement&&this._canvasJSContainer.removeChild(this._creditLink);this._options.toolTip&&this._toolTip._options!==this._options.toolTip&&(this._toolTip._options=this._options.toolTip);this._toolTip.updateOption("enabled");this._toolTip.updateOption("shared");this._toolTip.updateOption("animationEnabled");this._toolTip.updateOption("borderColor");
this._toolTip.updateOption("content")};w.prototype._updateSize=function(){var a=0,c=0;this._options.width?a=this.width:this.width=a=0<this._container.clientWidth?this._container.clientWidth:this.width;this._options.height?c=this.height:this.height=c=0<this._container.clientHeight?this._container.clientHeight:this.height;return this.canvas.width!==a*P||this.canvas.height!==c*P?(Y(this.canvas,a,c),Y(this.overlaidCanvas,a,c),Y(this._eventManager.ghostCanvas,a,c),!0):!1};w.prototype._initialize=function(){this.pieDoughnutClickHandler=
null;this.animationRequestId&&this.cancelRequestAnimFrame.call(window,this.animationRequestId);this._updateOptions();this._updateSize();this.ctx.clearRect(0,0,this.width,this.height);this.ctx.beginPath();this.axisY2=this.axisY=this.axisX=null;this._indexLabels=[];this._dataInRenderedOrder=[];this._events=[];this._eventManager&&this._eventManager.reset();this.plotInfo={axisPlacement:null,axisXValueType:null,plotTypes:[]};this.layoutManager.reset();this.data=[];for(var a=0,c=0;c<this._options.data.length;c++)if(a++,
!this._options.data[c].type||0<=w._supportedChartTypes.indexOf(this._options.data[c].type)){var b=new N(this,this._options.data[c],this.theme,a-1,++this._eventManager.lastObjectId);null===b.name&&(b.name="DataSeries "+a);null===b.color?1<this._options.data.length?(b._colorSet=[this._selectedColorSet[b.index%this._selectedColorSet.length]],b.color=this._selectedColorSet[b.index%this._selectedColorSet.length]):b._colorSet="line"===b.type||"stepLine"===b.type||"spline"===b.type||"area"===b.type||"stepArea"===
b.type||"splineArea"===b.type||"stackedArea"===b.type||"stackedArea100"===b.type?[this._selectedColorSet[0]]:this._selectedColorSet:b._colorSet=[b.color];null===b.markerSize&&(("line"===b.type||"stepLine"===b.type||"spline"===b.type)&&b.dataPoints&&b.dataPoints.length<this.width/16||"scatter"===b.type)&&(b.markerSize=8);"bubble"!==b.type&&"scatter"!==b.type||!b.dataPoints||b.dataPoints.sort(wa);this.data.push(b);var d=b.axisPlacement,e;"normal"===d?"xySwapped"===this.plotInfo.axisPlacement?e='You cannot combine "'+
b.type+'" with bar chart':"none"===this.plotInfo.axisPlacement?e='You cannot combine "'+b.type+'" with pie chart':null===this.plotInfo.axisPlacement&&(this.plotInfo.axisPlacement="normal"):"xySwapped"===d?"normal"===this.plotInfo.axisPlacement?e='You cannot combine "'+b.type+'" with line, area, column or pie chart':"none"===this.plotInfo.axisPlacement?e='You cannot combine "'+b.type+'" with pie chart':null===this.plotInfo.axisPlacement&&(this.plotInfo.axisPlacement="xySwapped"):"none"==d&&("normal"===
this.plotInfo.axisPlacement?e='You cannot combine "'+b.type+'" with line, area, column or bar chart':"xySwapped"===this.plotInfo.axisPlacement?e='You cannot combine "'+b.type+'" with bar chart':null===this.plotInfo.axisPlacement&&(this.plotInfo.axisPlacement="none"));if(e&&window.console){window.console.log(e);return}}this._objectsInitialized=!0};w._supportedChartTypes="line stepLine spline column area stepArea splineArea bar bubble scatter stackedColumn stackedColumn100 stackedBar stackedBar100 stackedArea stackedArea100 pie doughnut".split(" ");
w._supportedChartTypes.indexOf||(w._supportedChartTypes.indexOf=function(a,c){var b=this.length>>>0,d=Number(c)||0,d=0>d?Math.ceil(d):Math.floor(d);for(0>d&&(d+=b);d<b;d++)if(d in this&&this[d]===a)return d;return-1});w.prototype.render=function(a){a&&(this._options=a);this._initialize();for(a=0;a<this.data.length;a++)if("normal"===this.plotInfo.axisPlacement||"xySwapped"===this.plotInfo.axisPlacement)this.data[a].axisYType&&"primary"!==this.data[a].axisYType?"secondary"===this.data[a].axisYType&&
(this.axisY2||("normal"===this.plotInfo.axisPlacement?this.axisY2=new y(this,this._options.axisY2,"axisY","right"):"xySwapped"===this.plotInfo.axisPlacement&&(this.axisY2=new y(this,this._options.axisY2,"axisY","top"))),this.data[a].axisY=this.axisY2):(this.axisY||("normal"===this.plotInfo.axisPlacement?this.axisY=new y(this,this._options.axisY,"axisY","left"):"xySwapped"===this.plotInfo.axisPlacement&&(this.axisY=new y(this,this._options.axisY,"axisY","bottom"))),this.data[a].axisY=this.axisY),this.axisX||
("normal"===this.plotInfo.axisPlacement?this.axisX=new y(this,this._options.axisX,"axisX","bottom"):"xySwapped"===this.plotInfo.axisPlacement&&(this.axisX=new y(this,this._options.axisX,"axisX","left"))),this.data[a].axisX=this.axisX;this._processData();this._options.title&&(this._title=new W(this,this._options.title),this._title.render());this.legend=new aa(this,this._options.legend,this.theme);for(a=0;a<this.data.length;a++)this.data[a].showInLegend&&this.legend.dataSeries.push(this.data[a]);this.legend.render();
if("normal"===this.plotInfo.axisPlacement||"xySwapped"===this.plotInfo.axisPlacement)this.layoutManager.getFreeSpace(),y.setLayoutAndRender(this.axisX,this.axisY,this.axisY2,this.plotInfo.axisPlacement,this.layoutManager.getFreeSpace());else if("none"===this.plotInfo.axisPlacement)this.preparePlotArea();else return;for(a=0;a<this.plotInfo.plotTypes.length;a++)for(var c=this.plotInfo.plotTypes[a],b=0;b<c.plotUnits.length;b++){var d=c.plotUnits[b];"line"===d.type?this.renderLine(d):"stepLine"===d.type?
this.renderStepLine(d):"spline"===d.type?this.renderSpline(d):"column"===d.type?this.renderColumn(d):"bar"===d.type?this.renderBar(d):"area"===d.type?this.renderArea(d):"stepArea"===d.type?this.renderStepArea(d):"splineArea"===d.type?this.renderSplineArea(d):"stackedColumn"===d.type?this.renderStackedColumn(d):"stackedColumn100"===d.type?this.renderStackedColumn100(d):"stackedBar"===d.type?this.renderStackedBar(d):"stackedBar100"===d.type?this.renderStackedBar100(d):"stackedArea"===d.type?this.renderStackedArea(d):
"stackedArea100"===d.type?this.renderStackedArea100(d):"bubble"===d.type?this.renderBubble(d):"scatter"===d.type?this.renderScatter(d):"pie"===d.type?this.renderPie(d):"doughnut"===d.type&&this.renderPie(d);for(var e=0;e<d.dataSeriesIndexes.length;e++)this._dataInRenderedOrder.push(this.data[d.dataSeriesIndexes[e]])}0<this._indexLabels.length&&this.renderIndexLabels();this.attachPlotAreaEventHandlers();this.zoomEnabled||(this.panEnabled||"none"===this._toolBar.style.display)||(this._toolBar.style.display=
"none");this._toolTip._updateToolTip();this.renderCount++};w.prototype.attachPlotAreaEventHandlers=function(){this.attachEvent({context:this,chart:this,mousedown:this._plotAreaMouseDown,mouseup:this._plotAreaMouseUp,mousemove:this._plotAreaMouseMove,cursor:this.zoomEnabled?"col-resize":"move",cursor:this.panEnabled?"move":"default",capture:!0,bounds:this.plotArea})};w.prototype.categoriseDataSeries=function(){for(var a="",c=0;c<this.data.length;c++)if(a=this.data[c],a.dataPoints&&(0!==a.dataPoints.length&&
a.visible)&&0<=w._supportedChartTypes.indexOf(a.type)){for(var b=null,d=!1,e=null,f=!1,g=0;g<this.plotInfo.plotTypes.length;g++)if(this.plotInfo.plotTypes[g].type===a.type){d=!0;b=this.plotInfo.plotTypes[g];break}d||(b={type:a.type,totalDataSeries:0,plotUnits:[]},this.plotInfo.plotTypes.push(b));for(g=0;g<b.plotUnits.length;g++)if(b.plotUnits[g].axisYType===a.axisYType){f=!0;e=b.plotUnits[g];break}f||(e={type:a.type,previousDataSeriesCount:0,index:b.plotUnits.length,plotType:b,axisYType:a.axisYType,
axisY:"primary"===a.axisYType?this.axisY:this.axisY2,axisX:this.axisX,dataSeriesIndexes:[]},b.plotUnits.push(e));b.totalDataSeries++;e.dataSeriesIndexes.push(c)}for(c=0;c<this.plotInfo.plotTypes.length;c++)for(b=this.plotInfo.plotTypes[c],g=a=0;g<b.plotUnits.length;g++)b.plotUnits[g].previousDataSeriesCount=a,a+=b.plotUnits[g].dataSeriesIndexes.length};w.prototype.assignIdToDataPoints=function(){for(var a=0;a<this.data.length;a++){var c=this.data[a];if(c.dataPoints)for(var b=c.dataPoints.length,d=
0;d<b;d++)c.dataPointIds[d]=++this._eventManager.lastObjectId}};w.prototype._processData=function(){this.assignIdToDataPoints();this.categoriseDataSeries();for(var a=0;a<this.plotInfo.plotTypes.length;a++)for(var c=this.plotInfo.plotTypes[a],b=0;b<c.plotUnits.length;b++){var d=c.plotUnits[b];"line"===d.type||"stepLine"===d.type||"spline"===d.type||"column"===d.type||"area"===d.type||"stepArea"===d.type||"splineArea"===d.type||"bar"===d.type||"bubble"===d.type||"scatter"===d.type?this._processMultiseriesPlotUnit(d):
"stackedColumn"===d.type||"stackedBar"===d.type||"stackedArea"===d.type?this._processStackedPlotUnit(d):"stackedColumn100"!==d.type&&"stackedBar100"!==d.type&&"stackedArea100"!==d.type||this._processStacked100PlotUnit(d)}};w.prototype._processMultiseriesPlotUnit=function(a){if(a.dataSeriesIndexes&&!(1>a.dataSeriesIndexes.length))for(var c=a.axisY.dataInfo,b=a.axisX.dataInfo,d,e,f=!1,g=0;g<a.dataSeriesIndexes.length;g++){var l=this.data[a.dataSeriesIndexes[g]],q=0,k=!1,h=!1;if("normal"===l.axisPlacement||
"xySwapped"===l.axisPlacement)var r=this.sessionVariables.axisX.internalMinimum?this.sessionVariables.axisX.internalMinimum:this._options.axisX&&this._options.axisX.minimum?this._options.axisX.minimum:-Infinity,m=this.sessionVariables.axisX.internalMaximum?this.sessionVariables.axisX.internalMaximum:this._options.axisX&&this._options.axisX.maximum?this._options.axisX.maximum:Infinity;if(l.dataPoints[q].x&&l.dataPoints[q].x.getTime||"dateTime"===l.xValueType)f=!0;for(q=0;q<l.dataPoints.length;q++){"undefined"===
typeof l.dataPoints[q].x&&(l.dataPoints[q].x=q);l.dataPoints[q].x.getTime?(f=!0,d=l.dataPoints[q].x.getTime()):d=l.dataPoints[q].x;e=l.dataPoints[q].y;d<b.min&&(b.min=d);d>b.max&&(b.max=d);e<c.min&&(c.min=e);e>c.max&&(c.max=e);if(0<q){var n=d-l.dataPoints[q-1].x;0>n&&(n*=-1);b.minDiff>n&&0!==n&&(b.minDiff=n)}if(!(d<r)||k){if(!k&&(k=!0,0<q)){q-=2;continue}if(d>m&&!h)h=!0;else if(d>m&&h)continue;l.dataPoints[q].label&&(a.axisX.labels[d]=l.dataPoints[q].label);d<b.viewPortMin&&(b.viewPortMin=d);d>b.viewPortMax&&
(b.viewPortMax=d);null!==e&&(e<c.viewPortMin&&(c.viewPortMin=e),e>c.viewPortMax&&(c.viewPortMax=e))}}this.plotInfo.axisXValueType=l.xValueType=f?"dateTime":"number"}};w.prototype._processStackedPlotUnit=function(a){if(a.dataSeriesIndexes&&!(1>a.dataSeriesIndexes.length)){for(var c=a.axisY.dataInfo,b=a.axisX.dataInfo,d,e,f=!1,g=[],l=[],q=0;q<a.dataSeriesIndexes.length;q++){var k=this.data[a.dataSeriesIndexes[q]],h=0,r=!1,m=!1;if("normal"===k.axisPlacement||"xySwapped"===k.axisPlacement)var n=this.sessionVariables.axisX.internalMinimum?
this.sessionVariables.axisX.internalMinimum:this._options.axisX&&this._options.axisX.minimum?this._options.axisX.minimum:-Infinity,p=this.sessionVariables.axisX.internalMaximum?this.sessionVariables.axisX.internalMaximum:this._options.axisX&&this._options.axisX.maximum?this._options.axisX.maximum:Infinity;if(k.dataPoints[h].x&&k.dataPoints[h].x.getTime||"dateTime"===k.xValueType)f=!0;for(h=0;h<k.dataPoints.length;h++){"undefined"===typeof k.dataPoints[h].x&&(k.dataPoints[h].x=h);k.dataPoints[h].x.getTime?
(f=!0,d=k.dataPoints[h].x.getTime()):d=k.dataPoints[h].x;e=k.dataPoints[h].y;d<b.min&&(b.min=d);d>b.max&&(b.max=d);if(0<h){var t=d-k.dataPoints[h-1].x;0>t&&(t*=-1);b.minDiff>t&&0!==t&&(b.minDiff=t)}if(!(d<n)||r){if(!r&&(r=!0,0<h)){h-=2;continue}if(d>p&&!m)m=!0;else if(d>p&&m)continue;k.dataPoints[h].label&&(a.axisX.labels[d]=k.dataPoints[h].label);d<b.viewPortMin&&(b.viewPortMin=d);d>b.viewPortMax&&(b.viewPortMax=d);null!==e&&(0<=e?g[d]=g[d]?g[d]+e:e:l[d]=l[d]?l[d]+e:e)}}this.plotInfo.axisXValueType=
k.xValueType=f?"dateTime":"number"}for(h in g)isNaN(h)||(a=g[h],a<c.min&&(c.min=a),a>c.max&&(c.max=a),h<b.viewPortMin||h>b.viewPortMax||(a<c.viewPortMin&&(c.viewPortMin=a),a>c.viewPortMax&&(c.viewPortMax=a)));for(h in l)isNaN(h)||(a=l[h],a<c.min&&(c.min=a),a>c.max&&(c.max=a),h<b.viewPortMin||h>b.viewPortMax||(a<c.viewPortMin&&(c.viewPortMin=a),a>c.viewPortMax&&(c.viewPortMax=a)))}};w.prototype._processStacked100PlotUnit=function(a){if(a.dataSeriesIndexes&&!(1>a.dataSeriesIndexes.length)){for(var c=
a.axisY.dataInfo,b=a.axisX.dataInfo,d,e,f=!1,g=!1,l=!1,q=[],k=0;k<a.dataSeriesIndexes.length;k++){var h=this.data[a.dataSeriesIndexes[k]],r=0,m=!1,n=!1;if("normal"===h.axisPlacement||"xySwapped"===h.axisPlacement)var p=this.sessionVariables.axisX.internalMinimum?this.sessionVariables.axisX.internalMinimum:this._options.axisX&&this._options.axisX.minimum?this._options.axisX.minimum:-Infinity,t=this.sessionVariables.axisX.internalMaximum?this.sessionVariables.axisX.internalMaximum:this._options.axisX&&
this._options.axisX.maximum?this._options.axisX.maximum:Infinity;if(h.dataPoints[r].x&&h.dataPoints[r].x.getTime||"dateTime"===h.xValueType)f=!0;for(r=0;r<h.dataPoints.length;r++){"undefined"===typeof h.dataPoints[r].x&&(h.dataPoints[r].x=r);h.dataPoints[r].x.getTime?(f=!0,d=h.dataPoints[r].x.getTime()):d=h.dataPoints[r].x;e=h.dataPoints[r].y;d<b.min&&(b.min=d);d>b.max&&(b.max=d);if(0<r){var u=d-h.dataPoints[r-1].x;0>u&&(u*=-1);b.minDiff>u&&0!==u&&(b.minDiff=u)}if(!(d<p)||m){if(!m&&(m=!0,0<r)){r-=
2;continue}if(d>t&&!n)n=!0;else if(d>t&&n)continue;h.dataPoints[r].label&&(a.axisX.labels[d]=h.dataPoints[r].label);d<b.viewPortMin&&(b.viewPortMin=d);d>b.viewPortMax&&(b.viewPortMax=d);null!==e&&(0<=e?g=!0:l=!0,q[d]=q[d]?q[d]+Math.abs(e):Math.abs(e))}}this.plotInfo.axisXValueType=h.xValueType=f?"dateTime":"number"}g&&!l?(c.max=99,c.min=1):g&&l?(c.max=99,c.min=-99):!g&&l&&(c.max=-1,c.min=-99);c.viewPortMin=c.min;c.viewPortMax=c.max;a.dataPointYSums=q}};w.prototype.getDataPointAtXY=function(a,c,b){b=
b||!1;for(var d=[],e=this._dataInRenderedOrder.length-1;0<=e;e--){var f=null;(f=this._dataInRenderedOrder[e].getDataPointAtXY(a,c,b))&&d.push(f)}a=null;c=!1;for(b=0;b<d.length;b++)if("line"===d[b].dataSeries.type||"stepLine"===d[b].dataSeries.type||"area"===d[b].dataSeries.type||"stepArea"===d[b].dataSeries.type)if(e=Q("markerSize",d[b].dataPoint,d[b].dataSeries)||8,d[b].distance<=e/2){c=!0;break}for(b=0;b<d.length;b++)c&&"line"!==d[b].dataSeries.type&&"stepLine"!==d[b].dataSeries.type&&"area"!==
d[b].dataSeries.type&&"stepArea"!==d[b].dataSeries.type||(a?d[b].distance<=a.distance&&(a=d[b]):a=d[b]);return a};w.prototype.getObjectAtXY=function(a,c,b){var d=null;if(b=this.getDataPointAtXY(a,c,b||!1))d=b.dataSeries.dataPointIds[b.dataPointIndex];else if(v)d=na(a,c,this._eventManager.ghostCtx);else for(b=0;b<this.legend.items.length;b++){var e=this.legend.items[b];a>=e.x1&&(a<=e.x2&&c>=e.y1&&c<=e.y2)&&(d=e.id)}return d};w.prototype.getAutoFontSize=function(a,c,b){a/=400;return Math.round(Math.min(this.width,
this.height)*a)};w.prototype.resetOverlayedCanvas=function(){this.overlaidCanvasCtx.clearRect(0,0,this.width,this.height)};w.prototype.attachEvent=function(a){this._events.push(a)};w.prototype._touchEventHandler=function(a){if(a.changedTouches&&this.interactivityEnabled){var c=[],b=a.changedTouches,d=b?b[0]:a,e=null;switch(a.type){case "touchstart":case "MSPointerDown":c=["mousemove","mousedown"];this._lastTouchData=ba(d);this._lastTouchData.time=new Date;break;case "touchmove":case "MSPointerMove":c=
["mousemove"];break;case "touchend":case "MSPointerUp":c="touchstart"===this._lastTouchEventType||"MSPointerDown"===this._lastTouchEventType?["mouseup","click"]:["mouseup"];break;default:return}if(!(b&&1<b.length)){e=ba(d);e.time=new Date;try{var f=e.y-this._lastTouchData.y,g=e.time-this._lastTouchData.time;if(15<Math.abs(f)&&(this._lastTouchData.scroll||200>g)){this._lastTouchData.scroll=!0;var l=window.parent||window;l&&l.scrollBy&&l.scrollBy(0,-f)}}catch(q){}this._lastTouchEventType=a.type;if(this._lastTouchData.scroll&&
this.zoomEnabled)this.isDrag&&this.resetOverlayedCanvas(),this.isDrag=!1;else for(b=0;b<c.length;b++)e=c[b],f=document.createEvent("MouseEvent"),f.initMouseEvent(e,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),d.target.dispatchEvent(f),a.preventManipulation&&a.preventManipulation(),a.preventDefault&&a.preventDefault()}}};w.prototype._mouseEventHandler=function(a){if(this.interactivityEnabled){a.preventManipulation&&a.preventManipulation();a.preventDefault&&a.preventDefault();
"undefined"===typeof a.target&&a.srcElement&&(a.target=a.srcElement);var c=ba(a),b=a.type,d,e;a.which?e=3==a.which:a.button&&(e=2==a.button);if(!e){if(w.capturedEventParam)d=w.capturedEventParam,"mouseup"===b&&(w.capturedEventParam=null,d.chart.overlaidCanvas.releaseCapture?d.chart.overlaidCanvas.releaseCapture():document.body.removeEventListener("mouseup",d.chart._mouseEventHandler,!1)),d.hasOwnProperty(b)&&d[b].call(d.context,c.x,c.y);else if(this._events){for(e=0;e<this._events.length;e++)if(this._events[e].hasOwnProperty(b)){d=
this._events[e];var f=d.bounds;if(c.x>=f.x1&&c.x<=f.x2&&c.y>=f.y1&&c.y<=f.y2){d[b].call(d.context,c.x,c.y);"mousedown"===b&&!0===d.capture?(w.capturedEventParam=d,this.overlaidCanvas.setCapture?this.overlaidCanvas.setCapture():document.body.addEventListener("mouseup",this._mouseEventHandler,!1)):"mouseup"===b&&(d.chart.overlaidCanvas.releaseCapture?d.chart.overlaidCanvas.releaseCapture():document.body.removeEventListener("mouseup",this._mouseEventHandler,!1));break}else d=null}a.target.style.cursor=
d&&d.cursor?d.cursor:this._defaultCursor}this._toolTip&&this._toolTip.enabled&&(b=this.plotArea,(c.x<b.x1||c.x>b.x2||c.y<b.y1||c.y>b.y2)&&this._toolTip.hide());this.isDrag&&this.zoomEnabled||!this._eventManager||this._eventManager.mouseEventHandler(a)}}};w.prototype._plotAreaMouseDown=function(a,c){this.isDrag=!0;this.dragStartPoint="none"!==this.plotInfo.axisPlacement?{x:a,y:c,xMinimum:this.axisX.minimum,xMaximum:this.axisX.maximum}:{x:a,y:c}};w.prototype._plotAreaMouseUp=function(a,c){var b,d;if(("normal"===
this.plotInfo.axisPlacement||"xySwapped"===this.plotInfo.axisPlacement)&&this.isDrag){var e=0,e=this.axisX.lineCoordinates,e="xySwapped"===this.plotInfo.axisPlacement?c-this.dragStartPoint.y:this.dragStartPoint.x-a;Math.abs(this.axisX.maximum-this.axisX.minimum);if(2<Math.abs(e)){if(this.panEnabled)e=!1,d=0,this.axisX.sessionVariables.internalMinimum<this.axisX._absoluteMinimum?(d=this.axisX._absoluteMinimum-this.axisX.sessionVariables.internalMinimum,this.axisX.sessionVariables.internalMinimum+=
d,this.axisX.sessionVariables.internalMaximum+=d,e=!0):this.axisX.sessionVariables.internalMaximum>this.axisX._absoluteMaximum&&(d=this.axisX.sessionVariables.internalMaximum-this.axisX._absoluteMaximum,this.axisX.sessionVariables.internalMaximum-=d,this.axisX.sessionVariables.internalMinimum-=d,e=!0),e&&this.render();else if(this.zoomEnabled){this.resetOverlayedCanvas();if(!this.dragStartPoint)return;"xySwapped"===this.plotInfo.axisPlacement?(b=Math.min(this.dragStartPoint.y,c),d=Math.max(this.dragStartPoint.y,
c),1<Math.abs(b-d)&&(e=this.axisX.lineCoordinates,d=this.axisX.maximum-(this.axisX.maximum-this.axisX.minimum)/e.height*(d-e.y1),e=this.axisX.maximum-(this.axisX.maximum-this.axisX.minimum)/e.height*(b-e.y1),d=Math.max(d,this.axisX.dataInfo.min),e=Math.min(e,this.axisX.dataInfo.max),Math.abs((e-d)/this.axisX.dataInfo.minDiff)>=0.008*this.height&&(this.axisX.sessionVariables.internalMinimum=d,this.axisX.sessionVariables.internalMaximum=e,this.render()))):"normal"===this.plotInfo.axisPlacement&&(d=
Math.min(this.dragStartPoint.x,a),b=Math.max(this.dragStartPoint.x,a),1<Math.abs(d-b)&&(e=this.axisX.lineCoordinates,d=(this.axisX.maximum-this.axisX.minimum)/e.width*(d-e.x1)+this.axisX.minimum,e=(this.axisX.maximum-this.axisX.minimum)/e.width*(b-e.x1)+this.axisX.minimum,d=Math.max(d,this.axisX.dataInfo.min),e=Math.min(e,this.axisX.dataInfo.max),Math.abs((e-d)/this.axisX.dataInfo.minDiff)>=0.01*this.width&&(this.axisX.sessionVariables.internalMinimum=d,this.axisX.sessionVariables.internalMaximum=
e,this.render())))}this.zoomEnabled&&"none"===this._toolBar.style.display&&(this._toolBar.style.display="inline",this._zoomButton.innerHTML=this._cultureInfo.panText,this._resetButton.innerHTML=this._cultureInfo.resetText)}}this.isDrag=!1};w.prototype._plotAreaMouseMove=function(a,c){if(this.isDrag&&"none"!==this.plotInfo.axisPlacement){var b=0,d=0,d=this.axisX.lineCoordinates;"xySwapped"===this.plotInfo.axisPlacement?(b=c-this.dragStartPoint.y,d=Math.abs(this.axisX.maximum-this.axisX.minimum)/d.height*
b):(b=this.dragStartPoint.x-a,d=Math.abs(this.axisX.maximum-this.axisX.minimum)/d.width*b);2<Math.abs(b)&&8>Math.abs(b)&&(this.panEnabled||this.zoomEnabled)?this._toolTip.hide():!this._toolTip.enabled||(this.panEnabled||this.zoomEnabled)||this._toolTip.mouseMoveHandler(a,c);if(2<Math.abs(b)&&(this.panEnabled||this.zoomEnabled))if(this.panEnabled){this.axisX.sessionVariables.internalMinimum=this.dragStartPoint.xMinimum+d;this.axisX.sessionVariables.internalMaximum=this.dragStartPoint.xMaximum+d;b=
0;this.axisX.sessionVariables.internalMinimum<this.axisX._absoluteMinimum-T(this.axisX.interval,this.axisX.intervalType)?(b=this.axisX._absoluteMinimum-T(this.axisX.interval,this.axisX.intervalType)-this.axisX.sessionVariables.internalMinimum,this.axisX.sessionVariables.internalMinimum+=b,this.axisX.sessionVariables.internalMaximum+=b):this.axisX.sessionVariables.internalMaximum>this.axisX._absoluteMaximum+T(this.axisX.interval,this.axisX.intervalType)&&(b=this.axisX.sessionVariables.internalMaximum-
(this.axisX._absoluteMaximum+T(this.axisX.interval,this.axisX.intervalType)),this.axisX.sessionVariables.internalMaximum-=b,this.axisX.sessionVariables.internalMinimum-=b);var e=this;clearTimeout(this._panTimerId);this._panTimerId=setTimeout(function(){e.render()},0)}else this.zoomEnabled&&(b=this.plotArea,this.resetOverlayedCanvas(),d=this.overlaidCanvasCtx.globalAlpha,this.overlaidCanvasCtx.globalAlpha=0.7,this.overlaidCanvasCtx.fillStyle="#A0ABB8","xySwapped"===this.plotInfo.axisPlacement?this.overlaidCanvasCtx.fillRect(b.x1,
this.dragStartPoint.y,b.x2-b.x1,c-this.dragStartPoint.y):"normal"===this.plotInfo.axisPlacement&&this.overlaidCanvasCtx.fillRect(this.dragStartPoint.x,b.y1,a-this.dragStartPoint.x,b.y2-b.y1),this.overlaidCanvasCtx.globalAlpha=d)}else this._toolTip.enabled&&this._toolTip.mouseMoveHandler(a,c)};w.prototype.preparePlotArea=function(){var a=this.plotArea,c=this.axisY?this.axisY:this.axisY2;!v&&(0<a.x1||0<a.y1)&&a.ctx.translate(a.x1,a.y1);this.axisX&&c?(a.x1=this.axisX.lineCoordinates.x1<this.axisX.lineCoordinates.x2?
this.axisX.lineCoordinates.x1:c.lineCoordinates.x1,a.y1=this.axisX.lineCoordinates.y1<c.lineCoordinates.y1?this.axisX.lineCoordinates.y1:c.lineCoordinates.y1,a.x2=this.axisX.lineCoordinates.x2>c.lineCoordinates.x2?this.axisX.lineCoordinates.x2:c.lineCoordinates.x2,a.y2=this.axisX.lineCoordinates.y2>this.axisX.lineCoordinates.y1?this.axisX.lineCoordinates.y2:c.lineCoordinates.y2,a.width=a.x2-a.x1,a.height=a.y2-a.y1):(c=this.layoutManager.getFreeSpace(),a.x1=c.x1,a.x2=c.x2,a.y1=c.y1,a.y2=c.y2,a.width=
c.width,a.height=c.height);v||(a.canvas.width=a.width,a.canvas.height=a.height,a.canvas.style.left=a.x1+"px",a.canvas.style.top=a.y1+"px",(0<a.x1||0<a.y1)&&a.ctx.translate(-a.x1,-a.y1))};w.prototype.getPixelCoordinatesOnPlotArea=function(a,c){return{x:this.axisX.getPixelCoordinatesOnAxis(a).x,y:this.axisY.getPixelCoordinatesOnAxis(c).y}};w.prototype.renderIndexLabels=function(){var a=this.plotArea.ctx;a.textBaseline="middle";for(var c=this.plotArea,b=0;b<this._indexLabels.length;b++){var d=this._indexLabels[b],
e,f,g;a.fillStyle=Q("indexLabelFontColor",d.dataPoint,d.dataSeries);a.font=oa("indexLabel",d.dataPoint,d.dataSeries);var l=this.replaceKeywordsWithValue(Q("indexLabel",d.dataPoint,d.dataSeries),d.dataPoint,d.dataSeries),q=a.measureText(l).width,k=Q("indexLabelFontSize",d.dataPoint,d.dataSeries),h=Q("indexLabelPlacement",d.dataPoint,d.dataSeries),r=Q("indexLabelOrientation",d.dataPoint,d.dataSeries),m=g=0,n=0,p=0,t=0;d.point.x<c.x1||(d.point.x>c.x2||d.point.y<c.y1||d.point.y>c.y2)||("column"===d.chartType||
"stackedColumn"===d.chartType||"stackedColumn100"===d.chartType||"bar"===d.chartType||"stackedBar"===d.chartType||"stackedBar100"===d.chartType?(Math.abs(d.bounds.x1,d.bounds.x2),Math.abs(d.bounds.y1,d.bounds.y2),"normal"===this.plotInfo.axisPlacement?("outside"===h?(m=c.y1,n=c.y2):"inside"===h&&(m=d.bounds.y1,n=d.bounds.y2),"horizontal"===r?(e=d.point.x-q/2,f=0<=d.dataPoint.y?Math.min(Math.max(d.point.y-k/2-5,m+k/2+5),n-k/2-5):Math.max(Math.min(d.point.y+k/2+5,n-k/2),m+k/2+5)):"vertical"===r&&(e=
d.point.x,f=0<=d.dataPoint.y?Math.min(Math.max(d.point.y-5,m+q+5),n):Math.max(Math.min(d.point.y+q+5,n-5),m),g=-90)):"xySwapped"===this.plotInfo.axisPlacement&&("outside"===h?(p=c.x1,t=c.x2):"inside"===h&&(p=d.bounds.x1,t=d.bounds.x2),"horizontal"===r?(f=d.point.y,e=0<=d.dataPoint.y?Math.max(Math.min(d.point.x+5,t-q),p):Math.min(Math.max(d.point.x-q-5,p),t)):"vertical"===r&&(f=d.point.y+q/2,e=0<=d.dataPoint.y?Math.max(Math.min(d.point.x+k/2+5,t-k/2),p):Math.min(Math.max(d.point.x-k/2-5,p+k/2),t+k/
2),g=-90))):"horizontal"===r?(e=d.point.x-q/2,f=0<=d.dataPoint.y?Math.max(d.point.y-k/2-5,c.y1+k/2):Math.min(d.point.y+k/2+5,c.y2-k/2)):"vertical"===r&&(e=d.point.x,f=0<=d.dataPoint.y?Math.max(d.point.y-5,c.y1+q):Math.min(d.point.y+q+5,c.y2),g=-90),a.save(),a.translate(e,f),a.rotate(Math.PI/180*g),a.fillText(l,0,0),a.restore())}};w.prototype.renderLine=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=this._eventManager.ghostCtx;c.save();var d=this.plotArea;c.beginPath();
c.rect(d.x1,d.y1,d.width,d.height);c.clip();for(var d=[],e=0;e<a.dataSeriesIndexes.length;e++){var f=a.dataSeriesIndexes[e],g=this.data[f];c.lineWidth=g.lineThickness;var l=g.dataPoints,q=g.id;this._eventManager.objectMap[q]={objectType:"dataSeries",dataSeriesIndex:f};q=B(q);b.strokeStyle=q;b.lineWidth=0<g.lineThickness?Math.max(g.lineThickness,4):0;q=g._colorSet[0];c.strokeStyle=q;var k=!0,h=0,r,m;c.beginPath();if(0<l.length){for(var n=!1,h=0;h<l.length;h++)if(r=l[h].x.getTime?l[h].x.getTime():l[h].x,
!(r<a.axisX.dataInfo.viewPortMin||r>a.axisX.dataInfo.viewPortMax))if("number"!==typeof l[h].y)0<h&&(c.stroke(),v&&b.stroke()),n=!0;else{r=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(r-a.axisX.conversionParameters.minimum)+0.5<<0;m=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(l[h].y-a.axisY.conversionParameters.minimum)+0.5<<0;var p=g.dataPointIds[h];this._eventManager.objectMap[p]={id:p,objectType:"dataPoint",dataSeriesIndex:f,
dataPointIndex:h,x1:r,y1:m};k||n?(c.beginPath(),c.moveTo(r,m),v&&(b.beginPath(),b.moveTo(r,m)),n=k=!1):(c.lineTo(r,m),v&&b.lineTo(r,m),0==h%500&&(c.stroke(),c.beginPath(),c.moveTo(r,m),v&&(b.stroke(),b.beginPath(),b.moveTo(r,m))));if(0<l[h].markerSize||0<g.markerSize){var t=g.getMarkerProperties(h,r,m,c);d.push(t);if(!g.maxWidthInX||t.size>g.maxWidthInX)g.maxWidthInX=t.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);
p=B(p);v&&d.push({x:r,y:m,ctx:b,type:t.type,size:t.size,color:p,borderColor:p,borderThickness:t.borderThickness})}(l[h].indexLabel||g.indexLabel)&&this._indexLabels.push({chartType:"line",dataPoint:l[h],dataSeries:g,point:{x:r,y:m},color:q})}c.stroke();v&&b.stroke()}}H.drawMarkers(d);c.restore();c.beginPath();v&&b.beginPath()}};w.prototype.renderStepLine=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=this._eventManager.ghostCtx;c.save();var d=this.plotArea;c.beginPath();
c.rect(d.x1,d.y1,d.width,d.height);c.clip();for(var d=[],e=0;e<a.dataSeriesIndexes.length;e++){var f=a.dataSeriesIndexes[e],g=this.data[f];c.lineWidth=g.lineThickness;var l=g.dataPoints,q=g.id;this._eventManager.objectMap[q]={objectType:"dataSeries",dataSeriesIndex:f};q=B(q);b.strokeStyle=q;b.lineWidth=0<g.lineThickness?Math.max(g.lineThickness,4):0;q=g._colorSet[0];c.strokeStyle=q;var k=!0,h=0,r,m;c.beginPath();if(0<l.length){for(var n=!1,h=0;h<l.length;h++)if(r=l[h].getTime?l[h].x.getTime():l[h].x,
!(r<a.axisX.dataInfo.viewPortMin||r>a.axisX.dataInfo.viewPortMax))if("number"!==typeof l[h].y)0<h&&(c.stroke(),v&&b.stroke()),n=!0;else{var p=m;r=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(r-a.axisX.conversionParameters.minimum)+0.5<<0;m=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(l[h].y-a.axisY.conversionParameters.minimum)+0.5<<0;var t=g.dataPointIds[h];this._eventManager.objectMap[t]={id:t,objectType:"dataPoint",dataSeriesIndex:f,
dataPointIndex:h,x1:r,y1:m};k||n?(c.beginPath(),c.moveTo(r,m),v&&(b.beginPath(),b.moveTo(r,m)),n=k=!1):(c.lineTo(r,p),v&&b.lineTo(r,p),c.lineTo(r,m),v&&b.lineTo(r,m),0==h%500&&(c.stroke(),c.beginPath(),c.moveTo(r,m),v&&(b.stroke(),b.beginPath(),b.moveTo(r,m))));if(0<l[h].markerSize||0<g.markerSize){p=g.getMarkerProperties(h,r,m,c);d.push(p);if(!g.maxWidthInX||p.size>g.maxWidthInX)g.maxWidthInX=p.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);
t=B(t);v&&d.push({x:r,y:m,ctx:b,type:p.type,size:p.size,color:t,borderColor:t,borderThickness:p.borderThickness})}(l[h].indexLabel||g.indexLabel)&&this._indexLabels.push({chartType:"stepLine",dataPoint:l[h],dataSeries:g,point:{x:r,y:m},color:q})}c.stroke();v&&b.stroke()}}H.drawMarkers(d);c.restore();c.beginPath();v&&b.beginPath()}};w.prototype.renderSpline=function(a){function c(a){a=qa(a,2);if(0<a.length){b.beginPath();v&&d.beginPath();b.moveTo(a[0].x,a[0].y);v&&d.moveTo(a[0].x,a[0].y);for(var c=
0;c<a.length-3;c+=3)b.bezierCurveTo(a[c+1].x,a[c+1].y,a[c+2].x,a[c+2].y,a[c+3].x,a[c+3].y),v&&d.bezierCurveTo(a[c+1].x,a[c+1].y,a[c+2].x,a[c+2].y,a[c+3].x,a[c+3].y),0<c&&0===c%3E3&&(b.stroke(),b.beginPath(),b.moveTo(a[c+3].x,a[c+3].y),v&&(d.stroke(),d.beginPath(),d.moveTo(a[c+3].x,a[c+3].y)));b.stroke();v&&d.stroke()}}var b=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var d=this._eventManager.ghostCtx;b.save();var e=this.plotArea;b.beginPath();b.rect(e.x1,e.y1,e.width,e.height);b.clip();
for(var e=[],f=0;f<a.dataSeriesIndexes.length;f++){var g=a.dataSeriesIndexes[f],l=this.data[g];b.lineWidth=l.lineThickness;var q=l.dataPoints,k=l.id;this._eventManager.objectMap[k]={objectType:"dataSeries",dataSeriesIndex:g};k=B(k);d.strokeStyle=k;d.lineWidth=0<l.lineThickness?Math.max(l.lineThickness,4):0;k=l._colorSet[0];b.strokeStyle=k;var h=0,r,m,n=[];b.beginPath();if(0<q.length)for(h=0;h<q.length;h++)if(r=q[h].getTime?q[h].x.getTime():q[h].x,!(r<a.axisX.dataInfo.viewPortMin||r>a.axisX.dataInfo.viewPortMax))if("number"!==
typeof q[h].y)0<h&&(c(n),n=[]);else{r=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(r-a.axisX.conversionParameters.minimum)+0.5<<0;m=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(q[h].y-a.axisY.conversionParameters.minimum)+0.5<<0;var p=l.dataPointIds[h];this._eventManager.objectMap[p]={id:p,objectType:"dataPoint",dataSeriesIndex:g,dataPointIndex:h,x1:r,y1:m};n[n.length]={x:r,y:m};if(0<q[h].markerSize||0<l.markerSize){var t=l.getMarkerProperties(h,
r,m,b);e.push(t);if(!l.maxWidthInX||t.size>l.maxWidthInX)l.maxWidthInX=t.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);p=B(p);v&&e.push({x:r,y:m,ctx:d,type:t.type,size:t.size,color:p,borderColor:p,borderThickness:t.borderThickness})}(q[h].indexLabel||l.indexLabel)&&this._indexLabels.push({chartType:"spline",dataPoint:q[h],dataSeries:l,point:{x:r,y:m},color:k})}c(n)}H.drawMarkers(e);b.restore();b.beginPath();
v&&d.beginPath()}};var J=function(a,c,b,d,e,f,g,l,q,k){var h=15<d-c&&15<e-b?8:0.35*Math.min(d-c,e-b);a.beginPath();a.moveTo(c,b);a.save();a.fillStyle=f;a.fillRect(c,b,d-c,e-b);a.restore();!0===g&&(a.save(),a.beginPath(),a.moveTo(c,b),a.lineTo(c+h,b+h),a.lineTo(d-h,b+h),a.lineTo(d,b),a.closePath(),g=a.createLinearGradient((d+c)/2,b+h,(d+c)/2,b),g.addColorStop(0,f),g.addColorStop(1,"rgba(255, 255, 255, .4)"),a.fillStyle=g,a.fill(),a.restore());!0===l&&(a.save(),a.beginPath(),a.moveTo(c,e),a.lineTo(c+
h,e-h),a.lineTo(d-h,e-h),a.lineTo(d,e),a.closePath(),g=a.createLinearGradient((d+c)/2,e-h,(d+c)/2,e),g.addColorStop(0,f),g.addColorStop(1,"rgba(255, 255, 255, .4)"),a.fillStyle=g,a.fill(),a.restore());!0===q&&(a.save(),a.beginPath(),a.moveTo(c,b),a.lineTo(c+h,b+h),a.lineTo(c+h,e-h),a.lineTo(c,e),a.closePath(),g=a.createLinearGradient(c+h,(e+b)/2,c,(e+b)/2),g.addColorStop(0,f),g.addColorStop(1,"rgba(255, 255, 255, 0.1)"),a.fillStyle=g,a.fill(),a.restore());!0===k&&(a.save(),a.beginPath(),a.moveTo(d,
b),a.lineTo(d-h,b+h),a.lineTo(d-h,e-h),a.lineTo(d,e),g=a.createLinearGradient(d-h,(e+b)/2,d,(e+b)/2),g.addColorStop(0,f),g.addColorStop(1,"rgba(255, 255, 255, 0.1)"),a.fillStyle=g,g.addColorStop(0,f),g.addColorStop(1,"rgba(255, 255, 255, 0.1)"),a.fillStyle=g,a.fill(),a.closePath(),a.restore())};w.prototype.renderColumn=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=0,f,g,l,q=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*
(0-a.axisY.conversionParameters.minimum)<<0,e=Math.min(0.15*this.width,0.9*(this.plotArea.width/a.plotType.totalDataSeries))<<0,k=a.axisX.dataInfo.minDiff,h=0.9*(d.width/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(k)/a.plotType.totalDataSeries)<<0;h>e?h=e:Infinity===k?h=e:1>h&&(h=1);c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(d=
0;d<a.dataSeriesIndexes.length;d++){var k=a.dataSeriesIndexes[d],r=this.data[k],m=r.dataPoints;r.maxWidthInX=h/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);if(0<m.length)for(var n=5<h&&r.bevelEnabled?!0:!1,e=0;e<m.length;e++)if(m[e].getTime?l=m[e].x.getTime():l=m[e].x,!(l<a.axisX.dataInfo.viewPortMin||l>a.axisX.dataInfo.viewPortMax)&&"number"===typeof m[e].y){f=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*
(l-a.axisX.conversionParameters.minimum)+0.5<<0;g=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(m[e].y-a.axisY.conversionParameters.minimum)+0.5<<0;f=f-a.plotType.totalDataSeries*h/2+(a.previousDataSeriesCount+d)*h<<0;var p=f+h<<0,t;0<=m[e].y?t=q:(t=g,g=q);g>t&&(t=g=t);b=m[e].color?m[e].color:r._colorSet[e%r._colorSet.length];J(c,f,g,p,t,b,n&&0<=m[e].y,0>m[e].y&&n,!1,!1);b=r.dataPointIds[e];this._eventManager.objectMap[b]={id:b,objectType:"dataPoint",dataSeriesIndex:k,
dataPointIndex:e,x1:f,y1:g,x2:p,y2:t};b=B(b);v&&J(this._eventManager.ghostCtx,f,g,p,t,b,!1,!1,!1,!1);(m[e].indexLabel||r.indexLabel)&&this._indexLabels.push({chartType:"column",dataPoint:m[e],dataSeries:r,point:{x:f+(p-f)/2,y:0<=m[e].y?g:t},bounds:{x1:f,y1:Math.min(g,t),x2:p,y2:Math.max(g,t)},color:b})}}c.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderStackedColumn=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=[],f=[],
g=0,l,q=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,g=0.15*this.width<<0,k=a.axisX.dataInfo.minDiff,h=0.9*(d.width/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(k)/a.plotType.plotUnits.length)<<0;h>g?h=g:Infinity===k?h=g:1>h&&(h=1);c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());
for(k=0;k<a.dataSeriesIndexes.length;k++){var r=a.dataSeriesIndexes[k],m=this.data[r],n=m.dataPoints;m.maxWidthInX=h/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);if(0<n.length){var p=5<h&&m.bevelEnabled?!0:!1;c.strokeStyle="#4572A7 ";for(g=0;g<n.length;g++)if(b=n[g].x.getTime?n[g].x.getTime():n[g].x,!(b<a.axisX.dataInfo.viewPortMin||b>a.axisX.dataInfo.viewPortMax)&&"number"===typeof n[g].y){d=a.axisX.conversionParameters.reference+
a.axisX.conversionParameters.pixelPerUnit*(b-a.axisX.conversionParameters.minimum)+0.5<<0;l=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(n[g].y-a.axisY.conversionParameters.minimum)+0.5<<0;var t=d-a.plotType.plotUnits.length*h/2+a.index*h<<0,u=t+h<<0,s;if(0<=n[g].y){var A=e[b]?e[b]:0;l-=A;s=q-A;e[b]=A+(s-l)}else A=f[b]?f[b]:0,s=l+A,l=q+A,f[b]=A+(s-l);b=n[g].color?n[g].color:m._colorSet[g%m._colorSet.length];J(c,t,l,u,s,b,p&&0<=n[g].y,0>n[g].y&&p,!1,!1);b=m.dataPointIds[g];
this._eventManager.objectMap[b]={id:b,objectType:"dataPoint",dataSeriesIndex:r,dataPointIndex:g,x1:t,y1:l,x2:u,y2:s};b=B(b);v&&J(this._eventManager.ghostCtx,t,l,u,s,b,!1,!1,!1,!1);(n[g].indexLabel||m.indexLabel)&&this._indexLabels.push({chartType:"stackedColumn",dataPoint:n[g],dataSeries:m,point:{x:d,y:0<=n[g].y?l:s},bounds:{x1:t,y1:Math.min(l,s),x2:u,y2:Math.max(l,s)},color:b})}}}c.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderStackedColumn100=function(a){var c=this.plotArea.ctx;
if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=[],f=[],g=0,l,q=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,g=0.15*this.width<<0,k=a.axisX.dataInfo.minDiff,h=0.9*(d.width/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(k)/a.plotType.plotUnits.length)<<0;h>g?h=g:Infinity===k?h=g:1>h&&(h=1);c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,
d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(k=0;k<a.dataSeriesIndexes.length;k++){var r=a.dataSeriesIndexes[k],m=this.data[r],n=m.dataPoints;m.maxWidthInX=h/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);if(0<n.length)for(var p=5<h&&m.bevelEnabled?!0:!1,g=0;g<n.length;g++)if(b=n[g].x.getTime?n[g].x.getTime():n[g].x,!(b<a.axisX.dataInfo.viewPortMin||b>a.axisX.dataInfo.viewPortMax)&&"number"===typeof n[g].y){d=
a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(b-a.axisX.conversionParameters.minimum)+0.5<<0;l=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*((0!==a.dataPointYSums[b]?100*(n[g].y/a.dataPointYSums[b]):0)-a.axisY.conversionParameters.minimum)+0.5<<0;var t=d-a.plotType.plotUnits.length*h/2+a.index*h<<0,u=t+h<<0,s;if(0<=n[g].y){var A=e[b]?e[b]:0;l-=A;s=q-A;e[b]=A+(s-l)}else A=f[b]?f[b]:0,s=l+A,l=q+A,f[b]=A+(s-l);b=n[g].color?n[g].color:
m._colorSet[g%m._colorSet.length];J(c,t,l,u,s,b,p&&0<=n[g].y,0>n[g].y&&p,!1,!1);b=m.dataPointIds[g];this._eventManager.objectMap[b]={id:b,objectType:"dataPoint",dataSeriesIndex:r,dataPointIndex:g,x1:t,y1:l,x2:u,y2:s};b=B(b);v&&J(this._eventManager.ghostCtx,t,l,u,s,b,!1,!1,!1,!1);(n[g].indexLabel||m.indexLabel)&&this._indexLabels.push({chartType:"stackedColumn100",dataPoint:n[g],dataSeries:m,point:{x:d,y:0<=n[g].y?l:s},bounds:{x1:t,y1:Math.min(l,s),x2:u,y2:Math.max(l,s)},color:b})}}c.restore();v&&
this._eventManager.ghostCtx.restore()}};w.prototype.renderBar=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=0,f,g,l,q=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,e=Math.min(0.15*this.height,0.9*(this.plotArea.height/a.plotType.totalDataSeries))<<0,k=a.axisX.dataInfo.minDiff,h=0.9*(d.height/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(k)/a.plotType.totalDataSeries)<<
0;h>e?h=e:Infinity===k?h=e:1>h&&(h=1);c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(d=0;d<a.dataSeriesIndexes.length;d++){var k=a.dataSeriesIndexes[d],r=this.data[k],m=r.dataPoints;r.maxWidthInX=h/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);if(0<m.length){var n=
5<h&&r.bevelEnabled?!0:!1;c.strokeStyle="#4572A7 ";for(e=0;e<m.length;e++)if(m[e].getTime?l=m[e].x.getTime():l=m[e].x,!(l<a.axisX.dataInfo.viewPortMin||l>a.axisX.dataInfo.viewPortMax)&&"number"===typeof m[e].y){g=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(l-a.axisX.conversionParameters.minimum)+0.5<<0;f=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(m[e].y-a.axisY.conversionParameters.minimum)+0.5<<0;g=g-a.plotType.totalDataSeries*
h/2+(a.previousDataSeriesCount+d)*h<<0;var p=g+h<<0,t;0<=m[e].y?t=q:(t=f,f=q);b=m[e].color?m[e].color:r._colorSet[e%r._colorSet.length];J(c,t,g,f,p,b,n,!1,!1,!1);b=r.dataPointIds[e];this._eventManager.objectMap[b]={id:b,objectType:"dataPoint",dataSeriesIndex:k,dataPointIndex:e,x1:t,y1:g,x2:f,y2:p};b=B(b);v&&J(this._eventManager.ghostCtx,t,g,f,p,b,!1,!1,!1,!1);this._indexLabels.push({chartType:"bar",dataPoint:m[e],dataSeries:r,point:{x:0<=m[e].y?f:t,y:g+(p-g)/2},bounds:{x1:Math.min(t,f),y1:g,x2:Math.max(t,
f),y2:p},color:b})}}}c.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderStackedBar=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=[],f=[],g=0,l,q=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,g=0.15*this.width<<0,k=a.axisX.dataInfo.minDiff,h=0.9*(d.height/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(k)/a.plotType.plotUnits.length)<<0;h>g?
h=g:Infinity===k?h=g:1>h&&(h=1);c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(k=0;k<a.dataSeriesIndexes.length;k++){var r=a.dataSeriesIndexes[k],m=this.data[r],n=m.dataPoints;m.maxWidthInX=h/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);if(0<n.length){var p=
5<h&&m.bevelEnabled?!0:!1;c.strokeStyle="#4572A7 ";for(g=0;g<n.length;g++)if(b=n[g].x.getTime?n[g].x.getTime():n[g].x,!(b<a.axisX.dataInfo.viewPortMin||b>a.axisX.dataInfo.viewPortMax)&&"number"===typeof n[g].y){d=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(b-a.axisX.conversionParameters.minimum)+0.5<<0;l=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(n[g].y-a.axisY.conversionParameters.minimum)+0.5<<0;var t=d-a.plotType.plotUnits.length*
h/2+a.index*h<<0,u=t+h<<0,s;if(0<=n[g].y){var A=e[b]?e[b]:0;s=q+A;l+=A;e[b]=A+(l-s)}else A=f[b]?f[b]:0,s=l-A,l=q-A,f[b]=A+(l-s);b=n[g].color?n[g].color:m._colorSet[g%m._colorSet.length];J(c,s,t,l,u,b,p,!1,!1,!1);b=m.dataPointIds[g];this._eventManager.objectMap[b]={id:b,objectType:"dataPoint",dataSeriesIndex:r,dataPointIndex:g,x1:s,y1:t,x2:l,y2:u};b=B(b);v&&J(this._eventManager.ghostCtx,s,t,l,u,b,!1,!1,!1,!1);this._indexLabels.push({chartType:"stackedBar",dataPoint:n[g],dataSeries:m,point:{x:0<=n[g].y?
l:s,y:d},bounds:{x1:Math.min(s,l),y1:t,x2:Math.max(s,l),y2:u},color:b})}}}c.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderStackedBar100=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=[],f=[],g=0,l,q=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,g=0.15*this.width<<0,k=a.axisX.dataInfo.minDiff,h=0.9*(d.height/Math.abs(a.axisX.maximum-a.axisX.minimum)*
Math.abs(k)/a.plotType.plotUnits.length)<<0;h>g?h=g:Infinity===k?h=g:1>h&&(h=1);c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(k=0;k<a.dataSeriesIndexes.length;k++){var r=a.dataSeriesIndexes[k],m=this.data[r],n=m.dataPoints;m.maxWidthInX=h/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);
if(0<n.length){var p=5<h&&m.bevelEnabled?!0:!1;c.strokeStyle="#4572A7 ";for(g=0;g<n.length;g++)if(b=n[g].x.getTime?n[g].x.getTime():n[g].x,!(b<a.axisX.dataInfo.viewPortMin||b>a.axisX.dataInfo.viewPortMax)&&"number"===typeof n[g].y){d=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(b-a.axisX.conversionParameters.minimum)+0.5<<0;l=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*((0!==a.dataPointYSums[b]?100*(n[g].y/a.dataPointYSums[b]):
0)-a.axisY.conversionParameters.minimum)+0.5<<0;var t=d-a.plotType.plotUnits.length*h/2+a.index*h<<0,u=t+h<<0,s;if(0<=n[g].y){var A=e[b]?e[b]:0;s=q+A;l+=A;e[b]=A+(l-s)}else A=f[b]?f[b]:0,s=l-A,l=q-A,f[b]=A+(l-s);b=n[g].color?n[g].color:m._colorSet[g%m._colorSet.length];J(c,s,t,l,u,b,p,!1,!1,!1);b=m.dataPointIds[g];this._eventManager.objectMap[b]={id:b,objectType:"dataPoint",dataSeriesIndex:r,dataPointIndex:g,x1:s,y1:t,x2:l,y2:u};b=B(b);v&&J(this._eventManager.ghostCtx,s,t,l,u,b,!1,!1,!1,!1);this._indexLabels.push({chartType:"stackedBar100",
dataPoint:n[g],dataSeries:m,point:{x:0<=n[g].y?l:s,y:d},bounds:{x1:Math.min(s,l),y1:t,x2:Math.max(s,l),y2:u},color:b})}}}c.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderArea=function(a){function c(){A&&(0>=a.axisY.minimum&&0<=a.axisY.maximum?s=u:0>a.axisY.maximum?s=f.y1:0<a.axisY.minimum&&(s=e.y2),b.lineTo(n,s),b.lineTo(A.x,s),b.closePath(),b.fill(),v&&(d.lineTo(n,s),d.lineTo(A.x,s),d.closePath(),d.fill()),b.beginPath(),b.moveTo(n,p),d.beginPath(),d.moveTo(n,p),A={x:n,y:p})}
var b=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var d=this._eventManager.ghostCtx,e=a.axisX.lineCoordinates,f=a.axisY.lineCoordinates,g=[],l=this.plotArea;b.save();v&&d.save();b.beginPath();b.rect(l.x1,l.y1,l.width,l.height);b.clip();v&&(d.beginPath(),d.rect(l.x1,l.y1,l.width,l.height),d.clip());for(l=0;l<a.dataSeriesIndexes.length;l++){var q=a.dataSeriesIndexes[l],k=this.data[q],h=k.dataPoints,g=k.id;this._eventManager.objectMap[g]={objectType:"dataSeries",dataSeriesIndex:q};g=B(g);
d.fillStyle=g;var g=[],r=!0,m=0,n,p,t,u=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)+0.5<<0,s,A=null;if(0<h.length){var w=k._colorSet[m%k._colorSet.length];b.fillStyle=w;for(var z=!0;m<h.length;m++)if(t=h[m].x.getTime?h[m].x.getTime():h[m].x,!(t<a.axisX.dataInfo.viewPortMin||t>a.axisX.dataInfo.viewPortMax))if("number"!==typeof h[m].y)c(),z=!0;else{n=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*
(t-a.axisX.conversionParameters.minimum)+0.5<<0;p=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(h[m].y-a.axisY.conversionParameters.minimum)+0.5<<0;r||z?(b.beginPath(),b.moveTo(n,p),A={x:n,y:p},v&&(d.beginPath(),d.moveTo(n,p)),z=r=!1):(b.lineTo(n,p),v&&d.lineTo(n,p),0==m%250&&c());var E=k.dataPointIds[m];this._eventManager.objectMap[E]={id:E,objectType:"dataPoint",dataSeriesIndex:q,dataPointIndex:m,x1:n,y1:p};if(0!==h[m].markerSize&&(0<h[m].markerSize||0<k.markerSize)){t=
k.getMarkerProperties(m,n,p,b);g.push(t);if(!k.maxWidthInX||t.size>k.maxWidthInX)k.maxWidthInX=t.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);E=B(E);v&&g.push({x:n,y:p,ctx:d,type:t.type,size:t.size,color:E,borderColor:E,borderThickness:t.borderThickness})}(h[m].indexLabel||k.indexLabel)&&this._indexLabels.push({chartType:"area",dataPoint:h[m],dataSeries:k,point:{x:n,y:p},color:w})}c();H.drawMarkers(g)}}b.restore();
v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderSplineArea=function(a){function c(){var c=qa(s,2);if(0<c.length){b.beginPath();b.moveTo(c[0].x,c[0].y);v&&(d.beginPath(),d.moveTo(c[0].x,c[0].y));for(var g=0;g<c.length-3;g+=3)b.bezierCurveTo(c[g+1].x,c[g+1].y,c[g+2].x,c[g+2].y,c[g+3].x,c[g+3].y),v&&d.bezierCurveTo(c[g+1].x,c[g+1].y,c[g+2].x,c[g+2].y,c[g+3].x,c[g+3].y);0>=a.axisY.minimum&&0<=a.axisY.maximum?t=p:0>a.axisY.maximum?t=f.y1:0<a.axisY.minimum&&(t=e.y2);u={x:c[0].x,y:c[0].y};b.lineTo(c[c.length-
1].x,t);b.lineTo(u.x,t);b.closePath();b.fill();v&&(d.lineTo(c[c.length-1].x,t),d.lineTo(u.x,t),d.closePath(),d.fill())}}var b=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var d=this._eventManager.ghostCtx,e=a.axisX.lineCoordinates,f=a.axisY.lineCoordinates,g=[],l=this.plotArea;b.save();v&&d.save();b.beginPath();b.rect(l.x1,l.y1,l.width,l.height);b.clip();v&&(d.beginPath(),d.rect(l.x1,l.y1,l.width,l.height),d.clip());for(l=0;l<a.dataSeriesIndexes.length;l++){var q=a.dataSeriesIndexes[l],
k=this.data[q],h=k.dataPoints,g=k.id;this._eventManager.objectMap[g]={objectType:"dataSeries",dataSeriesIndex:q};g=B(g);d.fillStyle=g;var g=[],r=0,m,n,p=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)+0.5<<0,t,u=null,s=[];if(0<h.length){color=k._colorSet[r%k._colorSet.length];for(b.fillStyle=color;r<h.length;r++)if(m=h[r].x.getTime?h[r].x.getTime():h[r].x,!(m<a.axisX.dataInfo.viewPortMin||m>a.axisX.dataInfo.viewPortMax))if("number"!==
typeof h[r].y)0<r&&(c(),s=[]);else{m=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(m-a.axisX.conversionParameters.minimum)+0.5<<0;n=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(h[r].y-a.axisY.conversionParameters.minimum)+0.5<<0;var A=k.dataPointIds[r];this._eventManager.objectMap[A]={id:A,objectType:"dataPoint",dataSeriesIndex:q,dataPointIndex:r,x1:m,y1:n};s[s.length]={x:m,y:n};if(0!==h[r].markerSize&&(0<h[r].markerSize||0<
k.markerSize)){var w=k.getMarkerProperties(r,m,n,b);g.push(w);if(!k.maxWidthInX||w.size>k.maxWidthInX)k.maxWidthInX=w.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);A=B(A);v&&g.push({x:m,y:n,ctx:d,type:w.type,size:w.size,color:A,borderColor:A,borderThickness:w.borderThickness})}(h[r].indexLabel||k.indexLabel)&&this._indexLabels.push({chartType:"splineArea",dataPoint:h[r],dataSeries:k,point:{x:m,y:n},color:color})}c();
H.drawMarkers(g)}}b.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderStepArea=function(a){function c(){w&&(0>=a.axisY.minimum&&0<=a.axisY.maximum?s=u:0>a.axisY.maximum?s=f.y1:0<a.axisY.minimum&&(s=e.y2),b.lineTo(n,s),b.lineTo(w.x,s),b.closePath(),b.fill(),v&&(d.lineTo(n,s),d.lineTo(w.x,s),d.closePath(),d.fill()),b.beginPath(),b.moveTo(n,p),d.beginPath(),d.moveTo(n,p),w={x:n,y:p})}var b=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var d=this._eventManager.ghostCtx,e=
a.axisX.lineCoordinates,f=a.axisY.lineCoordinates,g=[],l=this.plotArea;b.save();v&&d.save();b.beginPath();b.rect(l.x1,l.y1,l.width,l.height);b.clip();v&&(d.beginPath(),d.rect(l.x1,l.y1,l.width,l.height),d.clip());for(l=0;l<a.dataSeriesIndexes.length;l++){var q=a.dataSeriesIndexes[l],k=this.data[q],h=k.dataPoints,g=k.id;this._eventManager.objectMap[g]={objectType:"dataSeries",dataSeriesIndex:q};g=B(g);d.fillStyle=g;var g=[],r=!0,m=0,n,p,t,u=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*
(0-a.axisY.conversionParameters.minimum)+0.5<<0,s,w=null,x=!1;if(0<h.length){var z=k._colorSet[m%k._colorSet.length];for(b.fillStyle=z;m<h.length;m++)if(t=h[m].x.getTime?h[m].x.getTime():h[m].x,!(t<a.axisX.dataInfo.viewPortMin||t>a.axisX.dataInfo.viewPortMax)){var E=p;if("number"!==typeof h[m].y)c(),x=!0;else{n=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(t-a.axisX.conversionParameters.minimum)+0.5<<0;p=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*
(h[m].y-a.axisY.conversionParameters.minimum)+0.5<<0;r||x?(b.beginPath(),b.moveTo(n,p),w={x:n,y:p},v&&(d.beginPath(),d.moveTo(n,p)),x=r=!1):(b.lineTo(n,E),v&&d.lineTo(n,E),b.lineTo(n,p),v&&d.lineTo(n,p),0==m%250&&(0>=a.axisY.minimum&&0<=a.axisY.maximum?s=u:0>a.axisY.maximum?s=f.y1:0<a.axisY.minimum&&(s=e.y2),b.lineTo(n,s),b.lineTo(w.x,s),b.closePath(),b.fill(),b.beginPath(),b.moveTo(n,p),v&&(d.lineTo(n,s),d.lineTo(w.x,s),d.closePath(),d.fill(),d.beginPath(),d.moveTo(n,p)),w={x:n,y:p}));E=k.dataPointIds[m];
this._eventManager.objectMap[E]={id:E,objectType:"dataPoint",dataSeriesIndex:q,dataPointIndex:m,x1:n,y1:p};if(0!==h[m].markerSize&&(0<h[m].markerSize||0<k.markerSize)){t=k.getMarkerProperties(m,n,p,b);g.push(t);if(!k.maxWidthInX||t.size>k.maxWidthInX)k.maxWidthInX=t.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);E=B(E);v&&g.push({x:n,y:p,ctx:d,type:t.type,size:t.size,color:E,borderColor:E,borderThickness:t.borderThickness})}(h[m].indexLabel||
k.indexLabel)&&this._indexLabels.push({chartType:"stepArea",dataPoint:h[m],dataSeries:k,point:{x:n,y:p},color:z})}}c();H.drawMarkers(g)}}b.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderStackedArea=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=[],e=this.plotArea,f=[],g=[],l=0,q,k,h,r=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,m=this._eventManager.ghostCtx;
v&&m.beginPath();c.save();v&&m.save();c.beginPath();c.rect(e.x1,e.y1,e.width,e.height);c.clip();v&&(m.beginPath(),m.rect(e.x1,e.y1,e.width,e.height),m.clip());xValuePresent=[];for(e=0;e<a.dataSeriesIndexes.length;e++){var n=a.dataSeriesIndexes[e],p=this.data[n],t=p.dataPoints;p.dataPointIndexes=[];for(l=0;l<t.length;l++)n=t[l].x.getTime?t[l].x.getTime():t[l].x,p.dataPointIndexes[n]=l,xValuePresent[n]||(g.push(n),xValuePresent[n]=!0);g.sort(la)}for(e=0;e<a.dataSeriesIndexes.length;e++){var n=a.dataSeriesIndexes[e],
p=this.data[n],t=p.dataPoints,u=!0,s=[],l=p.id;this._eventManager.objectMap[l]={objectType:"dataSeries",dataSeriesIndex:n};l=B(l);m.fillStyle=l;if(0<g.length){b=p._colorSet[0];c.fillStyle=b;for(l=0;l<g.length;l++){h=g[l];var w=null,w=0<=p.dataPointIndexes[h]?t[p.dataPointIndexes[h]]:{x:h,y:0};if(!(h<a.axisX.dataInfo.viewPortMin||h>a.axisX.dataInfo.viewPortMax)&&"number"===typeof w.y){q=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(h-a.axisX.conversionParameters.minimum)+
0.5<<0;k=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(w.y-a.axisY.conversionParameters.minimum)+0.5<<0;var x=f[h]?f[h]:0;k-=x;s.push({x:q,y:r-x});f[h]=r-k;if(u)c.beginPath(),c.moveTo(q,k),v&&(m.beginPath(),m.moveTo(q,k)),u=!1;else if(c.lineTo(q,k),v&&m.lineTo(q,k),0==l%250){for(;0<s.length;){var z=s.pop();c.lineTo(z.x,z.y);v&&m.lineTo(z.x,z.y)}c.closePath();c.fill();c.beginPath();c.moveTo(q,k);v&&(m.closePath(),m.fill(),m.beginPath(),m.moveTo(q,k));s.push({x:q,
y:r-x})}if(0<=p.dataPointIndexes[h]){var E=p.dataPointIds[p.dataPointIndexes[h]];this._eventManager.objectMap[E]={id:E,objectType:"dataPoint",dataSeriesIndex:n,dataPointIndex:p.dataPointIndexes[h],x1:q,y1:k}}if(0<=p.dataPointIndexes[h]&&0!==w.markerSize&&(0<w.markerSize||0<p.markerSize)){h=p.getMarkerProperties(l,q,k,c);d.push(h);if(!p.maxWidthInX||h.size>p.maxWidthInX)p.maxWidthInX=h.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);
markerColor=B(E);v&&d.push({x:q,y:k,ctx:m,type:h.type,size:h.size,color:markerColor,borderColor:markerColor,borderThickness:h.borderThickness})}(w.indexLabel||p.indexLabel)&&this._indexLabels.push({chartType:"stackedArea",dataPoint:w,dataSeries:p,point:{x:q,y:k},color:b})}}for(;0<s.length;)z=s.pop(),c.lineTo(z.x,z.y),v&&m.lineTo(z.x,z.y);c.closePath();c.fill();c.beginPath();c.moveTo(q,k);v&&(m.closePath(),m.fill(),m.beginPath(),m.moveTo(q,k))}delete p.dataPointIndexes}H.drawMarkers(d);c.restore();
v&&m.restore()}};w.prototype.renderStackedArea100=function(a){var c=this.plotArea.ctx;if(!(0>=a.dataSeriesIndexes.length)){var b=null,d=this.plotArea,e=[],f=[],g=[],l=0,q,k,h,r=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(0-a.axisY.conversionParameters.minimum)<<0,m=0.15*this.width<<0,n=a.axisX.dataInfo.minDiff,n=0.9*d.width/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(n)<<0,p=this._eventManager.ghostCtx;c.save();v&&p.save();c.beginPath();c.rect(d.x1,d.y1,
d.width,d.height);c.clip();v&&(p.beginPath(),p.rect(d.x1,d.y1,d.width,d.height),p.clip());xValuePresent=[];for(d=0;d<a.dataSeriesIndexes.length;d++){var t=a.dataSeriesIndexes[d],u=this.data[t],s=u.dataPoints;u.dataPointIndexes=[];for(l=0;l<s.length;l++)t=s[l].x.getTime?s[l].x.getTime():s[l].x,u.dataPointIndexes[t]=l,xValuePresent[t]||(g.push(t),xValuePresent[t]=!0);g.sort(la)}for(d=0;d<a.dataSeriesIndexes.length;d++){var t=a.dataSeriesIndexes[d],u=this.data[t],s=u.dataPoints,w=!0,b=u.id;this._eventManager.objectMap[b]=
{objectType:"dataSeries",dataSeriesIndex:t};b=B(b);p.fillStyle=b;1==s.length&&(n=m);1>n?n=1:n>m&&(n=m);var x=[];if(0<g.length){b=u._colorSet[l%u._colorSet.length];c.fillStyle=b;for(l=0;l<g.length;l++){h=g[l];var z=null,z=0<=u.dataPointIndexes[h]?s[u.dataPointIndexes[h]]:{x:h,y:0};if(!(h<a.axisX.dataInfo.viewPortMin||h>a.axisX.dataInfo.viewPortMax)&&"number"===typeof z.y){k=0!==a.dataPointYSums[h]?100*(z.y/a.dataPointYSums[h]):0;q=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*
(h-a.axisX.conversionParameters.minimum)+0.5<<0;k=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(k-a.axisY.conversionParameters.minimum)+0.5<<0;var E=f[h]?f[h]:0;k-=E;x.push({x:q,y:r-E});f[h]=r-k;if(w)c.beginPath(),c.moveTo(q,k),v&&(p.beginPath(),p.moveTo(q,k)),w=!1;else if(c.lineTo(q,k),v&&p.lineTo(q,k),0==l%250){for(;0<x.length;){var D=x.pop();c.lineTo(D.x,D.y);v&&p.lineTo(D.x,D.y)}c.closePath();c.fill();c.beginPath();c.moveTo(q,k);v&&(p.closePath(),p.fill(),p.beginPath(),
p.moveTo(q,k));x.push({x:q,y:r-E})}if(0<=u.dataPointIndexes[h]){var y=u.dataPointIds[u.dataPointIndexes[h]];this._eventManager.objectMap[y]={id:y,objectType:"dataPoint",dataSeriesIndex:t,dataPointIndex:u.dataPointIndexes[h],x1:q,y1:k}}if(0<=u.dataPointIndexes[h]&&0!==z.markerSize&&(0<z.markerSize||0<u.markerSize)){h=u.getMarkerProperties(l,q,k,c);e.push(h);if(!u.maxWidthInX||h.size>u.maxWidthInX)u.maxWidthInX=h.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-
1:a.axisX.conversionParameters.pixelPerUnit);markerColor=B(y);v&&e.push({x:q,y:k,ctx:p,type:h.type,size:h.size,color:markerColor,borderColor:markerColor,borderThickness:h.borderThickness})}(z.indexLabel||u.indexLabel)&&this._indexLabels.push({chartType:"stackedArea100",dataPoint:z,dataSeries:u,point:{x:q,y:k},color:b})}}for(;0<x.length;)D=x.pop(),c.lineTo(D.x,D.y),v&&p.lineTo(D.x,D.y);c.closePath();c.fill();c.beginPath();c.moveTo(q,k);v&&(p.closePath(),p.fill(),p.beginPath(),p.moveTo(q,k))}delete u.dataPointIndexes}H.drawMarkers(e);
c.restore();v&&p.restore()}};w.prototype.renderBubble=function(a){var c=this.plotArea.ctx,b=a.dataSeriesIndexes.length;if(!(0>=b)){var d=this.plotArea,e=0,f,g,l=0.15*this.width<<0,e=a.axisX.dataInfo.minDiff,b=0.9*(d.width/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(e)/b)<<0;c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(var q=-Infinity,
k=Infinity,h=0;h<a.dataSeriesIndexes.length;h++)for(var r=a.dataSeriesIndexes[h],m=this.data[r],n=m.dataPoints,p=0,e=0;e<n.length;e++)f=n[e].getTime?f=n[e].x.getTime():f=n[e].x,f<a.axisX.dataInfo.viewPortMin||f>a.axisX.dataInfo.viewPortMax||"undefined"===typeof n[e].z||(p=n[e].z,p>q&&(q=p),p<k&&(k=p));for(var t=25*Math.PI,d=Math.max(Math.pow(0.25*Math.min(d.height,d.width)/2,2)*Math.PI,t),h=0;h<a.dataSeriesIndexes.length;h++)if(r=a.dataSeriesIndexes[h],m=this.data[r],n=m.dataPoints,1==n.length&&(b=
l),1>b?b=1:b>l&&(b=l),0<n.length)for(c.strokeStyle="#4572A7 ",e=0;e<n.length;e++)if(f=n[e].getTime?f=n[e].x.getTime():f=n[e].x,!(f<a.axisX.dataInfo.viewPortMin||f>a.axisX.dataInfo.viewPortMax)&&"number"===typeof n[e].y){f=a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(f-a.axisX.conversionParameters.minimum)+0.5<<0;g=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(n[e].y-a.axisY.conversionParameters.minimum)+0.5<<0;var p=n[e].z,u=
2*Math.max(Math.sqrt((q===k?d/2:t+(d-t)/(q-k)*(p-k))/Math.PI)<<0,1),p=m.getMarkerProperties(e,c);p.size=u;H.drawMarker(f,g,c,p.type,p.size,p.color,p.borderColor,p.borderThickness);if(!m.maxWidthInX||p.size>m.maxWidthInX)m.maxWidthInX=p.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-1:a.axisX.conversionParameters.pixelPerUnit);var s=m.dataPointIds[e];this._eventManager.objectMap[s]={id:s,objectType:"dataPoint",dataSeriesIndex:r,dataPointIndex:e,x1:f,y1:g,
size:u};u=B(s);v&&H.drawMarker(f,g,this._eventManager.ghostCtx,p.type,p.size,u,u,p.borderThickness)}c.restore();v&&this._eventManager.ghostCtx.restore()}};w.prototype.renderScatter=function(a){var c=this.plotArea.ctx,b=a.dataSeriesIndexes.length;if(!(0>=b)){var d=this.plotArea,e=0,f,g,l=0.15*this.width<<0,e=a.axisX.dataInfo.minDiff,b=0.9*(d.width/Math.abs(a.axisX.maximum-a.axisX.minimum)*Math.abs(e)/b)<<0;c.save();v&&this._eventManager.ghostCtx.save();c.beginPath();c.rect(d.x1,d.y1,d.width,d.height);
c.clip();v&&(this._eventManager.ghostCtx.rect(d.x1,d.y1,d.width,d.height),this._eventManager.ghostCtx.clip());for(var q=0;q<a.dataSeriesIndexes.length;q++){var k=a.dataSeriesIndexes[q],h=this.data[k],r=h.dataPoints;1==r.length&&(b=l);1>b?b=1:b>l&&(b=l);if(0<r.length){c.strokeStyle="#4572A7 ";Math.pow(0.3*Math.min(d.height,d.width)/2,2);for(var m=0,n=0,e=0;e<r.length;e++)if(f=r[e].getTime?f=r[e].x.getTime():f=r[e].x,!(f<a.axisX.dataInfo.viewPortMin||f>a.axisX.dataInfo.viewPortMax)&&"number"===typeof r[e].y){f=
a.axisX.conversionParameters.reference+a.axisX.conversionParameters.pixelPerUnit*(f-a.axisX.conversionParameters.minimum)+0.5<<0;g=a.axisY.conversionParameters.reference+a.axisY.conversionParameters.pixelPerUnit*(r[e].y-a.axisY.conversionParameters.minimum)+0.5<<0;var p=h.getMarkerProperties(e,f,g,c);H.drawMarker(p.x,p.y,p.ctx,p.type,p.size,p.color,p.color,p.thickness);if(!h.maxWidthInX||p.size>h.maxWidthInX)h.maxWidthInX=p.size/(1<a.axisX.conversionParameters.pixelPerUnit?a.axisX.conversionParameters.pixelPerUnit-
1:a.axisX.conversionParameters.pixelPerUnit);Math.sqrt((m-f)*(m-f)+(n-g)*(n-g))<Math.min(p.size,5)||(m=h.dataPointIds[e],this._eventManager.objectMap[m]={id:m,objectType:"dataPoint",dataSeriesIndex:k,dataPointIndex:e,x1:f,y1:g},m=B(m),v&&H.drawMarker(p.x,p.y,this._eventManager.ghostCtx,p.type,p.size,m,m,p.borderThickness),m=f,n=g)}}}c.restore();v&&this._eventManager.ghostCtx.restore()}};var ja=function(a,c,b,d,e,f,g){a.save();"pie"===e?(a.beginPath(),a.moveTo(c.x,c.y),a.arc(c.x,c.y,b,f,g,!1),a.fillStyle=
d,a.strokeStyle="white",a.lineWidth=2,a.closePath(),a.fill()):"doughnut"===e&&(a.beginPath(),a.arc(c.x,c.y,b,f,g,!1),a.arc(c.x,c.y,0.6*b,g,f,!0),a.closePath(),a.fillStyle=d,a.strokeStyle="white",a.lineWidth=2,a.fill());a.restore()};w.prototype.renderPie=function(a){function c(a){u.frame=0;u.maxFrames=a||1}function b(){if(r&&m){for(var a=0,b=0;b<m.length;b++)a+=Math.abs(m[b].y);for(var c=0,d=0,e=0,g=0,b=0;b<m.length;b++){var f=m[b],l=r.dataPointIds[b],k={id:l,objectType:"dataPoint",dataPointIndex:b,
dataSeriesIndex:0};s.push(k);var n=f.indexLabel?f.indexLabel:r.indexLabel?r.indexLabel:f.label?f.label:r.label?r.label:"";h._eventManager.objectMap[l]=k;k.center={x:D.x,y:D.y};k.y=f.y;k.radius=y;k.indexLabelText=h.replaceKeywordsWithValue(n,f,r,b);k.indexLabelPlacement=r.indexLabelPlacement;k.indexLabelLineColor=f.indexLabelLineColor?f.indexLabelLineColor:r.indexLabelLineColor?r.indexLabelLineColor:f.color?f.color:r._colorSet[b%r._colorSet.length];k.indexLabelLineThickness=f.indexLabelLineThickness?
f.indexLabelLineThickness:r.indexLabelLineThickness;k.indexLabelFontColor=f.indexLabelFontColor?f.indexLabelFontColor:r.indexLabelFontColor;k.indexLabelFontStyle=f.indexLabelFontStyle?f.indexLabelFontStyle:r.indexLabelFontStyle;k.indexLabelFontWeight=f.indexLabelFontWeight?f.indexLabelFontWeight:r.indexLabelFontWeight;k.indexLabelFontSize=f.indexLabelFontSize?f.indexLabelFontSize:r.indexLabelFontSize;k.indexLabelFontFamily=f.indexLabelFontFamily?f.indexLabelFontFamily:r.indexLabelFontFamily;k.indexLabelBackgroundColor=
f.indexLabelBackgroundColor?f.indexLabelBackgroundColor:r.indexLabelBackgroundColor?r.indexLabelBackgroundColor:null;k.indexLabelMaxWidth=f.indexLabelMaxWidth?f.indexLabelMaxWidth:r.indexLabelMaxWidth?r.indexLabelMaxWidth:0.33*p.width;k.indexLabelWrap=f.indexLabelWrap?f.indexLabelWrap:r.indexLabelWrap;k.startAngle=0===b?r.startAngle?r.startAngle/180*Math.PI:0:s[b-1].endAngle;k.startAngle=(k.startAngle+2*Math.PI)%(2*Math.PI);k.endAngle=k.startAngle+2*Math.PI/a*Math.abs(f.y);f=(k.endAngle+k.startAngle)/
2;f=(f+2*Math.PI)%(2*Math.PI);k.midAngle=f;if(k.midAngle>Math.PI/2-z&&k.midAngle<Math.PI/2+z){if(0===c||s[e].midAngle>k.midAngle)e=b;c++}else if(k.midAngle>3*Math.PI/2-z&&k.midAngle<3*Math.PI/2+z){if(0===d||s[g].midAngle>k.midAngle)g=b;d++}k.hemisphere=f>Math.PI/2&&f<=3*Math.PI/2?"left":"right";k.indexLabelTextBlock=new F(h.plotArea.ctx,{fontSize:k.indexLabelFontSize,fontFamily:k.indexLabelFontFamily,fontColor:k.indexLabelFontColor,fontStyle:k.indexLabelFontStyle,fontWeight:k.indexLabelFontWeight,
horizontalAlign:"left",backgroundColor:k.indexLabelBackgroundColor,maxWidth:k.indexLabelMaxWidth,maxHeight:k.indexLabelWrap?5*k.indexLabelFontSize:1.5*k.indexLabelFontSize,text:k.indexLabelText,padding:0,textBaseline:"top"});k.indexLabelTextBlock.measureText()}f=a=0;l=!1;for(b=0;b<m.length;b++)k=s[(e+b)%m.length],1<c&&(k.midAngle>Math.PI/2-z&&k.midAngle<Math.PI/2+z)&&(a<=c/2&&!l?(k.hemisphere="right",a++):(k.hemisphere="left",l=!0));l=!1;for(b=0;b<m.length;b++)k=s[(g+b)%m.length],1<d&&(k.midAngle>
3*Math.PI/2-z&&k.midAngle<3*Math.PI/2+z)&&(f<=d/2&&!l?(k.hemisphere="left",f++):(k.hemisphere="right",l=!0))}}function d(){var a=h.plotArea.ctx;if(null!==u&&u.frame<u.maxFrames){0===u.frame&&(u.prevMaxAngle=s[0].startAngle);a.clearRect(p.x1,p.y1,p.width,p.height);for(var a=u.prevMaxAngle+2*Math.PI/u.maxFrames,b=0;b<m.length;b++){var g=0===b?s[b].startAngle:f,f=g+(s[b].endAngle-s[b].startAngle),k=!1;f>a&&(f=a,k=!0);var l=m[b].color?m[b].color:r._colorSet[b%r._colorSet.length];f>g&&ja(h.plotArea.ctx,
s[b].center,s[b].radius,l,r.type,g,f);if(k)break}u.frame++;u.prevMaxAngle=a;u.frame<u.maxFrames?h.animationRequestId=h.requestAnimFrame.call(window,d):(c(v?15:4),e())}}function e(){var a=h.plotArea.ctx;if(null!==u&&u.frame<u.maxFrames){a.clearRect(p.x1,p.y1,p.width,p.height);for(a=0;a<m.length;a++){var b=s[a].startAngle,c=s[a].endAngle;if(c>b){var d=0.07*y*Math.cos(s[a].midAngle),g=0.07*y*Math.sin(s[a].midAngle),f=!1;if(m[a].exploded){if(Math.abs(s[a].center.x-(D.x+d))>Math.abs(0.5*d/u.maxFrames)||
Math.abs(s[a].center.y-(D.y+g))>Math.abs(0.5*g/u.maxFrames))s[a].center.x+=d/u.maxFrames,s[a].center.y+=g/u.maxFrames,f=!0}else if(Math.abs(s[a].center.x-D.x)>Math.abs(0.5*d/u.maxFrames)||Math.abs(s[a].center.y-D.y)>Math.abs(0.5*g/u.maxFrames))s[a].center.x-=d/u.maxFrames,s[a].center.y-=g/u.maxFrames,f=!0;f&&(d={},d.dataSeries=r,d.dataPoint=r.dataPoints[a],d.index=a,h._toolTip.highlightObjects([d]));ja(h.plotArea.ctx,s[a].center,s[a].radius,m[a].color?m[a].color:r._colorSet[a%r._colorSet.length],
r.type,b,c)}}u.frame++;a=h.plotArea.ctx;a.fillStyle="black";a.strokeStyle="grey";a.textBaseline="middle";a.lineJoin="round";for(b=b=0;b<m.length;b++)c=s[b],c.indexLabelText&&(c.indexLabelTextBlock.y-=c.indexLabelTextBlock.height/2,d=0,d="left"===c.hemisphere?"outside"===r.indexLabelPlacement?-(c.indexLabelTextBlock.width+n):-c.indexLabelTextBlock.width/2:"outside"===r.indexLabelPlacement?n:-c.indexLabelTextBlock.width/2,c.indexLabelTextBlock.x+=d,c.indexLabelTextBlock.render(!0),c.indexLabelTextBlock.x-=
d,c.indexLabelTextBlock.y+=c.indexLabelTextBlock.height/2,"outside"===c.indexLabelPlacement&&(d=c.center.x+y*Math.cos(c.midAngle),g=c.center.y+y*Math.sin(c.midAngle),a.strokeStyle=c.indexLabelLineColor,a.lineWidth=c.indexLabelLineThickness,a.beginPath(),a.moveTo(d,g),a.lineTo(c.indexLabelTextBlock.x,c.indexLabelTextBlock.y),a.lineTo(c.indexLabelTextBlock.x+("left"===c.hemisphere?-n:n),c.indexLabelTextBlock.y),a.stroke()),a.lineJoin="miter");u.frame<u.maxFrames&&(h.animationRequestId=h.requestAnimFrame.call(window,
e))}}function f(a,b){var c=a.indexLabelTextBlock.x,d=a.indexLabelTextBlock.y-a.indexLabelTextBlock.height/2,e=a.indexLabelTextBlock.y+a.indexLabelTextBlock.height/2,g=b.indexLabelTextBlock.y-b.indexLabelTextBlock.height/2,f=b.indexLabelTextBlock.x+b.indexLabelTextBlock.width,h=b.indexLabelTextBlock.y+b.indexLabelTextBlock.height/2;return a.indexLabelTextBlock.x+a.indexLabelTextBlock.width<b.indexLabelTextBlock.x-n||c>f+n||d>h+n||e<g-n?!1:!0}function g(a,b){var c=0,c=a.indexLabelTextBlock.y-a.indexLabelTextBlock.height/
2,d=a.indexLabelTextBlock.y+a.indexLabelTextBlock.height/2,e=b.indexLabelTextBlock.y-b.indexLabelTextBlock.height/2,g=b.indexLabelTextBlock.y+b.indexLabelTextBlock.height/2;return c=b.indexLabelTextBlock.y>a.indexLabelTextBlock.y?e-d:c-g}function l(a){for(var b=null,c=1;c<m.length;c++)if(b=(a+c+s.length)%s.length,s[b].hemisphere!==s[a].hemisphere){b=null;break}else if(s[b].indexLabelText&&b!==a&&(0>g(s[b],s[a])||("right"===s[a].hemisphere?s[b].indexLabelTextBlock.y>=s[a].indexLabelTextBlock.y:s[b].indexLabelTextBlock.y<=
s[a].indexLabelTextBlock.y)))break;else b=null;return b}function q(a,b){b=b||0;var c=0,d=D.y-1*B,e=D.y+1*B;if(0<=a&&a<m.length){var f=s[a];if(0>b&&f.indexLabelTextBlock.y<d||0<b&&f.indexLabelTextBlock.y>e)return 0;var h=b,k=0,n=0,n=k=k=0;0>h?f.indexLabelTextBlock.y-f.indexLabelTextBlock.height/2>d&&f.indexLabelTextBlock.y-f.indexLabelTextBlock.height/2+h<d&&(h=-(d-(f.indexLabelTextBlock.y-f.indexLabelTextBlock.height/2+h))):f.indexLabelTextBlock.y+f.indexLabelTextBlock.height/2<d&&f.indexLabelTextBlock.y+
f.indexLabelTextBlock.height/2+h>e&&(h=f.indexLabelTextBlock.y+f.indexLabelTextBlock.height/2+h-e);h=f.indexLabelTextBlock.y+h;d=0;d="right"===f.hemisphere?D.x+Math.sqrt(Math.pow(B,2)-Math.pow(h-D.y,2)):D.x-Math.sqrt(Math.pow(B,2)-Math.pow(h-D.y,2));n=D.x+y*Math.cos(f.midAngle);k=D.y+y*Math.sin(f.midAngle);k=Math.sqrt(Math.pow(d-n,2)+Math.pow(h-k,2));n=Math.acos(y/B);k=Math.acos((B*B+y*y-k*k)/(2*y*B));h=k<n?h-f.indexLabelTextBlock.y:0;d=null;for(e=1;e<m.length;e++)if(d=(a-e+s.length)%s.length,s[d].hemisphere!==
s[a].hemisphere){d=null;break}else if(s[d].indexLabelText&&s[d].hemisphere===s[a].hemisphere&&d!==a&&(0>g(s[d],s[a])||("right"===s[a].hemisphere?s[d].indexLabelTextBlock.y<=s[a].indexLabelTextBlock.y:s[d].indexLabelTextBlock.y>=s[a].indexLabelTextBlock.y)))break;else d=null;n=d;k=l(a);e=d=0;0>h?(e="right"===f.hemisphere?n:k,c=h,null!==e&&(n=-h,h=f.indexLabelTextBlock.y-f.indexLabelTextBlock.height/2-(s[e].indexLabelTextBlock.y+s[e].indexLabelTextBlock.height/2),h-n<w&&(d=-n,t++,e=q(e,d),+e.toFixed(E)>
+d.toFixed(E)&&(c=h>w?-(h-w):-(n-(e-d)))))):0<h&&(e="right"===f.hemisphere?k:n,c=h,null!==e&&(n=h,h=s[e].indexLabelTextBlock.y-s[e].indexLabelTextBlock.height/2-(f.indexLabelTextBlock.y+f.indexLabelTextBlock.height/2),h-n<w&&(d=n,t++,e=q(e,d),+e.toFixed(E)<+d.toFixed(E)&&(c=h>w?h-w:n-(d-e)))));c&&(h=f.indexLabelTextBlock.y+c,d=0,d="right"===f.hemisphere?D.x+Math.sqrt(Math.pow(B,2)-Math.pow(h-D.y,2)):D.x-Math.sqrt(Math.pow(B,2)-Math.pow(h-D.y,2)),f.midAngle>Math.PI/2-z&&f.midAngle<Math.PI/2+z?(e=(a-
1+s.length)%s.length,e=s[e],n=s[(a+1+s.length)%s.length],"left"===f.hemisphere&&"right"===e.hemisphere&&d>e.indexLabelTextBlock.x?d=e.indexLabelTextBlock.x-15:"right"===f.hemisphere&&("left"===n.hemisphere&&d<n.indexLabelTextBlock.x)&&(d=n.indexLabelTextBlock.x+15)):f.midAngle>3*Math.PI/2-z&&f.midAngle<3*Math.PI/2+z&&(e=(a-1+s.length)%s.length,e=s[e],n=s[(a+1+s.length)%s.length],"right"===f.hemisphere&&"left"===e.hemisphere&&d<e.indexLabelTextBlock.x?d=e.indexLabelTextBlock.x+15:"left"===f.hemisphere&&
("right"===n.hemisphere&&d>n.indexLabelTextBlock.x)&&(d=n.indexLabelTextBlock.x-15)),f.indexLabelTextBlock.y=h,f.indexLabelTextBlock.x=d,f.indexLabelAngle=Math.atan2(f.indexLabelTextBlock.y-D.y,f.indexLabelTextBlock.x-D.x))}return c}function k(){var a=h.plotArea.ctx;a.fillStyle="grey";a.strokeStyle="grey";a.font="16px Arial";a.textBaseline="middle";for(var b=0,e=a=0,a=0;10>a&&(1>a||0<e);a++){y-=e;e=0;if("outside"===r.indexLabelPlacement){B=y*x;for(b=0;b<m.length;b++){var k=s[b];k.indexLabelTextBlock.x=
D.x+B*Math.cos(k.midAngle);k.indexLabelTextBlock.y=D.y+B*Math.sin(k.midAngle);k.indexLabelAngle=k.midAngle;k.radius=y}for(var t,u,b=0;b<m.length;b++){var k=s[b],z=l(b);if(null!==z){t=s[b];u=s[z];var C=0,C=g(t,u)-w;if(0>C){for(var F=u=t=0;F<m.length;F++)F!==b&&s[F].hemisphere===k.hemisphere&&(s[F].indexLabelTextBlock.y<k.indexLabelTextBlock.y?t++:u++);F=C/(t+u||1)*u;t=-1*(C-F);var G=u=0;"right"===k.hemisphere?(u=q(b,F),t=-1*(C-u),G=q(z,t),+G.toFixed(E)<+t.toFixed(E)&&+u.toFixed(E)<=+F.toFixed(E)&&
q(b,-(t-G))):(u=q(z,F),t=-1*(C-u),G=q(b,t),+G.toFixed(E)<+t.toFixed(E)&&+u.toFixed(E)<=+F.toFixed(E)&&q(z,-(t-G)))}}}}else for(b=0;b<m.length;b++)k=s[b],B="pie"===r.type?0.7*y:0.8*y,C=D.x+B*Math.cos(k.midAngle),F=D.y+B*Math.sin(k.midAngle),k.indexLabelTextBlock.x=C,k.indexLabelTextBlock.y=F;for(b=0;b<m.length;b++)k=s[b],C=k.indexLabelTextBlock.measureText(),0!==C.height&&0!==C.width&&(C=C=0,"right"===k.hemisphere?(C=p.x2-(k.indexLabelTextBlock.x+k.indexLabelTextBlock.width+n),C*=-1):C=p.x1-(k.indexLabelTextBlock.x-
k.indexLabelTextBlock.width-n),0<C&&(Math.abs(k.indexLabelTextBlock.y-k.indexLabelTextBlock.height/2-D.y)<y||Math.abs(k.indexLabelTextBlock.y+k.indexLabelTextBlock.height/2-D.y)<y)&&(C/=Math.abs(Math.cos(k.indexLabelAngle)),9<C&&(C*=0.3),C>e&&(e=C)),C=C=0,0<k.indexLabelAngle&&k.indexLabelAngle<Math.PI?(C=p.y2-(k.indexLabelTextBlock.y+k.indexLabelTextBlock.height/2+5),C*=-1):C=p.y1-(k.indexLabelTextBlock.y-k.indexLabelTextBlock.height/2-5),0<C&&Math.abs(k.indexLabelTextBlock.x-D.x)<y&&(C/=Math.abs(Math.sin(k.indexLabelAngle)),
9<C&&(C*=0.3),C>e&&(e=C)));b=function(a,b,c){for(var d=[],e=0;d.push(s[b]),b!==c;b=(b+1+m.length)%m.length);d.sort(function(a,b){return a.y-b.y});for(b=0;b<d.length;b++)if(c=d[b],e<a)e+=c.indexLabelTextBlock.height,c.indexLabelTextBlock.text="",c.indexLabelText="",c.indexLabelTextBlock.measureText();else break};z=k=-1;for(F=G=0;F<m.length;F++)if(t=s[F],t.indexLabelText){var H=l(F);null!==H&&(u=s[H],C=0,C=g(t,u),0>C&&f(t,u)?(0>k&&(k=F),H!==k&&(z=H),G+=-C):0<G&&(b(G,k,z),z=k=-1,G=0))}0<G&&b(G,k,z)}c(h.animationEnabled&&
0===h.renderCount?v?60:30:1);d()}var h=this;if(!(0>=a.dataSeriesIndexes.length)){var r=this.data[a.dataSeriesIndexes[0]],m=r.dataPoints,n=10,p=this.plotArea,t=0,u={frame:0,maxFrames:1},s=[],w=2,x=1.3,z=20/180*Math.PI,E=6,D={x:(p.x2+p.x1)/2,y:(p.y2+p.y1)/2},y="inside"===r.indexLabelPlacement?0.95*Math.min(p.width,p.height)/2:0.8*Math.min(p.width,p.height)/2,B=y*x;this.pieDoughnutClickHandler=function(a){u.frame===u.maxFrames&&(a=a.dataPoint,a.exploded=a.exploded?!1:!0,c(v?15:4),1<this.dataPoints.length&&
e())};b();k()}};w.prototype.animationRequestId=null;w.prototype.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();w.prototype.cancelRequestAnimFrame=window.cancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||
clearTimeout;V.prototype.registerSpace=function(a,c){"top"===a?this._topOccupied+=c.height:"bottom"===a?this._bottomOccupied+=c.height:"left"===a?this._leftOccupied+=c.width:"right"===a&&(this._rightOccupied+=c.width)};V.prototype.unRegisterSpace=function(a,c){"top"===a?this._topOccupied-=c.height:"bottom"===a?this._bottomOccupied-=c.height:"left"===a?this._leftOccupied-=c.width:"right"===a&&(this._rightOccupied-=c.width)};V.prototype.getFreeSpace=function(){return{x1:this._leftOccupied,y1:this._topOccupied,
x2:this.chart.width-this._rightOccupied,y2:this.chart.height-this._bottomOccupied,width:this.chart.width-this._rightOccupied-this._leftOccupied,height:this.chart.height-this._bottomOccupied-this._topOccupied}};V.prototype.reset=function(){this._topOccupied=0;this._bottomOccupied=3;this._rightOccupied=this._leftOccupied=0};M(F,I);F.prototype.render=function(a){a&&this.ctx.save();var c=this.ctx.font;this.ctx.textBaseline=this.textBaseline;var b=0;this._isDirty&&this.measureText(this.ctx);this.ctx.translate(this.x,
this.y+b);"middle"===this.textBaseline&&(b=-this._lineHeight/2);this.ctx.font=this._getFontString();this.ctx.rotate(Math.PI/180*this.angle);var d=0,e=this.padding,f=null;(0<this.borderThickness&&this.borderColor||this.backgroundColor)&&this.ctx.roundRect(0,b,this.width,this.height,this.cornerRadius,this.borderThickness,this.backgroundColor,this.borderColor);this.ctx.fillStyle=this.fontColor;for(b=0;b<this._wrappedText.lines.length;b++)f=this._wrappedText.lines[b],"right"===this.horizontalAlign?d=
this.width-f.width-this.padding:"left"===this.horizontalAlign?d=this.padding:"center"===this.horizontalAlign&&(d=(this.width-2*this.padding)/2-f.width/2+this.padding),this.ctx.fillText(f.text,d,e),e+=f.height;this.ctx.font=c;a&&this.ctx.restore()};F.prototype.setText=function(a){this.text=a;this._isDirty=!0;this._wrappedText=null};F.prototype.measureText=function(){if(null===this.maxWidth)throw"Please set maxWidth and height for TextBlock";this._wrapText(this.ctx);this._isDirty=!1;return{width:this.width,
height:this.height}};F.prototype._getLineWithWidth=function(a,c,b){a=String(a);if(!a)return{text:"",width:0};var d=b=0,e=a.length-1,f=Infinity;for(this.ctx.font=this._getFontString();d<=e;){var f=Math.floor((d+e)/2),g=a.substr(0,f+1);b=this.ctx.measureText(g).width;if(b<c)d=f+1;else if(b>c)e=f-1;else break}b>c&&1<g.length&&(g=g.substr(0,g.length-1),b=this.ctx.measureText(g).width);c=!0;if(g.length===a.length||" "===a[g.length])c=!1;c&&(a=g.split(" "),1<a.length&&a.pop(),g=a.join(" "),b=this.ctx.measureText(g).width);
return{text:g,width:b}};F.prototype._wrapText=function(){var a=new String(ca(this.text)),c=[],b=this.ctx.font,d=0,e=0;for(this.ctx.font=this._getFontString();0<a.length;){var f=this.maxHeight-2*this.padding,g=this._getLineWithWidth(a,this.maxWidth-2*this.padding,!1);g.height=this._lineHeight;c.push(g);e=Math.max(e,g.width);d+=g.height;a=ca(a.slice(g.text.length,a.length));f&&d>f&&(g=c.pop(),d-=g.height)}this._wrappedText={lines:c,width:e,height:d};this.width=e+2*this.padding;this.height=d+2*this.padding;
this.ctx.font=b};F.prototype._getFontString=function(){return oa("",this,null)};M(W,I);W.prototype.render=function(){if(this.text){var a=this.chart.layoutManager.getFreeSpace(),c=0,b=0,d=0,e=0,f=0,g,l;"top"===this.verticalAlign||"bottom"===this.verticalAlign?(e=a.width-2*this.margin,f=0.5*a.height-2*this.margin,d=0):"center"===this.verticalAlign&&("left"===this.horizontalAlign||"right"===this.horizontalAlign?(e=a.height-2*this.margin,f=0.5*a.width-2*this.margin):"center"===this.horizontalAlign&&(e=
a.width-2*this.margin,f=0.5*a.height-2*this.margin));var f=new F(this.ctx,{fontSize:this.fontSize,fontFamily:this.fontFamily,fontColor:this.fontColor,fontStyle:this.fontStyle,fontWeight:this.fontWeight,horizontalAlign:this.horizontalAlign,verticalAlign:this.verticalAlign,borderColor:this.borderColor,borderThickness:this.borderThickness,backgroundColor:this.backgroundColor,maxWidth:e,maxHeight:f,cornerRadius:this.cornerRadius,text:this.text,padding:this.padding,textBaseline:"top"}),q=f.measureText();
"top"===this.verticalAlign||"bottom"===this.verticalAlign?("top"===this.verticalAlign?(b=this.margin,l="top"):"bottom"===this.verticalAlign&&(b=a.y2-this.margin-q.height,l="bottom"),"left"===this.horizontalAlign?c=a.x1+this.margin:"center"===this.horizontalAlign?c=a.x1+(e/2-q.width/2)+this.margin:"right"===this.horizontalAlign&&(c=a.x2-this.margin-q.width),g=this.horizontalAlign,this.width=q.width,this.height=q.height):"center"===this.verticalAlign&&("left"===this.horizontalAlign?(c=a.x1+this.margin,
b=a.y2-this.margin-(e/2-q.width/2),d=-90,l="left",this.width=q.height,this.height=q.width):"right"===this.horizontalAlign?(c=a.x2-this.margin,b=a.y1+this.margin+(e/2-q.width/2),d=90,l="right",this.width=q.height,this.height=q.width):"center"===this.horizontalAlign&&(b=a.y1+(a.height/2-q.height/2),c=a.x1+(a.width/2-q.width/2),l="center",this.width=q.width,this.height=q.height),g="center");f.x=c;f.y=b;f.angle=d;f.horizontalAlign=g;f.render(!0);this.chart.layoutManager.registerSpace(l,{width:this.width+
2*this.margin,height:this.height+2*this.margin});this.bounds={x1:c,y1:b,x2:c+this.width,y2:b+this.height};this.ctx.textBaseline="top"}};M(aa,I);aa.prototype.render=function(){var a=this.chart.layoutManager.getFreeSpace(),c=null,b=0,d=0,e=0,f=0,g=[],l=[];"top"===this.verticalAlign||"bottom"===this.verticalAlign?(this.orientation="horizontal",c=this.verticalAlign,e=0.9*a.width,f=0.5*a.height):"center"===this.verticalAlign&&(this.orientation="vertical",c=this.horizontalAlign,e=0.5*a.width,f=0.9*a.height);
for(var q=0;q<this.dataSeries.length;q++){var k=this.dataSeries[q],h=k.legendMarkerType?k.legendMarkerType:"line"!==k.type&&"stepLine"!==k.type&&"spline"!==k.type&&"scatter"!==k.type&&"bubble"!==k.type||!k.markerType?N.getDefaultLegendMarker(k.type):k.markerType,r=k.legendText?k.legendText:k.name,m=k.legendMarkerColor?k.legendMarkerColor:k.markerColor?k.markerColor:k._colorSet[0],n=k.markerSize||"line"!==k.type&&"stepLine"!==k.type&&"spline"!==k.type?0.6*this.lineHeight:0;if("pie"!==k.type&&"doughnut"!==
k.type)h={markerType:h,markerColor:m,text:r,textBlock:null,chartType:k.type,markerSize:n,lineColor:k._colorSet[0],dataSeriesIndex:q,dataPointIndex:null},g.push(h);else for(var p=0;p<k.dataPoints.length;p++)n=k.dataPoints[p],h=n.legendMarkerType?n.legendMarkerType:k.legendMarkerType?k.legendMarkerType:N.getDefaultLegendMarker(k.type),r=n.legendText?n.legendText:k.legendText?k.legendText:n.name?n.name:"DataPoint: "+(p+1),m=n.markerColor?n.markerColor:k.markerColor?k.markerColor:n.color?n.color:k.color?
k.color:k._colorSet[p%k._colorSet.length],n=0!==n.markerSize&&(0!==k.markerSize||n.markerSize)||"line"!==k.type&&"stepLine"!==k.type&&"spline"!==k.type?0.6*this.lineHeight:0,h={markerType:h,markerColor:m,text:r,textBlock:null,chartType:k.type,markerSize:n,dataSeriesIndex:q,dataPointIndex:p},g.push(h)}if(0<g.length){k=null;for(q=p=0;q<g.length;q++){h=g[q];if("horizontal"===this.orientation){h.textBlock=new F(this.ctx,{x:0,y:0,maxWidth:e,maxHeight:this.lineHeight,angle:0,text:h.text,horizontalAlign:"left",
fontSize:this.fontSize,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontColor:this.fontColor,fontStyle:this.fontStyle,textBaseline:"top"});h.textBlock.measureText();if(!k||k.width+h.textBlock.width+(0===k.width?0:this.horizontalSpacing)>e)k={items:[],width:0},l.push(k),this.height=l.length*(h.textBlock.height+5);h.textBlock.x=k.width;h.textBlock.y=0;k.width+=Math.round(h.textBlock.width+h.textBlock._lineHeight+(0===k.width?0:0.5*h.textBlock._lineHeight))}else this.height+this.lineHeight<
f?(k={items:[],width:0},l.push(k),this.height=l.length*this.lineHeight):(k=l[p],p=(p+1)%l.length),h.textBlock=new F(this.ctx,{x:0,y:0,maxWidth:e,maxHeight:1.5*this.fontSize,angle:0,text:h.text,horizontalAlign:"left",fontSize:this.fontSize,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontColor:this.fontColor,fontStyle:this.fontStyle,textBaseline:"top"}),h.textBlock.measureText(),h.textBlock.x=k.width,h.textBlock.y=0,k.width+=h.textBlock.width+h.textBlock._lineHeight+(0===k.width?0:0.5*h.textBlock._lineHeight);
k.items.push(h);this.width=Math.max(k.width,this.width)}this.height=l.length*this.lineHeight}"top"===this.verticalAlign?(d="left"===this.horizontalAlign?a.x1+2:"right"===this.horizontalAlign?a.x2-this.width-2:a.x1+a.width/2-this.width/2,b=a.y1):"center"===this.verticalAlign?(d="left"===this.horizontalAlign?a.x1+2:"right"===this.horizontalAlign?a.x2-this.width-2:a.x1+a.width/2-this.width/2,b=a.y1+a.height/2-this.height/2):"bottom"===this.verticalAlign&&(d="left"===this.horizontalAlign?a.x1+2:"right"===
this.horizontalAlign?a.x2-this.width-2:a.x1+a.width/2-this.width/2,b=a.y2-this.height-5);this.items=g;for(q=0;q<this.items.length;q++)h=g[q],h.id=++this.chart._eventManager.lastObjectId,this.chart._eventManager.objectMap[h.id]={id:h.id,objectType:"legendItem",legendItemIndex:q,dataSeriesIndex:h.dataSeriesIndex,dataPointIndex:h.dataPointIndex};for(q=0;q<l.length;q++)for(k=l[q],a=0;a<k.items.length;a++){h=k.items[a];f=h.textBlock.x+d+(0===a?0.2*n:0.4*this.lineHeight+0.2*n);g=b+q*this.lineHeight;e=f;
this.chart.data[h.dataSeriesIndex].visible||(this.ctx.globalAlpha=0.5);if("line"===h.chartType||"stepLine"===h.chartType||"spline"===h.chartType)this.ctx.strokeStyle=h.lineColor,this.ctx.lineWidth=Math.ceil(this.lineHeight/8),this.ctx.beginPath(),this.ctx.moveTo(f-0.1*this.lineHeight,g+this.lineHeight/2),this.ctx.lineTo(f+0.7*this.lineHeight,g+this.lineHeight/2),this.ctx.stroke(),e-=0.1*this.lineHeight;H.drawMarker(f+n/2,g+this.lineHeight/2,this.ctx,h.markerType,n,h.markerColor,null,0);h.textBlock.x=
f+Math.round(0.9*this.lineHeight);h.textBlock.y=g;h.textBlock.render(!0);this.chart.data[h.dataSeriesIndex].visible||(this.ctx.globalAlpha=1);f=B(h.id);this.ghostCtx.fillStyle=f;this.ghostCtx.beginPath();this.ghostCtx.fillRect(e,h.textBlock.y,h.textBlock.x+h.textBlock.width-e,h.textBlock.height);h.x1=this.chart._eventManager.objectMap[h.id].x1=e;h.y1=this.chart._eventManager.objectMap[h.id].y1=h.textBlock.y;h.x2=this.chart._eventManager.objectMap[h.id].x2=h.textBlock.x+h.textBlock.width;h.y2=this.chart._eventManager.objectMap[h.id].y2=
h.textBlock.y+h.textBlock.height}this.chart.layoutManager.registerSpace(c,{width:this.width+2+2,height:this.height+5+5});this.bounds={x1:d,y1:b,x2:d+this.width,y2:b+this.height}};M(ea,I);ea.prototype.render=function(){var a=this.chart.layoutManager.getFreeSpace();this.ctx.fillStyle="red";this.ctx.fillRect(a.x1,a.y1,a.x2,a.y2)};M(N,I);N.prototype.getDefaultAxisPlacement=function(){var a=this.type;if("column"===a||"line"===a||"stepLine"===a||"spline"===a||"area"===a||"stepArea"===a||"splineArea"===
a||"stackedColumn"===a||"stackedLine"===a||"bubble"===a||"scatter"===a||"stackedArea"===a||"stackedColumn100"===a||"stackedLine100"===a||"stackedArea100"===a)return"normal";if("bar"===a||"stackedBar"===a||"stackedBar100"===a)return"xySwapped";if("pie"===a||"doughnut"===a)return"none";window.console.log("Unknown Chart Type: "+a);return null};N.getDefaultLegendMarker=function(a){if("column"===a||"stackedColumn"===a||"stackedLine"===a||"bar"===a||"stackedBar"===a||"stackedBar100"===a||"bubble"===a||
"scatter"===a||"stackedColumn100"===a||"stackedLine100"===a||"stepArea"===a)return"square";if("line"===a||"stepLine"===a||"spline"===a||"pie"===a||"doughnut"===a)return"circle";if("area"===a||"splineArea"===a||"stackedArea"===a||"stackedArea100"===a)return"triangle";window.console.log("Unknown Chart Type: "+a);return null};N.prototype.getDataPointAtX=function(a,c){if(!this.dataPoints||0===this.dataPoints.length)return null;var b={dataPoint:null,distance:Infinity,index:NaN},d=null,e=0,f=0,g=1,l=Infinity,
q=0,k=0,h=0;"none"!==this.chart.plotInfo.axisPlacement&&(h=this.dataPoints[this.dataPoints.length-1].x-this.dataPoints[0].x,h=0<h?(this.dataPoints.length-1)/h*(a-this.dataPoints[0].x)>>0:0);for(;;){f=0<g?h+e:h-e;if(0<=f&&f<this.dataPoints.length){var d=this.dataPoints[f],r=Math.abs(d.x-a);r<b.distance&&(b.dataPoint=d,b.distance=r,b.index=f);d=Math.abs(d.x-a);d<=l?l=d:0<g?q++:k++;if(1E3<q&&1E3<k)break}else if(0>h-e&&h+e>=this.dataPoints.length)break;-1===g?(e++,g=1):g=-1}return c||b.dataPoint.x!==
a?c&&null!==b.dataPoint?b:null:b};N.prototype.getDataPointAtXY=function(a,c,b){if(!this.dataPoints||0===this.dataPoints.length)return null;b=b||!1;var d=[],e=0,f=0,g=1,l=!1,q=Infinity,k=0,h=0,r=0;"none"!==this.chart.plotInfo.axisPlacement&&(r=this.chart.axisX.getXValueAt({x:a,y:c}),f=this.dataPoints[this.dataPoints.length-1].x-this.dataPoints[0].x,r=0<f?(this.dataPoints.length-1)/f*(r-this.dataPoints[0].x)>>0:0);for(;;){f=0<g?r+e:r-e;if(0<=f&&f<this.dataPoints.length){var m=this.chart._eventManager.objectMap[this.dataPointIds[f]],
n=this.dataPoints[f];if(m){switch(this.type){case "column":case "stackedColumn":case "stackedColumn100":case "bar":case "stackedBar":case "stackedBar100":a>=m.x1&&(a<=m.x2&&c>=m.y1&&c<=m.y2)&&(d.push({dataPoint:n,dataPointIndex:f,dataSeries:this,distance:Math.min(Math.abs(m.x1-a),Math.abs(m.x2-a),Math.abs(m.y1-c),Math.abs(m.y2-c))}),l=!0);break;case "line":case "stepLine":case "spline":case "area":case "stepArea":case "stackedArea":case "stackedArea100":case "splineArea":case "scatter":var p=Q("markerSize",
n,this)||4,t=b?20:p,u=Math.sqrt(Math.pow(m.x1-a,2)+Math.pow(m.y1-c,2));u<=t&&d.push({dataPoint:n,dataPointIndex:f,dataSeries:this,distance:u});f=Math.abs(m.x1-a);f<=q?q=f:0<g?k++:h++;u<=p/2&&(l=!0);break;case "bubble":p=m.size;u=Math.sqrt(Math.pow(m.x1-a,2)+Math.pow(m.y1-c,2));u<=p/2&&(d.push({dataPoint:n,dataPointIndex:f,dataSeries:this,distance:u}),l=!0);break;case "pie":case "doughnut":p=m.center,t="doughnut"===this.type?0.6*m.radius:0,u=Math.sqrt(Math.pow(p.x-a,2)+Math.pow(p.y-c,2)),u<m.radius&&
u>t&&(u=Math.atan2(c-p.y,a-p.x),0>u&&(u+=2*Math.PI),u=(180*(u/Math.PI)%360+360)%360,p=(180*(m.startAngle/Math.PI)%360+360)%360,t=(180*(m.endAngle/Math.PI)%360+360)%360,0===t&&1<m.endAngle&&(t=360),p>t&&(t+=360,u<p&&(u+=360)),u>p&&u<t&&(d.push({dataPoint:n,dataPointIndex:f,dataSeries:this,distance:0}),l=!0))}if(l||1E3<k&&1E3<h)break}}else if(0>r-e&&r+e>=this.dataPoints.length)break;-1===g?(e++,g=1):g=-1}a=null;for(c=0;c<d.length;c++)a?d[c].distance<=a.distance&&(a=d[c]):a=d[c];return a};N.prototype.getMarkerProperties=
function(a,c,b,d){var e=this.dataPoints;return{x:c,y:b,ctx:d,type:e[a].markerType?e[a].markerType:this.markerType,size:e[a].markerSize?e[a].markerSize:this.markerSize,color:e[a].markerColor?e[a].markerColor:this.markerColor?this.markerColor:e[a].color?e[a].color:this.color?this.color:this._colorSet[a%this._colorSet.length],borderColor:e[a].markerBorderColor?e[a].markerBorderColor:this.markerBorderColor?this.markerBorderColor:null,borderThickness:e[a].markerBorderThickness?e[a].markerBorderThickness:
this.markerBorderThickness?this.markerBorderThickness:null}};M(y,I);y.prototype.createLabels=function(){var a,c=0,b,d=0,e=0,c=0;if("bottom"===this._position||"top"===this._position)c=this.lineCoordinates.width/Math.abs(this.maximum-this.minimum)*this.interval,d=this.labelAutoFit?"undefined"===typeof this._options.labelMaxWidth?0.9*c>>0:this.labelMaxWidth:"undefined"===typeof this._options.labelMaxWidth?0.7*this.chart.width>>0:this.labelMaxWidth,e="undefined"===typeof this._options.labelWrap||this.labelWrap?
0.5*this.chart.height>>0:1.5*this.labelFontSize;else if("left"===this._position||"right"===this._position)c=this.lineCoordinates.height/Math.abs(this.maximum-this.minimum)*this.interval,d=this.labelAutoFit?"undefined"===typeof this._options.labelMaxWidth?0.3*this.chart.width>>0:this.labelMaxWidth:"undefined"===typeof this._options.labelMaxWidth?0.5*this.chart.width>>0:this.labelMaxWidth,e="undefined"===typeof this._options.labelWrap||this.labelWrap?2*c>>0:1.5*this.labelFontSize;if("axisX"===this.type&&
"dateTime"===this.chart.plotInfo.axisXValueType)for(b=ka(new Date(this.maximum),this.interval,this.intervalType),c=this.intervalStartPosition;c<b;ka(c,this.interval,this.intervalType))a="axisX"===this.type&&this.labels[c]?this.labels[c]:sa(c,this.valueFormatString,this.chart._cultureInfo),a=new F(this.ctx,{x:0,y:0,maxWidth:d,maxHeight:e,angle:this.labelAngle,text:this.prefix+a+this.suffix,horizontalAlign:"left",fontSize:this.labelFontSize,fontFamily:this.labelFontFamily,fontWeight:this.labelFontWeight,
fontColor:this.labelFontColor,fontStyle:this.labelFontStyle,textBaseline:"middle"}),this._labels.push({position:c.getTime(),textBlock:a,effectiveHeight:null});else{b=this.maximum;if(this.labels&&this.labels.length){a=Math.ceil(this.interval);for(var f=Math.ceil(this.intervalStartPosition),g=!1,c=f;c<this.maximum;c+=a)if(this.labels[c])g=!0;else{g=!1;break}g&&(this.interval=a,this.intervalStartPosition=f)}for(c=this.intervalStartPosition;c<=b;c+=this.interval)a="axisX"===this.type&&this.labels[c]?
this.labels[c]:ia(c,this.valueFormatString,this.chart._cultureInfo),a=new F(this.ctx,{x:0,y:0,maxWidth:d,maxHeight:e,angle:this.labelAngle,text:this.prefix+a+this.suffix,horizontalAlign:"left",fontSize:this.labelFontSize,fontFamily:this.labelFontFamily,fontWeight:this.labelFontWeight,fontColor:this.labelFontColor,fontStyle:this.labelFontStyle,textBaseline:"middle",borderThickness:0}),this._labels.push({position:c,textBlock:a,effectiveHeight:null})}for(c=0;c<this.stripLines.length;c++)b=this.stripLines[c],
a=new F(this.ctx,{x:0,y:0,backgroundColor:b.labelBackgroundColor,maxWidth:d,maxHeight:e,angle:this.labelAngle,text:b.label,horizontalAlign:"left",fontSize:b.labelFontSize,fontFamily:b.labelFontFamily,fontWeight:b.labelFontWeight,fontColor:b.labelFontColor,fontStyle:b.labelFontStyle,textBaseline:"middle",borderThickness:0}),this._labels.push({position:b.value,textBlock:a,effectiveHeight:null,stripLine:b})};y.prototype.createLabelsAndCalculateWidth=function(){var a=0;this._labels=[];if("left"===this._position||
"right"===this._position)for(this.createLabels(),i=0;i<this._labels.length;i++){var c=this._labels[i].textBlock.measureText(),b=0,b=0===this.labelAngle?c.width:c.width*Math.cos(Math.PI/180*Math.abs(this.labelAngle))+c.height/2*Math.sin(Math.PI/180*Math.abs(this.labelAngle));a<b&&(a=b);this._labels[i].effectiveWidth=b}return(this.title?X(this.titleFontFamily,this.titleFontSize,this.titleFontWeight)+2:0)+a+this.tickLength+5};y.prototype.createLabelsAndCalculateHeight=function(){var a=0;this._labels=
[];var c,b=0;this.createLabels();if("bottom"===this._position||"top"===this._position)for(b=0;b<this._labels.length;b++){c=this._labels[b].textBlock;c=c.measureText();var d=0,d=0===this.labelAngle?c.height:c.width*Math.sin(Math.PI/180*Math.abs(this.labelAngle))+c.height/2*Math.cos(Math.PI/180*Math.abs(this.labelAngle));a<d&&(a=d);this._labels[b].effectiveHeight=d}return(this.title?X(this.titleFontFamily,this.titleFontSize,this.titleFontWeight)+2:0)+a+this.tickLength+5};y.setLayoutAndRender=function(a,
c,b,d,e){var f,g,l,q=a.chart,k=q.ctx;a.calculateAxisParameters();c&&c.calculateAxisParameters();b&&b.calculateAxisParameters();if(c&&b&&"undefined"===typeof c._options.maximum&&"undefined"===typeof c._options.minimum&&"undefined"===typeof c._options.interval&&"undefined"===typeof b._options.maximum&&"undefined"===typeof b._options.minimum&&"undefined"===typeof b._options.interval){l=(c.maximum-c.minimum)/c.interval;var h=(b.maximum-b.minimum)/b.interval;l>h?b.maximum=b.interval*l+b.minimum:h>l&&(c.maximum=
c.interval*h+c.minimum)}h=c?c.margin:0;if("normal"===d){a.lineCoordinates={};var r=Math.ceil(c?c.createLabelsAndCalculateWidth():0);f=Math.round(e.x1+r+h);a.lineCoordinates.x1=f;h=Math.ceil(b?b.createLabelsAndCalculateWidth():0);g=Math.round(e.x2-h>a.chart.width-10?a.chart.width-10:e.x2-h);a.lineCoordinates.x2=g;a.lineCoordinates.width=Math.abs(g-f);var m=Math.ceil(a.createLabelsAndCalculateHeight());d=Math.round(e.y2-m-a.margin);l=Math.round(e.y2-a.margin);a.lineCoordinates.y1=d;a.lineCoordinates.y2=
d;a.boundingRect={x1:f,y1:d,x2:g,y2:l,width:g-f,height:l-d};c&&(f=Math.round(e.x1+c.margin),d=Math.round(10>e.y1?10:e.y1),g=Math.round(e.x1+r+c.margin),l=Math.round(e.y2-m-a.margin),c.lineCoordinates={x1:g,y1:d,x2:g,y2:l,height:Math.abs(l-d)},c.boundingRect={x1:f,y1:d,x2:g,y2:l,width:g-f,height:l-d});b&&(f=Math.round(a.lineCoordinates.x2),d=Math.round(10>e.y1?10:e.y1),g=Math.round(f+h+b.margin),l=Math.round(e.y2-m-a.margin),b.lineCoordinates={x1:f,y1:d,x2:f,y2:l,height:Math.abs(l-d)},b.boundingRect=
{x1:f,y1:d,x2:g,y2:l,width:g-f,height:l-d});a.calculateValueToPixelconversionParameters();c&&c.calculateValueToPixelconversionParameters();b&&b.calculateValueToPixelconversionParameters();k.save();k.rect(a.boundingRect.x1-40,a.boundingRect.y1,a.boundingRect.width+80,a.boundingRect.height);k.clip();a.renderLabelsTicksAndTitle();k.restore();c&&c.renderLabelsTicksAndTitle();b&&b.renderLabelsTicksAndTitle()}else{r=Math.ceil(a.createLabelsAndCalculateWidth());c&&(c.lineCoordinates={},f=Math.round(e.x1+
r+a.margin),g=Math.round(e.x2>c.chart.width-10?c.chart.width-10:e.x2),c.lineCoordinates.x1=f,c.lineCoordinates.x2=g,c.lineCoordinates.width=Math.abs(g-f));b&&(b.lineCoordinates={},f=Math.round(e.x1+r+a.margin),g=Math.round(e.x2>b.chart.width-10?b.chart.width-10:e.x2),b.lineCoordinates.x1=f,b.lineCoordinates.x2=g,b.lineCoordinates.width=Math.abs(g-f));var m=Math.ceil(c?c.createLabelsAndCalculateHeight():0),n=Math.ceil(b?b.createLabelsAndCalculateHeight():0);c&&(d=Math.round(e.y2-m-c.margin),l=Math.round(e.y2-
h>c.chart.height-10?c.chart.height-10:e.y2-h),c.lineCoordinates.y1=d,c.lineCoordinates.y2=d,c.boundingRect={x1:f,y1:d,x2:g,y2:l,width:g-f,height:m});b&&(d=Math.round(e.y1+b.margin),l=e.y1+b.margin+n,b.lineCoordinates.y1=l,b.lineCoordinates.y2=l,b.boundingRect={x1:f,y1:d,x2:g,y2:l,width:g-f,height:n});f=Math.round(e.x1+a.margin);d=Math.round(b?b.lineCoordinates.y2:10>e.y1?10:e.y1);g=Math.round(e.x1+r+a.margin);l=Math.round(c?c.lineCoordinates.y1:e.y2-h>a.chart.height-10?a.chart.height-10:e.y2-h);a.lineCoordinates=
{x1:g,y1:d,x2:g,y2:l,height:Math.abs(l-d)};a.boundingRect={x1:f,y1:d,x2:g,y2:l,width:g-f,height:l-d};a.calculateValueToPixelconversionParameters();c&&c.calculateValueToPixelconversionParameters();b&&b.calculateValueToPixelconversionParameters();c&&c.renderLabelsTicksAndTitle();b&&b.renderLabelsTicksAndTitle();a.renderLabelsTicksAndTitle()}q.preparePlotArea();e=a.chart.plotArea;k.save();k.rect(e.x1,e.y1,Math.abs(e.x2-e.x1),Math.abs(e.y2-e.y1));k.clip();a.renderStripLinesOfThicknessType("value");c&&
c.renderStripLinesOfThicknessType("value");b&&b.renderStripLinesOfThicknessType("value");a.renderInterlacedColors();c&&c.renderInterlacedColors();b&&b.renderInterlacedColors();k.restore();a.renderGrid();c&&c.renderGrid();b&&b.renderGrid();a.renderAxisLine();c&&c.renderAxisLine();b&&b.renderAxisLine();a.renderStripLinesOfThicknessType("pixel");c&&c.renderStripLinesOfThicknessType("pixel");b&&b.renderStripLinesOfThicknessType("pixel")};y.prototype.renderLabelsTicksAndTitle=function(){var a=!1,c=0,b=
1,d=0;0!==this.labelAngle&&360!==this.labelAngle&&(b=1.2);if("undefined"===typeof this._options.interval){if("bottom"===this._position||"top"===this._position){for(e=0;e<this._labels.length;e++)f=this._labels[e],f.position<this.minimum||f.stripLine||(f=f.textBlock.width*Math.cos(Math.PI/180*this.labelAngle)+f.textBlock.height*Math.sin(Math.PI/180*this.labelAngle),c+=f);c>this.lineCoordinates.width*b&&(a=!0)}if("left"===this._position||"right"===this._position){for(e=0;e<this._labels.length;e++)f=
this._labels[e],f.position<this.minimum||f.stripLine||(f=f.textBlock.height*Math.cos(Math.PI/180*this.labelAngle)+f.textBlock.width*Math.sin(Math.PI/180*this.labelAngle),c+=f);c>this.lineCoordinates.height*b&&(a=!0)}}if("bottom"===this._position){for(var e=0,f,e=0;e<this._labels.length;e++)if(f=this._labels[e],!(f.position<this.minimum||f.position>this.maximum)){c=this.getPixelCoordinatesOnAxis(f.position);if(this.tickThickness&&!this._labels[e].stripLine||this._labels[e].stripLine&&"pixel"===this._labels[e].stripLine._thicknessType)this._labels[e].stripLine?
(b=this._labels[e].stripLine,this.ctx.lineWidth=b.thickness,this.ctx.strokeStyle=b.color):(this.ctx.lineWidth=this.tickThickness,this.ctx.strokeStyle=this.tickColor),b=1===this.ctx.lineWidth%2?(c.x<<0)+0.5:c.x<<0,this.ctx.beginPath(),this.ctx.moveTo(b,c.y<<0),this.ctx.lineTo(b,c.y+this.tickLength<<0),this.ctx.stroke();if(!a||0===d++%2||this._labels[e].stripLine)0===f.textBlock.angle?(c.x-=f.textBlock.width/2,c.y+=this.tickLength+f.textBlock.fontSize/2):(c.x-=0>this.labelAngle?f.textBlock.width*Math.cos(Math.PI/
180*this.labelAngle):0,c.y+=this.tickLength+Math.abs(0>this.labelAngle?f.textBlock.width*Math.sin(Math.PI/180*this.labelAngle)-5:5)),f.textBlock.x=c.x,f.textBlock.y=c.y,f.textBlock.render(!0)}this.title&&(this._titleTextBlock=new F(this.ctx,{x:this.lineCoordinates.x1,y:this.boundingRect.y2-this.titleFontSize-5,maxWidth:this.lineCoordinates.width,maxHeight:1.5*this.titleFontSize,angle:0,text:this.title,horizontalAlign:"center",fontSize:this.titleFontSize,fontFamily:this.titleFontFamily,fontWeight:this.titleFontWeight,
fontColor:this.titleFontColor,fontStyle:this.titleFontStyle,textBaseline:"top"}),this._titleTextBlock.measureText(),this._titleTextBlock.x=this.lineCoordinates.x1+this.lineCoordinates.width/2-this._titleTextBlock.width/2,this._titleTextBlock.y=this.boundingRect.y2-this._titleTextBlock.height-2,this._titleTextBlock.render(!0))}else if("top"===this._position){for(e=0;e<this._labels.length;e++)if(f=this._labels[e],!(f.position<this.minimum||f.position>this.maximum)){c=this.getPixelCoordinatesOnAxis(f.position);
if(this.tickThickness&&!this._labels[e].stripLine||this._labels[e].stripLine&&"pixel"===this._labels[e].stripLine._thicknessType)this._labels[e].stripLine?(b=this._labels[e].stripLine,this.ctx.lineWidth=b.thickness,this.ctx.strokeStyle=b.color):(this.ctx.lineWidth=this.tickThickness,this.ctx.strokeStyle=this.tickColor),b=1===this.ctx.lineWidth%2?(c.x<<0)+0.5:c.x<<0,this.ctx.beginPath(),this.ctx.moveTo(b,c.y<<0),this.ctx.lineTo(b,c.y-this.tickLength<<0),this.ctx.stroke();if(!a||0===d++%2||this._labels[e].stripLine)0===
f.textBlock.angle?(c.x-=f.textBlock.width/2,c.y-=this.tickLength+f.textBlock.height/2):(c.x-=0<this.labelAngle?f.textBlock.width*Math.cos(Math.PI/180*this.labelAngle):0,c.y-=this.tickLength+Math.abs(0<this.labelAngle?f.textBlock.width*Math.sin(Math.PI/180*this.labelAngle)+5:5)),f.textBlock.x=c.x,f.textBlock.y=c.y,f.textBlock.render(!0)}this.title&&(this._titleTextBlock=new F(this.ctx,{x:this.lineCoordinates.x1,y:this.boundingRect.y1,maxWidth:this.lineCoordinates.width,maxHeight:1.5*this.titleFontSize,
angle:0,text:this.title,horizontalAlign:"center",fontSize:this.titleFontSize,fontFamily:this.titleFontFamily,fontWeight:this.titleFontWeight,fontColor:this.titleFontColor,fontStyle:this.titleFontStyle,textBaseline:"top"}),this._titleTextBlock.measureText(),this._titleTextBlock.x=this.lineCoordinates.x1+this.lineCoordinates.width/2-this._titleTextBlock.width/2,this._titleTextBlock.render(!0))}else if("left"===this._position){for(e=0;e<this._labels.length;e++)if(f=this._labels[e],!(f.position<this.minimum||
f.position>this.maximum)){c=this.getPixelCoordinatesOnAxis(f.position);if(this.tickThickness&&!this._labels[e].stripLine||this._labels[e].stripLine&&"pixel"===this._labels[e].stripLine._thicknessType)this._labels[e].stripLine?(b=this._labels[e].stripLine,this.ctx.lineWidth=b.thickness,this.ctx.strokeStyle=b.color):(this.ctx.lineWidth=this.tickThickness,this.ctx.strokeStyle=this.tickColor),b=1===this.ctx.lineWidth%2?(c.y<<0)+0.5:c.y<<0,this.ctx.beginPath(),this.ctx.moveTo(c.x<<0,b),this.ctx.lineTo(c.x-
this.tickLength<<0,b),this.ctx.stroke();if(!a||0===d++%2||this._labels[e].stripLine)f.textBlock.x=c.x-f.textBlock.width*Math.cos(Math.PI/180*this.labelAngle)-this.tickLength-5,f.textBlock.y=0===this.labelAngle?c.y-f.textBlock.height/2+this.labelFontSize/2:c.y-f.textBlock.width*Math.sin(Math.PI/180*this.labelAngle),f.textBlock.render(!0)}this.title&&(this._titleTextBlock=new F(this.ctx,{x:this.boundingRect.x1+5,y:this.lineCoordinates.y2,maxWidth:this.lineCoordinates.height,maxHeight:1.5*this.titleFontSize,
angle:-90,text:this.title,horizontalAlign:"center",fontSize:this.titleFontSize,fontFamily:this.titleFontFamily,fontWeight:this.titleFontWeight,fontColor:this.titleFontColor,fontStyle:this.titleFontStyle,textBaseline:"top"}),this._titleTextBlock.measureText(),this._titleTextBlock.y=this.lineCoordinates.height/2+this._titleTextBlock.width/2+this.lineCoordinates.y1,this._titleTextBlock.render(!0))}else if("right"===this._position){for(e=0;e<this._labels.length;e++)if(f=this._labels[e],!(f.position<this.minimum||
f.position>this.maximum)){c=this.getPixelCoordinatesOnAxis(f.position);if(this.tickThickness&&!this._labels[e].stripLine||this._labels[e].stripLine&&"pixel"===this._labels[e].stripLine._thicknessType)this._labels[e].stripLine?(b=this._labels[e].stripLine,this.ctx.lineWidth=b.thickness,this.ctx.strokeStyle=b.color):(this.ctx.lineWidth=this.tickThickness,this.ctx.strokeStyle=this.tickColor),b=1===this.ctx.lineWidth%2?(c.y<<0)+0.5:c.y<<0,this.ctx.beginPath(),this.ctx.moveTo(c.x<<0,b),this.ctx.lineTo(c.x+
this.tickLength<<0,b),this.ctx.stroke();if(!a||0===d++%2||this._labels[e].stripLine)f.textBlock.x=c.x+this.tickLength+5,f.textBlock.y=0===this.labelAngle?c.y-f.textBlock.height/2+this.labelFontSize/2:c.y,f.textBlock.render(!0)}this.title&&(this._titleTextBlock=new F(this.ctx,{x:this.boundingRect.x2-5,y:this.lineCoordinates.y2,maxWidth:this.lineCoordinates.height,maxHeight:1.5*this.titleFontSize,angle:90,text:this.title,horizontalAlign:"center",fontSize:this.titleFontSize,fontFamily:this.titleFontFamily,
fontWeight:this.titleFontWeight,fontColor:this.titleFontColor,fontStyle:this.titleFontStyle,textBaseline:"top"}),this._titleTextBlock.measureText(),this._titleTextBlock.y=this.lineCoordinates.height/2-this._titleTextBlock.width/2+this.lineCoordinates.y1,this._titleTextBlock.render(!0))}};y.prototype.renderInterlacedColors=function(){var a=this.chart.plotArea.ctx,c,b,d=this.chart.plotArea,e=0;c=!0;if(("bottom"===this._position||"top"===this._position)&&this.interlacedColor)for(a.fillStyle=this.interlacedColor,
e=0;e<this._labels.length;e++)this._labels[e].stripLine||(c?(c=this.getPixelCoordinatesOnAxis(this._labels[e].position),b=e+1>=this._labels.length?this.getPixelCoordinatesOnAxis(this.maximum):this.getPixelCoordinatesOnAxis(this._labels[e+1].position),a.fillRect(c.x,d.y1,Math.abs(b.x-c.x),Math.abs(d.y1-d.y2)),c=!1):c=!0);else if(("left"===this._position||"right"===this._position)&&this.interlacedColor)for(a.fillStyle=this.interlacedColor,e=0;e<this._labels.length;e++)this._labels[e].stripLine||(c?
(b=this.getPixelCoordinatesOnAxis(this._labels[e].position),c=e+1>=this._labels.length?this.getPixelCoordinatesOnAxis(this.maximum):this.getPixelCoordinatesOnAxis(this._labels[e+1].position),a.fillRect(d.x1,c.y,Math.abs(d.x1-d.x2),Math.abs(c.y-b.y)),c=!1):c=!0);a.beginPath()};y.prototype.renderStripLinesOfThicknessType=function(a){if(this.stripLines&&0<this.stripLines.length&&a)for(var c=this.chart.plotArea.ctx,b=0,b=0;b<this.stripLines.length;b++){var d=this.stripLines[b];if(d._thicknessType===a&&
("pixel"!==a||!(d.value<this.minimum||d.value>this.maximum))){var e=this.getPixelCoordinatesOnAxis(d.value),f=Math.abs("pixel"===a?d.thickness:this.conversionParameters.pixelPerUnit*d.thickness);if(!(0>=f)){c.strokeStyle=d.color;c.beginPath();B(d.id);var g,l,q,k;c.lineWidth=f;if("bottom"===this._position||"top"===this._position)g=l=1===c.lineWidth%2?(e.x<<0)+0.5:e.x<<0,q=this.chart.plotArea.y1,k=this.chart.plotArea.y2;else if("left"===this._position||"right"===this._position)q=k=1===c.lineWidth%2?
(e.y<<0)+0.5:e.y<<0,g=this.chart.plotArea.x1,l=this.chart.plotArea.x2;c.moveTo(g,q);c.lineTo(l,k);c.stroke()}}}};y.prototype.renderGrid=function(){if(this.gridThickness&&0<this.gridThickness){var a=this.chart.ctx,c,b=this.chart.plotArea;a.lineWidth=this.gridThickness;a.strokeStyle=this.gridColor;if("bottom"===this._position||"top"===this._position)for(d=0;d<this._labels.length&&!this._labels[d].stripLine;d++)this._labels[d].position<this.minimum||this._labels[d].position>this.maximum||(a.beginPath(),
c=this.getPixelCoordinatesOnAxis(this._labels[d].position),c=1===a.lineWidth%2?(c.x<<0)+0.5:c.x<<0,a.moveTo(c,b.y1<<0),a.lineTo(c,b.y2<<0),a.stroke());else if("left"===this._position||"right"===this._position)for(var d=0;d<this._labels.length&&!this._labels[d].stripLine;d++)this._labels[d].position<this.minimum||this._labels[d].position>this.maximum||(a.beginPath(),c=this.getPixelCoordinatesOnAxis(this._labels[d].position),c=1===a.lineWidth%2?(c.y<<0)+0.5:c.y<<0,a.moveTo(b.x1<<0,c),a.lineTo(b.x2<<
0,c),a.stroke())}};y.prototype.renderAxisLine=function(){var a=this.chart.ctx;if("bottom"===this._position||"top"===this._position){if(this.lineThickness){a.lineWidth=this.lineThickness;a.strokeStyle=this.lineColor?this.lineColor:"black";var c=1===this.lineThickness%2?(this.lineCoordinates.y1<<0)+0.5:this.lineCoordinates.y1<<0;a.beginPath();a.moveTo(this.lineCoordinates.x1,c);a.lineTo(this.lineCoordinates.x2,c);a.stroke()}}else"left"!==this._position&&"right"!==this._position||!this.lineThickness||
(a.lineWidth=this.lineThickness,a.strokeStyle=this.lineColor,c=1===this.lineThickness%2?(this.lineCoordinates.x1<<0)+0.5:this.lineCoordinates.x1<<0,a.beginPath(),a.moveTo(c,this.lineCoordinates.y1),a.lineTo(c,this.lineCoordinates.y2),a.stroke())};y.prototype.getPixelCoordinatesOnAxis=function(a){var c={},b=this.lineCoordinates.width,d=this.lineCoordinates.height;if("bottom"===this._position||"top"===this._position)b/=Math.abs(this.maximum-this.minimum),c.x=this.lineCoordinates.x1+b*(a-this.minimum),
c.y=this.lineCoordinates.y1;if("left"===this._position||"right"===this._position)b=d/Math.abs(this.maximum-this.minimum),c.y=this.lineCoordinates.y2-b*(a-this.minimum),c.x=this.lineCoordinates.x2;return c};y.prototype.getXValueAt=function(a){if(!a)return null;var c=null;"left"===this._position?c=(this.chart.axisX.maximum-this.chart.axisX.minimum)/this.chart.axisX.lineCoordinates.height*(this.chart.axisX.lineCoordinates.y2-a.y)+this.chart.axisX.minimum:"bottom"===this._position&&(c=(this.chart.axisX.maximum-
this.chart.axisX.minimum)/this.chart.axisX.lineCoordinates.width*(a.x-this.chart.axisX.lineCoordinates.x1)+this.chart.axisX.minimum);return c};y.prototype.calculateValueToPixelconversionParameters=function(a){a={pixelPerUnit:null,minimum:null,reference:null};var c=this.lineCoordinates.width,b=this.lineCoordinates.height;a.minimum=this.minimum;if("bottom"===this._position||"top"===this._position)a.pixelPerUnit=c/Math.abs(this.maximum-this.minimum),a.reference=this.lineCoordinates.x1;if("left"===this._position||
"right"===this._position)a.pixelPerUnit=-1*b/Math.abs(this.maximum-this.minimum),a.reference=this.lineCoordinates.y2;this.conversionParameters=a};y.prototype.calculateAxisParameters=function(){var a=this.chart.layoutManager.getFreeSpace();"bottom"===this._position||"top"===this._position?(this.maxWidth=a.width,this.maxHeight=a.height):(this.maxWidth=a.height,this.maxHeight=a.width);var a="axisX"===this.type?500>this.maxWidth?8:Math.max(6,Math.floor(this.maxWidth/62)):Math.floor(this.maxWidth/40),
c,b,d,e;"axisX"===this.type?(c=null!==this.sessionVariables.internalMinimum?this.sessionVariables.internalMinimum:this.dataInfo.viewPortMin,b=null!==this.sessionVariables.internalMaximum?this.sessionVariables.internalMaximum:this.dataInfo.viewPortMax,0===b-c&&(b+=0.4,c-=0.4),d=Infinity!==this.dataInfo.minDiff?this.dataInfo.minDiff:1):"axisY"===this.type&&(c="undefined"===typeof this._options.minimum?this.dataInfo.viewPortMin:this._options.minimum,b="undefined"===typeof this._options.maximum?this.dataInfo.viewPortMax:
this._options.maximum,0===b-c?(b+=5,c-=5):(0!==b&&(b+=Math.abs(0.05)),0!==c&&(c-=Math.abs(0.05))),this.includeZero&&"undefined"===typeof this._options.minimum&&0<c&&(c=0),this.includeZero&&"undefined"===typeof this._options.maximum&&0>b&&(b=0));"axisX"===this.type&&"dateTime"===this.chart.plotInfo.axisXValueType?(e=b-c,this.intervalType||(e/1<=a?(this.interval=1,this.intervalType="millisecond"):e/2<=a?(this.interval=2,this.intervalType="millisecond"):e/5<=a?(this.interval=5,this.intervalType="millisecond"):
e/10<=a?(this.interval=10,this.intervalType="millisecond"):e/20<=a?(this.interval=20,this.intervalType="millisecond"):e/50<=a?(this.interval=50,this.intervalType="millisecond"):e/100<=a?(this.interval=100,this.intervalType="millisecond"):e/200<=a?(this.interval=200,this.intervalType="millisecond"):e/250<=a?(this.interval=250,this.intervalType="millisecond"):e/300<=a?(this.interval=300,this.intervalType="millisecond"):e/400<=a?(this.interval=400,this.intervalType="millisecond"):e/500<=a?(this.interval=
500,this.intervalType="millisecond"):e/(1*x.secondDuration)<=a?(this.interval=1,this.intervalType="second"):e/(2*x.secondDuration)<=a?(this.interval=2,this.intervalType="second"):e/(5*x.secondDuration)<=a?(this.interval=5,this.intervalType="second"):e/(10*x.secondDuration)<=a?(this.interval=10,this.intervalType="second"):e/(15*x.secondDuration)<=a?(this.interval=15,this.intervalType="second"):e/(20*x.secondDuration)<=a?(this.interval=20,this.intervalType="second"):e/(30*x.secondDuration)<=a?(this.interval=
30,this.intervalType="second"):e/(1*x.minuteDuration)<=a?(this.interval=1,this.intervalType="minute"):e/(2*x.minuteDuration)<=a?(this.interval=2,this.intervalType="minute"):e/(5*x.minuteDuration)<=a?(this.interval=5,this.intervalType="minute"):e/(10*x.minuteDuration)<=a?(this.interval=10,this.intervalType="minute"):e/(15*x.minuteDuration)<=a?(this.interval=15,this.intervalType="minute"):e/(20*x.minuteDuration)<=a?(this.interval=20,this.intervalType="minute"):e/(30*x.minuteDuration)<=a?(this.interval=
30,this.intervalType="minute"):e/(1*x.hourDuration)<=a?(this.interval=1,this.intervalType="hour"):e/(2*x.hourDuration)<=a?(this.interval=2,this.intervalType="hour"):e/(3*x.hourDuration)<=a?(this.interval=3,this.intervalType="hour"):e/(6*x.hourDuration)<=a?(this.interval=6,this.intervalType="hour"):e/(1*x.dayDuration)<=a?(this.interval=1,this.intervalType="day"):e/(2*x.dayDuration)<=a?(this.interval=2,this.intervalType="day"):e/(4*x.dayDuration)<=a?(this.interval=4,this.intervalType="day"):e/(1*x.weekDuration)<=
a?(this.interval=1,this.intervalType="week"):e/(2*x.weekDuration)<=a?(this.interval=2,this.intervalType="week"):e/(3*x.weekDuration)<=a?(this.interval=3,this.intervalType="week"):e/(1*x.monthDuration)<=a?(this.interval=1,this.intervalType="month"):e/(2*x.monthDuration)<=a?(this.interval=2,this.intervalType="month"):e/(3*x.monthDuration)<=a?(this.interval=3,this.intervalType="month"):e/(6*x.monthDuration)<=a?(this.interval=6,this.intervalType="month"):(this.interval=e/(1*x.yearDuration)<=a?1:e/(2*
x.yearDuration)<=a?2:e/(4*x.yearDuration)<=a?4:Math.floor(y.getNiceNumber(e/(a-1),!0)/x.yearDuration),this.intervalType="year")),this.minimum=null!==this.sessionVariables.internalMinimum?this.sessionVariables.internalMinimum:c-d/2,this.maximum=this.sessionVariables.internalMaximum?this.sessionVariables.internalMaximum:b+d/2,this.valueFormatString||("year"===this.intervalType?this.valueFormatString="YYYY":"month"===this.intervalType?this.valueFormatString="MMM YYYY":"week"===this.intervalType?this.valueFormatString=
"MMM DD YYYY":"day"===this.intervalType?this.valueFormatString="MMM DD YYYY":"hour"===this.intervalType?this.valueFormatString="hh:mm TT":"minute"===this.intervalType?this.valueFormatString="hh:mm TT":"second"===this.intervalType?this.valueFormatString="hh:mm:ss TT":"millisecond"===this.intervalType&&(this.valueFormatString="fff'ms'")),this.intervalStartPosition=this.getLabelStartPoint(new Date(this.minimum),this.intervalType,this.interval)):(this.intervalType="number",e=y.getNiceNumber(b-c,!1),this.interval=
this._options&&this._options.interval?this._options.interval:y.getNiceNumber(e/(a-1),!0),this.minimum=null!==this.sessionVariables.internalMinimum?this.sessionVariables.internalMinimum:Math.floor(c/this.interval)*this.interval,this.maximum=null!==this.sessionVariables.internalMaximum?this.sessionVariables.internalMaximum:Math.ceil(b/this.interval)*this.interval,"axisX"===this.type?(null===this.sessionVariables.internalMinimum&&(this.minimum=c-d/2),this.sessionVariables.internalMaximum||(this.maximum=
b+d/2),this.intervalStartPosition=Math.floor((this.minimum+0.2*this.interval)/this.interval)*this.interval):"axisY"===this.type&&(this.intervalStartPosition=this.minimum));"axisX"===this.type&&(this._absoluteMinimum=this._options&&"undefined"!==typeof this._options.minimum?this._options.minimum:this.dataInfo.min-d/2,this._absoluteMaximum=this._options&&"undefined"!==typeof this._options.maximum?this._options.maximum:this.dataInfo.max+d/2);if(!this.valueFormatString&&(this.valueFormatString="#,##0.##",
e=Math.abs(this.maximum-this.minimum),1>e&&(c=Math.floor(Math.abs(Math.log(e)/Math.LN10))+2,2<c)))for(b=0;b<c-2;b++)this.valueFormatString+="#"};y.getNiceNumber=function(a,c){var b=Math.floor(Math.log(a)/Math.LN10),d=a/Math.pow(10,b);return(c?1.5>d?1:3>d?2:7>d?5:10:1>=d?1:2>=d?2:5>=d?5:10)*Math.pow(10,b)};y.prototype.getLabelStartPoint=function(){var a=T(this.interval,this.intervalType),a=new Date(Math.floor(this.minimum/a)*a);if("millisecond"!==this.intervalType)if("second"===this.intervalType)0<
a.getMilliseconds()&&(a.setSeconds(a.getSeconds()+1),a.setMilliseconds(0));else if("minute"===this.intervalType){if(0<a.getSeconds()||0<a.getMilliseconds())a.setMinutes(a.getMinutes()+1),a.setSeconds(0),a.setMilliseconds(0)}else if("hour"===this.intervalType){if(0<a.getMinutes()||0<a.getSeconds()||0<a.getMilliseconds())a.setHours(a.getHours()+1),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)}else if("day"===this.intervalType){if(0<a.getHours()||0<a.getMinutes()||0<a.getSeconds()||0<a.getMilliseconds())a.setDate(a.getDate()+
1),a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)}else if("week"===this.intervalType){if(0<a.getDay()||0<a.getHours()||0<a.getMinutes()||0<a.getSeconds()||0<a.getMilliseconds())a.setDate(a.getDate()+(7-a.getDay())),a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)}else if("month"===this.intervalType){if(1<a.getDate()||0<a.getHours()||0<a.getMinutes()||0<a.getSeconds()||0<a.getMilliseconds())a.setMonth(a.getMonth()+1),a.setDate(1),a.setHours(0),a.setMinutes(0),
a.setSeconds(0),a.setMilliseconds(0)}else"year"===this.intervalType&&(0<a.getMonth()||1<a.getDate()||0<a.getHours()||0<a.getMinutes()||0<a.getSeconds()||0<a.getMilliseconds())&&(a.setFullYear(a.getFullYear()+1),a.setMonth(0),a.setDate(1),a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0));return a};M(fa,I);M(L,I);L.prototype._initialize=function(){if(this.enabled){this.container=document.createElement("div");this.container.setAttribute("class","canvasjs-chart-tooltip");this.container.style.position=
"absolute";this.container.style.height="auto";this.container.style.boxShadow="1px 1px 2px 2px rgba(0,0,0,0.1)";this.container.style.zIndex="1000";this.container.style.display="none";var a;a='<div style=" width: auto;height: auto;min-width: 50px;';a+="line-height: 20px;";a+="padding: 5px;";a+="font-family: Calibri, Arial, Georgia, serif;";a+="font-weight: 400;";a+="font-style: "+(v?"italic;":"normal;");a+="font-size: 14px;";a+="color: #000000;";a+="text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);";a+=
"text-align: left;";a+="border: 2px solid gray;";a+=v?"background: rgba(255,255,255,.9);":"background: rgb(255,255,255);";a+="text-indent: 0px;";a+="white-space: nowrap;";a+="border-radius: 10px;";v||(a+="filter: alpha(opacity = 90);",a+="filter: progid:DXImageTransform.Microsoft.Shadow(Strength=3, Direction=135, Color='#666666');");a+='} "> Sample Tooltip</div>';this.container.innerHTML=a;this.contentDiv=this.container.firstChild;this.container.style.borderRadius=this.contentDiv.style.borderRadius;
this.chart._canvasJSContainer.appendChild(this.container)}};L.prototype.mouseMoveHandler=function(a,c){this._lastUpdated&&40>(new Date).getTime()-this._lastUpdated||(this._lastUpdated=(new Date).getTime(),this._updateToolTip(a,c))};L.prototype._updateToolTip=function(a,c){if(this.enabled){if("undefined"===typeof a||"undefined"===typeof c){if(isNaN(this._prevX)||isNaN(this._prevY))return;a=this._prevX;c=this._prevY}else this._prevX=a,this._prevY=c;var b=null,d=null,e=[],f=0;if(this.shared&&"none"!==
this.chart.plotInfo.axisPlacement){f="xySwapped"===this.chart.plotInfo.axisPlacement?(this.chart.axisX.maximum-this.chart.axisX.minimum)/this.chart.axisX.lineCoordinates.height*(this.chart.axisX.lineCoordinates.y2-c)+this.chart.axisX.minimum:(this.chart.axisX.maximum-this.chart.axisX.minimum)/this.chart.axisX.lineCoordinates.width*(a-this.chart.axisX.lineCoordinates.x1)+this.chart.axisX.minimum;b=[];for(d=0;d<this.chart.data.length;d++){var g=this.chart.data[d].getDataPointAtX(f,!0);g&&0<=g.index&&
(g.dataSeries=this.chart.data[d],null!==g.dataPoint.y&&b.push(g))}if(0===b.length)return;b.sort(function(a,b){return a.distance-b.distance});f=b[0];for(d=0;d<b.length;d++)b[d].dataPoint.x.valueOf()===f.dataPoint.x.valueOf()&&e.push(b[d]);b=null}else if((g=this.chart.getDataPointAtXY(a,c,!0))?(this.currentDataPointIndex=g.dataPointIndex,this.currentSeriesIndex=g.dataSeries.index):v?(g=na(a,c,this.chart._eventManager.ghostCtx),0<g&&"undefined"!==typeof this.chart._eventManager.objectMap[g]?(eventObject=
this.chart._eventManager.objectMap[g],this.currentSeriesIndex=eventObject.dataSeriesIndex,this.currentDataPointIndex=0<=eventObject.dataPointIndex?eventObject.dataPointIndex:-1):this.currentDataPointIndex=-1):this.currentDataPointIndex=-1,0<=this.currentSeriesIndex){d=this.chart.data[this.currentSeriesIndex];g={};if(0<=this.currentDataPointIndex)b=d.dataPoints[this.currentDataPointIndex],g.dataSeries=d,g.dataPoint=b,g.index=this.currentDataPointIndex,g.distance=Math.abs(b.x-f);else if("line"===d.type||
"stepLine"===d.type||"spline"===d.type||"area"===d.type||"stepArea"===d.type||"splineArea"===d.type||"stackedArea"===d.type||"stackedArea100"===d.type)f=(this.chart.axisX.maximum-this.chart.axisX.minimum)/this.chart.axisX.lineCoordinates.width*(a-this.chart.axisX.lineCoordinates.x1)+this.chart.axisX.minimum.valueOf(),g=d.getDataPointAtX(f,!0),g.dataSeries=d,this.currentDataPointIndex=g.index,b=g.dataPoint;else return;null!==g.dataPoint.y&&e.push(g)}if(0<e.length){this.highlightObjects(e);f="";f=this.getToolTipInnerHTML({entries:e});
this.contentDiv.innerHTML=f;this.contentDiv.innerHTML=f;f=!1;"none"===this.container.style.display&&(f=!0,this.container.style.display="block");try{this.contentDiv.style.borderRightColor=this.contentDiv.style.borderLeftColor=this.contentDiv.style.borderColor=this.borderColor?this.borderColor:e[0].dataPoint.color?e[0].dataPoint.color:e[0].dataSeries.color?e[0].dataSeries.color:e[0].dataSeries._colorSet[e[0].index%e[0].dataSeries._colorSet.length]}catch(l){}"pie"===e[0].dataSeries.type||"doughnut"===
e[0].dataSeries.type||"bar"===e[0].dataSeries.type||"stackedBar"===e[0].dataSeries.type||"stackedBar100"===e[0].dataSeries.type?toolTipLeft=a-10-this.container.clientWidth:(toolTipLeft=this.chart.axisX.lineCoordinates.width/Math.abs(this.chart.axisX.maximum-this.chart.axisX.minimum)*Math.abs(e[0].dataPoint.x-this.chart.axisX.minimum)+this.chart.axisX.lineCoordinates.x1+0.5-this.container.clientWidth<<0,toolTipLeft-=10);toolTipLeft=0<toolTipLeft?toolTipLeft+"px":toolTipLeft+this.container.clientWidth+
20+"px";e=1!==e.length||this.shared||"line"!==e[0].dataSeries.type&&"stepLine"!==e[0].dataSeries.type&&"spline"!==e[0].dataSeries.type&&"area"!==e[0].dataSeries.type&&"stepArea"!==e[0].dataSeries.type&&"splineArea"!==e[0].dataSeries.type&&"stackedArea"!==e[0].dataSeries.type&&"stackedArea100"!==e[0].dataSeries.type?"bar"===e[0].dataSeries.type||"stackedBar"===e[0].dataSeries.type||"stackedBar100"===e[0].dataSeries.type?e[0].dataSeries.axisX.lineCoordinates.y2-e[0].dataSeries.axisX.lineCoordinates.height/
Math.abs(e[0].dataSeries.axisX.maximum-e[0].dataSeries.axisX.minimum)*Math.abs(e[0].dataPoint.x-e[0].dataSeries.axisX.minimum)+0.5<<0:c:e[0].dataSeries.axisY.lineCoordinates.y2-e[0].dataSeries.axisY.lineCoordinates.height/Math.abs(e[0].dataSeries.axisY.maximum-e[0].dataSeries.axisY.minimum)*Math.abs(e[0].dataPoint.y-e[0].dataSeries.axisY.minimum)+0.5<<0;e=-e+10;0<e+this.container.clientHeight+5&&(e-=e+this.container.clientHeight+5-0);this.container.style.left=toolTipLeft;this.container.style.bottom=
e+"px";!this.animationEnabled||f?this.disableAnimation():this.enableAnimation()}}};L.prototype.highlightObjects=function(a){if(this.enabled){var c=this.chart.overlaidCanvasCtx;this.chart.resetOverlayedCanvas();c.save();var b=this.chart.plotArea;c.rect(b.x1,b.y1,b.width,b.height);c.clip();c.beginPath();for(b=0;b<a.length;b++){var d=a[b];if((d=this.chart._eventManager.objectMap[d.dataSeries.dataPointIds[d.index]])&&d.objectType&&"dataPoint"===d.objectType){var e=this.chart.data[d.dataSeriesIndex],f=
d.dataPointIndex;if("line"===e.type||"stepLine"===e.type||"spline"===e.type||"scatter"===e.type||"area"===e.type||"stepArea"===e.type||"splineArea"===e.type||"stackedArea"===e.type||"stackedArea100"===e.type)e=e.getMarkerProperties(f,d.x1,d.y1,this.chart.overlaidCanvasCtx),e.size=Math.max(1.5*e.size<<0,10),e.borderColor=e.borderColor||"#FFFFFF",e.borderThickness=e.borderThickness||Math.ceil(0.1*e.size),H.drawMarkers([e]);else if("bubble"===e.type)e=e.getMarkerProperties(f,d.x1,d.y1,this.chart.overlaidCanvasCtx),
e.size=d.size,e.color="white",e.borderColor="white",c.globalAlpha=0.3,H.drawMarkers([e]),c.globalAlpha=1;else if("column"===e.type||"stackedColumn"===e.type||"stackedColumn100"===e.type||"bar"===e.type||"stackedBar"===e.type||"stackedBar100"===e.type)c.globalAlpha=0.3,J(c,d.x1,d.y1,d.x2,d.y2,"white",!1,!1,!1,!1),c.globalAlpha=1;else if("pie"===e.type||"doughnut"===e.type)c.globalAlpha=0.3,ja(c,d.center,d.radius,"white",e.type,d.startAngle,d.endAngle),c.globalAlpha=1}}c.globalAlpha=1;c.restore()}};
L.prototype.getToolTipInnerHTML=function(a){a=a.entries;for(var c="",b=null,d=null,e=0,f="",g=!0,l=0;l<a.length;l++)if(a[l].dataSeries.toolTipContent||a[l].dataPoint.toolTipContent){g=!1;break}if(g&&this.content&&"function"===typeof this.content)c=this.content({entries:a});else if(1<a.length)for(l=0;l<a.length;l++){b=a[l].dataSeries;d=a[l].dataPoint;e=a[l].index;f="";0===l&&(g&&!this.content)&&(f+="undefined"!==typeof this.chart.axisX.labels[d.x]?this.chart.axisX.labels[d.x]:"{x}",f+="</br>");if("line"===
b.type||"stepLine"===b.type||"spline"===b.type||"area"===b.type||"stepArea"===b.type||"splineArea"===b.type||"column"===b.type||"bar"===b.type||"scatter"===b.type||"stackedColumn"===b.type||"stackedColumn100"===b.type||"stackedBar"===b.type||"stackedBar100"===b.type||"stackedArea"===b.type||"stackedArea100"===b.type)f+=d.toolTipContent?d.toolTipContent:b.toolTipContent?b.toolTipContent:this.content&&"function"!==typeof this.content?this.content:"<span style='\"'color:{color};'\"'>{name}:</span>&nbsp;&nbsp;{y}";
else if("bubble"===b.type)f+=d.toolTipContent?d.toolTipContent:b.toolTipContent?b.toolTipContent:this.content&&"function"!==typeof this.content?this.content:"<span style='\"'color:{color};'\"'>{name}:</span>&nbsp;&nbsp;{y}, &nbsp;&nbsp;{z}";else if("pie"===b.type||"doughnut"===b.type)f+=d.toolTipContent?d.toolTipContent:b.toolTipContent?b.toolTipContent:this.content&&"function"!==typeof this.content?this.content:"&nbsp;&nbsp;{y}";c+=this.chart.replaceKeywordsWithValue(f,d,b,e);l<a.length-1&&(c+="</br>")}else{b=
a[0].dataSeries;d=a[0].dataPoint;e=a[0].index;if("line"===b.type||"stepLine"===b.type||"spline"===b.type||"area"===b.type||"stepArea"===b.type||"splineArea"===b.type||"column"===b.type||"bar"===b.type||"scatter"===b.type||"stackedColumn"===b.type||"stackedColumn100"===b.type||"stackedBar"===b.type||"stackedBar100"===b.type||"stackedArea"===b.type||"stackedArea100"===b.type)f=d.toolTipContent?d.toolTipContent:b.toolTipContent?b.toolTipContent:this.content&&"function"!==typeof this.content?this.content:
"<span style='\"'color:{color};'\"'>"+(d.label?"{label}":"{x}")+" :</span>&nbsp;&nbsp;{y}";else if("bubble"===b.type)f=d.toolTipContent?d.toolTipContent:b.toolTipContent?b.toolTipContent:this.content&&"function"!==typeof this.content?this.content:"<span style='\"'color:{color};'\"'>"+(d.label?"{label}":"{x}")+":</span>&nbsp;&nbsp;{y}, &nbsp;&nbsp;{z}";else if("pie"===b.type||"doughnut"===b.type)f=d.toolTipContent?d.toolTipContent:b.toolTipContent?b.toolTipContent:this.content&&"function"!==typeof this.content?
this.content:(d.name?"{name}:&nbsp;&nbsp;":d.label?"{label}:&nbsp;&nbsp;":"")+"{y}";c+=this.chart.replaceKeywordsWithValue(f,d,b,e)}return c};L.prototype.enableAnimation=function(){this.container.style.WebkitTransition||(this.container.style.WebkitTransition="left .2s ease-out, bottom .2s ease-out",this.container.style.MozTransition="left .2s ease-out, bottom .2s ease-out",this.container.style.MsTransition="left .2s ease-out, bottom .2s ease-out",this.container.style.transition="left .2s ease-out, bottom .2s ease-out")};
L.prototype.disableAnimation=function(){this.container.style.WebkitTransition&&(this.container.style.WebkitTransition="",this.container.style.MozTransition="",this.container.style.MsTransition="",this.container.style.transition="")};L.prototype.hide=function(){this.enabled&&(this.container.style.display="none",this.currentSeriesIndex=-1,this._prevY=this._prevX=NaN,this.chart.resetOverlayedCanvas())};w.prototype.replaceKeywordsWithValue=function(a,c,b,d){var e=this;return a.replace(/\{\s*[a-zA-Z]+\s*\}|"[^"]*"|'[^']*'/g,
function(a){if('"'===a[0]&&'"'===a[a.length-1]||"'"===a[0]&&"'"===a[a.length-1])return a.slice(1,a.length-1);a=ca(a.slice(1,a.length-1));var g=null;if("color"===a)return c.color?c.color:b.color?b.color:b._colorSet[d%b._colorSet.length];if(c.hasOwnProperty(a))g=c;else if(b.hasOwnProperty(a))g=b;else return"";return"x"===a?e.axisX&&"dateTime"===e.plotInfo.axisXValueType?sa(g[a],c.xValueFormatString?c.xValueFormatString:b.xValueFormatString?b.xValueFormatString:e.axisX&&e.axisX.valueFormatString?e.axisX.valueFormatString:
"DD MMM YY",e._cultureInfo):ia(g[a],c.xValueFormatString?c.xValueFormatString:b.xValueFormatString?b.xValueFormatString:"#,##0.########",e._cultureInfo):"y"===a?ia(g[a],c.yValueFormatString?c.yValueFormatString:b.yValueFormatString?b.yValueFormatString:"#,##0.########",e._cultureInfo):g[a]})};U.prototype.reset=function(){this.lastObjectId=0;this.objectMap=[];this.rectangularRegionEventSubscriptions=[];this.previousDataPointEventObject=null;this.eventObjects=[];v&&(this.ghostCtx.clearRect(0,0,this.chart.width,
this.chart.height),this.ghostCtx.beginPath())};U.prototype.getNewObjectTrackingId=function(){return++this.lastObjectId};U.prototype.mouseEventHandler=function(a){if("mousemove"===a.type||"click"===a.type){var c=[],b=ba(a),d=null;if((d=this.chart.getObjectAtXY(b.x,b.y,!1))&&"undefined"!==typeof this.objectMap[d])if(d=this.objectMap[d],"dataPoint"===d.objectType){var e=this.chart.data[d.dataSeriesIndex],f=e.dataPoints[d.dataPointIndex],g=d.dataPointIndex;d.eventParameter={x:b.x,y:b.y,dataPoint:f,dataSeries:e._options,
dataPointIndex:g,dataSeriesIndex:e.index};d.eventContext={context:f,userContext:f,mouseover:"mouseover",mousemove:"mousemove",mouseout:"mouseout",click:"click"};c.push(d);d=this.objectMap[e.id];d.eventParameter={x:b.x,y:b.y,dataPoint:f,dataSeries:e._options,dataPointIndex:g,dataSeriesIndex:e.index};d.eventContext={context:e,userContext:e._options,mouseover:"mouseover",mousemove:"mousemove",mouseout:"mouseout",click:"click"};c.push(this.objectMap[e.id])}else"legendItem"===d.objectType&&(e=this.chart.data[d.dataSeriesIndex],
f=e.dataPoints[d.dataPointIndex],d.eventParameter={x:b.x,y:b.y,dataSeries:e._options,dataPoint:f,dataPointIndex:d.dataPointIndex,dataSeriesIndex:d.dataSeriesIndex},d.eventContext={context:this.chart.legend,userContext:this.chart.legend._options,mouseover:"itemmouseover",mousemove:"itemmousemove",mouseout:"itemmouseout",click:"itemclick"},c.push(d));e=[];for(b=0;b<this.mouseoveredObjectMaps.length;b++){f=!0;for(d=0;d<c.length;d++)if(c[d].id===this.mouseoveredObjectMaps[b].id){f=!1;break}f?this.fireEvent(this.mouseoveredObjectMaps[b],
"mouseout",a):e.push(this.mouseoveredObjectMaps[b])}this.mouseoveredObjectMaps=e;for(b=0;b<c.length;b++){e=!1;for(d=0;d<this.mouseoveredObjectMaps.length;d++)if(c[b].id===this.mouseoveredObjectMaps[d].id){e=!0;break}e||(this.fireEvent(c[b],"mouseover",a),this.mouseoveredObjectMaps.push(c[b]));"click"===a.type?this.fireEvent(c[b],"click",a):"mousemove"===a.type&&this.fireEvent(c[b],"mousemove",a)}}};U.prototype.fireEvent=function(a,c,b){if(a&&c){var d=a.eventParameter,e=a.eventContext,f=a.eventContext.userContext;
f&&(e&&f[e[c]])&&f[e[c]].call(f,d);"mouseout"!==c?f.cursor&&f.cursor!==b.target.style.cursor&&(b.target.style.cursor=f.cursor):(b.target.style.cursor=this.chart._defaultCursor,delete a.eventParameter,delete a.eventContext);"click"===c&&("dataPoint"===a.objectType&&this.chart.pieDoughnutClickHandler)&&this.chart.pieDoughnutClickHandler.call(this.chart.data[a.dataSeriesIndex],d)}};M(ra,I);var H={drawMarker:function(a,c,b,d,e,f,g,l){if(b){var q=1;b.fillStyle=f?f:"#000000";b.strokeStyle=g?g:"#000000";
b.lineWidth=l?l:0;"circle"===d?(b.moveTo(a,c),b.beginPath(),b.arc(a,c,e/2,0,2*Math.PI,!1),f&&b.fill(),l&&(g?b.stroke():(q=b.globalAlpha,b.globalAlpha=0.15,b.strokeStyle="black",b.stroke(),b.globalAlpha=q))):"square"===d?(b.beginPath(),b.rect(a-e/2,c-e/2,e,e),f&&b.fill(),l&&(g?b.stroke():(q=b.globalAlpha,b.globalAlpha=0.15,b.strokeStyle="black",b.stroke(),b.globalAlpha=q))):"triangle"===d?(b.beginPath(),b.moveTo(a-e/2,c+e/2),b.lineTo(a+e/2,c+e/2),b.lineTo(a,c-e/2),b.closePath(),f&&b.fill(),l&&(g?b.stroke():
(q=b.globalAlpha,b.globalAlpha=0.15,b.strokeStyle="black",b.stroke(),b.globalAlpha=q)),b.beginPath()):"cross"===d&&(b.strokeStyle=f,b.lineWidth=e/4,b.beginPath(),b.moveTo(a-e/2,c-e/2),b.lineTo(a+e/2,c+e/2),b.stroke(),b.moveTo(a+e/2,c-e/2),b.lineTo(a-e/2,c+e/2),b.stroke())}},drawMarkers:function(a){for(var c=0;c<a.length;c++){var b=a[c];H.drawMarker(b.x,b.y,b.ctx,b.type,b.size,b.color,b.borderColor,b.borderThickness)}}},ta={Chart:function(a,c){var b=new w(a,c,this);this.render=function(){b.render(this.options)};
this.options=b._options},addColorSet:function(a,c){R[a]=c},addCultureInfo:function(a,c){ga[a]=c}};ta.Chart.version="v1.4.1 GA";window.CanvasJS=ta})();
/*
  excanvas is used to support IE678 which do not implement HTML5 Canvas Element. You can safely remove the following excanvas code if you don't need to support older browsers.

  Copyright 2006 Google Inc. https://code.google.com/p/explorercanvas/
  Licensed under the Apache License, Version 2.0
*/
document.createElement("canvas").getContext||function(){function V(){return this.context_||(this.context_=new C(this))}function W(a,b,c){var g=M.call(arguments,2);return function(){return a.apply(b,g.concat(M.call(arguments)))}}function N(a){return String(a).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}function O(a){a.namespaces.g_vml_||a.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML");a.namespaces.g_o_||a.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML");
a.styleSheets.ex_canvas_||(a=a.createStyleSheet(),a.owningElement.id="ex_canvas_",a.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}")}function X(a){var b=a.srcElement;switch(a.propertyName){case "width":b.getContext().clearRect();b.style.width=b.attributes.width.nodeValue+"px";b.firstChild.style.width=b.clientWidth+"px";break;case "height":b.getContext().clearRect(),b.style.height=b.attributes.height.nodeValue+"px",b.firstChild.style.height=b.clientHeight+
"px"}}function Y(a){a=a.srcElement;a.firstChild&&(a.firstChild.style.width=a.clientWidth+"px",a.firstChild.style.height=a.clientHeight+"px")}function D(){return[[1,0,0],[0,1,0],[0,0,1]]}function t(a,b){for(var c=D(),g=0;3>g;g++)for(var e=0;3>e;e++){for(var f=0,d=0;3>d;d++)f+=a[g][d]*b[d][e];c[g][e]=f}return c}function P(a,b){b.fillStyle=a.fillStyle;b.lineCap=a.lineCap;b.lineJoin=a.lineJoin;b.lineWidth=a.lineWidth;b.miterLimit=a.miterLimit;b.shadowBlur=a.shadowBlur;b.shadowColor=a.shadowColor;b.shadowOffsetX=
a.shadowOffsetX;b.shadowOffsetY=a.shadowOffsetY;b.strokeStyle=a.strokeStyle;b.globalAlpha=a.globalAlpha;b.font=a.font;b.textAlign=a.textAlign;b.textBaseline=a.textBaseline;b.arcScaleX_=a.arcScaleX_;b.arcScaleY_=a.arcScaleY_;b.lineScale_=a.lineScale_}function Q(a){var b=a.indexOf("(",3),c=a.indexOf(")",b+1),b=a.substring(b+1,c).split(",");if(4!=b.length||"a"!=a.charAt(3))b[3]=1;return b}function E(a,b,c){return Math.min(c,Math.max(b,a))}function F(a,b,c){0>c&&c++;1<c&&c--;return 1>6*c?a+6*(b-a)*c:
1>2*c?b:2>3*c?a+6*(b-a)*(2/3-c):a}function G(a){if(a in H)return H[a];var b,c=1;a=String(a);if("#"==a.charAt(0))b=a;else if(/^rgb/.test(a)){c=Q(a);b="#";for(var g,e=0;3>e;e++)g=-1!=c[e].indexOf("%")?Math.floor(255*(parseFloat(c[e])/100)):+c[e],b+=v[E(g,0,255)];c=+c[3]}else if(/^hsl/.test(a)){e=c=Q(a);b=parseFloat(e[0])/360%360;0>b&&b++;g=E(parseFloat(e[1])/100,0,1);e=E(parseFloat(e[2])/100,0,1);if(0==g)g=e=b=e;else{var f=0.5>e?e*(1+g):e+g-e*g,d=2*e-f;g=F(d,f,b+1/3);e=F(d,f,b);b=F(d,f,b-1/3)}b="#"+
v[Math.floor(255*g)]+v[Math.floor(255*e)]+v[Math.floor(255*b)];c=c[3]}else b=Z[a]||a;return H[a]={color:b,alpha:c}}function C(a){this.m_=D();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.fillStyle=this.strokeStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=1*q;this.globalAlpha=1;this.font="10px sans-serif";this.textAlign="left";this.textBaseline="alphabetic";this.canvas=a;var b="width:"+a.clientWidth+"px;height:"+a.clientHeight+"px;overflow:hidden;position:absolute",
c=a.ownerDocument.createElement("div");c.style.cssText=b;a.appendChild(c);b=c.cloneNode(!1);b.style.backgroundColor="red";b.style.filter="alpha(opacity=0)";a.appendChild(b);this.element_=c;this.lineScale_=this.arcScaleY_=this.arcScaleX_=1}function R(a,b,c,g){a.currentPath_.push({type:"bezierCurveTo",cp1x:b.x,cp1y:b.y,cp2x:c.x,cp2y:c.y,x:g.x,y:g.y});a.currentX_=g.x;a.currentY_=g.y}function S(a,b){var c=G(a.strokeStyle),g=c.color,c=c.alpha*a.globalAlpha,e=a.lineScale_*a.lineWidth;1>e&&(c*=e);b.push("<g_vml_:stroke",
' opacity="',c,'"',' joinstyle="',a.lineJoin,'"',' miterlimit="',a.miterLimit,'"',' endcap="',$[a.lineCap]||"square",'"',' weight="',e,'px"',' color="',g,'" />')}function T(a,b,c,g){var e=a.fillStyle,f=a.arcScaleX_,d=a.arcScaleY_,k=g.x-c.x,n=g.y-c.y;if(e instanceof w){var h=0,l=g=0,u=0,m=1;if("gradient"==e.type_){h=e.x1_/f;c=e.y1_/d;var p=s(a,e.x0_/f,e.y0_/d),h=s(a,h,c),h=180*Math.atan2(h.x-p.x,h.y-p.y)/Math.PI;0>h&&(h+=360);1E-6>h&&(h=0)}else p=s(a,e.x0_,e.y0_),g=(p.x-c.x)/k,l=(p.y-c.y)/n,k/=f*q,
n/=d*q,m=x.max(k,n),u=2*e.r0_/m,m=2*e.r1_/m-u;f=e.colors_;f.sort(function(a,b){return a.offset-b.offset});d=f.length;p=f[0].color;c=f[d-1].color;k=f[0].alpha*a.globalAlpha;a=f[d-1].alpha*a.globalAlpha;for(var n=[],r=0;r<d;r++){var t=f[r];n.push(t.offset*m+u+" "+t.color)}b.push('<g_vml_:fill type="',e.type_,'"',' method="none" focus="100%"',' color="',p,'"',' color2="',c,'"',' colors="',n.join(","),'"',' opacity="',a,'"',' g_o_:opacity2="',k,'"',' angle="',h,'"',' focusposition="',g,",",l,'" />')}else e instanceof
I?k&&n&&b.push("<g_vml_:fill",' position="',-c.x/k*f*f,",",-c.y/n*d*d,'"',' type="tile"',' src="',e.src_,'" />'):(e=G(a.fillStyle),b.push('<g_vml_:fill color="',e.color,'" opacity="',e.alpha*a.globalAlpha,'" />'))}function s(a,b,c){a=a.m_;return{x:q*(b*a[0][0]+c*a[1][0]+a[2][0])-r,y:q*(b*a[0][1]+c*a[1][1]+a[2][1])-r}}function z(a,b,c){isFinite(b[0][0])&&(isFinite(b[0][1])&&isFinite(b[1][0])&&isFinite(b[1][1])&&isFinite(b[2][0])&&isFinite(b[2][1]))&&(a.m_=b,c&&(a.lineScale_=aa(ba(b[0][0]*b[1][1]-b[0][1]*
b[1][0]))))}function w(a){this.type_=a;this.r1_=this.y1_=this.x1_=this.r0_=this.y0_=this.x0_=0;this.colors_=[]}function I(a,b){if(!a||1!=a.nodeType||"IMG"!=a.tagName)throw new A("TYPE_MISMATCH_ERR");if("complete"!=a.readyState)throw new A("INVALID_STATE_ERR");switch(b){case "repeat":case null:case "":this.repetition_="repeat";break;case "repeat-x":case "repeat-y":case "no-repeat":this.repetition_=b;break;default:throw new A("SYNTAX_ERR");}this.src_=a.src;this.width_=a.width;this.height_=a.height}
function A(a){this.code=this[a];this.message=a+": DOM Exception "+this.code}var x=Math,k=x.round,J=x.sin,K=x.cos,ba=x.abs,aa=x.sqrt,q=10,r=q/2;navigator.userAgent.match(/MSIE ([\d.]+)?/);var M=Array.prototype.slice;O(document);var U={init:function(a){a=a||document;a.createElement("canvas");a.attachEvent("onreadystatechange",W(this.init_,this,a))},init_:function(a){a=a.getElementsByTagName("canvas");for(var b=0;b<a.length;b++)this.initElement(a[b])},initElement:function(a){if(!a.getContext){a.getContext=
V;O(a.ownerDocument);a.innerHTML="";a.attachEvent("onpropertychange",X);a.attachEvent("onresize",Y);var b=a.attributes;b.width&&b.width.specified?a.style.width=b.width.nodeValue+"px":a.width=a.clientWidth;b.height&&b.height.specified?a.style.height=b.height.nodeValue+"px":a.height=a.clientHeight}return a}};U.init();for(var v=[],d=0;16>d;d++)for(var B=0;16>B;B++)v[16*d+B]=d.toString(16)+B.toString(16);var Z={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",
bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgreen:"#006400",darkgrey:"#A9A9A9",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",
darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",grey:"#808080",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4",indianred:"#CD5C5C",indigo:"#4B0082",
ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",lightgreen:"#90EE90",lightgrey:"#D3D3D3",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",mediumaquamarine:"#66CDAA",
mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370DB",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",oldlace:"#FDF5E6",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#DB7093",papayawhip:"#FFEFD5",
peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",whitesmoke:"#F5F5F5",yellowgreen:"#9ACD32"},
H={},L={},$={butt:"flat",round:"round"},d=C.prototype;d.clearRect=function(){this.textMeasureEl_&&(this.textMeasureEl_.removeNode(!0),this.textMeasureEl_=null);this.element_.innerHTML=""};d.beginPath=function(){this.currentPath_=[]};d.moveTo=function(a,b){var c=s(this,a,b);this.currentPath_.push({type:"moveTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};d.lineTo=function(a,b){var c=s(this,a,b);this.currentPath_.push({type:"lineTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};d.bezierCurveTo=
function(a,b,c,g,e,f){e=s(this,e,f);a=s(this,a,b);c=s(this,c,g);R(this,a,c,e)};d.quadraticCurveTo=function(a,b,c,g){a=s(this,a,b);c=s(this,c,g);g={x:this.currentX_+2/3*(a.x-this.currentX_),y:this.currentY_+2/3*(a.y-this.currentY_)};R(this,g,{x:g.x+(c.x-this.currentX_)/3,y:g.y+(c.y-this.currentY_)/3},c)};d.arc=function(a,b,c,g,e,f){c*=q;var d=f?"at":"wa",k=a+K(g)*c-r,n=b+J(g)*c-r;g=a+K(e)*c-r;e=b+J(e)*c-r;k!=g||f||(k+=0.125);a=s(this,a,b);k=s(this,k,n);g=s(this,g,e);this.currentPath_.push({type:d,
x:a.x,y:a.y,radius:c,xStart:k.x,yStart:k.y,xEnd:g.x,yEnd:g.y})};d.rect=function(a,b,c,g){this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+g);this.lineTo(a,b+g);this.closePath()};d.strokeRect=function(a,b,c,g){var e=this.currentPath_;this.beginPath();this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+g);this.lineTo(a,b+g);this.closePath();this.stroke();this.currentPath_=e};d.fillRect=function(a,b,c,g){var e=this.currentPath_;this.beginPath();this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+
c,b+g);this.lineTo(a,b+g);this.closePath();this.fill();this.currentPath_=e};d.createLinearGradient=function(a,b,c,g){var e=new w("gradient");e.x0_=a;e.y0_=b;e.x1_=c;e.y1_=g;return e};d.createRadialGradient=function(a,b,c,g,e,f){var d=new w("gradientradial");d.x0_=a;d.y0_=b;d.r0_=c;d.x1_=g;d.y1_=e;d.r1_=f;return d};d.drawImage=function(a,b){var c,g,e,d,r,y,n,h;e=a.runtimeStyle.width;d=a.runtimeStyle.height;a.runtimeStyle.width="auto";a.runtimeStyle.height="auto";var l=a.width,u=a.height;a.runtimeStyle.width=
e;a.runtimeStyle.height=d;if(3==arguments.length)c=arguments[1],g=arguments[2],r=y=0,n=e=l,h=d=u;else if(5==arguments.length)c=arguments[1],g=arguments[2],e=arguments[3],d=arguments[4],r=y=0,n=l,h=u;else if(9==arguments.length)r=arguments[1],y=arguments[2],n=arguments[3],h=arguments[4],c=arguments[5],g=arguments[6],e=arguments[7],d=arguments[8];else throw Error("Invalid number of arguments");var m=s(this,c,g),p=[];p.push(" <g_vml_:group",' coordsize="',10*q,",",10*q,'"',' coordorigin="0,0"',' style="width:',
10,"px;height:",10,"px;position:absolute;");if(1!=this.m_[0][0]||this.m_[0][1]||1!=this.m_[1][1]||this.m_[1][0]){var t=[];t.push("M11=",this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",k(m.x/q),",","Dy=",k(m.y/q),"");var v=s(this,c+e,g),w=s(this,c,g+d);c=s(this,c+e,g+d);m.x=x.max(m.x,v.x,w.x,c.x);m.y=x.max(m.y,v.y,w.y,c.y);p.push("padding:0 ",k(m.x/q),"px ",k(m.y/q),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",t.join(""),", sizingmethod='clip');")}else p.push("top:",
k(m.y/q),"px;left:",k(m.x/q),"px;");p.push(' ">','<g_vml_:image src="',a.src,'"',' style="width:',q*e,"px;"," height:",q*d,'px"',' cropleft="',r/l,'"',' croptop="',y/u,'"',' cropright="',(l-r-n)/l,'"',' cropbottom="',(u-y-h)/u,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",p.join(""))};d.stroke=function(a){var b=[];b.push("<g_vml_:shape",' filled="',!!a,'"',' style="position:absolute;width:',10,"px;height:",10,'px;"',' coordorigin="0,0"',' coordsize="',10*q,",",10*q,'"',
' stroked="',!a,'"',' path="');for(var c={x:null,y:null},d={x:null,y:null},e=0;e<this.currentPath_.length;e++){var f=this.currentPath_[e];switch(f.type){case "moveTo":b.push(" m ",k(f.x),",",k(f.y));break;case "lineTo":b.push(" l ",k(f.x),",",k(f.y));break;case "close":b.push(" x ");f=null;break;case "bezierCurveTo":b.push(" c ",k(f.cp1x),",",k(f.cp1y),",",k(f.cp2x),",",k(f.cp2y),",",k(f.x),",",k(f.y));break;case "at":case "wa":b.push(" ",f.type," ",k(f.x-this.arcScaleX_*f.radius),",",k(f.y-this.arcScaleY_*
f.radius)," ",k(f.x+this.arcScaleX_*f.radius),",",k(f.y+this.arcScaleY_*f.radius)," ",k(f.xStart),",",k(f.yStart)," ",k(f.xEnd),",",k(f.yEnd))}if(f){if(null==c.x||f.x<c.x)c.x=f.x;if(null==d.x||f.x>d.x)d.x=f.x;if(null==c.y||f.y<c.y)c.y=f.y;if(null==d.y||f.y>d.y)d.y=f.y}}b.push(' ">');a?T(this,b,c,d):S(this,b);b.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",b.join(""))};d.fill=function(){this.stroke(!0)};d.closePath=function(){this.currentPath_.push({type:"close"})};d.save=function(){var a=
{};P(this,a);this.aStack_.push(a);this.mStack_.push(this.m_);this.m_=t(D(),this.m_)};d.restore=function(){this.aStack_.length&&(P(this.aStack_.pop(),this),this.m_=this.mStack_.pop())};d.translate=function(a,b){z(this,t([[1,0,0],[0,1,0],[a,b,1]],this.m_),!1)};d.rotate=function(a){var b=K(a);a=J(a);z(this,t([[b,a,0],[-a,b,0],[0,0,1]],this.m_),!1)};d.scale=function(a,b){this.arcScaleX_*=a;this.arcScaleY_*=b;z(this,t([[a,0,0],[0,b,0],[0,0,1]],this.m_),!0)};d.transform=function(a,b,c,d,e,f){z(this,t([[a,
b,0],[c,d,0],[e,f,1]],this.m_),!0)};d.setTransform=function(a,b,c,d,e,f){z(this,[[a,b,0],[c,d,0],[e,f,1]],!0)};d.drawText_=function(a,b,c,d,e){var f=this.m_;d=0;var r=1E3,t=0,n=[],h;h=this.font;if(L[h])h=L[h];else{var l=document.createElement("div").style;try{l.font=h}catch(u){}h=L[h]={style:l.fontStyle||"normal",variant:l.fontVariant||"normal",weight:l.fontWeight||"normal",size:l.fontSize||10,family:l.fontFamily||"sans-serif"}}var l=h,m=this.element_;h={};for(var p in l)h[p]=l[p];p=parseFloat(m.currentStyle.fontSize);
m=parseFloat(l.size);"number"==typeof l.size?h.size=l.size:-1!=l.size.indexOf("px")?h.size=m:-1!=l.size.indexOf("em")?h.size=p*m:-1!=l.size.indexOf("%")?h.size=p/100*m:-1!=l.size.indexOf("pt")?h.size=m/0.75:h.size=p;h.size*=0.981;p=h.style+" "+h.variant+" "+h.weight+" "+h.size+"px "+h.family;m=this.element_.currentStyle;l=this.textAlign.toLowerCase();switch(l){case "left":case "center":case "right":break;case "end":l="ltr"==m.direction?"right":"left";break;case "start":l="rtl"==m.direction?"right":
"left";break;default:l="left"}switch(this.textBaseline){case "hanging":case "top":t=h.size/1.75;break;case "middle":break;default:case null:case "alphabetic":case "ideographic":case "bottom":t=-h.size/2.25}switch(l){case "right":d=1E3;r=0.05;break;case "center":d=r=500}b=s(this,b+0,c+t);n.push('<g_vml_:line from="',-d,' 0" to="',r,' 0.05" ',' coordsize="100 100" coordorigin="0 0"',' filled="',!e,'" stroked="',!!e,'" style="position:absolute;width:1px;height:1px;">');e?S(this,n):T(this,n,{x:-d,y:0},
{x:r,y:h.size});e=f[0][0].toFixed(3)+","+f[1][0].toFixed(3)+","+f[0][1].toFixed(3)+","+f[1][1].toFixed(3)+",0,0";b=k(b.x/q)+","+k(b.y/q);n.push('<g_vml_:skew on="t" matrix="',e,'" ',' offset="',b,'" origin="',d,' 0" />','<g_vml_:path textpathok="true" />','<g_vml_:textpath on="true" string="',N(a),'" style="v-text-align:',l,";font:",N(p),'" /></g_vml_:line>');this.element_.insertAdjacentHTML("beforeEnd",n.join(""))};d.fillText=function(a,b,c,d){this.drawText_(a,b,c,d,!1)};d.strokeText=function(a,
b,c,d){this.drawText_(a,b,c,d,!0)};d.measureText=function(a){this.textMeasureEl_||(this.element_.insertAdjacentHTML("beforeEnd",'<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>'),this.textMeasureEl_=this.element_.lastChild);var b=this.element_.ownerDocument;this.textMeasureEl_.innerHTML="";this.textMeasureEl_.style.font=this.font;this.textMeasureEl_.appendChild(b.createTextNode(a));return{width:this.textMeasureEl_.offsetWidth}};d.clip=function(){};
d.arcTo=function(){};d.createPattern=function(a,b){return new I(a,b)};w.prototype.addColorStop=function(a,b){b=G(b);this.colors_.push({offset:a,color:b.color,alpha:b.alpha})};d=A.prototype=Error();d.INDEX_SIZE_ERR=1;d.DOMSTRING_SIZE_ERR=2;d.HIERARCHY_REQUEST_ERR=3;d.WRONG_DOCUMENT_ERR=4;d.INVALID_CHARACTER_ERR=5;d.NO_DATA_ALLOWED_ERR=6;d.NO_MODIFICATION_ALLOWED_ERR=7;d.NOT_FOUND_ERR=8;d.NOT_SUPPORTED_ERR=9;d.INUSE_ATTRIBUTE_ERR=10;d.INVALID_STATE_ERR=11;d.SYNTAX_ERR=12;d.INVALID_MODIFICATION_ERR=
13;d.NAMESPACE_ERR=14;d.INVALID_ACCESS_ERR=15;d.VALIDATION_ERR=16;d.TYPE_MISMATCH_ERR=17;G_vmlCanvasManager=U;CanvasRenderingContext2D=C;CanvasGradient=w;CanvasPattern=I;DOMException=A}();
