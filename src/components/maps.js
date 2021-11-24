import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import * as d3 from 'd3'
function Mapo (props){
    const [statesData,setStateData]=useState(props.data);
    const [maximum,setMaximum]=useState(0);
    console.log(statesData);
    console.log(props.csv);
    const svgRef = useRef();
    const pathRef=useRef();
    
    useEffect(()=>{
      
        setMaximum(d3.max(props.csv,function(d){
          console.log(d.Obesity_prevalence);
          return d.Obesity_prevalence;
         }));
         console.log(maximum);
        let colorScale=d3.scaleLinear().domain([0, d3.max(props.csv,function(d){
          console.log(d.Obesity_prevalence);
          return d.Obesity_prevalence;
         })]).range([255,0]);
         const svg = select(svgRef.current);
         console.log(colorScale(34.4));
         // svg.selectAll('path').data(props.csv).enter().attr("fill",function(d){
         //   console.log(d.Obesity_prevalence);
         //   var f=colorScale(d.Obesity_prevalence);
         //   if(f<=25.5){
         //    return "rgb(" + 255 + ",0,0)";
         //   }
         //   else{
         //   return "rgb(" + f + "," + f + "," + f + ")"};
         // })
     
     
    },[])
    return (
        <svg ref={svgRef} viewBox="0 0 960 600">
          {statesData.map((stateData, index) =>
            <path
              style={{cursor: "pointer", fill: "blue"}}
              key={index}
              ref={pathRef}
              stroke="#fff"
              strokeWidth="6px"
              d={stateData.shape}
              onMouseOver={(event) => {
                event.target.style.fill = 'red';
              }}
              onMouseOut={(event) => {
                event.target.style.fill = 'blue';
              }}
            >
            </path>
          )}
        </svg>
      )
}
export default Mapo;