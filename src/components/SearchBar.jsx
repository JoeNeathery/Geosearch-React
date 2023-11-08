import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

export const SearchBar = ({ setFacilities, setLocations }) => {
    const [input, setInput] = useState("");
    const [location, setLocation] = useState({longitude: -81.3792, latitude: 28.5383});

    const fetchData = (value) => {
            if(value.length > 2)
            {
              //get coordinates
                getGeolocation();
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({
                        "Text": value,
                        "Long": location.longitude,
                        "Lat": location.latitude,
                    })
                };

                const limit = 5;

                fetch('https://localhost:7133/geolocation/facility/nearV2?limit=' + limit, requestOptions)
                .then(response => response.json())
                .then((json) => {
                  if(json.hits != null && json.hits.length > 0){
                    var facilities = [];
                    var locations = [];
                    json.hits.forEach(hit => {
                      if(hit.type != null){
                        if(hit.type.toLowerCase() === "facility"){
                          facilities.push(hit);
                        }
                        else if(hit.type.toLowerCase() === "location"){
                          locations.push(hit);
                        }
                      }
                    });
                    setFacilities(facilities);
                    setLocations(locations);
                  }
                  else{
                    setFacilities([]);
                    setLocations([]);
                  }
                });     
            }
            else{
              setFacilities([]);
              setLocations([]);
            }
      };

      const getGeolocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.log(error);
            }
          );
        }
      };
    
      const handleChange = (value) => {
        setInput(value);
        fetchData(value);
      };
    return (
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          className="search-input"
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    );
  };