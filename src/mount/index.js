// https://github.com/reactjs/react-rails/blob/v1.8.2/lib/assets/javascripts/react_ujs_mount.js

import React from 'react';
import ReactDOM from 'react-dom';

// jQuery is optional. Use it to support legacy browsers.
const $ = (typeof global.jQuery !== 'undefined') && global.jQuery;
const document = global.document;

// This attribute holds the name of component which should be mounted
// example: `data-react-class="MyApp.Items.EditForm"`
const CLASS_NAME_ATTR = 'data-react-class';

// This attribute holds JSON stringified props for initializing the component
// example: `data-react-props="{\"item\": { \"id\": 1, \"name\": \"My Item\"} }"`
const PROPS_ATTR = 'data-react-props';

// helper method for the mount and unmount methods to find the
// `data-react-class` DOM elements
function findDOMNodes(searchSelector) {
  // we will use fully qualified paths as we do not bind the callbacks
  var selector, parent;

  switch (typeof searchSelector) {
    case 'undefined':
      selector = '[' + CLASS_NAME_ATTR + ']';
      parent = document;
      break;
    case 'object':
      selector = '[' + CLASS_NAME_ATTR + ']';
      parent = searchSelector;
      break;
    case 'string':
      selector = searchSelector + '[' + CLASS_NAME_ATTR + '], ' +
                 searchSelector + ' [' + CLASS_NAME_ATTR + ']';
      parent = document;
      break
    default:
      break;
  }

  if ($) {
    return $(selector, parent);
  } else {
    return parent.querySelectorAll(selector);
  }
}

// Get the constructor for a className
function getConstructor(className) {
  // Assume className is simple and can be found at top-level (window).
  // Fallback to eval to handle cases like 'My.React.ComponentName'.
  // Also, try to gracefully import Babel 6 style default exports
  //
  var constructor;

  // Try to access the class globally first
  constructor = global[className];

  // If that didn't work, try eval
  if (!constructor) {
    constructor = eval.call(global, className);
  }

  // Lastly, if there is a default attribute try that
  if (constructor && constructor.default) {
    constructor = constructor.default;
  }

  return constructor;
}

// Within `searchSelector`, find nodes which should have React components
// inside them, and mount them with their props.
export function mountComponents(searchSelector) {
  if (!document) {
    return;
  }

  const nodes = findDOMNodes(searchSelector);

  nodes.forEach(node => {
    const className = node.getAttribute(CLASS_NAME_ATTR);
    const constructor = getConstructor(className);
    const propsJson = node.getAttribute(PROPS_ATTR);
    const props = propsJson && JSON.parse(propsJson);

    if (typeof(constructor) === "undefined") {
      var message = "Cannot find component: '" + className + "'"
      /* eslint-disable no-console  */
      if (console && console.log) {
        console.log("%c[react-rails] %c" + message + " for element", "font-weight: bold", "", node)
      }
      /* eslint-enable no-console */
      var error = new Error(message + ". Make sure your component is globally available to render.")
      throw error
    } else {
      ReactDOM.render(React.createElement(constructor, props), node);
    }
  });
}

// Within `searchSelector`, find nodes which have React components
// inside them, and unmount those components.
export function unmountComponents(searchSelector) {
  var nodes = findDOMNodes(searchSelector);

  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];

    ReactDOM.unmountComponentAtNode(node);
  }
}

export default mountComponents;
