"use strict";

var MapWidth = 1100,
    MapHeight = 860,
    margin = { top: 20, right: 20, bottom: 20, left: 40 },
    ChartWidth = 400 - margin.left - margin.right,
    ChartHeight = 300 - margin.top - margin.bottom,
    ChartBarsHeight = ChartHeight - 50,
    dataSet = [
        { province: "WN", value: 800 },
        { province: "PM", value: 200 },
        { province: "DS", value: 100 },
        { province: "ZP", value: 300 },
        { province: "LB", value: 340 },
        { province: "WP", value: 123 },
        { province: "KP", value: 634 },
        { province: "SL", value: 987 },
        { province: "LD", value: 1000 },
        { province: "MZ", value: 20 },
        { province: "SK", value: 120 },
        { province: "PD", value: 167 },
        { province: "LU", value: 250 },
        { province: "PK", value: 233 },
        { province: "OP", value: 522 },
        { province: "MA", value: 722 }
    ],
    blues = [],
    woj = [],
    mesh,
    selectedProvinceCode,
    conversionTable = [],
    unitConverter = {
        "osoba": "osób",
        "%": "%",
        "zł":"zł"
    };

for (var i = 0; i < 10; i++) {
    blues.push(d3.interpolateBlues(i / 10));
}

// Imports convertion table from file (Province code, Province name, Province geojson shortcut)
$.ajax({
    type: "GET",
    url: "codes.csv",
    dataType: "text"
}).done(function (data) {
    var dataLines = data.split(/\r\n|\n/);
    for (var i = 1; i < dataLines.length; i++) {
        var line = dataLines[i].split(",");
        conversionTable.push(line);
    }

    fillProvinceSelect();
});

// Filling "Kategoria1" Select tag with options
$(document)
    .ready(function () {
        fillCategorySelect({});
        fillProvinceSelect();
    });

// Filling Province select tag with optins from conversionTable
var fillProvinceSelect = function() {
    d3.select("#Kod")
        .on("change", function () {
            $(".clicked").removeClass("clicked");
            var code = this.value;
            var geojsonShortcut = $.grep(conversionTable,
                function(d) {
                    return d[0] === code;
                })[0][2];
            $("." + geojsonShortcut).addClass("clicked");
        })
        .selectAll("option")
        .data(conversionTable)
        //Update
        .enter()
        .append("option")
        .attr("value", function(d) { return d[0]; })
        .text(function(d) { return d[1]; });
};

// Filling target select tag with options recieved from server
var fillCategorySelect = function (obj) {
    $.ajax({
        url: "/Home/GetCategories",
        type: "POST",
        data: JSON.stringify(obj.body),
        contentType: "application/json"
    })
        .done(function (data) {
            var disableFlag = false;

            // Completing data table with 
            // "-" for just not filled field 
            // "Kategoria niedostępna" for when there is no data to show
            if (data.length === 0) {
                data.push("Kategoria niedostępna" );
                disableFlag = true;
            } else
                data.unshift("-");

            // Selecting target select tag
            var sel = obj.selectId;
            if (obj.selectId === undefined)
                sel = "Kategoria1";
            var selection = d3.select("#" + sel);

            // Onlick handler
            selection
                .on("change",
                    function () {
                        var selId = this.id;

                        var newObj = {};
                        newObj.body = {}
                        var targetId = "";

                        if (selId === "Kategoria3") return;

                        else if (selId === "Kategoria1") {
                            targetId = "Kategoria2";
                            d3.select("#Kategoria3").selectAll("option").data(["-"]).exit().remove();
                        } else if (selId === "Kategoria2") {
                            targetId = "Kategoria3";
                            newObj.body.Kategoria1 = $("#Kategoria1 :selected").text();
                        }

                        newObj.selectId = targetId;

                        newObj.body[selId] = this.value;
                        fillCategorySelect(newObj);
                    });

            // Disable target select if there is no data to show (no further category)
            if (disableFlag)
                selection.attr("disabled", "disabled");
            else
                selection.attr("disabled", null);

            // Dynamically creating options for select tags with help of d3
            var update = selection
                .selectAll("option")
                .data(data) // Update
                .attr("value",
                    function(d) {
                        if (d !== "-" && d !== "Kategoria niedostępna") return d;
                        return "";
                    })
                .text(function(d) { return d; });

            update.enter() // Enter
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
            
            update.exit().remove(); // Exit
        });
};

var scaleColor = d3.scaleQuantize()
    .domain([d3.min(dataSet, function (d) { return d.value; }), d3.max(dataSet, function (d) { return d.value; })])
    .range(blues);
var scaleRange = d3.scaleLinear()
    .domain([d3.max(dataSet, function (d) { return d.value; }), d3.min(dataSet, function (d) { return d.value; })])
    .range([20, MapHeight - 20]);
var y = d3.scaleLinear().domain([0, 10]).rangeRound([820, 0]);

