/**
 * Convert to array
 */

/**
 * Convert to array
 * @param  {Object} args Arguments object
 * @return {Array}      An array
 */
var toArray = function (args) {
  var length = args.length;
  var arr = new Array(length);
  var i = 0;

  for (i = 0; i < length; i++) {
    arr[i] = args[i];
  }
  return arr;
};

module.exports = toArray;