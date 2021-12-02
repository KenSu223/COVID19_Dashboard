import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import * as d3 from "d3";

import _ from "lodash";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";
// import sq from '@vx/scale/scaleQuantile';
import { ComposableMap, Geographies, ZoomableGroup,Geography } from "react-simple-maps";
import { Dropdown } from "semantic-ui-react";
// import { LegendQuantile } from 'react-d3-legends';
import {
  Legend,
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from '@vx/legend';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
function Mapo(props) {
  const [statesData, setStateData] = useState(props.data);
  const [maximum, setMaximum] = useState(0);
  // console.log(statesData);
  console.log(props.csv);
  const svgRef = useRef();
  const [colourScale, setColourScale] = useState();
  const pathRef = useRef();
  const [colorfunction,setColorfunction]=useState();
  const [statefips,setStatefips]=useState("_nation");
  const[statename,setStateName]=useState("the United States");
  useEffect(() => {
    setMaximum(
      d3.max(props.csv, function (d) {
        // console.log(d.Obesity_prevalence);
        //return(d.Obesity_prevalence)
        // console.log(d[props.ChosenDisease]);
        // console.log(props.ChosenDisease);
        return d[props.ChosenDisease];
      })
    );

    console.log(maximum);

    let colorScale = scaleQuantile()
      .domain([
        0,
        d3.max(props.csv, function (d) {
          // console.log(d.Obesity_prevalence);
          return d[props.ChosenDisease];
        }),
      ])
      .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"]);
//       var legendSvg = svg.append('g')
setColorfunction(colorScale);
//          .attr('class', 'legend')
//         .attr("transform","translate("+ (width - 40) + ",20)")

// // Define the legend as you did
// var legend = legendColor()
//                  .useClass(true)
//                  .shape('rect')
//                  .orient('vertical')
//                  .title('Temperature Variance')
//                  .scale(colorScale);

// // And then call legend on the legendSvg not on svg itself
//  legendSvg.call(legend);

    const svg = select(svgRef.current);
    console.log(colorScale(34.4));
    let scales = {};
    _.each(props.csv, (d) => {
      scales[d["COUNTY_NAME"]] = colorScale(d[props.ChosenDisease]);
    });
    // console.log(scales);
    setColourScale(scales);
    // console.log(colourScale);
    //  svg.selectAll('path').data(props.csv).enter().attr("fill",function(d){
    //    console.log(d.Obesity_prevalence);
    //    var f=colorScale(d.Obesity_prevalence);
    //    if(f<=25.5){
    //     return "rgb(" + 255 + ",0,0)";
    //    }
    //    else{
    //    return "rgb(" + f + "," + f + "," + f + ")"};
    //  })
  }, [props.ChosenDisease]);
  const CustomizedLabellist_state = (props) => {
    const {value}=props
console.log(props)
    return (
      <g>asdf</g>
      
    )
  }
  const legendGlyphSize = 15;
  let colorScale = scaleQuantile()
  .domain([
    0,
    d3.max(props.csv, function (d) {
      // console.log(d.Obesity_prevalence);
      return d[props.ChosenDisease].toFixed(0);
    }),
  ])
  .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"]);
  if (colourScale) {
    console.log(colourScale);
    return (
      <div>
        {/* <svg class='legend'></svg> */}
        <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px"
        }}
     
      >
     
        <LegendQuantile scale={colorScale}>
          {labels =>
            labels.map((label, i) => (
              <LegendItem
                key={`legend-${i}`}
                
              >
                <svg width={legendGlyphSize} height={legendGlyphSize} style={{ margin: '2px 0' }}>
                  <circle
                    fill={label.value}
                    r={legendGlyphSize / 2}
                    cx={legendGlyphSize / 2}
                    cy={legendGlyphSize / 2}
                  />
                </svg>
                <LegendLabel align="left" margin="0 4px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))
          }
        </LegendQuantile>
     
        {/* <LegendQuantile
        labelFormat={CustomizedLabellist_state}
          scale={colorScale}
          direction="row"
          labelMargin="0 0 0 0"
        /> */}
      </div>
<ComposableMap data-tip data-for='states' projection="geoAlbersUsa">
<ZoomableGroup>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            {/* const cur = props.csv.find(s => s['COUNTY_NAME'] === geo.properties.name); */}
        
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={()=>{
                  const fip=geo.id.substring(0,2);
                  const cur=props.csv.find(s=>s['STATE_FIPS']+''===fip);
                  setStatefips(fip);
                  console.log(fip);
        
                  console.log(cur);
                  setStateName(cur['STATE_NAME']);
                }}
                onMouseLeave={()=>{
                  setStatefips("_nation");
                  setStateName("the United States");
                }}
                fill={geo.id.substring(0,2)===statefips?'yellow':(colourScale[geo.properties.name] ? colourScale[geo.properties.name] : "#EEE")}
              />
            );
          })
        }
      </Geographies>
     
      </ZoomableGroup>
        
    </ComposableMap>
    <ReactTooltip id='states'>

<font size='20px'><b >{statename}</b> </font>
<br />
<b>Click for data about the counties .</b>
</ReactTooltip>  
      {/* <svg ref={svgRef} viewBox="0 0 960 600">
        {statesData.map((stateData, index) => {
          console.log(colourScale[stateData.name]);
          return (
            <path
              style={{
                cursor: "pointer",
                fill: colourScale[stateData.name]
                  ? "rgb(" +
                    colourScale[stateData.name] +
                    "," +
                    0 +
                    "," +
                    0 +
                    ")"
                  : "white",
              }}
              key={index}
              ref={pathRef}
              stroke="black"
              strokeWidth="5px"
              d={stateData.shape}
              onMouseOver={(event) => {
                event.target.style.fill = "blue";
              }}
              onMouseOut={(event) => {
                event.target.style.fill = colourScale[stateData.name]
                  ? "rgb(" +
                    colourScale[stateData.name] +
                    "," +
                    0 +
                    "," +
                    0 +
                    ")"
                  : "white";
              }}
            ></path>
          );
        })}
      </svg> */}
      <h1>Prevalence of {props.ChosenDisease} in {statename}</h1>
      </div>
    );
  } else {
    return <p>Hello World</p>;
  }
}
export default Mapo;
