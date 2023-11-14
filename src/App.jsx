import { useState } from "react";

import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { SearchResultsList } from "./components/SearchResultsList";
import "react-bootstrap";
import { Button } from "react-bootstrap";
import { CreateFacilityModal } from "./components/CreateFacilityModal";

function App() {
  const [facilities, setFacilities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showCreateFacilityModal, setShowCreateFacilityModal] = useState(false);
  const toggleCreateFacilityModal = () => setShowCreateFacilityModal(!showCreateFacilityModal);

  return (
    <div className="App">
      <div className="search-bar-container">
        <h1>Geolocation Search</h1>
        <SearchBar setFacilities={setFacilities} setLocations={setLocations} />
        {((facilities && facilities.length > 0) || (locations && locations.length > 0)) && <SearchResultsList facilities={facilities} locations={locations} />}
      </div>
      <div className="create-facility-main">
        <Button variant="primary" onClick={toggleCreateFacilityModal}>Create Facility</Button>
        {showCreateFacilityModal && <CreateFacilityModal toggleCreateFacilityModal={toggleCreateFacilityModal}/>}
      </div>
    </div>
  );
}

export default App;