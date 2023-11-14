import React, { useState } from 'react';
import "./SearchResults.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { EditFacilityModal } from './EditFacilityModal';

export const SearchResult = ({ result, resultId, type }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  const [facility, setFacility] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const fetchData = () => {
    if(type.toLowerCase() === "facility"){
        const requestOptions = {
          method: 'GET',
        };

      fetch('https://localhost:7133/facility/get?id=' + resultId, requestOptions)
      .then(response => response.json())
      .then((json) => {
        if(json.hits != null && json.hits.length > 0){
          setFacility(json.hits[0]);
          
          if(json.hits[0].geo != null){

            if(json.hits[0].geo.lat != null)
              setLat(json.hits[0].geo.lat);

            if(json.hits[0].geo.long != null)
              setLong(json.hits[0].geo.long);
          }

          if(json.hits[0].displayName != null)
            setDisplayName(json.hits[0].displayName);

        }
      });  
      toggleEditModal();
    }
  };

  return (
    <div>
      <div
        className="search-result"
        onClick={fetchData}
      >
        {result}
      </div>
      {showEditModal && <EditFacilityModal toggleEditModal={toggleEditModal} facility={facility} displayName={displayName} lat={lat} long={long}/>}
    </div>    
  );
};