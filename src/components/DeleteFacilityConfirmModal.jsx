import {React, useState} from 'react'
import {Modal, Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export const DeleteFacilityConfirmModal = ({toggleDeleteModal, facility}) => {
    const [showModal, setShow] = useState(true);
    const handleClose = () => {
      setShow(false);
      toggleDeleteModal();
    };

    const deleteFacility = () => {
        const requestOptions = {
        method: 'DELETE',
        };

        fetch('https://localhost:7133/facility/delete?id=' + facility.mongoId, requestOptions)
        .then(response => window.location.reload(false));  
    };

  return (
    <Modal show={showModal} onHide={handleClose}>
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
    <Button variant="secondary" onClick={handleClose}>
        Close
    </Button>
    </Modal.Footer>
    </Modal>
);
}
