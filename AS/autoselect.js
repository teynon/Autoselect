/* 
 * jQuery Autoselect Plugin created by Thomas Eynon
 * 
 ***************************************************
 * USAGE
 ***************************************************
 *
 *$('myInputBox').Autosuggest( params, callbackFunction );
 *
 *Example:
 *$('input').Autosuggest({ 'url' : 'myPage.php' }, function(text, value) { alert(text . " | " . value); });
 * 
 */
(function($) {
    $.fn.Autoselect = function(properties, fnc) {
        var _this = this;
        this.properties = properties;
        this.searchTimeout = null;
        this.window = null;
        this.resultBox = null;
        this.fnc = fnc;
        
        this.init = function() {
            if (!this.properties['results']) this.properties['results'] = {};
        }
        
        this.search = function() {
            // If a value exists, search for it.
            if ($(_this).val()) {
                if (_this.properties['url']) {
                    _this.ajax_search(_this.properties['url']);
                }
            }
        }
        
        this.ajax_search = function(url) {
            var value = $(_this).val();
            $.getJSON(url, { 'search' : value }, function(data) {
                if (data['results']) {
                    _this.properties['results'] = data['results'];
                    _this.prepareResults();
                    _this.open();
                }
            });
        }
        
        this.prepareResults = function() {
            var html = new Array();
            var display = null;
            var value = null;
            for (var i in _this.properties['results']) {
                display = null;
                value = null;
                
                if (_this.properties['results'][i] instanceof Array) {
                    display = _this.properties['results'][i][0];
                    if (_this.properties['results'][i][1]) value = _this.properties['results'][i][1];
                }
                else display = _this.properties['results'][i];
                    
                if (value == null) value = display;
                
                
                html[i] = $("<div class='Autoselect_value'>" + display + "</div>")
                    .click(function() {
                        _this.selectValue(display, value);
                    });
            }
            
            var initWindow = false;
            if (_this.window == null) {
                _this.window = $("<div class='Autoselect_window'></div>").hide()
                    .css({ 'position' : 'absolute', 'left' : $(_this).offset().left, 'top' : _this.offset().top + _this.outerHeight() });
                if (_this.properties['width'] && _this.properties['width'] == 'match') 
                    _this.window.css({ 'width' : _this.outerWidth() });
                initWindow = true;
            }
            else _this.window.empty();
            
            for (var i in html) {
                _this.window.append(html[i]);
            }
            
            if (initWindow) $('body').append(_this.window);
        }
        
        this.selectValue = function(display, value) {
            //alert('You chose ' + display + ' with a value of ' + value);
            this.val(value);
            
            var append = false;
            var css = {};
            
            // Draw replacement box
            if (this.resultBox == null) {
                append = true;
                css = this.copyCSS(this);
            
                this.resultBox = $('<div>' + display + '</div>')
                    .css(css)
                    .click(function() { _this.restore(); });
            }
            
            
            var defaults = { 'border' : '1px solid #000000', 'position' : 'absolute', 'left' : this.offset().left, 'top' : this.offset().top, 'width' : this.outerWidth(), 'height' : this.outerHeight() };
            css = $.extend(defaults, css);
            
            this.resultBox
                .css(css)
                .click(function() { _this.restore(); });
            
            // Hide the input.
            if (append) $('body').append(this.resultBox);
            
            this.hide();
            this.resultBox.show();
            
            this.close();
            
            if (typeof(this.fnc) == 'function') this.fnc(display, value);
        }
        
        this.restore = function() {
            _this.show();
            _this.val(_this.resultBox.text());
            _this.resultBox.hide();
            _this.select();
        }
        
        this.open = function() {
            if (_this.window != null) {
                _this.window.show();
            }
        }
        
        this.close = function() {
            if (_this.window != null) {
                _this.window.hide();
            }
        }
        
        this.copyCSS = function(object) {
            var DOMObject = object.get(0);
            var css = {};
            
            for (var i in DOMObject.style) {
                if (DOMObject.style[i] != '' && DOMObject.style[i] != null && DOMObject.style[i] != 'null' && typeof(DOMObject.style[i]) != 'function') {
                    css[i] = DOMObject.style[i];
                }
            }
            
            return css;
        }
        
        $(this).bind('keypress', function() {
            if (_this.searchTimeout) clearTimeout(_this.searchTimeout);
            
            _this.searchTimeout = setTimeout(_this.search, 200);
            
            return true;
        });
    }
})( jQuery );