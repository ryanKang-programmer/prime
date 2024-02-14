import React from 'react';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import GraphView from '../Utils/GraphView.js';
import { Modal, ModalContent } from '../Utils/Modal.js';
import { BaseMaps } from "./BaseMaps";
import "./LeakDetection.css";
import { Vegetation } from './Vegetation';
import { MuskegMap } from "./MuskegMap";
import { SoilMap } from "./SoilMap";
import { SceneMap } from './SceneMap';
import { Weather } from './Weather';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import List from '@mui/material/List';
import GeoData from '../Utils/Data/geoData.json'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { inputs } from './BaseMaps';
import Select from "react-dropdown-select";
import { App } from 'realm-web';
import { Credentials } from 'realm-web';

const { arr } = require('./BaseMaps.js');
//const { inputCoord } = require('./BaseMaps.js');

var whatIn = 0;
var h;
var index = 0;
var input = [];
var something = 999;
var curPump = [];

var something_cachedValue = something;

export function what() {
    let inputCoord = inputs();
    console.log("here is input", inputCoord);
    console.log("size of coords is : " + GeoData.length);

    if (inputCoord.table.length != 0) {
        input = [inputCoord.table[inputCoord.table.length - 1].long, inputCoord.table[inputCoord.table.length - 1].lat];

    }
    else {
        console.log("No nodes have been selected !!!!")
    }


    for (var k = 0; k < arr.length; k++) {
        if (arr[k][0] == input[1] && arr[k][1] == input[0]) {
            index = k;
            h = k;
            console.log("h is", h);

        }
    }
    if (h == 0) {
        curPump = [0, 1]
    }
    else if (h <= 1350) {
        curPump = [0, 1]
    }
    else if (h <= 2580) {
        curPump = [1, 2]
    }
    else if (h <= 2850) {
        curPump = [2, 3]

    }
    else if (h <= 3390) {
        curPump = [3, 4]
    }
    else if (h <= 4560) {
        curPump = [4, 5]
    }
    else if (h <= 7016) {
        curPump = [5, 6]
    }
    else if (h <= 8005) {
        curPump = [6, 7]
    }

    whatIn = h;
    console.log("this is whatin", whatIn);

    return (
        whatIn + 1
    );

}

