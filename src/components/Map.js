import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3'

function Map (props)  {
   
    //////////////////////////////////////////////////////
    // REFs
    //////////////////////////////////////////////////////
    console.log(props.data);
    const svgRef = useRef();
    const projRef = useRef(d3.geoMercator().center([-73.93, 40.72]).scale(57500));
    const pathRef = useRef()
    useEffect(() => {
        // GRAB CURRENT WIDTH/HEIGHT OF DIV ID="MAP"
        const height = svgRef.current.clientHeight;
        const width = svgRef.current.clientWidth;
        // FINE TUNE THE POSITION THE MAP WITHING THE ELEMENT
         projRef.current.translate([width  / 2, height  / 2 ]);
    
        // ASSING THE PROJECTION A PROJECTION
        const path = d3.geoPath().projection(projRef.current);
        if (props.data.features.length) {
            console.log(props.data);
          renderChart(props.data.features, path);
        }
     }, [props.data.features]);

     const renderChart = (data, path) => {
         
        d3.select(svgRef.current).selectAll('path').data(data).enter()
          .append('path')
          .attr('class', (d) => {
              console.log(d);
              return d.properties})
          .attr('d', path)
        //   .style('fill', (d) => boroughLegend(d.properties.borough))
      };
     //////////////////////////////////////////////////////
    return(    
        <svg id="boroughs-map" ref={svgRef}>
        {props.data.features && renderChart()}
      </svg>
    )
 }
 export default Map;