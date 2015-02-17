#Benchmarking Library
The benchmark library can be used to calculate some data about the performance of a function.

##Example
```
var benchmark = require('sald:benchmark');

function myReallySlowFunction() {
	var i = 0;
	for(var j = 0; j < 1000000000; j++) {
		i++;
	}
}

console.log(benchmark(myReallySlowFunction, {iterations: 1000, timeout: 10}));
```

`function benchmark(fn,opts)`
*Parameters*
	`fn {function}` the function to benchmark
	`opts {object}` the options object which specifies iterations, timeout(ms), or both

*Returns*
	`avg` average runtime for each call to fn
	`min` minimum runtime for each call to fn
	`total` total time it takes to run every iteration of fn
	`iters` total number of times fn executed