export function Realtime(props) {
    const [isOpen, setIsopen] = useState(false);
    const [node, setNode] = useState({id: null, lat: null, lng: null, pump: [null, null]});
    const [modalID, setModalID] = useState(0);
    const app = new App({id: "application-1-ekucx"});
    const credentials = Credentials.anonymous();
    const [Mapitems] = useState([
        <BaseMaps setNode={setNode}/>,
        <Vegetation setNode={setNode}/>,
        <MuskegMap setNode={setNode}/>,
        <SoilMap setNode={setNode}/>,
        <SceneMap setNode={setNode}/>,
        <Weather setNode={setNode}/>,
    ]);

    const [items] = useState([
        { label: "Base Map Gallery", value: 0 },
        { label: "Vegetation Map", value: 1 },
        { label: "Muskeg Map", value: 2 },
        { label: "Soil Map", value: 3 },
        { label: "Scene Map", value: 4 },
        { label: "Weather Map", value: 5 },
    ]);

    const [value, setValue] = useState(0);
    
    const user = app.logIn(credentials);   

    function Selection(inputCoord) {
        console.log("here is input", inputCoord);
        console.log("size of coords is : " + GeoData.length);

        if (inputCoord.table.length != 0) {
            input = [inputCoord.table[inputCoord.table.length - 1].long, inputCoord.table[inputCoord.table.length - 1].lat];
        }
        else {
            console.log("No nodes have been selected !!!!")
        }

        for (var k = 0; k < arr.length; k++) {
            if (arr[k][0] == input[1] && arr[k][1] == input[0]) {
                index = k;
                h = k;
                console.log("h is", h);
            }
        }
        whatIn = h;
        console.log("this is whatin", whatIn);
    }

    function UseScript(leak) {
        let inputCoord = inputs();
        Selection(inputCoord);
        var leakPositioning = index / GeoData.length;
        var leakEdit = parseFloat(leak);
        leakEdit /= 100;
       
        var zoneEdit;

        if (h == 0) {
            zoneEdit = 1;
            leakPositioning = 0;
        }
        else if (h <= 1350) {
            zoneEdit = 1;
            leakPositioning = parseFloat(h / 1350);
        }
        else if (h <= 2580) {
            zoneEdit = 2;
            leakPositioning = h / 2580;
        }
        else if (h <= 2850) {
            zoneEdit = 3;
            leakPositioning = h / 2850;
        }
        else if (h <= 3390) {
            zoneEdit = 4;
            leakPositioning = h / 3390;
        }
        else if (h <= 4560) {
            zoneEdit = 5;
            leakPositioning = h / 4560;
        }
        else if (h <= 7016) {
            zoneEdit = 6;
            leakPositioning = h / 7016;
        }
        else if (h <= 8005) {
            zoneEdit = 7;
            leakPositioning = h / 8005;
        }
        console.log("the Leak positioning is : " + leakPositioning);
        
        var data = JSON.stringify({
            "rhs": [leakEdit, leakPositioning, zoneEdit],
            "nargout": 0,
            "outputFormat": {
                "mode": "small",
                "nanType": "string"
            }
        });


        var xhr = new XMLHttpRequest();

        xhr.open("POST", "http://localhost:9811/RTTMEngine/scriptRun");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);
    }

    // const showModal = () => {setIsopen((prev) => !prev); console.log("aaaaaaaaaa");}
    function showModal(id) {
        setIsopen((prev) => !prev);
        setModalID(id)
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function Graphs() {

        const modal = <div>
            
            <List>
                <h5>Inlet Flow</h5>
                <GraphView type="line" onClick={() => showModal(1)} />
                {isOpen && (modalID == 1) && (
                    <ModalContent onClose={() => setIsopen(false)}>
                        <div className="modal_c">
                            <h3>Inlet Flow-Rate Measured vs Simulated</h3>
                            <GraphView type="line" a="modal-graph" />
                            <p> </p>
                        </div>
                    </ModalContent>
                )}
                <h5>Outlet Flow</h5>
                <GraphView type="outlet" onClick={() => showModal(2)} />
                {isOpen && (modalID == 2) && (
                    <ModalContent onClose={() => setIsopen(false)}>
                        <div className="modal_c">
                            <h3>Outlet Flow</h3>
                            <GraphView type="outlet" a="modal-graph" />
                            <p> </p>
                        </div>
                    </ModalContent>
                )}
            </List>
        </div>
        return modal;
    }

    function Graph2() {
        const modal = <div>
            <List>
                <h5>Inlet Pressure</h5>
                <GraphView type="inpress" onClick={() => showModal(3)} />
                {isOpen && (modalID == 3) && (
                    <ModalContent onClose={() => setIsopen(false)}>
                        <div className="modal_c">
                            <h3>Inlet Pressure</h3>
                            <GraphView type="inpress" a="modal-graph" />
                            <p> </p>
                        </div>
                    </ModalContent>
                )}
                <h5>Outlet Pressure</h5>
                <GraphView type="outpress" onClick={() => showModal(4)} />
                {isOpen && (modalID == 4) && (
                    <ModalContent onClose={() => setIsopen(false)}>
                        <div className="modal_c">
                            <h3>Outlet Pressure</h3>
                            <GraphView type="outpress" a="modal-graph" />

                            <h3>Outlet Pressure Residue </h3>
                            <GraphView type="outpressresidue" a="modal-graph" />
                        </div>
                    </ModalContent>
                )}

            </List>
        </div>
        return modal;
    }

    function GraphsPop() {
        const modal = <div>
            <Button variant="outline-primary" onClick={handleShow} size="lg">
                Show Graphs
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Pipeline Node Graphs</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <h5>Inlet Flow</h5>
                    <GraphView type="line" onClick={() => showModal(1)} />
                    {isOpen && (modalID == 1) && (
                        <ModalContent onClose={() => setIsopen(false)}>
                            <div className="modal_c">
                                <h3>Inlet Flow-Rate Measured vs Simulated</h3>
                                <GraphView type="line" a="modal-graph" />
                                <p> </p>
                            </div>
                        </ModalContent>
                    )}
                    <h5>Outlet Flow</h5>
                    <GraphView type="outlet" onClick={() => showModal(2)} />
                    {isOpen && (modalID == 2) && (
                        <ModalContent onClose={() => setIsopen(false)}>
                            <div className="modal_c">
                                <h3>Outlet Flow</h3>
                                <GraphView type="outlet" a="modal-graph" />
                                <p> </p>
                            </div>
                        </ModalContent>
                    )}
                    <h5>Inlet Pressure</h5>
                    <GraphView type="inpress" onClick={() => showModal(3)} />
                    {isOpen && (modalID == 3) && (
                        <ModalContent onClose={() => setIsopen(false)}>
                            <div className="modal_c">
                                <h3>Inlet Pressure</h3>
                                <GraphView type="inpress" a="modal-graph" />
                                <p> </p>
                            </div>
                        </ModalContent>
                    )}
                    <h5>Outlet Pressure</h5>
                    <GraphView type="outpress" onClick={() => showModal(4)} />
                    {isOpen && (modalID == 4) && (
                        <ModalContent onClose={() => setIsopen(false)}>
                            <div className="modal_c">
                                <h3>Outlet Pressure</h3>
                                <GraphView type="outpress" a="modal-graph" />
                                <p> </p>
                            </div>
                        </ModalContent>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>

        return modal;


    }

    const LeakPercentage = React.useRef();

    //const LeakZone = React.useRef();
    const handleSubmit = () => {
        // console.log(LeakPercentage.current.value, LeakZone.current.value);
        UseScript(LeakPercentage.current.value)
    };


    //const[leak, setLeak]=useState("");

    //const[leakLocation, setLeakLocation]=useState("");
    //const getText = (valu) => `${leakLocation}`;

    function refreshPage() {
        window.location.reload(false);
    }
    const choices = [
        { value: 'CH4_Hyd_10', label: 'CH4_Hyd_10' },
        { value: 'CH4_Hyd_30', label: 'CH4_Hyd_30' },
        { value: 'CH4_Hyd_50', label: 'CH4_Hyd_50' },
        { value: 'CH4_Hyd_70', label: 'CH4_Hyd_70' },
        { value: 'CH4_Hyd_90', label: 'CH4_Hyd_90' },
        { value: 'Hyd_10', label: 'Hyd_10' },
        { value: 'Hyd_30', label: 'Hyd_30' },
        { value: 'Hyd_50', label: 'Hyd_50' },
        { value: 'Hyd_70', label: 'Hyd_70' },
        { value: 'Hyd_90', label: 'Hyd_90' },
    ]

    function index() {
        const left = 
        <div className="div.b">
            <label>
                Leak Percentage
            </label>
            <br />
            <input ref={LeakPercentage} />
            {"\n\n"}

            <br />
            <label> Fluid Composition</label> <Select options={choices} />
            <div style={styles.btnContainer}>
                <Button variant="outline-primary" onClick={handleSubmit} >
                    Submit Inputs
                </Button>
            </div>
        </div>
        return left;
    }

    function mapper() {
        return (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 .5rem'}}>
                <select onChange={e => setValue(e.currentTarget.value)} style={{alignSelf: 'flex-start'}}>
                    {items.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}

                </select>
                {Mapitems[value]}
            </div>
        );

    }
    
    function altitude() {
        const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        }
        const alt = 
        <div className='alter'>
            <div style={{padding: '1rem 0'}}>
                <h3>{new Date().toLocaleString("en-US", options)} {new Date().toLocaleTimeString()}</h3>
            </div>
            <h5>Altitude</h5>
            <GraphView type="altitude" onClick={() => showModal(5)} />
            {isOpen && (modalID == 5) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>Altitude</h3>
                        <GraphView type="altitude" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
            <h5>Pressure</h5>
            <GraphView type="pressure" onClick={() => showModal(6)} />
            {isOpen && (modalID == 6) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>Pressure</h3>
                        <GraphView type="pressure" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
            <h5>Velocity</h5>
            <GraphView type="velocity" onClick={() => showModal(7)} />
            {isOpen && (modalID == 7) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>Altitude</h3>
                        <GraphView type="velocity" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
        </div>
        return alt;
    }

    function getWhatin() {
        return whatIn;
    }

    function tab() {
        const tab = 
        <div className='tabber' style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem'}}>
            <Tabs>
                <TabList>
                    <Tab>Node {node.id}</Tab>
                    <Tab>Zone</Tab>
                    <Tab>Inputs</Tab>
                    <Tab>Leak Localization</Tab>
                </TabList>
                <TabPanel>
                    Node {node.id} {node.id === null? 'Not Selected' : 'Currently Selected'} <br />
                    PUMP STATIONS : {node.pump[0]} - {node.pump[1]}<br />
                    Node 1 : Lat: -113.3569, Long: 53.54877 <br />
                    Node 1351: Lat: -113.5979, Long: 53.2801
                    <Container fluid>
                        <Row>
                            <Col>
                                {Graphs()}
                            </Col>
                            <Col>
                                {Graph2()}
                            </Col>
                        </Row>
                    </Container>
                </TabPanel>
                <TabPanel>
                    {altitude()}
                </TabPanel>
                <TabPanel>
                    Pump Stations : {node.pump[0]} - {node.pump[1]}<br/>
                    Node {node.id} {node.id === null? 'Not Selected' : 'Currently Selected'} <br />
                    Coordinates: <br />
                    --Latitude: {node.lat}<br />
                    --Longitude: {node.lng}<br />
                    {index()}
                </TabPanel>
                <TabPanel>
                    Leak Detection: Leak<br />
                    Leak Position: 2.1km<br />
                    Error: 1.2%<br />
                    <div style={styles.btnContainer}>
                        <button style={styles.submitBtn} onClick={handleSubmit}>Detect Leaks</button>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
        return tab;
    }

    function ui() {
        const ui = 
        <div className="lower" style={{height: '100%'}}>
            <Container fluid style={{height: '100%'}}>
                <Row style={{height: '100%'}}>
                    <Col style={{height: '100%', position: 'relative'}}>
                        {mapper()}
                    </Col>
                    <Col style={{height: '100%', position: 'relative'}}>
                        {tab()}
                    </Col>
                </Row>
            </Container>
        </div>
        return ui
    }

    return (
        <div style={{height: '100%'}}>
            {ui()}
        </div>
    );

}

const styles = {
    btnContainer: {
        display: 'flex',
        padding: '1rem',
        justifyContent: 'end'
    },
    submitBtn: {
        border: '0px',
        backgroundColor: '#ec7210',
        color: 'white',
        fontWeight: 700,
        padding: '.5rem 1rem',
        borderRadius: '.5rem',
    }
}


export default Realtime;