var barWidth = 20;

var color = d3.scaleThreshold()
    .domain(d3.range(1, 10))
    .range(blues);

var projection = d3.geoAlbers()
    .center([0, 52])
    .rotate([-19.3, 0])
    .parallels([50, 60])
    .scale(8000)
    .translate([(MapWidth / 2) - 50, MapHeight / 2]);

var path = d3.geoPath()
    .projection(projection);

var mapSvg = d3.select("body")
    .select(".visual")
    .select("svg")
    .attr("width", MapWidth)
    .attr("height", MapHeight)
    .attr("class", "svgMap")
    .append("g")
    .attr("id", "mapg");

var chartSvg = d3.select("#charts")
    .attr("width", barWidth * dataSet.length)
    .attr("height", ChartHeight);

// Handle clicking on any province
function clicked(d) {
    d3.select(".dropdown").remove();

    // Second item in conversion table is Geojson shortcut. 
    // grep is returning array of matched items, but we know there's only one
    // then from this one item list we take province code
    selectedProvinceCode = $.grep(conversionTable,
        function(e) {
            return e[2] === d.province;
        })[0][0];

    //var kod = $("#Kod").val(selectedProvinceCode);

    $("." + d.province).addClass("clicked");

    // Remove scale from mapSvg element
    var map = d3.select('#mapg');
    map.selectAll(".axis").remove();

    // rescale with animation
    map.transition().duration(750).attr("transform", "scale(0.25)");

    // Let finish the animation
    setTimeout(function () {
        // rescale mapSvg container
        d3.select("body")
            .select(".visual")
            .select(".svgMap")
            .attr("width", 250)
            .attr("height", 250);
        // Show filters
        d3.select("#filters").attr("class", "visible");
        d3.select("#charts").attr("class", "visible");
        d3.select("#statistics").attr("class", "visible");
    }, 750);
}

// Loading Geojson data to create map
d3.json("pl.json",
    function (error, pl) {
        var features = topojson.feature(pl, pl.objects.pol).features;
        mesh = topojson.mesh(pl, pl.objects.pol, function (a, b) { return true; });

        features.forEach(function (item, i) {
            var index = dataSet.indexOf($.grep(dataSet, function (e) { return e.province === item.id; })[0]);
            dataSet[index].geo = item;
        });
        //console.log(dataSet);
        main(dataSet);
    });

// Hanles map creating, colors, axis
var main = function (data) {
    mapSvg.selectAll(".woj")
        .data(data)
        .enter()
        .append("path")
        .attr("class", function (d) { return "woj " + d.geo.id; })
        .attr("d", function (d) { return path(d.geo) })
        .style("fill", function (d) { return scaleColor(d.value); })
        .on("click", clicked);

    mapSvg.append("path")
        .datum(mesh)
        .attr("d", path)
        .attr("class", "woj-boundary");

    var chart = mapSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (MapWidth - 100) + ",-70)");

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

// Creates chart from requestModels array
var chart = function (data) {
    //chartSvg
    chartSvg.append("p").text(data[0].etykieta1);
    var chartDiv = chartSvg.append("div"),
        barOffset = 0.1,
        yearsRange = [],
        barWidth2 = 30;

    data.forEach(function(d) {
        yearsRange.push(d.rok);
    });
    yearsRange.sort();

    var ymax = d3.max(data, function(d) { return d.wartosc; });
    var chartYscale = d3.scaleLinear().range([ChartBarsHeight, 0]).domain([0, ymax]).nice();

    // IF COMPARING TO (=100) than YMAX CANNOT BE < 100
    var match100 = data[0].etykieta1.match("=100");
    if (match100) {
        if (ymax < 100)
            chartYscale.domain([0, 105]);
    }

    var chartXscale = d3.scaleBand()
        .domain(yearsRange).rangeRound([0, ChartWidth])
        .padding(barOffset);

    var xAxis = d3.axisBottom(chartXscale);
    var yAxis = d3.axisLeft(chartYscale);

    var box = chartDiv.append("svg")
        .attr("width", ChartWidth + margin.left + margin.right)
        .attr("height", ChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var update = box.selectAll("g")
        .data(data);
    // Update

    var enter = update.enter()
        .append("g")
        .attr("transform", function (d) { return "translate(" + (chartXscale(d.rok) + (chartXscale.bandwidth() - barWidth2)/2) + "," + "0)"; });

    //var barWidth2 = chartXscale.bandwidth();
    //var barWidth2 = 30;

    // Bars
    enter.append("rect")
        //.attr("x", function(d,i) { return (i * barWidth2)/2; })
        .attr("y", function(d) { return chartYscale(d3.max([0, parseFloat(d.wartosc)])); })
        .attr("width", barWidth2)
        .attr("height", function(d) { return Math.abs(chartYscale(0) - chartYscale(d.wartosc)); })
        .attr("class", "bar");

    // xAxis
    box.append("g")
        .attr("transform", "translate(0," + ChartBarsHeight + ")")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", "1em");

    // yAxis + text
    box.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .text(unitConverter[data[0].jednostka])
    .attr("y", "-.8em")
    .attr("x", "1.5em")
    .attr("fill", "#333")
    .attr("font-size", "10px");

    // Adding line when =100
    if (match100) {
        var line = d3.line().x(function (d, i) {
            var l = chartXscale(d.rok);
            if (i > 0)
                l += chartXscale.bandwidth();
            return l;
        }).y(function () { return chartYscale(99.6); });
        box.append("path").datum(data).attr("class", "line").attr("d", line);
    }

    update.exit().remove();
}

var verticalChart = function(data) {
    chartSvg.append("p").text(data[0].etykieta1);
    var chartDiv = chartSvg.append("div"),
        yearsRange = [];

    data.forEach(function (d) {
        yearsRange.push(d.rok);
    });
    yearsRange.sort();

    var x = d3.scaleLinear()
        .range([0, ChartWidth]);

    var y = d3.scaleBand()
        //.domain(yearsRange)
        .rangeRound([0, ChartBarsHeight])
        .padding(0.1);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(6);

    var box = chartDiv.append("svg")
        .attr("width", ChartWidth + margin.left + margin.right)
        .attr("height", ChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return +d.wartosc; })).nice();
    y.domain(data.map(function (d) { return d.rok; }));

    box.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function (d) { return "bar bar--" + (d.wartosc < 0 ? "negative" : "positive"); })
        .attr("x", function (d) { return x(d3.min([0, parseFloat(d.wartosc)])); })
        .attr("y", function (d) { return y(d.rok); })
        .attr("width", function (d) { return Math.abs(x(d.wartosc) - x(0)); })
        .attr("height", y.bandwidth());

    box.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + ChartBarsHeight + ")")
        .call(xAxis);

    box.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .call(yAxis);
}

