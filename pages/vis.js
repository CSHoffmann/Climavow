const width = 500;
const height = 500;

Promise.all([
	d3.text("../data-raw/co2 emissions by country/API_EN.ATM.CO2E.KT_DS2_en_csv_v2_3011692.csv"),
	d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
]).then(res => {
	const [text, geojson] = res;
	const rows = d3.csvParse(text.split("\n").slice(4).join("\n"));
	const countries = geojson.features.map(c => c.id);
	console.log(countries);
	const data_map = new Map();
	rows.filter(row => countries.includes(row["Country Code"]))
		.forEach(row => data_map.set(row["Country Code"], row))


	setup_map(geojson, data_map);
});


function setup_map (geojson, data, year) {
	console.log(data);
	const colorScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => +d[1][1970])])

	console.log(d3.max(data, d => +d[1][1970]))
	const path = d3.geoPath();
	const projection = d3.geoMercator()
		.scale(70)
		.center([0, 20])
		.translate([width/2, height/2])

	d3.select("div#vis")
		.append("svg")
			.attr("id", "map")
			.attr("width", width)
			.attr("height", height)
			.selectAll("path")
			.data(geojson.features, d => d.id)
			.enter()
			.append("path")
				.attr("d", d3.geoPath().projection(projection))
				.attr("fill", d => {
					console.log(data.get(d.id), d.id)
					if (!data.get(d.id)) return
					return d3.interpolateInferno(colorScale(data.get(d.id)[1970]))
				})
}

function setup_bar (data) {
	
}


	// .then( => text.split("\n").slice(4))
	// .then(rows => d3.csvParse(rows.join("\n")))
	// .then(data => {
	// 	const map = new Map();
	// 	data.forEach(row => map.set(row["Country Name"], row));
	// 	return map;
	// }).then(map => {



	// 	d3.select("#select")
	// 		.on("change", e => {
	// 			const val = d3.select("#select").node().value;
	// 			d3.selectAll("svg")
	// 				.style("display", "none");

	// 			d3.select(`svg#${val}`)
	// 				.style("display", "block");

	// 		})
	// })

