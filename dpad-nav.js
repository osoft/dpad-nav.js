var dPadNav = dPadNav || {};

// Move focus
$(document).on("keydown", function (e) {
    //console.log("Try Move focus: keyup " + e);
    var focusedId = $(':focus').attr('id');
    var focusable = dPadNav.getFocusable(focusedId);
    console.log("src offset: " + focusable.offset.left + ", " + focusable.offset.top);
    switch (e.keyCode) {
        case 39: // Right
            if (focusable.right.id !== "") {
                $('#' + focusable.right.id, dPadNav.scope).focus();
            } else {
                dPadNav.forceNavigate(focusable.offset, 39);
            }
            break;
        case 37: // Left
            if (focusable.left.id !== "") {
                $('#' + focusable.left.id, dPadNav.scope).focus();
            } else {
                dPadNav.forceNavigate(focusable.offset, 37);
            }
            break;
        case 38: // Up
            if (focusable.up.id !== "") {
                $('#' + focusable.up.id, dPadNav.scope).focus();
            } else {
                dPadNav.forceNavigate(focusable.offset, 38);
            }
            break;
        case 40: // Down
            if (focusable.down.id !== "") {
                $('#' + focusable.down.id, dPadNav.scope).focus();
            } else {
                dPadNav.forceNavigate(focusable.offset, 40);
            }
            break;
        default:
            break;
    }
});

dPadNav.focusables = [];

dPadNav.forceNavigate = function(srcOffset, direction) {
    //alert('try force navigate');
    for (var i = 0; i < dPadNav.focusables.length; i++) {
        console.log("focusable[" + i + "]: " + dPadNav.focusables[i].offset.left + ", " + dPadNav.focusables[i].offset.top + " @@@ " + srcOffset.left + "," + srcOffset.top);
        // Up
        if (direction === 38 && dPadNav.focusables[i].offset.top < srcOffset.top) {
            //alert('force navigate!' + dPadNav.focusables[i].id);
            $('#' + dPadNav.focusables[i].id, dPadNav.scope).focus();
            return;
        }
        // Down
        if (direction === 40 && dPadNav.focusables[i].offset.top > srcOffset.top) {
            //alert('force navigate!' + dPadNav.focusables[i].id);
            $('#' + dPadNav.focusables[i].id, dPadNav.scope).focus();
            return;
        }
        // Left
        if (direction === 37 && dPadNav.focusables[i].offset.left < srcOffset.left) {
            //alert('force navigate!' + dPadNav.focusables[i].id);
            $('#' + dPadNav.focusables[i].id, dPadNav.scope).focus();
            return;
        }
        // Right
        if (direction === 39 && dPadNav.focusables[i].offset.left > srcOffset.left) {
            //alert('force navigate!' + dPadNav.focusables[i].id);
            $('#' + dPadNav.focusables[i].id, dPadNav.scope).focus();
            return;
        }
    }
}

dPadNav.getFocusable = function(id) {
    for (var i = 0; i < dPadNav.focusables.length; i++) {
        if (dPadNav.focusables[i].id === id) {
            return dPadNav.focusables[i];
        }
    }
}

/**
 * Scan focusable elements to enable d-pad navigation
 * @param selector This jQuery selector string should include all elements that are focusable.
 *        Default selector will be applied if this parameter is omitted.
 * @param preference Omitted this parameter to make the algorithm more flexible.
 *        Use "column" or "row" to set the preference.
 */
