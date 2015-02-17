/*
 * benchmark - benchmark a piece of code and return some stats about it
 * fn: the function to benchmark
 * opts: {iterations,timeout}
 */
function benchmark(fn,opts) {
	var start = performance.now();
	var end = start;
	var times = [];

	if(!(opts.iterations || opts.timeout)) return null;

	var iterations = opts.iterations || Number.POSITIVE_INFINITY;
	var timeout = opts.timeout || Number.POSITIVE_INFINITY;

	var stop = start + timeout;

	var i;
	for(i = 0; i < iterations && end < stop; i++) {
		var iterStart = performance.now();
		fn();
		end = performance.now();
		times.push(end - iterStart);
	}

	var min = times.reduce(function (a,b) {return Math.min(a,b);});
	var tot = end - start;
	var avg = tot / i;

	return {avg: avg, min: min, total: tot, iters: i};
}

module.exports = benchmark;