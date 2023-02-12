import axios from 'axios';
import { Row, Col, Container,Modal,Button } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';

const PatchFormPage = () => {
  const [companyDetail, setCompanyDetail] = useState([]);
  const [getName, setGetName] = useState("");
  const auditorNameRef = useRef();
  const registrationNumberRef = useRef();
  const nameRef = useRef();
  const externalProfilesValRef = useRef();
  const externalProfilesLabRef = useRef();
  const externalProfilesValNewRef = useRef();
  const externalProfilesLabNewRef = useRef();
  const tagsRef = useRef();
  const tagsNewRef=useRef();
  const [target,setTarget]=useState("");

  const [show, setShow] = useState(false);
  const [editable,setEditable]=useState({});



  const getDetail = async () => {
    
    try {
      let movieLists = await axios.get("http://localhost:3001/detail");
      setCompanyDetail(movieLists.data);
      
    } catch (e) {
      console.log("eeee--", e);
    }
  }
  useEffect(() => {
    getDetail();
  }, [])

  const onChangeText = (e) => {
    setGetName(e.target.name)
  }

  const handleClose = () => setShow(false);
  

  const handleAddUpdate=(e)=>{
    //onClickGet(e)
    setShow(true);
    setTarget(e.target.name);
  }


  const onClickGet = async () => {
    let data = {};
    if (getName === "auditor_name") {
      data = { "path": "/" + auditorNameRef.current.name, "value": auditorNameRef.current.value }
    } else if (getName === "name") {
      data = { "path": "/" + nameRef.current.name, "value": nameRef.current.value }
    } else if (getName === "external_profiles_val") {
      data = { "path": externalProfilesValRef.current.id, "value": externalProfilesValRef.current.value }
    } else if (getName === "external_profiles_lab") {
      data = { "path": externalProfilesLabRef.current.id, "value": externalProfilesLabRef.current.value }
    } else if (getName === "registration_number") {
      data = { "path": "/" + registrationNumberRef.current.name, "value": registrationNumberRef.current.value }
    } else if (getName === "tags") {
      data = { "path": tagsRef.current.id, "value": tagsRef.current.value }
    }
    else if (getName === "tags_new") {
      data = { "path": tagsNewRef.current.id, "value": tagsNewRef.current.value }
      tagsNewRef.current.value="";
    }
    else if (getName === "external_profiles_lab_new" || getName === "external_profiles_val_new") {
      data = {
        "path": externalProfilesLabNewRef.current.id, "value": {
          "label": externalProfilesLabNewRef.current.value,
          "uri": externalProfilesValNewRef.current.value
        }
      }
      externalProfilesLabNewRef.current.value="";
      externalProfilesValNewRef.current.value="";
    }
      
      let apiUrl = "";
      if (target === "edit") {
        apiUrl = "http://localhost:3001/update";
      }
      if (target === "add") {
        apiUrl = "http://localhost:3001/add";
      }
      
      if(!(data.path) || !(data.value)){
        return alert('Both fields are required.')
      }
     
      let updateData = await axios.post(apiUrl, data).catch((e)=>{
        console.log("eee-->>",e.response.data.message)
        alert(e.response.data.message)
    });
      
      if(updateData.data.status===false){
        alert(updateData.message)
      }
      setCompanyDetail(updateData.data);
      setShow(false);
      
      setEditable({})
    }

    const onClickEditable=(e,index)=>{
      index=(index>-1)?index:"";
      let editableNew=Object.assign({}, editable);
      editableNew[e.target.id+index]=1;
      setEditable(editableNew)
      
    }
    
    return (
      <div>
     
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Please select</Modal.Title>
        </Modal.Header>
        
        <Modal.Footer>
          <Button className="button-danger" variant="secondary" onClick={handleClose}>
          Reject 
          </Button>
          <Button className="button" variant="primary" onClick={onClickGet}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    
        <h3 className="App">Patch data Add/Edit</h3>
        <Container className="form-css input-icons">
          <Row><Col><strong>Auditor Name</strong></Col><Col> 
          {editable["auditor_name"]!==1 && <i className="fa fa-edit icon" id="auditor_name" onClick={onClickEditable}></i>}
          {editable["auditor_name"]===1?<input name="auditor_name" className="input-field" ref={auditorNameRef} defaultValue={companyDetail && companyDetail.auditor_name} onChange={onChangeText}  />:<label className="input-field">{companyDetail && companyDetail.auditor_name}</label>}
          </Col></Row>
          <Row><Col><strong>External Profiles</strong></Col><Col>
            {companyDetail && companyDetail.external_profiles && companyDetail.external_profiles.map((item, indexPro) => <span key={indexPro}>
            {editable["external_profiles_lab"+indexPro]!==1 && <i className="fa fa-edit icon" id="external_profiles_lab" onClick={(e)=>onClickEditable(e,indexPro)}></i>}
              
              
              {editable["external_profiles_lab"+indexPro]===1?<input  className="input-field-50 input-field" defaultValue={item.label} name="external_profiles_lab" id={"/external_profiles/" + indexPro + "/label"} ref={externalProfilesLabRef} onChange={onChangeText} />:<label className="input-field-50 input-field">{item.label}</label> }
              
              {editable["external_profiles_val"+indexPro]!==1 && <i className="fa fa-edit icon" id="external_profiles_val" onClick={(e)=>onClickEditable(e,indexPro)}></i>}
            
            {editable["external_profiles_val"+indexPro]===1?<input className="input-field-50 input-field" defaultValue={item.uri} name="external_profiles_val" id={"/external_profiles/" + indexPro + "/uri"} ref={externalProfilesValRef} onChange={onChangeText}  />:<label className="input-field-50 input-field">{item.uri}</label>}<br/></span>)}
            <br />
            
            <i className="fa fa-plus icon"></i>
            <input className="input-field-50 input-field" name="external_profiles_lab_new" id={"/external_profiles/" + (companyDetail && companyDetail.external_profiles && companyDetail.external_profiles.length)} ref={externalProfilesLabNewRef} onChange={onChangeText} placeholder="Add Lable" />

            <i className="fa fa-plus icon"></i>
            <input className="input-field-50 input-field" name="external_profiles_val_new" id={"/external_profiles/" + (companyDetail && companyDetail.external_profiles && companyDetail.external_profiles.length)} ref={externalProfilesValNewRef} onChange={onChangeText} placeholder="Add Value" />
            <input className="button" type="button" onClick={handleAddUpdate} name="add" value="Add" />
          </Col></Row>
          <Row><Col><strong>Name</strong></Col><Col> 

          {editable["name"]!==1 && <i className="fa fa-edit icon" id="name" onClick={(e)=>onClickEditable(e)}></i>}
          {editable["name"]===1?<input className="input-field" name="name" defaultValue={companyDetail && companyDetail.name} ref={nameRef} onChange={onChangeText} />:<label className="input-field">{companyDetail && companyDetail.name}</label>}
          </Col></Row>
          <Row><Col><strong>Registration Number</strong></Col><Col> 

          {editable["registration_number"]!==1 && <i className="fa fa-edit icon" id="registration_number" onClick={(e)=>onClickEditable(e)}></i>}
          {editable["registration_number"]===1?<input className="input-field" name="registration_number" ref={registrationNumberRef} defaultValue={companyDetail && companyDetail.registration_number} onChange={onChangeText} />:<label className="input-field">{companyDetail && companyDetail.registration_number}</label>}</Col></Row>

          <Row><Col><strong>Tags</strong></Col><Col>{companyDetail && companyDetail.tags && companyDetail.tags.map((item, indexTag) => (<span key={indexTag}>

            {editable["tags"+indexTag]!==1 && <i className="fa fa-edit icon" id="tags" onClick={(e)=>onClickEditable(e,indexTag)}></i>}
            {editable["tags"+indexTag]===1?<input className="input-field" name="tags" id={"/tags/" + indexTag} ref={tagsRef} defaultValue={item} onChange={onChangeText} />:<label className="input-field">{item}</label>}<br /></span>))}
          <br/>
          <i className="fa fa-plus icon"></i>
          <input  className="input-field" name="tags_new" id={"/tags/" + (companyDetail && companyDetail.tags && companyDetail.tags.length)} ref={tagsNewRef} onChange={onChangeText} placeholder="Add Tags" />
          <input className="button" type="button" onClick={handleAddUpdate} name="add" value="Add" />
          </Col></Row>
        </Container>
        <div className="App">
        <input className="button" type="button" onClick={handleAddUpdate} name="edit" value="Edit" />
        
        </div>
        
      </div>
    );
  }

  export default PatchFormPage;