import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import { Grid, Image } from "semantic-ui-react";
import * as d3 from "d3";
import _ from "lodash";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";
import {
  ComposableMap,
  Geographies,
  ZoomableGroup,
  Geography,
} from "react-simple-maps";
import { Dropdown, ItemContent, List } from "semantic-ui-react";
import "./maps.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
function Mapo(props) {
  const [statesData, setStateData] = useState(props.data);
  const [maximum, setMaximum] = useState(0);
  // console.log(statesData);
  console.log(props.csv);
  const svgRef = useRef();
  const [colourScale, setColourScale] = useState();
  const pathRef = useRef();
  const [statefips, setStatefips] = useState("_nation");
  const [statename, setStateName] = useState("the United States");

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
      .range([
        "#ffedea",
        "#ffcec5",
        "#ffad9f",
        "#ff8a75",
        "#ff5533",
        "#e2492d",
        "#be3d26",
        "#9a311f",
        "#782618",
      ]);
    const svg = select(svgRef.current);
    console.log(colorScale(34.4));
    let scales = {};
    _.each(props.csv, (d) => {
      scales[d["COUNTY_NAME"]] = colorScale(d[props.ChosenDisease]);
    });
    // console.log(scales);
    setColourScale(scales);
    console.log(scales);
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

  const CountyList = ({ list }) => {
    return (
      <div>
        <p>List of Counties in {statename}</p>
        <ul>
          {list.map((item) => (
            <CountyListItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    );
  };

  const CountyListItem = ({ item }) => {
    const styles = {
      //color: colourScale[item.COUNTY_NAME],
      color: "blue",
    };

    return (
      <div>
        <li>
          <div class="input-color">
            <div
              class="color-box"
              style={{ backgroundColor: colourScale[item.COUNTY_NAME] }}
            ></div>
            <div class="CountyName">{item.COUNTY_NAME}</div>
          </div>
        </li>
      </div>
    );
  };

  const filteredCountyList = props.csv.filter(function (item) {
    return item.STATE_NAME === statename;
  });

  if (colourScale) {
    console.log(colourScale);
    return (
      <div>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column width={2}>
              <div class="CountyList">
                {" "}
                <CountyList list={filteredCountyList} id="growth" />
              </div>
            </Grid.Column>

            <Grid.Column width={14}>
              <h1>
                Prevalence of {props.ChosenDisease} in {statename}
              </h1>
              <div>
                <ComposableMap
                  data-tip
                  data-for="states"
                  projection="geoAlbersUsa"
                >
                  <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          {
                            /* const cur = props.csv.find(s => s['COUNTY_NAME'] === geo.properties.name); */
                          }
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => {
                                const fip = geo.id.substring(0, 2);
                                const cur = props.csv.find(
                                  (s) => s["STATE_FIPS"] + "" === fip
                                );
                                setStatefips(fip);
                                console.log(fip);
                                console.log(cur);
                                setStateName(cur["STATE_NAME"]);
                              }}
                              onMouseLeave={() => {
                                setStatefips("_nation");
                                setStateName("the United States");
                              }}
                              fill={
                                geo.id.substring(0, 2) === statefips
                                  ? "yellow"
                                  : colourScale[geo.properties.name]
                                  ? colourScale[geo.properties.name]
                                  : "#EEE"
                              }
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
                <ReactTooltip id="states">
                  <font size="20px">
                    <b>{statename}</b>{" "}
                  </font>
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
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  } else {
    return <p>Hello World</p>;
  }
}
export default Mapo;
