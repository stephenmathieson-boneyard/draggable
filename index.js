
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
    if (e.target.nodeName == 'IMG') {
      return e.preventDefault();
    }
    var style = getComputedStyle(e.target, null);
    var dropOffset = {};

    dropOffset.left = parseInt(style.getPropertyValue('left'), 10) - e.clientX;
    dropOffset.right = parseInt(style.getPropertyValue('right'), 10) - (window.innerWidth - e.clientX);
    dropOffset.top = parseInt(style.getPropertyValue('top'), 10) - e.clientY;
    dropOffset.bottom = parseInt(style.getPropertyValue('bottom'), 10) - (window.innerHeight - e.clientY);

    e.dataTransfer.setData(id, JSON.stringify(dropOffset));
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
