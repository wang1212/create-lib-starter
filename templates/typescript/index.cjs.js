'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/bundle.cjs.min.js');
} else {
  module.exports = require('./build/bundle.cjs.js');
}
