import { useState } from "react";

import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { SearchResultsList } from "./components/SearchResultsList";
import "react-bootstrap";

function App() {
  const [facilities, setFacilities] = useState([]);
  const [locations, setLocations] = useState([]);


  return (
    <div className="App">
      <div className="search-bar-container">
        <h1>Geolocation Search</h1>
        <SearchBar setFacilities={setFacilities} setLocations={setLocations} />
        {((facilities && facilities.length > 0) || (locations && locations.length > 0)) && <SearchResultsList facilities={facilities} locations={locations} />}
      </div>
    </div>
  );
}

export default App;