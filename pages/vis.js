const width = 500;
const height = 500;

Promise.all([
	d3.text("../data-raw/co2 emissions by country/API_EN.ATM.CO2E.KT_DS2_en_csv_v2_3011692.csv"),
	d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
]).then(res => {
	const [text, geojson] = res; //get responses
	const rows = d3.csvParse(text.split("\n").slice(4).join("\n"));
	const countries = geojson.features.map(c => c.id);
	const data_map = new Map();
	rows.filter(row => countries.includes(row["Country Code"])) 
		.forEach(row => data_map.set(row["Country Code"], row)) //fill data with valid countries

	const update_map = setup_map(geojson, data_map);

	//setup slider
	d3.select("div#controls")
		.append("input")
			.attr("type", "range")
			.attr("id", "points")
			.attr("min", 1970)
			.attr("max", 2010)
			.on("change", function (e) {
				const year = d3.select(this).node().value
				d3.select("span.sliderlabel")
					.text(() => year);
				
				update_map(year);
			})

	update_map(1970);

});


function setup_map (geojson, data) {

	const path = d3.geoPath();
	const projection = d3.geoMercator()
		.scale(70)
		.center([0, 20])
		.translate([width/2, height/2])

	const scalescale = d3.scaleSymlog()
		.domain([0, 500])
		.range([0, 1])

	d3.select("div#vis")
		.append("div")
		.attr("id", "mapdiv")
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
					return "black"
					console.log(data.get(d.id), d.id)
					if (!data.get(d.id)) return
				})
				.on("mouseenter", (e, d) => {
					const sl = d.properties.scaleLookup;
					d3.select(`text.scalelabel-${sl}`)
						.style("display", "block")

					d3.select(`rect.scalerect-${sl}`)
						.attr("fill", "black")
				})
				.on("mouseout", (e, d) => {
					const sl = d.properties.scaleLookup;
					d3.select(`text.scalelabel-${sl}`)
						.style("display", "none")

					d3.select(`rect.scalerect-${sl}`)
						.attr("fill", d => d3.interpolateInferno(scalescale(sl)))
				})


	
	const scaledata = Array.from(Array(500).keys())

	const scalesel = d3.select("div#vis div#mapdiv")
		.append("svg")
			.attr("id", "mapscale")
			.attr("width", 150)
			.attr("height", 500)
			.selectAll("rect")
			.data(scaledata, d => d)
			.enter()

	scalesel
		.append("rect")
		.attr("x", 0)
		.attr("y", d => 500 - d)
		.attr("width", d => 30)
		.attr("height", 1)
		.attr("fill", d => d3.interpolateInferno(scalescale(d)))
		.attr("class", d => `scalerect-${d}`)
		.on("mouseenter", function (e, d) {
			d3.select(this)
				.attr("fill", "black")

			d3.select(`text.scalelabel-${d}`)
				.style("display", "block")
		})
		.on("mouseleave", function (e, d) {
			d3.select(this)
				.attr("fill", d => d3.interpolateInferno(scalescale(d)))

			d3.select(`text.scalelabel-${d}`)
				.style("display", "none")
		})
	
	scalesel
		.append("text")
		.attr("x", 30)
		.attr("y", d => 500 - d + 5)
		.attr("class", d => `scalelabel scalelabel-${d}`)
		.style("display", "none")
	


	d3.select("div#controls")
		.append("span")
			.classed("sliderlabel", true)
			.text(1970)
	
	const update = (year) => {
		const max_val = d3.max(data, d => +d[1][year]);
		const colorScale = d3.scaleSymlog() //this MUST be symlog for the domain to include 0
			.domain([0, max_val*1.1])
			.range([0, 1])


		const t = d3.transition()
			.duration(1000);

		d3.select("svg#map")
			.selectAll("path")
			.transition(t)
			.attr("fill", d => {
				if (!data.get(d.id)) {
					console.log(d.id);
					return "black";
				}

				const scaleLookup = Math.trunc(scalescale.invert(colorScale(+data.get(d.id)[year])))
				d.properties.scaleLookup = scaleLookup;
				const color = d3.interpolateInferno(colorScale(+data.get(d.id)[year]))
				return color;
			})


		d3.selectAll("text.scalelabel")
			.text(d => {
				console.log(d)
				return Math.trunc(colorScale.invert(scalescale(d))) + " kt"
			})

	}

	return update;
}

function setup_bar (data) {
	
}



	// 	d3.select("#select")
	// 		.on("change", e => {
	// 			const val = d3.select("#select").node().value;
	// 			d3.selectAll("svg")
	// 				.style("display", "none");

	// 			d3.select(`svg#${val}`)
	// 				.style("display", "block");

	// 		})
	// })

