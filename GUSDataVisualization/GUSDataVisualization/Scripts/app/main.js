"use strict";

var width = 900,
    height = 860,
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0"],
    data = [-50, 200, 100, 300, 340, 123, 634, 987];

//var scale = d3.scale.linear().domain([d3.min(data), d3.max(data)]).range([height, 0]);

var projection = d3.geoAlbers()
    .center([0, 52])
    .rotate([-19.3, 0])
    .parallels([50, 60])
    .scale(8000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body").select(".visual")
    .select("svg")
    .attr("width", width)
    .attr("height", height);

console.log(window.location.pathname);

d3.json("../../pl.json",
    function (error, pl) {
        svg.selectAll(".woj")
            .data(topojson.feature(pl, pl.objects.pol).features)
            .enter()
            .append("path")
            .attr("class", function (d) { return "woj " + d.id; })
            .attr("d", path)
            .on("click",
                () =>
                    d3.select(this)
                    .transition()
                    .styleTween("fill", () => d3.interpolate("green", "red")));

        svg.append("path")
            .datum(topojson.mesh(pl, pl.objects.pol, function (a, b) { return true }))
            .attr("d", path)
            .attr("class", "woj-boundary");

        //        svg.append("path")
        //            .datum(topojson.feature(pl, pl.objects.pl_places))
        //            .attr("d", path)
        //            .attr("class", "place");
    });

//    svg.selectAll("path")
//        .on("click", d => {
//            svg.selectAll(".woj").transition()
//                .styleTween("fill", () => d3.interpolate("green", "red"));
//    });

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}