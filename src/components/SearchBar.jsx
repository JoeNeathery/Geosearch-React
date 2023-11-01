import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
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
                        "Lat": location.latitude
                    })
                };

                fetch('https://localhost:7133/geolocation/facility/near', requestOptions)
                .then(response => response.json())
                .then((json) => setResults(json.hits));     
            }
            else{
              setResults([]);
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
              console.log(position.coords.latitude, position.coords.longitude);
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
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    );
  };