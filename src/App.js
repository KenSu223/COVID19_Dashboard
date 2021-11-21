import React,{useState} from 'react';
import BarChartData from './components/BarChartData'
import data from "./customgeo.json"
import USMap from"./components/USMap.js"

function App() {
  const [property,setProperty]=useState("pop_est");
  return (
  	<div>
    <USMap data={data} property={property}/>
    </div>
    
  )
}

export default App;
