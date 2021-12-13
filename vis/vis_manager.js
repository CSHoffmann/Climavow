import * as d3 from "https://cdn.skypack.dev/d3@7";
export default function VisManager(datasets, fn_args, _dataset=0, _vistype=0) {
    let dataset = _dataset
    let vistype = _vistype
    let vizs = []

    const construct = () => {
        let i = 0;
        for (const ds of datasets) { //so sorry for this monstrosity
            let j = 0;
            let inter = [];
            for (const [fn, gj, cfg] of fn_args) {
                const vqs = `d${i}v${j}`
                d3.select("#vis")
                    .append("div")
                    .classed(vqs, true)

                const v = fn("." + vqs, ds, gj, cfg)
                inter.push(v)
                j++
            }
            i++
            vizs.push(inter)
        }
    }

    const updateYear = year => {
        vizs.forEach(row => row.forEach(v => v.updateYear(year)))
    }

    const updateCountry = code => {
        vizs.forEach(row => row.forEach(v => v.updateCountry(code)))
    }

    const hideAll = () => {
        vizs.forEach(row => row.forEach(v => v.hide()))
    }
    
    const render = () => {
        hideAll()
        vizs[dataset][vistype].show()
    }

    const updateDataset = ds => {
        dataset = ds
        render()
    }

    const updateVistype = vt => {
        vistype = vt
        render()
    }

    construct()
    updateYear(1970)
    updateCountry("USA")
    render()
    return {construct, updateYear, updateCountry, updateDataset, updateVistype}
}
