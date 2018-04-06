# Contract

<img src="assets/contract.png" alt="Logo" width="200px" />

Hello, this is a **synchronous** continuation monad library, with the following goals:

* Promise compatibility
* Flexibility
* Usability

Think of this as a synchronous Promise-API if it helps

Here is a basic Promise-compatible example to let you know what this library can do for you:

```js
Contract.resolve('He') // Contract { 'He' }
	.then(x => x + 'llo') // Contract { 'Hello' }
	.then(x => x.split('')) // Contract { [ 'H', 'e', 'l', 'l', 'o' ] }
	.map(x => x.charCodeAt(0)) // Contract { [ 72, 101, 108, 108, 111 ] }
	.map(x => x * 3) // Contract { [ 216, 303, 324, 324, 333 ] }
	.filter(x => x % 2 === 0) // Contract { [ 216, 324, 324 ] }
	.tap(console.log) // Contract { [ 216, 324, 324 ] }
	// Logs: [ 216, 324, 324 ]
	.reduce((a, b) => a + b, 0) // Contract { 864 }
	.then(() => {
		throw new Error('Hello World');
	}) // Contract { (rejected) Error<Hello World> }
	.catch(console.error); // Contract { undefined }
```

It also supports laziness through generators!

```js
function* naturalNumbers() {
	let i = 1;
	while (true)
		yield i++;
}

Contract.of(naturalNumbers())
	.lazy.map(x => x * 3)
	.lazy.filter(x => x % 2 === 0)
	.lazy.take(10)
	.toArray()
	.then(console.log);
	// Logs: [ 6, 12, 18, 24, 30, 36, 42, 48, 54, 60 ]
```

(This will only start iterating natural numbers after `.toArray()` has been called)

## Installation

```sh
npm i @thedevs/contract
```

## Roadmap

* Make this library fully Promise-compatible (except async stuff)
* Make it work in browsers
* Have examples for all methods

## Thanks to

[@MKRhere](https://github.com/MKRhere) for the original idea

## API Reference

### Contract

This is the complete function signature of the constructor:

```hs
Contract(Contract | Promise | Function -> (Contract | Promise | any) | any[, ...args])
-> Contract { any } | Promise { any }
```

Expressed in english:

1. If the first argument is already a `Contract`, it will simply return that.
1. If the first argument is a `Promise`, it will return that
1. If the first argument is not a function, it will return a `Contract` that resolves to that
1. Otherwise, it will run the function with the provided rest arguments.
1. If the function throws, it will return a rejecting `Contract`
1. If the return value of the function is a `Contract` or a `Promise`, it will return that
1. Otherwise, it will return `Contract { return value }`

### Contract.resolve

### Contract.of

### Contract.from

Aliases, these three do the same: Create a contract from a value

```js
Contract.resolve(value) -> Contract { value }
```

### Contract.reject

Create a rejecting Contract from the given error (or value)

### Contract.isContract

Checks if the given value is a Contract

### Contract.all

Resolves an array of functions, values, or Contracts (rejects if any of the functions throw, return a rejecting Contract, or any Contract in the array is rejected)

### Instance methods

All instance methods are also available as thunks, for Promise-interoperability:

```js
Promise.resolve(Contract.of([ 1, 2, 3 ]))
	.then(Contract.map(x => x * 2))
	.then(Contract.reduce((a, b) => a + b, 0))
	.then(Contract.tap(console.log))
	// Promise { Contract { 12 } }
```

### Contract#then

Works just like Promises, maps the existing value to a new value

### Contract#catch

Catches a rejected Contract (Resolves it)

### Contract#tap

Do something with a value without changing the Contract (useful for logging / debugging)

### Contract#map

Map the contents of an array within a Contract easily (Similar to bluebird's map)

### Contract#reduce

Similar to bluebird's reduce

### Contract#filter

Similar to bluebird's filter

### Contract#spread

Similar to bluebird's spread

### Contract#take

Slice an array within a contract (take the first N elements)

### Contract#toArray

Convert the inner value of a contract to an array (useful with lazy values)

### Contract#toString

Convert the inner value of a contract to a string

### Contract#lazy.map

Lazily map values (Returns an iterator)

### Contract#lazy.filter

Lazily filter values (Returns an iterator)

### Contract#lazy.take

Lazily take values (Returns an iterator)
