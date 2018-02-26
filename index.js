'use strict';

const { inspect } = require('util');
const { custom: inspectSymbol } = inspect;

const err = require('./error');
const { identity } = require('./symbols');

const {
	filter,
	lazy: {
		filter: lazyFilter,
		map: lazyMap,
		take: lazyTake
	},
	map,
	reduce,
	take
} = require('./lists');

const isContract = value =>
	typeof value === 'object' &&
	typeof value[identity] === 'boolean' &&
	value[identity] === true;

const contractString = () => 'Contract';

const Contract = (f, ...args) => {
	if (isContract(f) || f instanceof Promise) {
		return f;
	}
	if (typeof f !== 'function') {
		return resolve(f);
	}
	const [ e, res ] = err(f, ...args);
	if (e) {
		return reject(e);
	}
	if (isContract(res) || res instanceof Promise) {
		return res;
	}
	return resolve(res);
};


const resolve = value =>
	({
		[identity]: true,
		[Symbol.toStringTag]: contractString,
		[inspectSymbol]: (depth, opts) =>
			'Contract { ' +
			inspect(value, { ...opts, depth }) +
			' }',
		catch: f => resolve(value),
		filter: f => Contract(filter, f, value),
		lazy: {
			filter: f => Contract(lazyFilter, f, value),
			map: f => Contract(lazyMap, f, value),
			take: amount => Contract(lazyTake, amount, value)
		},
		map: f => Contract(map, f, value),
		reduce: (f, initial) => Contract(reduce, f, value, initial),
		spread: f => Contract(f, ...value),
		take: amount => Contract(take, amount, value),
		tap: f => (f(value), resolve(value)),
		then: resolver =>
			Contract(resolver, value),
		toArray: () => Contract(Array.from, value),
		toString: () => Contract(String, value)
	});

const reject = value => {
	const rejectValue = () => reject(value);
	return {
		[identity]: true,
		[Symbol.toStringTag]: contractString,
		[inspectSymbol]: (depth, opts) =>
			'Contract { ' +
			opts.stylize('<rejected>', 'undefined') +
			' ' +
			inspect(value, { ...opts, depth }) +
			' }',
		catch: f => Contract(f, value),
		filter: rejectValue,
		lazy: {
			filter: rejectValue,
			map: rejectValue,
			take: rejectValue
		},
		map: rejectValue,
		reduce: rejectValue,
		spread: rejectValue,
		take: rejectValue,
		tap: rejectValue,
		then: (resolver, rejecter) =>
			typeof rejecter === 'undefined'
				? rejectValue
				: Contract(rejecter, value),
		toArray: rejectValue,
		toString: rejectValue
	};
};

Contract.of = resolve;
Contract.from = resolve;
Contract.resolve = resolve;
Contract.reject = reject;

Contract.isContract = isContract;

Contract.all = values => {
	const result = [];
	let err;
	const resolver = val => result.push(val);
	const rejecter = e => err = e;
	for (const item of values) {
		Contract(item).then(resolver, rejecter);
		if (err) {
			return reject(err);
		}
	}
	return resolve(result);
};

Contract.catch = f => c => c.catch(f);
Contract.filter = f => c => c.filter(f);
Contract.lazy = {
	filter: f => c => c.lazy.filter(f),
	map: f => c => c.lazy.map(f),
	take: amount => c => c.lazy.take(amount)
};
Contract.map = f => c => c.map(f);
Contract.reduce = f => c => c.reduce(f);
Contract.take = amount => c => c.take(amount);
Contract.tap = f => c => c.tap(f);
Contract.toArray = c => c.toArray();
Contract.then = (resolver, rejecter) => c => c.then(resolver, rejecter);
Contract.toString = c => c.toString();

module.exports = Contract;
