var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var GcHmlt5UISwiper = function() {
  function GcHmlt5UISwiper(options) {
    var _this = this;
    this.config = GcHmlt5UISwiper.mergeSettings(options);
    this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;
    if (this.selector === null) {
      throw new Error('Something wrong with your selector');
    }
    this.resolveSlidesNumber();
    this.selectorWidth = this.selector.offsetWidth;
    this.innerElements = [].slice.call(this.selector.children);
    this.currentSlide = this.config.loop ? this.config.startIndex % this.innerElements.length : Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage));
    this.transformProperty = GcHmlt5UISwiper.webkitOrNot();
    ['touchstartHandler', 'touchendHandler', 'touchmoveHandler', 'mousedownHandler', 'mouseupHandler', 'mouseleaveHandler', 'mousemoveHandler', 'clickHandler'].forEach(function(method) {
      _this[method] = _this[method].bind(_this);
    });
    this.init();
  }
  _createClass(GcHmlt5UISwiper, [{
    key: 'attachEvents',
    value: function attachEvents() {
      if (this.config.draggable) {
        this.pointerDown = false;
        this.drag = {
          startX: 0,
          endX: 0,
          startY: 0,
          letItGo: null,
          preventClick: false
        };
        this.selector.addEventListener('touchstart', this.touchstartHandler, {
          passive: true
        });
        this.selector.addEventListener('touchend', this.touchendHandler);
        this.selector.addEventListener('touchmove', this.touchmoveHandler, {
          passive: true
        });
        this.selector.addEventListener('mousedown', this.mousedownHandler);
        this.selector.addEventListener('mouseup', this.mouseupHandler);
        this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
        this.selector.addEventListener('mousemove', this.mousemoveHandler);
        this.selector.addEventListener('click', this.clickHandler);
      }
    }
  }, {
    key: 'detachEvents',
    value: function detachEvents() {
      this.selector.removeEventListener('touchstart', this.touchstartHandler);
      this.selector.removeEventListener('touchend', this.touchendHandler);
      this.selector.removeEventListener('touchmove', this.touchmoveHandler);
      this.selector.removeEventListener('mousedown', this.mousedownHandler);
      this.selector.removeEventListener('mouseup', this.mouseupHandler);
      this.selector.removeEventListener('mouseleave', this.mouseleaveHandler);
      this.selector.removeEventListener('mousemove', this.mousemoveHandler);
      this.selector.removeEventListener('click', this.clickHandler);
    }
  }, {
    key: 'init',
    value: function init() {
      this.attachEvents();
      this.selector.style.overflow = 'hidden';
      this.selector.style.direction = this.config.rtl ? 'rtl' : 'ltr';
      this.buildSliderFrame();
      this.config.onInit.call(this);
    }
  }, {
    key: 'buildSliderFrame',
    value: function buildSliderFrame() {
      var widthItem = this.selectorWidth / this.perPage;
      var itemsToBuild = this.config.loop ? this.innerElements.length + 2 * this.perPage : this.innerElements.length;
      this.sliderFrame = document.createElement('div');
      this.sliderFrame.style.width = widthItem * itemsToBuild + 'px';
      this.enableTransition();
      if (this.config.draggable) {
        this.selector.style.cursor = '-webkit-grab';
      }
      var docFragment = document.createDocumentFragment();
      if (this.config.loop) {
        for (var i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
          var element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
          docFragment.appendChild(element);
        }
      }
      for (var _i = 0; _i < this.innerElements.length; _i++) {
        var _element = this.buildSliderFrameItem(this.innerElements[_i]);
        docFragment.appendChild(_element);
      }
      if (this.config.loop) {
        for (var _i2 = 0; _i2 < this.perPage; _i2++) {
          var _element2 = this.buildSliderFrameItem(this.innerElements[_i2].cloneNode(true));
          docFragment.appendChild(_element2);
        }
      }
      this.sliderFrame.appendChild(docFragment);
      this.selector.innerHTML = '';
      this.selector.appendChild(this.sliderFrame);
      this.slideToCurrent();
    }
  }, {
    key: 'buildSliderFrameItem',
    value: function buildSliderFrameItem(elm) {
      var elementContainer = document.createElement('div');
      elementContainer.style.cssFloat = this.config.rtl ? 'right' : 'left';
      elementContainer.style.float = this.config.rtl ? 'right' : 'left';
      elementContainer.style.width = (this.config.loop ? 100 / (this.innerElements.length + this.perPage * 2) : 100 / this.innerElements.length) + '%';
      elementContainer.appendChild(elm);
      return elementContainer;
    }
  }, {
    key: 'resolveSlidesNumber',
    value: function resolveSlidesNumber() {
      if (typeof this.config.perPage === 'number') {
        this.perPage = this.config.perPage;
      } else if (_typeof(this.config.perPage) === 'object') {
        this.perPage = 1;
        for (var viewport in this.config.perPage) {
          if (window.innerWidth >= viewport) {
            this.perPage = this.config.perPage[viewport];
          }
        }
      }
    }
  }, {
    key: 'prev',
    value: function prev() {
      var howManySlides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var callback = arguments[1];
      if (this.innerElements.length <= this.perPage) {
        return;
      }
      var beforeChange = this.currentSlide;
      if (this.config.loop) {
        var isNewIndexClone = this.currentSlide - howManySlides < 0;
        if (isNewIndexClone) {
          this.disableTransition();
          var mirrorSlideIndex = this.currentSlide + this.innerElements.length;
          var mirrorSlideIndexOffset = this.perPage;
          var moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
          var offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
          var dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;
          this.sliderFrame.style[this.transformProperty] = 'translate3d(' + (offset + dragDistance) + 'px, 0, 0)';
          this.currentSlide = mirrorSlideIndex - howManySlides;
        } else {
          this.currentSlide = this.currentSlide - howManySlides;
        }
      } else {
        this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
      }
      if (beforeChange !== this.currentSlide) {
        this.slideToCurrent(this.config.loop);
        this.config.onChange.call(this);
        if (callback) {
          callback.call(this);
        }
      }
    }
  }, {
    key: 'next',
    value: function next() {
      var howManySlides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var callback = arguments[1];
      if (this.innerElements.length <= this.perPage) {
        return;
      }
      var beforeChange = this.currentSlide;
      if (this.config.loop) {
        var isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage;
        if (isNewIndexClone) {
          this.disableTransition();
          var mirrorSlideIndex = this.currentSlide - this.innerElements.length;
          var mirrorSlideIndexOffset = this.perPage;
          var moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
          var offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
          var dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;
          this.sliderFrame.style[this.transformProperty] = 'translate3d(' + (offset + dragDistance) + 'px, 0, 0)';
          this.currentSlide = mirrorSlideIndex + howManySlides;
        } else {
          this.currentSlide = this.currentSlide + howManySlides;
        }
      } else {
        this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
      }
      if (beforeChange !== this.currentSlide) {
        this.slideToCurrent(this.config.loop);
        this.config.onChange.call(this);
        if (callback) {
          callback.call(this);
        }
      }
    }
  }, {
    key: 'disableTransition',
    value: function disableTransition() {
      this.sliderFrame.style.webkitTransition = 'all 0ms ' + this.config.easing;
      this.sliderFrame.style.transition = 'all 0ms ' + this.config.easing;
    }
  }, {
    key: 'enableTransition',
    value: function enableTransition() {
      this.sliderFrame.style.webkitTransition = 'all ' + this.config.duration + 'ms ' + this.config.easing;
      this.sliderFrame.style.transition = 'all ' + this.config.duration + 'ms ' + this.config.easing;
    }
  }, {
    key: 'goTo',
    value: function goTo(index, callback) {
      if (this.innerElements.length <= this.perPage) {
        return;
      }
      var beforeChange = this.currentSlide;
      this.currentSlide = this.config.loop ? index % this.innerElements.length : Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
      if (beforeChange !== this.currentSlide) {
        this.slideToCurrent();
        this.config.onChange.call(this);
        if (callback) {
          callback.call(this);
        }
      }
    }
  }, {
    key: 'slideToCurrent',
    value: function slideToCurrent(enableTransition) {
      var _this2 = this;
      var currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
      var offset = (this.config.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage);
      if (enableTransition) {
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            _this2.enableTransition();
            _this2.sliderFrame.style[_this2.transformProperty] = 'translate3d(' + offset + 'px, 0, 0)';
          });
        });
      } else {
        this.sliderFrame.style[this.transformProperty] = 'translate3d(' + offset + 'px, 0, 0)';
      }
    }
  }, {
    key: 'updateAfterDrag',
    value: function updateAfterDrag() {
      var movement = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
      var movementDistance = Math.abs(movement);
      var howManySliderToSlide = this.config.multipleDrag ? Math.ceil(movementDistance / (this.selectorWidth / this.perPage)) : 1;
      var slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0;
      var slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage;
      if (movement > 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
        this.prev(howManySliderToSlide);
      } else if (movement < 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
        this.next(howManySliderToSlide);
      }
      this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
    }
  },{
    key: 'clearDrag',
    value: function clearDrag() {
      this.drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        letItGo: null,
        preventClick: this.drag.preventClick
      };
    }
  }, {
    key: 'touchstartHandler',
    value: function touchstartHandler(e) {
      var ignoreGcHmlt5UISwiper = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
      if (ignoreGcHmlt5UISwiper) {
        return;
      }
      e.stopPropagation();
      this.pointerDown = true;
      this.drag.startX = e.touches[0].pageX;
      this.drag.startY = e.touches[0].pageY;
    }
  }, {
    key: 'touchendHandler',
    value: function touchendHandler(e) {
      e.stopPropagation();
      this.pointerDown = false;
      this.enableTransition();
      if (this.drag.endX) {
        this.updateAfterDrag();
      }
      this.clearDrag();
    }
  }, {
    key: 'touchmoveHandler',
    value: function touchmoveHandler(e) {
      e.stopPropagation();
      if (this.drag.letItGo === null) {
        this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
      }
      if (this.pointerDown && this.drag.letItGo) {
        e.preventDefault();
        this.drag.endX = e.touches[0].pageX;
        this.sliderFrame.style.webkitTransition = 'all 0ms ' + this.config.easing;
        this.sliderFrame.style.transition = 'all 0ms ' + this.config.easing;
        var currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
        var currentOffset = currentSlide * (this.selectorWidth / this.perPage);
        var dragOffset = this.drag.endX - this.drag.startX;
        var offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
        this.sliderFrame.style[this.transformProperty] = 'translate3d(' + (this.config.rtl ? 1 : -1) * offset + 'px, 0, 0)';
      }
    }
  }, {
    key: 'mousedownHandler',
    value: function mousedownHandler(e) {
      var ignoreGcHmlt5UISwiper = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
      if (ignoreGcHmlt5UISwiper) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.pointerDown = true;
      this.drag.startX = e.pageX;
    }
  }, {
    key: 'mouseupHandler',
    value: function mouseupHandler(e) {
      e.stopPropagation();
      this.pointerDown = false;
      this.selector.style.cursor = '-webkit-grab';
      this.enableTransition();
      if (this.drag.endX) {
        this.updateAfterDrag();
      }
      this.clearDrag();
    }
  }, {
    key: 'mousemoveHandler',
    value: function mousemoveHandler(e) {
      e.preventDefault();
      if (this.pointerDown) {
        if (e.target.nodeName === 'A') {
          this.drag.preventClick = true;
        }
        this.drag.endX = e.pageX;
        this.selector.style.cursor = '-webkit-grabbing';
        this.sliderFrame.style.webkitTransition = 'all 0ms ' + this.config.easing;
        this.sliderFrame.style.transition = 'all 0ms ' + this.config.easing;
        var currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
        var currentOffset = currentSlide * (this.selectorWidth / this.perPage);
        var dragOffset = this.drag.endX - this.drag.startX;
        var offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
        this.sliderFrame.style[this.transformProperty] = 'translate3d(' + (this.config.rtl ? 1 : -1) * offset + 'px, 0, 0)';
      }
    }
  }, {
    key: 'mouseleaveHandler',
    value: function mouseleaveHandler(e) {
      if (this.pointerDown) {
        this.pointerDown = false;
        this.selector.style.cursor = '-webkit-grab';
        this.drag.endX = e.pageX;
        this.drag.preventClick = false;
        this.enableTransition();
        this.updateAfterDrag();
        this.clearDrag();
      }
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler(e) {
      // prevent browsers from folowing the link
      if (this.drag.preventClick) {
        e.preventDefault();
      }
      this.drag.preventClick = false;
    }
  }, {
    key: 'remove',
    value: function remove(index, callback) {
      if (index < 0 || index >= this.innerElements.length) {
        throw new Error('Item to remove doesn\'t exist 😭');
      }
      // 1. Item with lower index than currenSlide is removed.
      var lowerIndex = index < this.currentSlide;
      var lastItem = this.currentSlide + this.perPage - 1 === index;
      if (lowerIndex || lastItem) {
        this.currentSlide--;
      }
      this.innerElements.splice(index, 1);
      this.buildSliderFrame();
      if (callback) {
        callback.call(this);
      }
    }
  }, {
    key: 'insert',
    value: function insert(item, index, callback) {
      if (index < 0 || index > this.innerElements.length + 1) {
        throw new Error('Unable to inset it at this index 😭');
      }
      if (this.innerElements.indexOf(item) !== -1) {
        throw new Error('The same item in a carousel? Really? Nope 😭');
      }
      var shouldItShift = index <= this.currentSlide > 0 && this.innerElements.length;
      this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide;
      this.innerElements.splice(index, 0, item);
      this.buildSliderFrame();
      if (callback) {
        callback.call(this);
      }
    }
  }, {
    key: 'prepend',
    value: function prepend(item, callback) {
      this.insert(item, 0);
      if (callback) {
        callback.call(this);
      }
    }
  }, {
    key: 'append',
    value: function append(item, callback) {
      this.insert(item, this.innerElements.length + 1);
      if (callback) {
        callback.call(this);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var restoreMarkup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var callback = arguments[1];
      this.detachEvents();
      this.selector.style.cursor = 'auto';
      if (restoreMarkup) {
        var slides = document.createDocumentFragment();
        for (var i = 0; i < this.innerElements.length; i++) {
          slides.appendChild(this.innerElements[i]);
        }
        this.selector.innerHTML = '';
        this.selector.appendChild(slides);
        this.selector.removeAttribute('style');
      }
      if (callback) {
        callback.call(this);
      }
    }
  }], [{
    key: 'mergeSettings',
    value: function mergeSettings(options) {
      var settings = {
        selector: '.gc-html5-ui-swiper-container',
        duration: 200,
        easing: 'ease-out',
        perPage: 1,
        startIndex: 0,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
        loop: false,
        rtl: false,
        onInit: function onInit() {},
        onChange: function onChange() {}
      };
      var userSttings = options;
      for (var attrname in userSttings) {
        settings[attrname] = userSttings[attrname];
      }
      return settings;
    }
  }, {
    key: 'webkitOrNot',
    value: function webkitOrNot() {
      var style = document.documentElement.style;
      if (typeof style.transform === 'string') {
        return 'transform';
      }
      return 'WebkitTransform';
    }
  }]);
  return GcHmlt5UISwiper;
}();