import React from "react";
import "./SideBar.css";
import { Checkbox, Chip, FormControlLabel } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

function SideBar(props) {
  const priorityLevel = ["High", "Medium", "Low"];
  const tags = [
    { name: "School", color: "#81d4fa" },
    { name: "Work", color: "#a5d6a7" },
    { name: "Fun", color: "#ef9a9a" },
    { name: "Sport", color: "#80cbc4" },
    { name: "Learning", color: "#7e57c2" },
  ];

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    props.setSelectedPriorities((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)));
  };

  const handleTagChange = (name) => {
    props.setSelectedTags((prevTags) =>
      prevTags.includes(name) ? prevTags.filter(tagName => tagName !== name) : [...prevTags, name]
    );
  };

  return (
    <div className="sideBar_main">
      <div className="sideBar_heading">Filters</div>
      <div className="sideBar_subHeading">Priority</div>
      <div className="sideBar_priority_checkbox">
        {priorityLevel.map((element, index) => (
          <FormControlLabel
            key={index}
            style={{ margin: "0" }}
            control={
              <Checkbox
                sx={{ padding: "2px", height: "20px", width: "20px", marginRight: "15px" }}
                icon={<RadioButtonUncheckedIcon sx={{ color: "#333333" }} />}
                checkedIcon={<CheckCircleIcon sx={{ color: "#80b156" }} />}
                value={element}
                checked={props.selectedPriorities.includes(element)}
                onChange={handleCheckboxChange}
              />
            }
            label={element}
          />
        ))}
      </div>

      <div className="sideBar_subHeading" style={{ marginTop: "50px" }}>
        Tags
      </div>
      <div className="sideBar_tag_chip">
        {tags.map((element, index) => (
          <Chip
            className="sideBar_chip"
            disableRipple
            label={element.name}
            key={index}
            onClick={() => handleTagChange(element.name)}            
            sx={{
              backgroundColor:'#01579b ',
              border:props.selectedTags.includes(element.name) ? `1px solid ${element.color}` : "#546E7A",
              color:props.selectedTags.includes(element.name) ? 'white' : 'white',
              "&:hover": {
                backgroundColor: "#0277bd !important", // Slightly darker hover effect
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default SideBar;
