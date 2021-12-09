import React, { useEffect, useState } from "react";
import { Grid, Image } from "semantic-ui-react";
import data from "./customgeo.json";
import "./App.css";
import { Dropdown } from "semantic-ui-react";
import datageo from "./components/usmap.json";
import Mapo from "./components/maps.js";
import ReactLoading from "react-loading";
import csv from "./convertcsv.json";
import Dropdownbutton from "./components/MapDropdown";
import Select from "react-select";
function App() {
  const diseaselist = ["Obesity", "Heart disease", "COPD", "diabetes", "CKD"];

  const [ChosenDisease, setChosenDisease] = useState(["anycondition_prevalence"]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChoiceChange = (e) => {
    // setSelectedOption;
    let disease_prevalence = e.concat("_prevalence");
    console.log(disease_prevalence);
    setChosenDisease(disease_prevalence);
  };

  const options = [
    { value: "anycondition", label: "Any Condition" },
    { value: "Obesity", label: "Obesity" },
    { value: "Heart disease", label: "Heart Disease" },
    { value: "COPD", label: "COPD" },
    { value: "diabetes", label: "Diabetes" },
    { value: "CKD", label: "CKD" },
  ];

  useEffect(() => {
  
   
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
      
          onChange={setSelectedOption}
          //
        >
        
        </Select>
      </div>
    );
  };

  const DropdownButtonCounty = () => {
    return (
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
          
              <Mapo data={datageo} csv={csv} ChosenDisease={ChosenDisease} />
            </Grid.Column>
           
          </Grid.Row>
        </Grid>
      </div>
    );
  } else {
    return <ReactLoading />;
  }
}

export default App;
