import React, { useRef, useEffect, useState } from "react";
function Mapo (props){
    const [statesData,setStateData]=useState(props.data);
    console.log(statesData);
    return (
        <svg viewBox="0 0 960 600">
          {statesData.map((stateData, index) =>
            <path
              className="someCSSClass"
              style={{cursor: "pointer", fill: "orange"}}
              key={index}
              stroke="#fff"
              strokeWidth="6px"
              d={stateData.shape}
              onMouseOver={(event) => {
                event.target.style.fill = 'red';
              }}
              onMouseOut={(event) => {
                event.target.style.fill = 'orange';
              }}
            >
            </path>
          )}
        </svg>
      )
}
export default Mapo;