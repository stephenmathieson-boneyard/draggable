
/**
 * Module dependencies.
 */

var uuid = require('uuid');

module.exports = draggable;

/**
 * Make `element` draggable within `container`,
 * defaulting to the body.
 *
 * Uses `top` and `left` positions by default.
 * Uses `bottom` and `right` in lieu of their
 * counterparts.
 *
 * @api public
 * @param {HTMLElement} element
 * @param {HTMLElement} [container]
 */

function draggable(element, container) {
  container = container || document.body;
  var id = uuid();

  element.classList.add('draggable');
  element.draggable = true;

  element.addEventListener('dragstart', ondragstart);
  container.addEventListener('dragover', ondragover);
  container.addEventListener('drop', ondrop);

  function ondragstart(e) {
    var o = offset(e);
    e.dataTransfer.setData(id, JSON.stringify(o));
  }

  function ondragover(e) {
    e.preventDefault();
  }

  function ondrop(e) {
    var data = e.dataTransfer.getData(id);
    if (!data) return;
    data = JSON.parse(data);

    if (data.left) {
      element.style.left = (e.clientX + data.left) + 'px';
    } else {
      element.style.right = ((window.innerWidth - e.clientX) + data.right) + 'px';
    }

    if (data.top) {
      element.style.top = (e.clientY + data.top) + 'px';
    } else {
      element.style.bottom = ((window.innerHeight - e.clientY) + data.bottom) + 'px';
    }

    e.preventDefault();
  }
}

/**
 * Get the offset for the given `e`.
 *
 * @api private
 * @param {Event} e
 * @return {Object}
 */

function offset(e) {
  var style = getComputedStyle(e.target, null);
  return {
    left: parseValue(style, 'left') - e.clientX,
    right: parseValue(style, 'right') - (window.innerWidth - e.clientX),
    top: parseValue(style, 'top') - e.clientY,
    bottom: parseValue(style, 'bottom') - (window.innerHeight - e.clientY)
  };
}

/**
 * Get the value of the CSS property `name` as an int.
 */

function parseValue(style, name) {
  return parseInt(style.getPropertyValue(name), 10);
}
