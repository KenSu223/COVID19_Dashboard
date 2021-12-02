import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import { Grid, GridColumn, Image } from "semantic-ui-react";
import * as d3 from "d3";
import Select from "react-select";
import _ from "lodash";
import { scaleQuantile } from "d3-scale";
import { Table, Header } from 'semantic-ui-react'
import ReactTooltip from "react-tooltip";
import statedic from "./statedic.json";
import nationdic from "./nation.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import sq from '@vx/scale/scaleQuantile';
import "./maps.css";
import {
  ComposableMap,
  Geographies,
  ZoomableGroup,
  Geography,
} from "react-simple-maps";
import { Dropdown } from "semantic-ui-react";
// import { LegendQuantile } from 'react-d3-legends';
import {
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from "@vx/legend";
function CBar(props) {
  const cur = props.data.filter(function (item) {
    return item['STATE_NAME'] == props.statename;
  });
  console.log(cur);

  console.log(typeof (props.disease));
  return (
    <ResponsiveContainer width="100%" height={400}><BarChart

      data={cur}
      margin={{
        top: 5,
        right: 30,
        left: 0,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="COUNTY_NAME" tick={false} />
      <YAxis />
      <Tooltip />
      <Legend />
      {typeof (props.disease) === 'object' ? <Bar dataKey={props.disease[0]} fill="#396EB0" /> : <Bar dataKey={props.disease} fill="#396EB0" />}
      {/* <Bar dataKey={props.disease} fill="#8884d8" /> */}
      {/* <Bar dataKey="uv" fill="#82ca9d" />  */}
    </BarChart></ResponsiveContainer>)
}
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
function Mapo(props) {
  const [statesData, setStateData] = useState(props.data);
  const [maximum, setMaximum] = useState(0);
  // console.log(statesData);
  console.log(props.csv);
  const svgRef = useRef();
  const [colourScale, setColourScale] = useState();
  const pathRef = useRef();
  const [colorfunction, setColorfunction] = useState();
  const [clickedfips, setClickedfips] = useState();
  const [clicked, setClicked] = useState(false);

  const [statefips, setStatefips] = useState("_nation");
  const [statename, setStateName] = useState("the United States");
  const [clickedState, setStateClickedState] = useState("the United States");
  useEffect(() => {
    console.log(statedic);
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
        "#fff7ec",
        "#fee8c8",
        "#fdd49e",
        "#fdbb84",
        "#fc8d59",
        "#ef6548",
        "#d7301f",
        "#990000",
      ]);
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
        <p>List of Counties in {clickedState}</p>
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
    return item.STATE_NAME === clickedState;
  });

  const filteredCountyOptions = filteredCountyList.map((item) => {
    return { value: item.COUNTY_NAME, label: item.COUNTY_NAME };
  });

  console.log(filteredCountyOptions);
  //select county
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    console.log("disease changed!!!");
    console.log(selectedOption);
    console.log("------");
    if (selectedOption) {
      let disease_prevalence = selectedOption.value.concat("_prevalence");
      // setChosenDisease(disease_prevalence);
    }
  }, [selectedOption]);

  const CountyDropdown = () => {
    return (
      <div>
        <Select
          options={filteredCountyOptions}
          value={selectedOption}
          placeholder={"Select a County"}
          clearable={false}
          // style={styles.select}

          onChange={setSelectedOption}
        //
        >
          {/* {diseaselist.map((choice) => (
            <option key={choice}>{choice}</option>
          ))} */}
        </Select>
      </div>
    );
  };

  const CountyPercentageCircle = (data) => {
    console.log(filteredCountyList);
    let ChosenCounty = filteredCountyList.filter(function (item) {
      if (selectedOption) {
        return item.COUNTY_NAME === selectedOption.value;
      }
    });
    // ChosenCounty = ChosenCounty[0];
    let percent = "";
    let ChosenCountyName = " ";
    if (ChosenCounty.length != 0) {
      ChosenCountyName = ChosenCounty[0]["COUNTY_NAME"];
      Array.isArray(props.ChosenDisease)
        ? (percent = ChosenCounty[0][props.ChosenDisease[0]])
        : (percent = ChosenCounty[0][props.ChosenDisease]);
    }

    return (
      <div>
        <div>
          <h2 style={{ textSize: "12px" }}></h2>
        </div>
        <CircularProgressbarWithChildren
          styles={buildStyles({ textSize: "16px", pathColor: "#990000" })}
          value={percent}
        // text={`${percent}%`}
        >
          <div
            style={{
              fontSize: 20,
              width: "70%",
              marginTop: -5,
              lineHeight: 1.5,
              justifyContent: "center",
            }}
          >
            <center>
              {props.ChosenDisease} in {ChosenCountyName}
              <br />
              <strong style={{ fontsSize: 30 }}>{percent}%</strong>
            </center>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    );
  };

  const CustomizedLabellist_state = (props) => {
    const { value } = props;
    console.log(props);
    return <g>asdf</g>;
  };
  const legendGlyphSize = 15;
  let colorScale = scaleQuantile()
    .domain([
      0,
      d3.max(props.csv, function (d) {
        // console.log(d.Obesity_prevalence);
        return d[props.ChosenDisease].toFixed(0);
      }),
    ])
    .range([
      "#fff7ec",
      "#fee8c8",
      "#fdd49e",
      "#fdbb84",
      "#fc8d59",
      "#ef6548",
      "#d7301f",
      "#990000",
    ]);
  if (colourScale) {
    console.log(colourScale);
    return (
      <div>
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column width={2}>
              <div class="CountyList">
                {" "}
                <CountyList list={filteredCountyList} id="growth" />
              </div>
            </Grid.Column>
            {/* <svg class='legend'></svg> */}

            <Grid.Column width={10}>
              <h1>
                Prevalence of {props.ChosenDisease} in {clickedState}
              </h1>
              <div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  <LegendQuantile scale={colorScale}>
                    {(labels) =>
                      labels.map((label, i) => (
                        <LegendItem key={`legend-${i}`}>
                          <svg
                            width={legendGlyphSize}
                            height={legendGlyphSize}
                            style={{ margin: "2px 0" }}
                          >
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
                </div>
              </div>
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
                              onClick={() => {
                                const fip = geo.id.substring(0, 2);
                                const cur = props.csv.find(
                                  (s) => s["STATE_FIPS"] + "" === fip
                                );
                                setStateClickedState(cur["STATE_NAME"]);
                                setClickedfips(fip);
                                setClicked(true);
                              }}
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
                              style={{
                                default: {
                                  outline: 'none'
                                },
                                hover: {
                                  outline: 'none'
                                },
                                pressed: {
                                  outline: 'none'
                                }
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
              </div>

            </Grid.Column>
            <Grid.Column width={5}>
            <Table celled fixed style={{ width: "100%" }}>
            <Table.Header>

            <tr textalign="center" colSpan="3"
            style={{ backgroundColor: '#94B3FD'}}
            >
            <td colSpan='1' style={{ width: 135,fontSize: '14px', textAlign: "center", fontWeight: 700, color: "black"  }}>Total Number </td>
            <td colSpan='1' style={{ width: 110, fontSize: '14px', textAlign: "center", fontWeight: 700, color: "black" }}> {clicked?clickedState: ""}</td>
            <td colSpan='1' style={{ width: 110, fontSize: '14px', textAlign: "center",  fontWeight: 700, color: "black" }}> U.S.</td>
            </tr>


            <Table.Row textAlign='center'>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {"Obesity"} </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {clicked?statedic[clickedfips]['Obesity_number']: <div></div>} </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {nationdic[0]['Obesity_number']} </Table.HeaderCell>

            </Table.Row>
            <Table.Row textAlign='center'>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {"CKD"} </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {clicked?statedic[clickedfips]['CKD_number']: <div></div>}  </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {nationdic[0]['CKD_number']} </Table.HeaderCell>

            </Table.Row>
            <Table.Row textAlign='center'>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {"COPD"} </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {clicked?statedic[clickedfips]['COPD_number']: <div></div>}  </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {nationdic[0]['COPD_number']} </Table.HeaderCell>

            </Table.Row>
            <Table.Row textAlign='center'>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {"Heart Disease "} </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {clicked?statedic[clickedfips]['Heart disease_number']: <div></div>}  </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {nationdic[0]['Heart disease_number']} </Table.HeaderCell>

            </Table.Row>
            <Table.Row textAlign='center'>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {"Diabetes "} </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {clicked?statedic[clickedfips]['diabetes_number']: <div></div>}  </Table.HeaderCell>
            <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 700 }}> {nationdic[0]['diabetes_number']} </Table.HeaderCell>

            </Table.Row>

          {/* <Table.Row textAlign = 'center'>
                                  <Table.HeaderCell style={{fontSize: '19px'}}> {"Moderna Vaccine"} </Table.HeaderCell>
                                  <Table.HeaderCell style={{fontSize: '19px'}}> {numberWithCommas(vaccineData["_nation"]["Administered_Moderna"])} </Table.HeaderCell>
                                  <Table.HeaderCell style={{fontSize: '19px'}}> {numberWithCommas(vaccineData[stateMapFips]["Administered_Moderna"])} </Table.HeaderCell>

                                </Table.Row>
                                <Table.Row textAlign = 'center'>
                                  <Table.HeaderCell style={{fontSize: '19px'}}> {"Pfizer \n \n Vaccine"} </Table.HeaderCell>
                                  <Table.HeaderCell style={{fontSize: '19px'}}> {numberWithCommas(vaccineData["_nation"]["Administered_Pfizer"])} </Table.HeaderCell>
                                  <Table.HeaderCell style={{fontSize: '19px'}}> {numberWithCommas(vaccineData[stateMapFips]["Administered_Pfizer"])} </Table.HeaderCell>

                                </Table.Row> */}


            </Table.Header>
            </Table>

            <CountyDropdown />
            <CountyPercentageCircle data={props.csv} />
</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={2}>

            </Grid.Column>
            <Grid.Column width={12}>
              <div>
                {clicked ? <CBar statename={clickedState} disease={props.ChosenDisease} fip={clickedfips} data={props.csv} /> : <div></div>}
              </div>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </div>
    );
  } else {
    return <p> Please enable Javascript</p>;
  }
}
export default Mapo;
