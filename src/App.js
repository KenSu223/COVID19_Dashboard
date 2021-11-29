import React, { useEffect, useState } from "react";
import BarChartData from "./components/BarChartData";
import data from "./customgeo.json";
import USMap from "./components/USMap.js";
import Map from "./components/Map.js";
import dataus from "./us-county-boundaries.json";
import datageo from "./components/usmap.json";
import Mapo from "./components/maps.js";
import ReactLoading from "react-loading";
import csv from "./convertcsv.json";
import Dropdownbutton from "./components/Dropdownbutton";
function App() {
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
        <USMap data={data} property={property} />
        <Mapo data={datageo} csv={csv} />
      </div>
    );
  } else {
    return <ReactLoading />;
  }
}

export default App;