//$.ajax({
//    url: "/Home/GetData",
//    type: "POST",
//    data: JSON.stringify({ Kod: 0, RokOd: 2010, RokDo: 2015, Kategoria1: "Ceny", Kategoria2: "Kultura" }),
//    contentType: "application/json"
//})
//    .done(function (data) {
//        data.forEach(function (d) {
//            d.wartosc = d.wartosc.replace(",", ".");
//        });
//        console.log(data);
//        chart(data);
//    });

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
}

// Handling form submit
// Can't do it from hmtl because lack of 'application/json' content-type support
$("#filterForm")
    .submit(function (e) {
        e.preventDefault();
        var frm = $(this);
        var dat = {};
        var inputs = frm[0].elements;

        for (var i = 0, element; (element = inputs[i++]);) {
            if (element.type === "submit")
                continue;
            dat[element.name] = element.value;
        }

        var jsonData = JSON.stringify(dat);

        //alert("posting" + jsonData);
        $.ajax({
            url: "/Home/GetData",
            type: "POST",
            data: jsonData,
            contentType: "application/json"
        })
        .done(function (data) {
            $("#charts div").remove();  // There has to be other way (animations)
            $("#charts p").remove();
            $(".data-node").remove();

            data.forEach(function(plotData) {
                plotData.forEach(function(d) {
                    d.wartosc = d.wartosc.replace(",", ".");
                });
                console.log(plotData);
                if (d3.min(plotData, function(d) { return +d.wartosc; }) < 0)
                    verticalChart(plotData);
                else 
                    chart(plotData);
                printDetails(plotData);
            }); 
        });
    });

var printDetails = function (data) {
    var label, header, div = d3.select("#statistics").append("div").attr("class", "data-node");

    $("#statistics").switchClass("hidden", "visible");
    if (data[0].etykieta2 === "")
        label = data[0].etykieta1;
    else
        label = data[0].etykieta2;

    //div.append("<p>" + label + "</p>");
    div.append("p").text(label);

    if (data[0].kategoria3 === "")
        if (data[0].kategoria2 === "")
            header = data[0].kategoria1;
        else
            header = data[0].kategoria2;
    else
        header = data[0].kategoria3;

    var headers = ["Rok", header + " (" + unitConverter[data[0].jednostka] + ")" ];
    var dataHeader = ["rok", "wartosc"];

    var table = div.append("table");

    var thead = table.append("thead");
    var tbody = table.append("tbody");

    thead.append("tr")
        .selectAll("th")
        .data(headers)
        .enter()
        .append("th")
        .text(function (h) { return h; });

    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    var cells = rows.selectAll("td")
        .data(function(row) {
            return dataHeader.map(function (column) {
                return { col: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .html(function(d) { return d.value });

    //var div = d3.select("#statistics");
    //div.append("p")
    //    .selectAll()
    //    .data(data)
    //  .enter()
    //    .append("p")
    //    .attr("text", function (d) { return d });

};