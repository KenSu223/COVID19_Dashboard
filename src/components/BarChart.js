import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3'

function BarChart(props){

  console.log(props.csv);  
  const svgRef = useRef();
  const ref = useRef();
  var height = 100;
  var width = 400;

  useEffect(() => {
    //const height = svgRef.current.clientHeight;
    //const width = svgRef.current.clientWidth;
    const svg = d3.select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")
  }, []);

  useEffect(() => {
      draw();
  }, [props.csv.Obesity_prevalence]);

  const draw = () => {
      
      const svg = d3.select(ref.current);
      var selection = svg.selectAll("rect").data(props.csv.Obesity_prevalence);
      var yScale = d3.scaleLinear()
            .domain([0, d3.max(props.csv.Obesity_prevalence)])
            .range([0, height-100]);
      
      selection
          .transition().duration(300)
              .attr("height", (d) => yScale(d))
              .attr("y", (d) => height - yScale(d))

      selection
          .enter()
          .append("rect")
          .attr("x", (d, i) => i * 45)
          .attr("y", (d) => height)
          .attr("width", 40)
          .attr("height", 0)
          .attr("fill", "orange")
          .transition().duration(300)
              .attr("height", (d) => yScale(d))
              .attr("y", (d) => height - yScale(d))
      
      selection
          .exit()
          .transition().duration(300)
              .attr("y", (d) => height)
              .attr("height", 0)
          .remove()
  }


  return (
      <div className="chart">
          <svg ref={ref}>
          </svg>
      </div>
  )
}

export default BarChart;