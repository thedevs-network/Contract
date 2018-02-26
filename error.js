'use strict';

const err = (f, ...args) => {
	try {
		return [ null, f(...args) ];
	} catch (e) {
		return [ e ];
	}
};

module.exports = err;
