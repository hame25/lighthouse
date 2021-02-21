<script>
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	let latestValue;
	let status;

	onMount(async () => {
		let svg = d3.select("#chart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");

		// d3.json('https://lighthousedata.blob.core.windows.net/$web/data.json').then(data => {
		let data = await d3.json('http://localhost:3000/')
		console.log(data)

		data = data.map(d => {
			return { date: new Date(d.fetchTime), value: d.firstContentfulPaint }
		});

		let x = d3.scaleTime()
				.domain(d3.extent(data, function (d) { return d.date }))
				.range([0, width]);
			
		svg.append("g")
			.attr("transform", "translate(0, " + height + ")")
			.call(d3.axisBottom(x));

		//y axis
		let y = d3.scaleLinear()
			.domain([0, d3.max(data, function(d) { return +d.value; })])
			.range([height, 0]);

		svg.append("g")
			.call(d3.axisLeft(y));
		
		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.attr("d", d3.line()
				.x(function(d) { return x(d.date) })
				.y(function(d) { return y(d.value) })
			);

		const length = data.length;
		latestValue = data[data.length - 1].value;

		const previousValue = data[data.length - 2].value;

		status = latestValue > previousValue ? "INCREASE" : "DECREASE"
	});
</script>

<h1>Lighthouse report</h1>
<h3>First contentful paint</h3>

<div id="chart"></div>
<p>Latest: {latestValue}ms<br/>Status: {status}</p>

