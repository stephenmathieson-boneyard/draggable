
/**
 * Module dependencies.
 */

var uuid = require('uuid');

module.exports = draggable;

/**
 * Make `element` draggable within `container`,
 * defaulting to the body.
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
    var style = getComputedStyle(e.target, null);
    var left = parseInt(style.getPropertyValue('left'), 10) - e.clientX;
    var top = parseInt(style.getPropertyValue('top'), 10) - e.clientY;
    e.dataTransfer.setData(id, JSON.stringify({
      left: left,
      top: top
    }));
  }

  function ondragover(e) {
    e.preventDefault();
  }

  function ondrop(e) {
    var data = e.dataTransfer.getData(id);
    if (!data) return;
    data = JSON.parse(data);

    element.style.left = (e.clientX + data.left) + 'px';
    element.style.top = (e.clientY + data.top) + 'px';

    // TODO maybe emit an event?
    e.preventDefault();
  }
}
