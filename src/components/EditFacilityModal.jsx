import {React, useState} from 'react'
import {Modal, Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { DeleteFacilityConfirmModal } from './DeleteFacilityConfirmModal';
import { SaveFacilityModalConfirm } from './SaveFacilityModalConfirm';
import './EditFacilityModal.css';

export const EditFacilityModal = ({toggleEditModal, facility, displayName, lat, long}) => {
    const [showModal, setShow] = useState(true);
    const handleClose = () => {
        setShow(false);
        toggleEditModal();
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    const [showSaveModal, setSaveModal] = useState(false);
    const toggleSaveModal = () => setSaveModal(!showSaveModal);

    const [saveModalMessage, setSaveModalMessage] = useState("");

    const setDisplayName = (value) => 
    {
        displayName = value;
    };

    const setLat = (value) => {
        lat = value;
    };

    const setLong = (value) => {
        long = value;
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

        fetch('https://localhost:7133/facility/update', requestOptions)
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
        
        toggleSaveModal();
        });
  };

  return (
    <div>
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
        <Button variant="danger" onClick={toggleDeleteModal}>
            Delete
        </Button>
        <Button variant="primary" onClick={saveFacility}>
            Save
        </Button>
        </Modal.Footer>
    </Modal>
    {showDeleteModal && <DeleteFacilityConfirmModal toggleDeleteModal={toggleDeleteModal} facility={facility}/>}
    {showSaveModal && <SaveFacilityModalConfirm toggleSaveModal={toggleSaveModal} saveModalMessage={saveModalMessage} reloadPage={true}/>}
    </div>
    );
}