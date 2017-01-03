"use strict";

var width = 1100,
    height = 860,
    dataSet = [800, 200, 100, 300, 340, 123, 634, 987, 1000, 20, 120, 167, 250, 233, 522, 722],
    blues = [],
    woj = [],
    mesh;

for (var i = 0; i < 10; i++) {
    blues.push(d3.interpolateBlues(i / 10));
}

var scaleColor = d3.scaleQuantize().domain([d3.min(dataSet), d3.max(dataSet)]).range(blues);
var scaleRange = d3.scaleLinear().domain([d3.max(dataSet), d3.min(dataSet)]).range([20, height - 20]);
var y = d3.scaleLinear().domain([0, 10]).rangeRound([820, 0]);

var color = d3.scaleThreshold()
    .domain(d3.range(1, 10))
    .range(blues);

var projection = d3.geoAlbers()
    .center([0, 52])
    .rotate([-19.3, 0])
    .parallels([50, 60])
    .scale(8000)
    .translate([(width / 2) - 50, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body")
    .select(".visual")
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "mapg");
//.call(zoom);

function clicked(d) {
    d3.select(".dropdown").remove();

    var woj = d3.select("." + d[1].id).attr("class", "clicked");
    //d[1].attr("class", "clicked");

    // Remove scale from svg element
    var map = d3.select('#mapg');
    map.selectAll(".axis").remove();

    // rescale with animation
    map.transition().duration(750).attr("transform", "scale(0.25)");

    // Let finish the animation
    setTimeout(function () {
        // rescale svg container
        d3.select("body")
            .select(".visual")
            .select("svg")
            .attr("width", 250)
            .attr("height", 250);
        // Show filters
        // TODO: Show other things
        d3.select("#filters").attr("class", "visible");
        d3.select("#charts").attr("class", "visible");
        d3.select("#statistics").attr("class", "visible");
    }, 750);

    
}

for (var i = 0; i < dataSet.length; i++) {
    woj.push([dataSet[i]]);
}

d3.json("../../pl.json",
    function (error, pl) {
        var features = topojson.feature(pl, pl.objects.pol).features;
        mesh = topojson.mesh(pl, pl.objects.pol, function (a, b) { return true });

        dataSet.forEach(function (item, i) {
            woj[i].push(features[i]);
        });
        console.log(woj);
        update(woj);
    });

var update = function (data) {
    svg.selectAll(".woj")
        .data(data)
        .enter()
        .append("path")
        .attr("class", function (d) { return "woj " + d[1].id; })
        .attr("d", function (d) { return path(d[1]) })
        .style("fill", function (d) { return scaleColor(d[0]); })
        .on("click", clicked);

    svg.append("path")
        .datum(mesh)
        .attr("d", path)
        .attr("class", "woj-boundary");

    var chart = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (width - 100) + ",-70)");

    chart.selectAll("rect")
      .data(color.range().map(function (d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = y.domain()[0];
          if (d[1] == null) d[1] = y.domain()[1];
          return d;
      }))
      .enter().append("rect")
        .attr("width", 40)
        .attr("y", function (d) { return y(d[0]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("fill", function (d) { return color(d[0]); });

    chart.call(d3.axisRight(y)
        .tickSize(50)
        .tickFormat(function (y) { return (y * 10 + 10) + "%"; })
        .tickValues(d3.range(0, 9)))
        .attr("font-size", 14)
      .select(".domain")
        .remove();
};

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