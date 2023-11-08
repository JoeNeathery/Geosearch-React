import React, { useState } from 'react';
import "./SearchResults.css";
import {Modal, Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export const SearchResult = ({ result, resultId, type }) => {
  const [showModal, setShow] = useState(false);
  const [showDeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showSaveModal, setSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState("");
  const [facility, setFacility] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const handleSaveConfirmationClose = () => 
  {
    setSaveModal(false);
    window.location.reload(false);
  };

  const handleSaveonfirmationShow = () => {
    setSaveModal(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleDeleteConfirmationClose = () => setDeleteConfirmation(false);
  const handleDeleteConfirmationShow = () => {
    setDeleteConfirmation(true);
  };
  const fetchData = () => {
    if(type.toLowerCase() === "facility"){
        const requestOptions = {
          method: 'GET',
        };

      fetch('https://localhost:7133/geolocation/facility?id=' + resultId, requestOptions)
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
      handleShow();
    }
  };

  const deleteFacility = () => {
    const requestOptions = {
      method: 'DELETE',
    };

    fetch('https://localhost:7133/geolocation/facility?id=' + resultId, requestOptions)
    .then(response => window.location.reload(false));  
  };

  const saveFacility = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
          "gId": facility.mongoId,
          "Long": long,
          "Lat": lat,
          "DisplayName": displayName,
      })
    };
    fetch('https://localhost:7133/geolocation/facility/update', requestOptions)
    .then(response => response.json())
    .then((json) => {
      if(json != null && json.success != null)
      {
        if(json.success === true)
          setSaveModalMessage("Facility Updates Saved");
        else
          setSaveModalMessage("Facility Updates Failed: " + json.message);
      }
      else
        setSaveModalMessage("Facility Updates Failed" );
      
      setSaveModal(true);
    });
  };

  return (
    <div>
      <div
        className="search-result"
        onClick={fetchData}
      >
        {result}
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        {facility && <Modal.Title>{facility.displayName}</Modal.Title> }
        {!facility && <Modal.Title>Facility Not Found</Modal.Title>}
        </Modal.Header>
        {facility && 
                <Modal.Body>
                <div className="form-group">
                  <label className="edit-label" htmlFor="facilityId">Facility ID:</label><input className="edit-input" defaultValue={facility.mongoId} id="facilityId" disabled={true} readOnly={true}></input>
                </div>
                <div className="form-group">
                  <label className="edit-label" htmlFor="displayName">Display Name:</label>
                  <input className="edit-input" onChange={(e) => setDisplayName(e.target.value)} defaultValue={displayName} id="displayName" ></input>
                </div>
                <div className='form-group'>
                  <label className='edit-label' htmlFor="lat">Lat:</label><input className="edit-input" onChange={(e) => setLat(e.target.value)} defaultValue={lat} id="lat"></input>
                  <label className='edit-label' htmlFor="long">Lat:</label><input className="edit-input" onChange={(e) => setLong(e.target.value)} defaultValue={long} id="long"></input>
                </div>
              </Modal.Body>
        }
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteConfirmationShow}>
            Delete
          </Button>
          <Button variant="primary" onClick={saveFacility}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteConfirmation} onHide={handleDeleteConfirmationClose}>
        <Modal.Header closeButton>
        {facility && <Modal.Title>DELETE</Modal.Title> }
        </Modal.Header>
        <Modal.Body>
        <h3>Are you sure you want to delete this facility?</h3>          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteFacility}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleDeleteConfirmationClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSaveModal} onHide={handleSaveConfirmationClose}>
        <Modal.Header closeButton>
        {facility && <Modal.Title>Save</Modal.Title> }
        </Modal.Header>
        <Modal.Body>
          <h3>{saveModalMessage}</h3>          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveConfirmationClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>    
  );
};