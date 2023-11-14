import {React, useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { SaveFacilityModalConfirm } from './SaveFacilityModalConfirm';
import './CreateFacilityModal.css';
export const CreateFacilityModal = ({toggleCreateFacilityModal}) => {

  const [ianaDropdownItems, setIanaDropdownItems] = useState([]);
  const [countryDropdownItems, setCountryDropdownItems] = useState([]);
  const [stateProvinceDropdownItems, setStateProvinceDropdownItems] = useState([]);
  const [filteredStateProvinceDropdownItems, setFilteredStateProvinceDropdownItems] = useState([]);

  useEffect(() => {
    //get IANA from the database
    fetch("https://localhost:7133/timezone/iana", {method: 'GET'})
    .then(response => response.json())
    .then((json) => {
      if(json.hits != null && json.hits.length > 0){
        var ianaDropdownItems = [{key: "", value: ""}];
        json.hits.forEach(element => {
          if(element.gId != null && element.value != null)
            ianaDropdownItems.push({key: element.gId, value: element.value});
        });
        setIanaDropdownItems(ianaDropdownItems);
      }
    });
    
    //get all countries from the database
    fetch("https://localhost:7133/country/country", { method: 'GET' })
    .then(response => response.json())
    .then((json) => {
      if(json.hits != null && json.hits.length > 0){
        var countryDropdownItems = [{ id: "", name: "", code: ""}];
        json.hits.forEach(element => {
          if(element.gId != null && element.code != null && element.name)
            countryDropdownItems.push({id: element.gId, name: element.name, code: element.code});
        });
        setCountryDropdownItems(countryDropdownItems);
      }
    });
    //get states/provinces from the database
    fetch("https://localhost:7133/stateProvince/stateProvince", { method: 'GET' })
    .then(response => response.json())
    .then((json) => {
      if(json.hits != null && json.hits.length > 0){
        var stateProvinceDropdownItems = [{id: "", name: "", code: "", country: ""}];
        json.hits.forEach(element => {
          if(element.gId != null && element.code != null && element.name && element.country != null && element.country.gId != null)
            stateProvinceDropdownItems.push({id: element.gId, name: element.name, code: element.code, country: element.country.gId});
        });
        setStateProvinceDropdownItems(stateProvinceDropdownItems);
      }
    });
  }, []);

  const [showModal, setShow] = useState(true);
  const handleClose = () => 
  {
    setShow(false);
    toggleCreateFacilityModal();
  };

  const [showSaveModal, setSaveModal] = useState(false);
  const toggleSaveModal = () => setSaveModal(!showSaveModal);

  const [saveModalMessage, setSaveModalMessage] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  //facility fields
  const [displayName, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [iana, setIana] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [courseInfoId, setCourseInfoId] = useState("");
  const [crmId, setCrmId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [useAutoUpdate, setUseAutoUpdate] = useState(true);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [stateProvince, setStateProvince] = useState({id: "", name: "", code: "", country: ""});
  const [country, setCountry] = useState({id: "", name: "", code: ""});
  const [countryDisplay, setCountryDisplay] = useState("");
  const [stateProvinceDisplay, setStateProvinceDisplay] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const updateDisplayName = (value1, value2, value3, value4) => 
  {
    var combined = "";
    if(value1 != null && value1 !== "")
    {
      combined = value1;
      if(value2 != null && value2 !== "")
        combined = combined + ", " + value2;
      if(value3 != null && value3 !== "")
        combined = combined + ", " + value3;
      if(value4 != null && value4 !== "")
        combined = combined + ", " + value4;
    }
    else if(value2 != null && value2 !== "")
    {
      combined = value2;
      if(value3 != null && value3 !== "")
        combined = combined + ", " + value3;
      if(value4 != null && value4 !== "")
        combined = combined + ", " + value4;
    }
    else if(value3 != null && value3 !== "")
    {
      combined = value3;
      if(value4 != null && value4 !== "")
        combined = combined + ", " + value4;
    }
    else if(value4 != null && value4 !== "")
    {
      combined = value4;
    }
    setDisplayName(combined);
  };

  const handleShortNameChange = (input) => {
    setShortName(input);
    updateDisplayName(input, municipality, "", country.code);
  };

  const handleMunicipalityChange = (input) => {
    setMunicipality(input);
    updateDisplayName(shortName, input, "", country.code);
  };

  const handleStateProvinceChange = (input) => {
    //deserializ stateProvince
    const tempStateProvince = JSON.parse(input);
    setStateProvince(tempStateProvince);
    setStateProvinceDisplay(tempStateProvince.name);
    updateDisplayName(shortName, municipality, tempStateProvince.code, country.code);
  };

  const setCountryAndFilterStates = (input) => {
    //deserializ country
    const tempCountry = JSON.parse(input);
    setCountry(tempCountry);
    setCountryDisplay(tempCountry.name);
    updateDisplayName(shortName, municipality, "", tempCountry.code)
    setFilteredStateProvinceDropdownItems([]);
    if(country != null && stateProvinceDropdownItems != null && stateProvinceDropdownItems.length > 0){
      var tempFilteredStateProvinceDropdownItems = [{id: "", name: "", code: "", country: ""}];
      stateProvinceDropdownItems.forEach(element => {
        if(element.country != null && element.country === tempCountry.id)
          tempFilteredStateProvinceDropdownItems.push(element);
      });
      setFilteredStateProvinceDropdownItems(tempFilteredStateProvinceDropdownItems);
    }
  };

  const saveFacility = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        "displayName": displayName,
        "name": name,
        "shortName": shortName,
        "iana": iana,
        "lat": lat,
        "long": long,
        "courseInfoId": courseInfoId,
        "crmId": crmId,
        "isActive": isActive,
        "useAutoUpdate": useAutoUpdate,
        "addressLine1": addressLine1,
        "addressLine2": addressLine2,
        "municipality": municipality,
        "stateProvinceId": stateProvince.id,
        "countryId": country.id,
        "postalCode": postalCode
      })
    };

    fetch("https://localhost:7133/facility/create", requestOptions)
    .then(response => response.json())
    .then((json) => {
      if(json.success != null && json.success === true && json.facilityId != null){
        setFacilityId(json.facilityId);
        setSaveModalMessage("Facility successfully created!");
        setIsDisabled(true);
        setIsReadOnly(true);
        toggleSaveModal();      
      }
      else{
        var message = "Facilility creation failed!";
        if(json.message != null)
          message = message + " Message: " + json.message;
        setSaveModalMessage(message);
        toggleSaveModal();
      }
    });
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <h1>Create Facility</h1>
        </Modal.Header>
        <Modal.Body>
                  <div className="form-group">
                    <label className="edit-label" htmlFor="facilityId">Facility ID:</label><input className="edit-input" defaultValue={facilityId} id="facilityId" disabled={true} readOnly={true}></input>
                  </div>
                  <div className="form-group">
                    <label className="edit-label" htmlFor="courseInfoId">CourseInfo ID:</label><input className="edit-input" onChange={(e) => setCourseInfoId(e.target.value)} defaultValue={courseInfoId} id="courseInfoId" disabled={isDisabled} readOnly={isReadOnly}></input>
                    <label className="edit-label" htmlFor="crmId">CRM ID:</label><input className="edit-input" onChange={(e) => setCrmId(e.target.value)} defaultValue={crmId} id="crmId" disabled={isDisabled} readOnly={isReadOnly}></input>
                  </div>
                  <div className="form-group">
                    <label className="edit-label" htmlFor="name">Name:</label>
                    <input className="edit-input" onChange={(e) => setName(e.target.value)} defaultValue={name} id="name" disabled={isDisabled} readOnly={isReadOnly}></input>
                  </div>
                  <div className="form-group">
                    <label className="edit-label" htmlFor="shortName">Short Name:</label>
                    <input className="edit-input" onChange={(e) => handleShortNameChange(e.target.value)} defaultValue={shortName} id="shortName" disabled={isDisabled} readOnly={isReadOnly}></input>
                  </div>
                  <div>
                    <h4>Address:</h4>
                    <div className="form-group">
                      <div className='country-iana-boxes'>
                      <label className="edit-label" htmlFor="country">Country:</label>
                          <select id='countrySelectBox' onChange={(event) => setCountryAndFilterStates(event.target.value)} defaultValue={countryDisplay} disabled={isDisabled} readOnly={isReadOnly}>
                            {countryDropdownItems && countryDropdownItems.length > 0 && countryDropdownItems.map((item) => (
                              <option key={item.id} value={JSON.stringify(item)}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                      </div>
                      <div className='address-text-box'>
                        <label className="edit-label" htmlFor="addressLine1">Line 1:</label>
                        <input className="edit-input" onChange={(e) => setAddressLine1(e.target.value)} defaultValue={addressLine1} id="addressLine1" disabled={isDisabled} readOnly={isReadOnly}></input>
                      </div>
                      <div className='address-text-box'>
                        <label className="edit-label" htmlFor="addressLine2">Line 2:</label>
                        <input className="edit-input" onChange={(e) => setAddressLine2(e.target.value)} defaultValue={addressLine2} id="addressLine2" disabled={isDisabled} readOnly={isReadOnly}></input>
                      </div>
                      <div className='address-text-box'>
                        <label className="edit-label" htmlFor="municipality">Municipality:</label>
                        <input className="edit-input" onChange={(e) => handleMunicipalityChange(e.target.value)} defaultValue={municipality} id="municipality" disabled={isDisabled} readOnly={isReadOnly}></input>
                        <label className="edit-label" htmlFor="stateProvince">State/Province:</label>
                        <select id='stateSelectBox' onChange={(event) => handleStateProvinceChange(event.target.value)} defaultValue={stateProvinceDisplay} disabled={isDisabled} readOnly={isReadOnly}>
                          {filteredStateProvinceDropdownItems && filteredStateProvinceDropdownItems.length > 0 && filteredStateProvinceDropdownItems.map((item) => (
                            <option key={item.id} value={JSON.stringify(item)}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='address-text-box'>
                        <label className="edit-label" htmlFor="postalCode">Postal Code:</label>
                        <input className="edit-input" onChange={(e) => setPostalCode(e.target.value)} defaultValue={postalCode} id="postalCode" disabled={isDisabled} readOnly={isReadOnly}></input>
                        <label className="edit-label" htmlFor="iana">IANA Timezone:</label>
                        <select id='ianaSelectBox' onChange={(event) => setIana(event.target.value)} value={iana} disabled={isDisabled} readOnly={isReadOnly}>
                          {ianaDropdownItems && ianaDropdownItems.length > 0 && ianaDropdownItems.map((item) => (
                            <option key={item.key} value={item.value}>
                              {item.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className='edit-label' htmlFor="lat">Lat:</label><input className="edit-input" onChange={(e) => setLat(e.target.value)} defaultValue={lat} id="lat" disabled={isDisabled} readOnly={isReadOnly}></input>
                      <label className='edit-label' htmlFor="long">Long:</label><input className="edit-input" onChange={(e) => setLong(e.target.value)} defaultValue={long} id="long" disabled={isDisabled} readOnly={isReadOnly}></input>
                    </div>
                  </div>
                  <div>
                  <div className="form-group">
                    <h4>Display Name:</h4>
                    <input className="edit-input" onChange={(e) => setDisplayName(e.target.value)} defaultValue={displayName} id="displayName" disabled={isDisabled} readOnly={isReadOnly}></input>
                  </div>
                  </div>
                  <div>
                    <h4>Settings:</h4>
                    <div className="form-group">
                      <label className="edit-label" htmlFor="isActive">Active:</label>
                      <input className="edit-input" type="checkbox" onChange={(e) => setIsActive(e.target.checked)} checked={isActive} id="isActive" disabled={isDisabled} readOnly={isReadOnly}></input>
                      <label className="edit-label" htmlFor="useAutoUpdate">Auto Update:</label>
                      <input className="edit-input" type="checkbox" onChange={(e) => setUseAutoUpdate(e.target.checked)} checked={useAutoUpdate} id="useAutoUpdate" disabled={isDisabled} readOnly={isReadOnly}></input>
                    </div>
                  </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={saveFacility}>
            Save
        </Button>
        </Modal.Footer>
    </Modal>
    {showSaveModal && <SaveFacilityModalConfirm toggleSaveModal={toggleSaveModal} saveModalMessage={saveModalMessage} reloadPage={false}/> }
    </div>

    );
}
