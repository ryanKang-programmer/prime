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
import { useSelector } from "react-redux";

import altitude from './Simulation.js'

import ldb from 'localdata';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import leak from '../../Strore/reducers/Leak/index.js';


const { arr } = require('./BaseMaps.js');
//const { inputCoord } = require('./BaseMaps.js');

var whatIn = 0;
var h;
var index = 0;
var input = [];
var something = 999;
var curPump = [];

let Localization_Obj;
let Error;

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

export function Localization(props) {
    const [isOpen, setIsopen] = useState(false);

    const { leakHistory } = useSelector(state => state.leak);
    const [leakModalNode, setLeakModalNode] = React.useState(null);


    const [locNode, setLocNode] = useState(null);
    const [locPump, setLocPump] = useState([null,null]);

    const [node, setNode] = useState({ id: null, lat: null, lng: null, pump: [null, null] });
    const [modalID, setModalID] = useState(0);
    const app = new App({ id: "application-1-ekucx" });
    const credentials = Credentials.anonymous();
    const [Mapitems] = useState([
        <BaseMaps setNode={setNode} />,
        <Vegetation setNode={setNode} />,
        <MuskegMap setNode={setNode} />,
        <SoilMap setNode={setNode} />,
        <SceneMap setNode={setNode} />,
        <Weather setNode={setNode} />,
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

    // setting up the localization result state
    const [localizationResult, setLocalizationResult] = useState(0, 0, 0);

    function UseScript() {
        const obj = leakHistory[leakHistory.length - 1];
        console.log("obj", obj)
        setLeakModalNode(obj.node)
        console.log(leakHistory)
        let inputCoord = inputs();
        Selection(inputCoord);
        var leakPositioning = index / GeoData.length;
        var leakEdit = 0.5;
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

        console.log("the Leak positioning is : " + leakPositioning);

        var data = JSON.stringify({
            "rhs": [leakEdit, leakPositioning, zoneEdit],
            "nargout": 0,
            "outputFormat": {
                "mode": "small",
                "nanType": "string"
            }
        });

        // var xhr = new XMLHttpRequest();


        // xhr.open("POST", "https://dicetunnel.lhr.rocks/RTTMEngine/scriptRun");
        //xhr.setRequestHeader("Content-Type", "application/json");


        // xhr.send(data);
        let inputlink = "http://136.159.140.66/LeakSense/Localization/GradientIntersection/?isleak=0";






        //let inputlink="http://100.21.228.146/RTTM/Liquid/?leakPercentage=0.5&leakPosition=0.5&leakZone=1";


        //setting up the toast


        console.log("input link", inputlink);


        var httpreq = new XMLHttpRequest();


        httpreq.addEventListener("progress", updateProgress);
        httpreq.addEventListener("load", transferComplete);
        httpreq.addEventListener("error", transferFailed);
        httpreq.addEventListener("abort", transferCanceled);




        httpreq.open("GET", inputlink, false);
        httpreq.send(null);


        Localization_Obj = JSON.parse(httpreq.responseText);
        let rounder = []
        rounder[0] = Localization_Obj[0].toFixed(3);
        rounder[1] = Localization_Obj[1].toFixed(3);
        rounder[2] = Localization_Obj[2].toFixed(3);
        setLocalizationResult(rounder);
        Error = rounder[2];
        console.log("Error", Error);
        console.log("python object", Localization_Obj);


        

        //need to use ldb instead of local storage since local storage has a 5mb limit
        ldb.clear(function () {
            console.log('Storage cleared')
        });


        ldb.set('Localization_Obj', Localization_Obj)
        console.log("leakModalNode", leakModalNode)
        if (leakHistory[leakHistory.length-1].node == 0) {
            zoneEdit = 1;
            leakPositioning = 0;
        }
        else if (leakHistory[leakHistory.length-1].node <= 1350) {
            zoneEdit = 1;
            let holder = (1350 - 0) * rounder[0];
            setLocNode(0 + holder);
            setLocPump([0, 1]);
            leakPositioning = parseFloat(h / 1350);
        }
        else if (leakHistory[leakHistory.length-1].node <= 2580) {
            zoneEdit = 2;
            let holder = (2580 - 1350) * rounder[0];
            setLocNode(1350 + holder);
            setLocPump([1, 2]);
            leakPositioning = h / 2580;
        }
        else if (leakHistory[leakHistory.length-1].node <= 2850) {
            zoneEdit = 3;
            let holder = (2850 - 2580) * rounder[0];
            setLocNode(2580 + holder);
            setLocPump([2, 3]);
            leakPositioning = h / 2850;
        }
        else if (leakHistory[leakHistory.length-1].node <= 3390) {
            zoneEdit = 4;
            let holder = (3390 - 2850) * rounder[0];
            setLocNode(2850 + holder);
            setLocPump([3, 4]);
            leakPositioning = h / 3390;
        }
        else if (leakHistory[leakHistory.length-1].node <= 4560) {
            zoneEdit = 5;
            let holder = (4560 - 3390) * rounder[0];
            setLocNode(3390 + holder);
            setLocPump([4,5]);
            leakPositioning = h / 4560;
        }
        else if (leakHistory[leakHistory.length-1].node <= 7016) {
            zoneEdit = 6;
            let holder = (7016 - 4560) * rounder[0];
            setLocNode(4560 + holder);
            setLocPump([5, 6]);
            leakPositioning = h / 7016;
        }
        else if (leakHistory[leakHistory.length-1].node <= 8005) {
            zoneEdit = 7;
            let holder = (8005 - 7016) * rounder[0];
            setLocNode(7016 + holder);
            setLocPump([6, 7]);
            leakPositioning = h / 8005;
        }


        // console.log("let us empty the local storage")
        // window.localStorage.removeItem("JSONOBJECT");


        // window.localStorage.setItem("JSONOBJECT", JSON.stringify(json_obj));
        // let jsontest = window.localStorage.getItem("JSONOBJECT");


        ldb.get('JSONOBJECT', function (Localization_Obj) {
            console.log('And the value is', Localization_Obj);
        });
        //const anchor = document.getElementById("LeakDetection");
        //const result = anchor.toString();
        //console.log("this is the anchor", result);
    }
    function renderToast(percent) {
        console.log("toast");
        //toast("LIQUID RTTM Progress: "+percent+"%", {
        toast("Localization Complete", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: percent,
        });
    }


    function updateProgress(oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = (oEvent.loaded / oEvent.total) * 100;
            renderToast(percentComplete);
            console.log("percent complete", percentComplete);
        } else {
            console.log("unable to compute");
        }
    }
    function transferComplete(evt) {
        console.log("The transfer is complete.");
        renderToast(100);
    }
    function transferFailed(evt) {
        console.log("An error occurred while transferring the file.");
    }
    function transferCanceled(evt) {
        console.log("The transfer has been canceled by the user.");
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

        //     const modal = <div>

        //         <List>
        //             <h5>Inlet Flow</h5>
        //             <GraphView type="line" onClick={() => showModal(1)} />
        //             {isOpen && (modalID == 1) && (
        //                 <ModalContent onClose={() => setIsopen(false)}>
        //                     <div className="modal_c">
        //                         <h3>Inlet Flow-Rate Measured vs Simulated</h3>
        //                         <GraphView type="line" a="modal-graph" />
        //                         <p> </p>
        //                     </div>
        //                 </ModalContent>
        //             )}
        //             <h5>Outlet Flow</h5>
        //             <GraphView type="outlet" onClick={() => showModal(2)} />
        //             {isOpen && (modalID == 2) && (
        //                 <ModalContent onClose={() => setIsopen(false)}>
        //                     <div className="modal_c">
        //                         <h3>Outlet Flow</h3>
        //                         <GraphView type="outlet" a="modal-graph" />
        //                         <p> </p>
        //                     </div>
        //                 </ModalContent>
        //             )}
        //         </List>
        //     </div>
        //     return modal;
    }

    function Graph2() {
        //     const modal = <div>
        //         <List>
        //             <h5>Inlet Pressure</h5>
        //             <GraphView type="inpress" onClick={() => showModal(3)} />
        //             {isOpen && (modalID == 3) && (
        //                 <ModalContent onClose={() => setIsopen(false)}>
        //                     <div className="modal_c">
        //                         <h3>Inlet Pressure</h3>
        //                         <GraphView type="inpress" a="modal-graph" />
        //                         <p> </p>
        //                     </div>
        //                 </ModalContent>
        //             )}
        //             <h5>Outlet Pressure</h5>
        //             <GraphView type="outpress" onClick={() => showModal(4)} />
        //             {isOpen && (modalID == 4) && (
        //                 <ModalContent onClose={() => setIsopen(false)}>
        //                     <div className="modal_c">
        //                         <h3>Outlet Pressure</h3>
        //                         <GraphView type="outpress" a="modal-graph" />

        //                         <h3>Outlet Pressure Residue </h3>
        //                         <GraphView type="outpressresidue" a="modal-graph" />
        //                     </div>
        //                 </ModalContent>
        //             )}

        //         </List>
        //     </div>
        //     return modal;
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
        UseScript();
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
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 .5rem' }}>
                <select onChange={e => setValue(e.currentTarget.value)} style={{ alignSelf: 'flex-start' }}>
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
                <div style={{ padding: '1rem 0' }}>
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
            <div className='tabber' style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem' }}>
                <Tabs>
                    <TabList>
                        <Tab>Leak Localization</Tab>
                    </TabList>
                    <TabPanel>
                        <h3>Data Used for Leak Localization</h3>
                        <li>
                            Node {leakHistory[leakHistory.length-1].node} {leakHistory[leakHistory.length-1].node === null ? 'Retrieved from Leak Simulation' : 'from Leak Simulation'}
                        </li>
                        <div style={{ padding: '1rem' }}>
                            Leak Simulation Timestamp
                        </div>
                        <div style={{ ...styles.btnContainer, justifyContent: 'flex-start' }}>
                            <button style={styles.submitBtn} onClick={handleSubmit}>Start Leak Localization</button>
                        </div>
                        <h3>Localization Outcomes</h3>
                        <ul>
                            <li>
                                Node Number: {locNode}
                            </li>
                            <li>
                                PUMP STATIONS : {locPump[0]} - {locPump[1]}<br />
                            </li>
                            <li>
                                Position %: {localizationResult[0]}
                            </li>
                            <li>
                                Position (M): {localizationResult[1]}
                            </li>

                            <li>
                                Error: {localizationResult[2]} %
                            </li>
                        </ul>
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
                </Tabs>
            </div>
        return tab;
    }

    function ui() {
        const ui =
            <div className="lower" style={{ height: '100%' }}>
                <Container fluid style={{ height: '100%' }}>
                    <Row style={{ height: '100%' }}>
                        <Col style={{ height: '100%', position: 'relative' }}>
                            {mapper()}
                        </Col>
                        <Col style={{ height: '100%', position: 'relative' }}>
                            {tab()}
                     
                        </Col>
                    </Row>
                </Container>
            </div>
        return ui
    }

    return (
        <div style={{ height: '100%' }}>
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


export default Localization;