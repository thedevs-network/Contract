'use strict';

const Contract = require('./contract');

const add = (a, b) => a + b;

Contract(add, 1, 2)
	.then(x => console.log('3', x))
	.catch(err => console.error(err));

Contract(add, 1, 2)
	.then(x => x * 2)
	.then(x => console.log('6', x))
	.catch(err => console.error(err));

Contract.resolve(4)
	.then(x => console.log('4', x))
	.catch(err => console.error(err));

const thrower = Contract(() => { throw 4; });

thrower
	.then(x => console.log('should never happen'))
	.catch(x => console.log('should happen'))
	.then(x => console.log('should also happen'))
	.catch(err => console.error(err));

Contract.of([ 1, 2, 3 ])
	.map(x => x * 2)
	.then(x => console.log('[ 2, 4, 6 ]', x))
	.catch(err => console.error(err));

Contract.of([ 1, 2, 3 ])
	.reduce((x, y) => x + y, 1)
	.then(x => console.log('7', x))
	.catch(err => console.error(err));

Contract.of([ 1, 2, 3 ])
	.filter(x => x % 2 === 1)
	.then(x => console.log('[ 1, 3 ]', x))
	.catch(err => console.error(err));

Contract.of([ 4, 5 ])
	.spread((four, five) => console.log('4', four, '5', five))
	.catch(err => console.error(err));


Contract.of(1)
	.then(x => Contract.of(2))
	.then(x => console.log('2', x))
	.catch(err => console.error(err));

const infinite = function* () {
	let i = 0;
	while (true) {
		yield ++i;
	}
};

Contract.of(infinite())
	.lazy.map(x => x * 2)
	.lazy.filter(x => x % 2 === 0)
	.lazy.take(5)
	.then(Array.from)
	.then(x => console.log('[ 2, 4, 6, 8, 10 ]', x))
	.catch(console.error);

Contract.of(infinite())
	.lazy.take(10)
	.toArray()
	.tap(console.log)
	.catch(console.error);

Contract.of([ 1, 2, 3 ])
	.toString()
	.tap(console.log)
	.catch(console.error);

Contract.of(infinite())
	.lazy.take(1)
	.toArray()
	.then(console.log)
	.catch(console.error);

Contract.of(4)
	.then(x => Promise.resolve(5))
	.then(x => console.log('5', x))
	.catch(console.error);

console.log('async promise results:');
