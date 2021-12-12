import * as d3 from "https://cdn.skypack.dev/d3@7";

export default function VisManager(datasets, fn_args) {
    let visz = []
    let dataset = 0


    const updateYear = year => {
        vizs.forEach(v => v.updateYear(year));
    }

    const updateCountry = code => {
        vizs.forEach(v => v.updateCountry(code));
    }

    construct();
    return {construct, destruct, updateYear, updateCountry}
}
