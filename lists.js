'use strict';

const lazyFilter = function* (predicate, iterable) {
	for (const item of iterable) {
		if (predicate(item)) {
			yield item;
		}
	}
};

const lazyMap = function* (transformer, iterable) {
	for (const item of iterable) {
		yield transformer(item);
	}
};

const lazyTake = function* (amount, iterable) {
	let i = 0;
	for (const item of iterable) {
		if (i < amount) {
			i++;
			yield item;
		} else {
			break;
		}
	}
};

const filter = (predicate, iterable) =>
	Array.from(iterable).filter(predicate);

const map = (transformer, iterable) =>
	Array.from(iterable).map(transformer);

const reduce = (reducer, iterable, initial) =>
	typeof initial === 'undefined'
		? Array.from(iterable).reduce(reducer)
		: Array.from(iterable).reduce(reducer, initial);

const take = (amount, iterable) =>
	Array.from(iterable).slice(0, amount);

module.exports = {
	filter,
	lazy: {
		filter: lazyFilter,
		map: lazyMap,
		take: lazyTake
	},
	map,
	reduce,
	take
};
