import React, { useEffect, useState } from "react";
import { Grid, Image } from "semantic-ui-react";
import BarChartData from "./components/BarChartData";
import data from "./customgeo.json";
import USMap from "./components/USMap.js";
import Map from "./components/Map.js";
import "./App.css";
import { Dropdown } from "semantic-ui-react";
// import dataus from "./us-county-boundaries.json";
import datageo from "./components/usmap.json";
import Mapo from "./components/maps.js";
import ReactLoading from "react-loading";
import csv from "./convertcsv.json";

import Dropdownbutton from "./components/MapDropdown";
import Select from "react-select";
function App() {
  const diseaselist = ["Obesity", "Heart disease", "COPD", "diabetes", "CKD"];
  // const diseaseList = [
  //   { key: "Obesity", text: "Obesity", value: "Obesity" },
  //   { key: "Heart disease", text: "Heart disease", value: "Heart disease" },
  //   { key: "COPD", text: "COPD", value: "COPD" },
  //   { key: "diabetes", text: "diabetes", value: "diabetes" },
  //   { key: "CKD", text: "CKD", value: "CKD" },
  // ];

  const [ChosenDisease, setChosenDisease] = useState(["Obesity_prevalence"]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChoiceChange = (e) => {
    // setSelectedOption;
    let disease_prevalence = e.concat("_prevalence");
    console.log(disease_prevalence);
    setChosenDisease(disease_prevalence);
  };

  const options = [
    { value: "Obesity", label: "Obseity" },
    { value: "Heart disease", label: "Heart Disease" },
    { value: "COPD", label: "COPD" },
    { value: "diabetes", label: "Diabetes" },
    { value: "CKD", label: "CKD" },
  ];

  useEffect(() => {
    console.log("disease changed!!!");
    console.log(selectedOption);
    console.log("------");
    if (selectedOption) {
      let disease_prevalence = selectedOption.value.concat("_prevalence");
      setChosenDisease(disease_prevalence);
    }
  }, [selectedOption]);

  const DropdownButton = () => {
    const styles = {
      fontSize: 50,
      // color: "blue",
    };
    return (
      <div>
        <Select
          options={options}
          value={selectedOption}
          placeholder={"Select a disease"}
          clearable={false}
          style={styles.select}
          // style={styles.select}
          onChange={setSelectedOption}
          //
        >
          {console.log("---------------------")}
          {console.log(selectedOption)}
          {/* {diseaselist.map((choice) => (
            <option key={choice}>{choice}</option>
          ))} */}
        </Select>
      </div>
    );
  };

  const DropdownButtonCounty = () => {
    return (
      // <Dropdown
      //   placeholder="Select Disease"
      //   fluid
      //   selection
      //   options={diseaseList}
      //   onChange={handleChoiceChange}
      // />
      <div>
        <Select
          options={options}
          value={selectedOption}
          placeholder={"Select a disease"}
          clearable={false}
          // style={styles.select}
          onChange={setSelectedOption}
          //
        >
          {console.log("---------------------")}
          {console.log(selectedOption)}
          {/* {diseaselist.map((choice) => (
            <option key={choice}>{choice}</option>
          ))} */}
        </Select>
      </div>
    );
  };

  const [statesData, setStateData] = useState([]);
  const [property, setProperty] = useState("pop_est");
  useEffect(() => {
    (async () => {
      const res = await fetch(datageo);
      const statesData = await res.json();
      // Set the statesData with the data received from fetch().
      setStateData(statesData);
    })();
  }, []);
  if (statesData) {
    return (
      <div>
        <Grid divided>
          <Grid.Row>
            <Grid.Column>
              <div class="DropdownToggle">
                <DropdownButton />
              </div>
              {/* <USMap data={data} property={property} /> */}
              <Mapo data={datageo} csv={csv} ChosenDisease={ChosenDisease} />
            </Grid.Column>
            {/* <Grid.Column style={{ marginTop: "4%" }} width={6}>
              <DropdownButton />
            </Grid.Column> */}
          </Grid.Row>
        </Grid>
      </div>
    );
  } else {
    return <ReactLoading />;
  }
}

export default App;
