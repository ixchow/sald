#Benchmarking Library
The benchmark library can be used to calculate some data about the performance of a function.

##Example
```javascript
var benchmark = require('sald:benchmark');

function myReallySlowFunction() {
	var i = 0;
	for(var j = 0; j < 1000000000; j++) {
		i++;
	}
}

console.log(benchmark(myReallySlowFunction, {iterations: 1000, timeout: 10}));
```

##Specs

###Function
`function benchmark(fn,opts)`

###Description
benchmark will run fn a number of times specified by opts, either in iterations or elapsed time,
and return stats about the runtime performance of that fn.

###Parameters

| Param | Type     | Description                                                         |
|-------|----------|---------------------------------------------------------------------|
| fn    | function | the function to benchmark                                           |
| opts  | object   | the options object which specifies iterations, timeout(ms), or both |

###Returns

| Return | Type  | Description                                           |
|--------|-------|-------------------------------------------------------|
| avg    | float | average runtime for each call to fn (ms)              |
| min    | float | minimum runtime for each call to fn (ms)              |
| total  | float | total time it takes to run every iteration of fn (ms) |
| iters  | int   | total number of times fn executed                     |