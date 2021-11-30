import DropdownButton from "react-bootstrap/DropdownButton";
// import Dropdown from "react-bootstrap/Dropdown";
import { Dropdown } from "semantic-ui-react";
import React, { useRef, useEffect, useState } from "react";

const diseaseList = [
  { key: "Obesity", text: "Obesity", value: "Obesity" },
  { key: "Heart Disease", text: "Heart Disease", value: "Heart Disease" },
  { key: "COPD", text: "COPD", value: "COPD" },
  { key: "Diabetes", text: "Diabetes", value: "Diabetes" },
  { key: "CKD", text: "CKD", value: "CKD" },
];

// const DropdownExampleSelection = () => (
//   <Dropdown
//     placeholder="Select Friend"
//     fluid
//     selection
//     options={friendOptions}
//   />
// );

// export default DropdownExampleSelection;

const DropdownSelection = () => {
  //   const [DiseaseChoice, setDiseaseChoice] = useState([
  //     "Obesity",
  //     "Heart Disease",
  //     "COPD",
  //     "Diabetes",
  //     "CKD",
  //   ]);
  const [ChosenDisease, setChosenDisease] = useState(["Obesity"]);

  const handleChoiceChange = (event, data) => {
    setChosenDisease(data.value);
  };

  return (
    <Dropdown
      placeholder="Select Disease"
      fluid
      selection
      options={diseaseList}
      onChange={handleChoiceChange}
    />
  );
};

export default DropdownSelection;
