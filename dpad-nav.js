// Move focus
$(document).on("keyup", "[data-role='page'].demo-page", function (e) {
    //console.log("Try Move focus: keyup " + e);
    var focusedId = $(':focus').attr('id');
    var focusable = getFocusable(focusedId);
    console.log("src offset: " + focusable.offset.left + ", " + focusable.offset.top);
    switch (e.keyCode) {
        case 39: // Right
            if (focusable.right.id !== "") {
                $('#' + focusable.right.id, currentPage).focus();
            } else {
                forceNavigate(focusable.offset, 39);
            }
            break;
        case 37: // Left
            if (focusable.left.id !== "") {
                $('#' + focusable.left.id, currentPage).focus();
            } else {
                forceNavigate(focusable.offset, 37);
            }
            break;
        case 38: // Up
            if (focusable.up.id !== "") {
                $('#' + focusable.up.id, currentPage).focus();
            } else {
                forceNavigate(focusable.offset, 38);
            }
            break;
        case 40: // Down
            if (focusable.down.id !== "") {
                $('#' + focusable.down.id, currentPage).focus();
            } else {
                forceNavigate(focusable.offset, 40);
            }
            break;
        default:
            break;
    }
});

var focusables = [];

function forceNavigate(srcOffset, direction) {
    //alert('try force navigate');
    for (var i = 0; i < focusables.length; i++) {
        console.log("focusable[" + i + "]: " + focusables[i].offset.left + ", " + focusables[i].offset.top + " @@@ " + srcOffset.left + "," + srcOffset.top);
        // Up
        if (direction === 38 && focusables[i].offset.top < srcOffset.top) {
            //alert('force navigate!' + focusables[i].id);
            $('#' + focusables[i].id, currentPage).focus();
            return;
        }
        // Down
        if (direction === 40 && focusables[i].offset.top > srcOffset.top) {
            //alert('force navigate!' + focusables[i].id);
            $('#' + focusables[i].id, currentPage).focus();
            return;
        }
        // Left
        if (direction === 37 && focusables[i].offset.left < srcOffset.left) {
            //alert('force navigate!' + focusables[i].id);
            $('#' + focusables[i].id, currentPage).focus();
            return;
        }
        // Right
        if (direction === 39 && focusables[i].offset.left > srcOffset.left) {
            //alert('force navigate!' + focusables[i].id);
            $('#' + focusables[i].id, currentPage).focus();
            return;
        }
    }
}

function getFocusable(id) {
    for (var i = 0; i < focusables.length; i++) {
        if (focusables[i].id === id) {
            return focusables[i];
        }
    }
}

function scanFocusables(selector) {
    focusables = [];
    if (selector === undefined) {
        selector = '.focusable:not(".ui-disabled,li")';
    }
    console.log("scanFocusables: " + selector);
    $(selector, currentPage).not(':hidden').each(function (index, element) {
        var offsetVal = $(element).offset();
        var focusableToAdd = {
            id: $(element).attr("id"),
            offset: offsetVal,
            left: {id: "", dist: 9999999},
            right: {id: "", dist: 9999999},
            up: {id: "", dist: 9999999},
            down: {id: "", dist: 9999999}
        };

        //alert(offsetVal.left + " " + offsetVal.top);
        for (var i = 0; i < focusables.length; i++) {
            var dx = offsetVal.left - focusables[i].offset.left;
            var dy = offsetVal.top - focusables[i].offset.top;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dx >= 0 && dy >= -dx && dy <= dx) {
                // Right
                if (focusables[i].right.dist > dist) {
                    focusables[i].right.id = $(element).attr("id");
                    focusables[i].right.dist = dist;
                }

                if (focusableToAdd.left.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + focusables[i].id + "[right] than " + focusables[i].right.id);
                    focusableToAdd.left.id = focusables[i].id;
                    focusableToAdd.left.dist = dist;
                }

            } else if (dx < 0 && dy > dx && dy < -dx) {
                // Left
                if (focusables[i].left.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + focusables[i].id + "[left] than " + focusables[i].left.id);
                    focusables[i].left.dist = dist;
                    focusables[i].left.id = $(element).attr("id");
                }

                if (focusableToAdd.right.dist > dist) {
                    focusableToAdd.right.id = focusables[i].id;
                    focusableToAdd.right.dist = dist;
                }
            } else if (dy < 0 && dx > dy && dx < -dy) {
                // Up
                if (focusables[i].up.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + focusables[i].id + "[up] than " + focusables[i].up.id);
                    focusables[i].up.dist = dist;
                    focusables[i].up.id = $(element).attr("id");
                }

                if (focusableToAdd.down.dist > dist) {
                    focusableToAdd.down.id = focusables[i].id;
                    focusableToAdd.down.dist = dist;
                }
            } else if (dy >= 0 && dx >= -dy && dx <= dy) {
                // Down
                if (focusables[i].down.dist > dist) {
                    //console.log($(element).attr("id") + " is closer to " + focusables[i].id + "[down] than " + focusables[i].down.id);
                    focusables[i].down.dist = dist;
                    focusables[i].down.id = $(element).attr("id");
                }
                if (focusableToAdd.up.dist > dist) {
                    focusableToAdd.up.id = focusables[i].id;
                    focusableToAdd.up.dist = dist;
                }
            }
        }
        focusables.push(focusableToAdd);

    });
}

function focusDefaultItem() {
    if (focusables.length > 0) {
        console.log("Focus: " + focusables[0].id);
        $('#' + focusables[0].id).focus();
    }
}