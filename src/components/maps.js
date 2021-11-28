import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import * as d3 from 'd3'
import _ from "lodash";
function Mapo (props){
    const [statesData,setStateData]=useState(props.data);
    const [maximum,setMaximum]=useState(0);
    console.log(statesData);
    console.log(props.csv);
    const svgRef = useRef();
    const [colourScale,setColourScale]=useState();
    const pathRef=useRef();
    
    useEffect(()=>{
      
        setMaximum(d3.max(props.csv,function(d){
          // console.log(d.Obesity_prevalence);
          return d.Obesity_prevalence;
         }));
         console.log(maximum);
        let colorScale=scaleLinear().domain([0, d3.max(props.csv,function(d){
          // console.log(d.Obesity_prevalence);
          return d.Obesity_prevalence;
         })]).range([255,0]);
         const svg = select(svgRef.current);
         console.log(colorScale(34.4));
         let scales={}
         _.each(props.csv,(d)=>{
           scales[d['STATE_NAME']]=colorScale(d['Obesity_prevalence'])
         })
         console.log(scales);
         setColourScale(scales);
         console.log(colourScale);
        //  svg.selectAll('path').data(props.csv).enter().attr("fill",function(d){
        //    console.log(d.Obesity_prevalence);
        //    var f=colorScale(d.Obesity_prevalence);
        //    if(f<=25.5){
        //     return "rgb(" + 255 + ",0,0)";
        //    }
        //    else{
        //    return "rgb(" + f + "," + f + "," + f + ")"};
        //  })
     
     
    },[])
    if(colourScale){
      console.log(colourScale);
    return (
        <svg ref={svgRef} viewBox="0 0 960 600">
          {statesData.map((stateData, index) =>{
            console.log(colourScale[stateData.name])
            return (<path
              style={{cursor: "pointer", fill:colourScale[stateData.name]?"rgb(" + colourScale[stateData.name] + ","+0+","+0+")":"white"}}
              key={index}
              ref={pathRef}
              stroke="black"
              strokeWidth="5px"
              d={stateData.shape}
              onMouseOver={(event) => {
                event.target.style.fill = 'blue';
              }}
              onMouseOut={(event) => {
                event.target.style.fill = colourScale[stateData.name]?"rgb(" + colourScale[stateData.name] + ","+0+","+0+")":"white";
              }}
            >
            </path>)

          }
          
          )}
        </svg>
      )
}
else{
  return (
    <p>Hello World</p>
  )
}
}
export default Mapo;