dPadNav.scanFocusables = function(selector, scope, preference) {
    dPadNav.scope = scope;

    dPadNav.focusables = [];
    var strictVertical = true;
    var strictHorizontal = true;
    if (typeof selector === 'undefined') {
        selector = '.focusable:not(".ui-disabled,li")';
    }
    if (typeof preference === "undefined") {
        strictHorizontal = false;
        strictVertical = false;
    } else if (preference === "column") {
        strictHorizontal = false;
    } else if (preference === "row") {
        strictVertical = false;
    }
    console.log("scanFocusables: " + selector);
    $(selector, dPadNav.scope).not(':hidden').each(function (index, element) {
        var offsetVal = $(element).offset();
        var height = $(element).height();
        var width = $(element).width();
        // offsetVal = {left: offsetVal.left + width / 2,
        //     top: offsetVal.top + height / 2};
        //console.log("Scanning: " + $(element).attr("id") + " " + offsetVal.left + "," + offsetVal.top);
        // var uOffsetVal = {left: offsetVal.left, top: offsetVal.top - height / 2};
        // var dOffsetVal = {left: offsetVal.left, top: offsetVal.top + height / 2};
        // var lOffsetVal = {left: offsetVal.left - width / 2, top: offsetVal.top};
        // var rOffsetVal = {left: offsetVal.left + width / 2, top: offsetVal.top};
        var uOffsetVal = {left: offsetVal.left + width / 2, top: offsetVal.top};
        var dOffsetVal = {left: offsetVal.left + width / 2, top: offsetVal.top + height};
        var lOffsetVal = {left: offsetVal.left, top: offsetVal.top + height / 2};
        var rOffsetVal = {left: offsetVal.left + width, top: offsetVal.top + height / 2};
        var focusableToAdd = {
            id: $(element).attr("id"),
            offset: offsetVal,
            offsetU: uOffsetVal,
            offsetD: dOffsetVal,
            offsetL: lOffsetVal,
            offsetR: rOffsetVal,
            left: {id: "", dist: 9999999},
            right: {id: "", dist: 9999999},
            up: {id: "", dist: 9999999},
            down: {id: "", dist: 9999999}
        };

        //alert(offsetVal.left + " " + offsetVal.top);
        for (var i = 0; i < dPadNav.focusables.length; i++) {
            var dx = lOffsetVal.left - dPadNav.focusables[i].offsetR.left;
            var dy = lOffsetVal.top - dPadNav.focusables[i].offsetR.top;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dx >= 0 && (!strictHorizontal || (dy >= -dx && dy <= dx))) {
                // Right
                if (dPadNav.focusables[i].right.dist > dist) {
                    dPadNav.focusables[i].right.id = $(element).attr("id");
                    dPadNav.focusables[i].right.dist = dist;
                }

                if (focusableToAdd.left.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dPadNav.focusables[i].id + "[right] than " + dPadNav.focusables[i].right.id);
                    focusableToAdd.left.id = dPadNav.focusables[i].id;
                    focusableToAdd.left.dist = dist;
                }

            }
            dx = rOffsetVal.left - dPadNav.focusables[i].offsetL.left;
            dy = rOffsetVal.top - dPadNav.focusables[i].offsetL.top;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dx < 0 && (!strictHorizontal || (dy > dx && dy < -dx))) {
                // Left
                if (dPadNav.focusables[i].left.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dPadNav.focusables[i].id + "[left] than " + dPadNav.focusables[i].left.id);
                    dPadNav.focusables[i].left.dist = dist;
                    dPadNav.focusables[i].left.id = $(element).attr("id");
                }

                if (focusableToAdd.right.dist > dist) {
                    focusableToAdd.right.id = dPadNav.focusables[i].id;
                    focusableToAdd.right.dist = dist;
                }
            }

            dx = dOffsetVal.left - dPadNav.focusables[i].offsetU.left;
            dy = dOffsetVal.top - dPadNav.focusables[i].offsetU.top;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dy < 0 && (!strictVertical || (dx > dy && dx < -dy))) {
                // Up
                if (dPadNav.focusables[i].up.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dPadNav.focusables[i].id + "[up] than " + dPadNav.focusables[i].up.id);
                    dPadNav.focusables[i].up.dist = dist;
                    dPadNav.focusables[i].up.id = $(element).attr("id");
                }

                if (focusableToAdd.down.dist > dist) {
                    focusableToAdd.down.id = dPadNav.focusables[i].id;
                    focusableToAdd.down.dist = dist;
                }
            }
            dx = uOffsetVal.left - dPadNav.focusables[i].offsetD.left;
            dy = uOffsetVal.top - dPadNav.focusables[i].offsetD.top;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dy >= 0 && (!strictVertical || (dx >= -dy && dx <= dy))) {
                // Down
                if (dPadNav.focusables[i].down.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dPadNav.focusables[i].id + "[down] than " + dPadNav.focusables[i].down.id);
                    dPadNav.focusables[i].down.dist = dist;
                    dPadNav.focusables[i].down.id = $(element).attr("id");
                }
                if (focusableToAdd.up.dist > dist) {
                    focusableToAdd.up.id = dPadNav.focusables[i].id;
                    focusableToAdd.up.dist = dist;
                }
            }
        }
        dPadNav.focusables.push(focusableToAdd);

    });
}

dPadNav.overrideMovement = function(idSource, direction, idTarget) {
  sourceEl = dPadNav.getFocusable(idSource);
  if (direction === "left") {
    sourceEl.left.id = idTarget;
  } else if (direction === "right") {
    sourceEl.right.id = idTarget;
  } else if (direction === "up") {
    sourceEl.up.id = idTarget;
  } else if (direction === "down") {
    sourceEl.down.id = idTarget;
  }
};

dPadNav.focusDefaultItem = function() {
    if (dPadNav.focusables.length > 0) {
        console.log("Focus: " + dPadNav.focusables[0].id);
        $('#' + dPadNav.focusables[0].id).focus();
    }
}
