var dpadNavCurrentScope;

// Move focus
$(document).on("keyup", function (e) {
    //console.log("Try Move focus: keyup " + e);
    var focusedId = $(':focus').attr('id');
    var focusable = getFocusable(focusedId);
    console.log("src offset: " + focusable.offset.left + ", " + focusable.offset.top);
    switch (e.keyCode) {
        case 39: // Right
            if (focusable.right.id !== "") {
                $('#' + focusable.right.id, dpadNavCurrentScope).focus();
            } else {
                forceNavigate(focusable.offset, 39);
            }
            break;
        case 37: // Left
            if (focusable.left.id !== "") {
                $('#' + focusable.left.id, dpadNavCurrentScope).focus();
            } else {
                forceNavigate(focusable.offset, 37);
            }
            break;
        case 38: // Up
            if (focusable.up.id !== "") {
                $('#' + focusable.up.id, dpadNavCurrentScope).focus();
            } else {
                forceNavigate(focusable.offset, 38);
            }
            break;
        case 40: // Down
            if (focusable.down.id !== "") {
                $('#' + focusable.down.id, dpadNavCurrentScope).focus();
            } else {
                forceNavigate(focusable.offset, 40);
            }
            break;
        default:
            break;
    }
});

var dpadNavFocusables = [];

function forceNavigate(srcOffset, direction) {
    //alert('try force navigate');
    for (var i = 0; i < dpadNavFocusables.length; i++) {
        console.log("focusable[" + i + "]: " + dpadNavFocusables[i].offset.left + ", " + dpadNavFocusables[i].offset.top + " @@@ " + srcOffset.left + "," + srcOffset.top);
        // Up
        if (direction === 38 && dpadNavFocusables[i].offset.top < srcOffset.top) {
            //alert('force navigate!' + dpadNavFocusables[i].id);
            $('#' + dpadNavFocusables[i].id, dpadNavCurrentScope).focus();
            return;
        }
        // Down
        if (direction === 40 && dpadNavFocusables[i].offset.top > srcOffset.top) {
            //alert('force navigate!' + dpadNavFocusables[i].id);
            $('#' + dpadNavFocusables[i].id, dpadNavCurrentScope).focus();
            return;
        }
        // Left
        if (direction === 37 && dpadNavFocusables[i].offset.left < srcOffset.left) {
            //alert('force navigate!' + dpadNavFocusables[i].id);
            $('#' + dpadNavFocusables[i].id, dpadNavCurrentScope).focus();
            return;
        }
        // Right
        if (direction === 39 && dpadNavFocusables[i].offset.left > srcOffset.left) {
            //alert('force navigate!' + dpadNavFocusables[i].id);
            $('#' + dpadNavFocusables[i].id, dpadNavCurrentScope).focus();
            return;
        }
    }
}

function getFocusable(id) {
    for (var i = 0; i < dpadNavFocusables.length; i++) {
        if (dpadNavFocusables[i].id === id) {
            return dpadNavFocusables[i];
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
function scanFocusables(selector, scope, preference) {
    dpadNavCurrentScope = scope;

    dpadNavFocusables = [];
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
    $(selector, dpadNavCurrentScope).not(':hidden').each(function (index, element) {
        var offsetVal = $(element).offset();
        var height = $(element).height();
        var width = $(element).width();
        offsetVal = {left: offsetVal.left + width / 2,
            top: offsetVal.top + height / 2};
        //console.log("Scanning: " + $(element).attr("id") + " " + offsetVal.left + "," + offsetVal.top);
        var uOffsetVal = {left: offsetVal.left, top: offsetVal.top - height / 2};
        var dOffsetVal = {left: offsetVal.left, top: offsetVal.top + height / 2};
        var lOffsetVal = {left: offsetVal.left - width / 2, top: offsetVal.top};
        var rOffsetVal = {left: offsetVal.left + width / 2, top: offsetVal.top};
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
        for (var i = 0; i < dpadNavFocusables.length; i++) {
            var dx = lOffsetVal.left - dpadNavFocusables[i].offsetR.left;
            var dy = lOffsetVal.top - dpadNavFocusables[i].offsetR.top;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dx >= 0 && (!strictHorizontal || (dy >= -dx && dy <= dx))) {
                // Right
                if (dpadNavFocusables[i].right.dist > dist) {
                    dpadNavFocusables[i].right.id = $(element).attr("id");
                    dpadNavFocusables[i].right.dist = dist;
                }

                if (focusableToAdd.left.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dpadNavFocusables[i].id + "[right] than " + dpadNavFocusables[i].right.id);
                    focusableToAdd.left.id = dpadNavFocusables[i].id;
                    focusableToAdd.left.dist = dist;
                }

            }
            dx = rOffsetVal.left - dpadNavFocusables[i].offsetL.left;
            dy = rOffsetVal.top - dpadNavFocusables[i].offsetL.top;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dx < 0 && (!strictHorizontal || (dy > dx && dy < -dx))) {
                // Left
                if (dpadNavFocusables[i].left.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dpadNavFocusables[i].id + "[left] than " + dpadNavFocusables[i].left.id);
                    dpadNavFocusables[i].left.dist = dist;
                    dpadNavFocusables[i].left.id = $(element).attr("id");
                }

                if (focusableToAdd.right.dist > dist) {
                    focusableToAdd.right.id = dpadNavFocusables[i].id;
                    focusableToAdd.right.dist = dist;
                }
            }

            dx = dOffsetVal.left - dpadNavFocusables[i].offsetU.left;
            dy = dOffsetVal.top - dpadNavFocusables[i].offsetU.top;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dy < 0 && (!strictVertical || (dx > dy && dx < -dy))) {
                // Up
                if (dpadNavFocusables[i].up.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dpadNavFocusables[i].id + "[up] than " + dpadNavFocusables[i].up.id);
                    dpadNavFocusables[i].up.dist = dist;
                    dpadNavFocusables[i].up.id = $(element).attr("id");
                }

                if (focusableToAdd.down.dist > dist) {
                    focusableToAdd.down.id = dpadNavFocusables[i].id;
                    focusableToAdd.down.dist = dist;
                }
            }
            dx = uOffsetVal.left - dpadNavFocusables[i].offsetD.left;
            dy = uOffsetVal.top - dpadNavFocusables[i].offsetD.top;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dy >= 0 && (!strictVertical || (dx >= -dy && dx <= dy))) {
                // Down
                if (dpadNavFocusables[i].down.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + dpadNavFocusables[i].id + "[down] than " + dpadNavFocusables[i].down.id);
                    dpadNavFocusables[i].down.dist = dist;
                    dpadNavFocusables[i].down.id = $(element).attr("id");
                }
                if (focusableToAdd.up.dist > dist) {
                    focusableToAdd.up.id = dpadNavFocusables[i].id;
                    focusableToAdd.up.dist = dist;
                }
            }
        }
        dpadNavFocusables.push(focusableToAdd);

    });
}

function focusDefaultItem() {
    if (dpadNavFocusables.length > 0) {
        console.log("Focus: " + dpadNavFocusables[0].id);
        $('#' + dpadNavFocusables[0].id).focus();
    }
}