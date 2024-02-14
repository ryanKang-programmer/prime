import React from 'react';
import './PipelineOverview.css'
import Button from '../Utils/Button.js'
import Table from '../Utils/Table.js'
import ImageView from '../Utils/ImageView.js'
import GraphView from '../Utils/GraphView.js'
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Radio } from 'react-loader-spinner';

/**
 * Pipeline Overview
 */

function PipelineMap(props) {

    const [img, setImg] = useState("2D")
    const [click, setClick] = useState(" ")
    const [active, setActive] = useState(1)
    const [active2, setActive2] = useState(-1)
    const [isImgLoad, setIsImgLoad] = useState(false);

    // for debugging
    useEffect(()=>{
        console.log(click);
        console.log(active2)
    },[click]);

    function handleClick () {
        let ret = def();
        switch(click) {
            case "searchMap":
                ret = searchOnMap()
                break;
            case "importCoords":
                ret = importCoordinates()
                break;
            case "exportCoords":
                ret = exportCoordinates()
                break;
            case "hazardSim":
                ret = hazardSim()
                break;
            default:
                ret = def()
                break;
        }
        return ret;
    }
    

    function activeButton(value, num) {
        setImg(value)
        setActive(num)
    }

    function activeButton2(num, clicked) {
        if (active2 == num) {
            setActive2(-1)
            setClick(" ")
            console.log("unclick")
        } else {
            setActive2(num)
            setClick(clicked)
            console.log("click")
        }
    }

    function hazardSim() {
        const modal = <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignSelf: 'center'}}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <h4>Choose a simulation: </h4>
                                <button class="closeButton" onClick={() => close()}><img src={require('../Img/close.png')} alt="close" width="17" height="17"/></button>
                            </div>
                            <div class="mid">
                                <Button text="FIRE" more="no" id="1" status="false"/>
                                <Button text="FLOOD" more="no" id="2" status="false"/>
                                <Button text="LEAK" more="no" id="3" status="false"/>
                                <Button text="EROSION" more="no" id="4" status="false"/>
                                <Button text="CRACK" more="no" id="5" status="false"/>
                                <Button text="EXTERNAL FORCE" more="no" id="6" status="false"/>
                                <Button text="BUCKLING LOAD" more="no" id="7" status="false"/>
                                <Button text="DENT" more="no" id="8" status="false"/>
                                <Button text="OPTIMIZATION" more="no" id="9" status="false"/>
                            </div>
                    </div>
        return modal;
    }

    function searchOnMap() {
        const modal = <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'row'}}>
                            <h4>Search On Map</h4>
                            <button class="closeButton" onClick={() => close()}><img src={require('../Img/close.png')} alt="close" width="17" height="17"/></button>
                    </div>
        return modal;
    }

    function importCoordinates() {
        const modal = <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'row'}}>
                        <h4>Import Coordinates</h4>
                        <button class="closeButton" onClick={() => close()}><img src={require('../Img/close.png')} alt="close" width="17" height="17"/></button>
                    </div>
        return modal;
    }

    function exportCoordinates() {
        const modal = <div>
                        <h4>Export Coordinates</h4>
                          <GraphView />
                        </div>
        return modal;
    }

    function close() {
        activeButton2(-1, " ")
    }

    function def() {
        const left =
            <div className="pipelineOverviewFlex-col" style={{display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '1rem'}}>
                <div style={{height: '90%'}}>
                    {false ?
                    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Radio
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="radio-loading"
                            wrapperStyle={{}}
                            wrapperClass="radio-wrapper"
                        />
                    </div>
                    : <ImageView text={img} status="1" setIsImgLoad={setIsImgLoad}/>}
                </div>
                <div className="pipelineOverviewFlex-row" style={{height: 'fit-content'}}>
                    <Button text="2D" more="yes" onClick={() => {activeButton("2D", 1)}} status={active == 1}/>
                    <Button text="3D" more="yes" onClick={() => {activeButton("3D", 2)}} status={active == 2}/>
                    <Button text="GEOMETRY" more="yes" onClick={() => {activeButton("GEOMETRY", 3)}} status={active == 3}/>
                </div>
            </div>
        return left
    }

    function index() {
        const left = 
        <div className="pipelineOverviewFlex-col-center"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'stretch',
            }}>
            <h4 style={{padding: '1rem', fontWeight: '700', alignSelf: 'center'}}>Active Lines</h4>
            <Table tableName="blah" className="pipelineOverview-table" id="t"/>
        </div>
        return left;
    }

    function ui() {
        const ui = <div className="lower" style={{height: '100vh', position: 'relative'}}>
            <Container>
                <Row>
                    <Col xs={3} className = "one" style={{position: 'absolute', left: 0, top: 0, bottom: 0, borderRight: '0.5px solid lightgray'}}>{index()}</Col>
                    <Col xs={9} className = "two" style={{position: 'absolute', right: 0, top: 0, bottom: 0}}>{handleClick()}</Col>
                </Row>
            </Container>
        </div>
        return ui
    }

    return (
        <div>
            {ui()}
        </div>
    )

}

export default PipelineMap;