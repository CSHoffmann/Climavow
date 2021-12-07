var mydata = [
    [],
    ["United States","Joe Biden"],
    ["United States","Donald Trump"],
    ["United States","Barack Obama"],
    ["Russia","Vladimir Putin"],
    ["China","Xi Jinping"],
    ["France","Emmanuel Macron"],
    ["India"," Narendra Modi"]

   
   
];

function makeDropDown(data,filtersAsArray,targetElement){

    const filteredArray = filterArray(data,filtersAsArray);
    const uniqueList = getUniqueValues(filteredArray,filtersAsArray.length);
    populateDropDown(targetElement,uniqueList);

}

function applyDropDown() {
    const selectLevel1Value = document.getElementById("level1").value;
    const selectLevel2 = document.getElementById("level2");
    makeDropDown(mydata,[selectLevel1Value],selectLevel2);
    applyDropDown2();
}

function applyDropDown2() {
    const selectLevel1Value = document.getElementById("level1").value;
    const selectLevel2Value = document.getElementById("level2").value;
    const selectLevel3 = document.getElementById("level3");
    makeDropDown(mydata,[selectLevel1Value,selectLevel2Value],selectLevel3);
}

function afterDocumentLoads(){
    populateFirstLevelDropDown();
    applyDropDown();

}

function getUniqueValues(data,index){
    const uniqueOptions = new Set();
    data.forEach(r => uniqueOptions.add(r[index]));

    return [...uniqueOptions];

}

function populateFirstLevelDropDown(){
    const uniqueList = getUniqueValues(mydata,0);
    const el = document.getElementById("level1");
    populateDropDown(el,uniqueList);

}

function populateDropDown(el,listAsArray){
    el.innerHTML = "";

    listAsArray.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item;
        el.appendChild(option);
    });
}

function filterArray(data,filtersAsArray){

   return data.filter(r => filtersAsArray.every((item,i) => item === r[i]));

}



document.getElementById("level1").addEventListener("change", applyDropDown);
document.getElementById("level2").addEventListener("change", applyDropDown2);
document.addEventListener("DOMContentLoaded", afterDocumentLoads);
