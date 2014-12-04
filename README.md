dpad-nav
===========

a keyboard(dpad) web page navigation library for <a href="http://jquery.com">jQuery</a>/<a href="http://zeptojs.com">Zepto</a>.

##Usage
##### Include keynavigator.js after having included jQuery or Zepto:
```html
<script src="jquery.js"></script>
<script src="keynavigator.js"></script>
```
##### Make sure 
* Elements can gain focus
* Elements are marked with class "focusable"
* Each element has a unique id
```html
  <button id="btn1" class="focusable">Button 1</button>
  <div id="div1" tabindex="-1" class="focusable"></div>
```
##### Start dpad-nav
```javascript
  $(document).on("ready", function() {
    dPadNav.scanFocusables();
    dPadNav.focusDefaultItem(); // Make sure one of the elements has focus
  });
```

