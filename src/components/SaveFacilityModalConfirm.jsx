import {React, useState} from 'react'
import {Modal, Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

export const SaveFacilityModalConfirm = ({toggleSaveModal, saveModalMessage, reloadPage}) => {
    const [showModal, setShow] = useState(true);
    const handleClose = () => {
        toggleSaveModal();
        if(reloadPage)
            window.location.reload(false);
    };

  return (
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Save Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h3>{saveModalMessage}</h3>          
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        </Modal.Footer>
        </Modal>
  );
}
