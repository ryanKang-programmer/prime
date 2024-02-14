import React from "react";
import './GraphView.css'
import * as d3 from "d3";
import { useEffect } from "react";

// https://stackoverflow.com/questions/34088550/d3-how-to-refresh-a-chart-with-new-data
// https://stackoverflow.com/questions/47196592/update-d3-chart-with-new-data
// https://stackoverflow.com/questions/63249124/how-to-update-d3-chart-when-receiving-new-data
// https://stackoverflow.com/questions/56283478/d3-js-how-to-update-chart-when-with-new-data
// https://stackoverflow.com/questions/48949327/update-d3-graph-with-new-data
// search: d3 update graph on data change site:stackoverflow.com

function Wavelet() {

        const gWidth = window.innerWidth / 5
        const gWidth_modal = window.innerWidth/ (2.5)
        var margin = {top: 20, right: 30, bottom: 30, left: 20},
        width = gWidth - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

        var margin_modal = {top: 20, right: 30, bottom: 30, left: 20},
        width_modal = gWidth_modal - margin_modal.left - margin_modal.right,
        height_modal = 400 - margin_modal.top - margin_modal.bottom;
        

        // append the svg object to the body of the page
        

        var svg = d3.select("#contour").selectAll("*").remove();
        svg = d3.select("#contour").append("svg")
            .attr("width", gWidth + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            // .attr("width", '100%')
            // .attr("height", '100%')
            // .attr('viewBox','0 0 '+ Math.min(width,height)+' '+Math.min(width,height))
            // .attr('preserveAspectRatio','xMinYMin')
            // .append("g")
            // .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

        var svg_modal = d3.select("#contour-modal").selectAll("*").remove();
        svg_modal = d3.select("#contour-modal").append("svg")
            .attr("width", width_modal + margin_modal.left + margin_modal.right)
            .attr("height", height_modal + margin_modal.top + margin_modal.bottom)
            .append("g")
            .attr("transform", "translate(" + margin_modal.left + "," + margin_modal.top + ")")
            // .attr("width", '100%')
            // .attr("height", '100%')
            // .attr('viewBox','0 0 '+ Math.min(width,height)+' '+Math.min(width,height))
            // .attr('preserveAspectRatio','xMinYMin')
            // .append("g")
            // .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");
        
        var color = d3.scaleLinear()
            .domain([0, 0.01]) // Points per square pixel.
            .range(["#c3d7e8", "#23527a"])
      

        const data = [
            { x: 3.4, y: 4.2 },
            { x: -1, y: 4.2 },
            { x: -1, y: 2.8 },
            { x: 3.6, y: 4.3 },
            { x: -0.1, y: 3.7 },
            { x: 4.7, y: 2.5 },
            { x: 0.8, y: 3.6 },
            { x: 4.7, y: 3.7 },
            { x: -0.4, y: 4.2 },
            { x: 0.1, y: 2.2 },
            { x: 0.5, y: 3 },
            { x: 4.3, y: 4.5 },
            { x: 3.4, y: 2.7 },
            { x: 4.4, y: 3.6 },
            { x: 3.3, y: 0.6 },
            { x: 3, y: 3.4 },
            { x: 4.7, y: 0 },
            { x: -0.7, y: 2.7 },
            { x: 2.6, y: 2 },
            { x: 0, y: -1 },
            { x: 3.4, y: 4.5 },
            { x: 3.9, y: 4.6 },
            { x: 0.7, y: 3.9 },
            { x: 3, y: 0.2 }
            ];

        // Add X axis
        var x = d3.scaleLinear()
            .domain([-2, 6])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var x_modal = d3.scaleLinear()
            .domain([-2, 6])
            .range([ 0, width_modal ]);
        svg_modal.append("g")
            .attr("transform", "translate(0," + height_modal + ")")
            .call(d3.axisBottom(x_modal));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([-2, 5])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var y_modal = d3.scaleLinear()
            .domain([-2, 5])
            .range([ height_modal, 0 ]);
        svg_modal.append("g")
            .call(d3.axisLeft(y_modal));

        // compute the density data
        var densityData = d3.contourDensity()
            .x(function(d) { return x(d.x); })   // x and y = column name in .csv input data
            .y(function(d) { return y(d.y); })
            .size([width, height])
            .bandwidth(20)    // smaller = more precision in lines = more lines
            (data)

        // Add the contour: several "path"
        svg
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", function(d) { return color(d.value); })
            .attr("stroke", "#4285f4")
            // .attr("stroke-linejoin", "round")
        
        svg_modal
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", function(d) { return color(d.value); })
            .attr("stroke", "#4285f4")
}

export default Wavelet