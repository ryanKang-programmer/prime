import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';
import './StressAnalysis.css'
import Button from '../Utils/Button.js'
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
import Wavelet from '../Utils/Wavelet.js'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { borderRadius } from '@mui/system';
import { BaseMaps } from './BaseMaps.js'
import { NewSimulation } from './NewSimulation.js'
import { inputCoords } from './NewSimulation.js';


// function UseScript(SimType, iliLength, iliMass, volDensity) {
//     var SimEdit = parseFloat(SimType);

//     var lengthEdit = parseFloat(iliLength);

//     var massEdit = parseFloat(iliMass);

//     var volDensityEdit = parseFloat(volDensity);

//     var data = JSON.stringify({
//         "rhs": [SimEdit, lengthEdit, massEdit, volDensityEdit],
//         "nargout": 0,
//         "outputFormat": {
//             "mode": "small",
//             "nanType": "string"
//         }
//     });

//     var xhr = new XMLHttpRequest();

//     xhr.open("POST", "http://localhost:9910/StressEngine/stressRun");
//     xhr.setRequestHeader("Content-Type", "application/json");

//     xhr.send(data);
// }

export function Simulation(props) {
    const [update, setUpdate] = useState(false);

    const [nodeLength, setNodeLength] = useState(null);

    const [inputCoordinates, setInputCoordinates] = useState([null,null]);
    const [inputCoordinates2, setInputCoordinates2] = useState([null,null]);

    const [stressMap, setStressMap] = useState(new Map());
    const [strainMap,setStrainMap] = useState(new Map());

    const [active, setActive] = useState("1");
    const [click, setClick] = useState("pump")
    const [twoPoints, _setTwoPoints] = useState([undefined, undefined]);
    const [isOpen, setIsopen] = useState(false);
    const [modalID, setModalID] = useState(0);
    const [noder, setNoder] = useState({ id: 0, lat: null, lng: null, pump: [null, null] });
    const [timestamp, setTimestamp] = useState(null);
    const [mapItems] = useState([
        <NewSimulation _setTwoPoints={_setTwoPoints} />,
    ]);


    const setTwoPoints = (value) => {
        <NewSimulation _setTwoPoints={_setTwoPoints} />
    }
    console.log("twoPoints: ", twoPoints)
    useEffect(() => {
        (async () => {
            await Wavelet()
        })();
    });

    // const showModal = () => {setIsopen((prev) => !prev); console.log("aaaaaaaaaa");}
    function showModal(id) {
        setIsopen((prev) => !prev);
        setModalID(id)
    }

    function activeButton(value, click) {
        console.log("value: " + value)
        setActive(value)
        setClick(click)
    }

    function handleClick() {
        let ret = pump();
        switch (click) {
            case "pump":
                ret = pump()
                break;
            case "leak":
                ret = leak()
                break;
            case "alarm":
                ret = alarmLog()
                break;
            case "ili":
                ret = iliInformation()
                break;
            case "external":
                ret = externalLoads()
                break;
            case "soil":
                ret = soilBoundaries()
                break;
            case "dimensions":
                ret = pipelineDimensions()
                break;
            case "insideFluid":
                ret = insideFluid()
                break;
            case "defects":
                ret = defects()
                break;
            case "meshing":
                ret = meshing()
                break;
            default:
                ret = pump()
                break;
        }
        return ret;
    }

    function pump() {
        const modal = <h4>Pump Information</h4>
        return modal;
    }

    function leak() {
        const modal = <h4>Leak Detection</h4>
        return modal;
    }


    function alarmLog() {

        const modal = <div>
            <h4>Alarm Log</h4>
            <GraphView type="line" onClick={() => showModal(1)} />
            {isOpen && (modalID == 1) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>{modalID}</h3>
                        <GraphView type="line" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
            <GraphView type="line" onClick={() => showModal(2)} />
            {isOpen && (modalID == 2) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>{modalID}</h3>
                        <GraphView type="line" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
            <GraphView type="line" onClick={() => showModal(3)} />
            {isOpen && (modalID == 3) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>{modalID}</h3>
                        <GraphView type="line" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
            <div id="contour" onClick={() => showModal(4)}>
            </div>
            {isOpen && (modalID == 4) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>{modalID}</h3>
                        <div id="contour-modal" onClick={() => showModal(4)}>
                        </div>
                        <p> </p>
                    </div>
                </ModalContent>
            )}
            <GraphView type="line" onClick={() => showModal(5)} />
            {isOpen && (modalID == 5) && (
                <ModalContent onClose={() => setIsopen(false)}>
                    <div className="modal_c">
                        <h3>{modalID}</h3>
                        <GraphView type="line" a="modal-graph" />
                        <p> </p>
                    </div>
                </ModalContent>
            )}
        </div>
        return modal;
    }

    function iliInformation() {
        const modal = <h4>ILI Information</h4>
        return modal;
    }

    function externalLoads() {
        const modal = <h4>External Loads</h4>
        return modal;
    }

    function soilBoundaries() {
        const modal = <h4>Soil Boundaries</h4>
        return modal;
    }

    function pipelineDimensions() {
        const modal = <h4>Pipeline Dimensions</h4>
        return modal;
    }

    function insideFluid() {
        const modal = <h4>Inside Fluid</h4>
        return modal;
    }

    function defects() {
        const modal = <h4>Defects</h4>
        return modal;
    }

    function meshing() {
        const modal = <h4>Meshing Tools</h4>
        return modal;
    }

    function index() {
        const left = <div className="StressAnalysisFlex-col">
            <Button text="PUMP INFORMATION" more="no" id="1" onClick={() => activeButton("1", "pump")} status={active == "1"} />
            <Button text="LEAK DETECTION" more="no" id="2" onClick={() => activeButton("2", "leak")} status={active === "2"} />
            <Button text="ALARM LOG" more="no" id="3" onClick={() => activeButton("3", "alarm")} status={active === "3"} />
            <Button text="ILI INFORMATION" more="no" id="4" onClick={() => activeButton("4", "ili")} status={active === "4"} />
            <Button text="EXTERNAL LOADS" more="no" id="5" onClick={() => activeButton("5", "external")} status={active === "5"} />
            <Button text="SOIL BOUNDARIES" more="no" id="6" onClick={() => activeButton("6", "soil")} status={active === "6"} />
            <Button text="PIPELINE DIMENSIONS" more="no" id="7" onClick={() => activeButton("7", "dimensions")} status={active === "7"} />
            <Button text="INSIDE FLUID" more="no" id="8" onClick={() => activeButton("8", "insideFluid")} status={active === "8"} />
            <Button text="DEFECTS" more="no" id="9" onClick={() => activeButton("9", "defects")} status={active === "9"} />
            <Button text="MESHING TOOL" more="no" id="10" onClick={() => activeButton("10", "meshing")} status={active === "10"} />
        </div>
        return left;
    }
    const SimType = React.useRef();
    const iliLength = React.useRef();
    const iliMass = React.useRef();
    const volDensity = React.useRef();
    let stressObject = 0;
    const handleSubmit = () => {
        let inputCoordinates = inputCoords();

        setNodeLength(inputCoordinates.table.length);
        //console.log('inputCoordinates',inputCoordinates);
        //first item in coords is the longitude
        let inputLong = []
        let inputlat = []
        for (let i = 0; i < inputCoordinates.table.length; i++) {
            inputLong.push(inputCoordinates.table[i][0] * 180 / Math.PI)
            inputlat.push(inputCoordinates.table[i][1] * 180 / Math.PI)
            if(i==0){
                setInputCoordinates([inputCoordinates.table[i][0] * 180 / Math.PI,inputCoordinates.table[i][1] * 180 / Math.PI])
            }
            if(i==inputCoordinates.table.length-1){
                setInputCoordinates2([inputCoordinates.table[i][0] * 180 / Math.PI,inputCoordinates.table[i][1] * 180 / Math.PI])
            }

        }
        console.log('inputLong', inputLong);
        console.log('inputlat', inputlat);
        // if (inputCoordinates.table.length != 0) {
        //     alert("inputCoordinates are :", inputCoordinates,inputCoordinates2)
        // }
        // else {
        //     alert("No nodes have been selected !!!!");
        // }

        // console.log(LeakPercentage.current.value, LeakZone.current.value);
        // UseScript(LeakPercentage.current.value)
        var params = {
            "longitude": inputLong,
            "latitude": inputlat,
        }

        let inputlink = 'http://136.159.140.66/Stress/'
        //let inputlink = 'http://127.0.0.1:5000/Stress/'
        var htttpreq = new XMLHttpRequest();
        htttpreq.open("POST", inputlink, false);
        htttpreq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        htttpreq.setRequestHeader("Access-Control-Allow-Origin", "*");
        htttpreq.send(JSON.stringify(params));

        stressObject = JSON.parse(htttpreq.responseText);
        alert('Stress Simulation Complete, Stress Analysis Outcomes Updated!')
        console.log('Stress Object entire', stressObject);
        var stressHolder = stressObject[0].data[0];
        var stressHolderTop = stressObject[1].data[0];
        console.log('Stress Object', stressObject[0].data[0]);
        window.localStorage.setItem('StressObject', JSON.stringify(stressHolder));
        let hey = JSON.parse(window.localStorage.getItem('StressObject'));
        console.log('hey', hey);

        let zeros = [0];
        for (let i = 0; i < stressHolder.length; i++) {
            zeros[i] = i;
        }
        //setting up graph object. 
        let StressArray2 = zeros.map((node, ix) => ({ node, Von_Mises_Stress: stressHolder[ix] }));
        let StressArrayTop = zeros.map((node, ix) => ({ node, Von_Mises_Stress: stressHolderTop[ix] }));
        setStressMap(StressArray2);
        setStrainMap(StressArrayTop);

        setUpdate(!update);

        setTimestamp(new Date().toLocaleString('en-us', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }));
        
        if (noder.id === null || noder.pump[0] === null || noder.pump[1] === null) {
            //alert('Select a pipeline node to simulate.')
        } else {
            setTimestamp(new Date().toLocaleString('en-us', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }));
        }
    };

    function oneColumn() {
        const left =
            <div style={{ whiteSpace: 'normal', paddingBottom: '1rem', borderBottom: '1px solid lightgray' }}>
                <h4 style={{ padding: '2rem', paddingBottom: '1rem' }}>
                    ILI TOOL
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>I<sub>i</sub></div>
                        <input ref={SimType} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            m<sub>i</sub>
                        </div>
                        <input ref={iliLength} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            v<sub>i</sub>
                        </div>
                        <input ref={iliMass} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&mu;</span><sub>i</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                </div>
                <h4 style={{ padding: '2rem', paddingBottom: '1rem' }}>
                    Internal Fluid Settings
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&rho;</span><sub>m</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&Rho;</span><sub>m</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&Tau;</span><sub>m</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}></label>
                </div>
                <div style={styles.btnContainer}>
                    <button style={styles.submitBtn} onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        return left;
    }

    function twoColumn() {
        const middle =
            <div style={{ whiteSpace: 'normal', paddingBottom: '1rem', borderBottom: '1px solid lightgray' }}>
                <h4 style={{ padding: '2rem', paddingBottom: '1rem' }}>
                    Pipe Properties
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&#8959;</span><sub>P</sub>
                        </div>
                        <input ref={SimType} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            V<sub>P</sub>
                        </div>
                        <input ref={iliLength} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&rho;</span><sub>P</sub>
                        </div>
                        <input ref={iliMass} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&sigma;</span><sub>y</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&alpha;</span><sub>P</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&zeta;</span><sub>P</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <span>&sigma;</span><sub>U</sub>
                        </div>
                        <input ref={volDensity} />
                    </label>
                    <label style={{ width: '23%', display: 'flex', flexDirection: 'column' }}></label>
                </div>
                <div style={styles.btnContainer}>
                    <button style={styles.submitBtn} onClick={handleSubmit}>Submit</button>
                </div>
            </div>

        return middle;
    }

    function threeColumn() {
        const right =
            <div style={{ whiteSpace: 'normal', paddingBottom: '1rem', borderBottom: '1px solid lightgray' }}>
                <h4 style={{ padding: '2rem', paddingBottom: '1rem' }}>
                    Properties
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <label style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            Simulation Type
                        </div>
                        <input ref={SimType} placeholder={2} />
                    </label>
                    <label style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            ILI Length (m)
                        </div>
                        <input ref={iliLength} placeholder={4200} />
                    </label>
                    <label style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            ILI Mass (Kg)
                        </div>
                        <input ref={iliMass} placeholder={2608} />
                    </label>
                    <label style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            Fluid Volumetric Density (kg/m^3)
                        </div>
                        <input ref={volDensity} placeholder={1} />
                    </label>
                </div>
                <div style={styles.btnContainer}>
                    <button style={styles.submitBtn} onClick={handleSubmit}>Submit</button>
                </div>
            </div>

        return right;
    }
    function newSim() {
        const modal =
            <Container style={{ padding: 0 }}>
                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 700 }}>Pipeline Simulation Parameters</h2>
                </div>
                <div>
                    <div>{oneColumn()} </div>
                    <div>{twoColumn()}</div>
                    <div>{threeColumn()}</div>
                </div>
            </Container>
        return modal;
    }

    //<Col xs={3} className = "one">{index()}</Col> 
    function stressTab() {
        let jsontest = window.localStorage.getItem('StressObject');
        console.log('jsontest', jsontest)
        console.log("stressMap", stressMap)
        if (jsontest == null) {
            jsontest = 0;
        }
        const tab =
            <div className='tabber' style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem' }}>
                <Tabs>
                    <TabList>
                        <Tab>Stress Settings</Tab>
                        <Tab>Stress Analysis Outcomes</Tab>
                    </TabList>
                    <TabPanel>
                        <h3>
                            Instruction
                        </h3>

                        <div style={{ padding: '1rem' }}>
                      
                            
                            select two pipeline nodes on the map
                        </div>
                        <h3>
                            Water-crossing Coordinates and Soil Types within the Region
                        </h3>
                        <div style={{ padding: '1rem' }}>
                            <ul>
                                <li>2 Watercrossings : Node 922, Node 3755 </li>
                                <li> Organics, Organic Cryosols, [Gray, Dark Gray] Luvisols, Brunisols, [Dark Brown, Dark Gray, Black] Chernozemics,</li>
                            </ul>
                        </div>
                        <h3>
                            Inputs for Stress Analysis
                        </h3>
                        <div style={{ padding: '1rem' }}>
                            <ul>
                                <li>{nodeLength}{nodeLength == null ? "two points must be selected on the map":" Nodes Selected"}</li>
                                <h5>Boundary Coordinates:</h5>
                                <li>[{inputCoordinates[0]} , {inputCoordinates[1]}] </li>
                                <li>[{inputCoordinates2[0]} , {inputCoordinates2[1]}] </li>
                            </ul>
                        </div>

                        <div>
                            <div style={{ ...styles.btnContainer, justifyContent: 'flex-start' }}>
                                <button style={styles.submitBtn} onClick={handleSubmit}>Start Stress Simulation</button>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <ul>
                                 
                                        Timestamp: <span>{timestamp}</span>
                                    
                                </ul>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                    
                        <h3>
                            Timestamp :
                        </h3>
                        <div style={{ padding: '1rem' }}>
                            {timestamp}
                        </div>
                        <h3>
                            Graphs
                        </h3>

                        <div style={{ padding: '1rem' }}>
                            <h4>Von Mises Stress of Selected Nodes (Right Circumferential Node)</h4>
                            <ResponsiveContainer width="100%" height={200} >
                            <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                                    <XAxis dataKey="node" xAxisId={"zeros"} label={{ value: 'node',  position: 'bottom' ,offset:-7}}/>
                                    <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure(Pa)', angle: -90, position: 'insideLeft' , offset: 7, units: 'Pa'}} />
                                    <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />
                                    <Line xAxisId={"zeros"} data={stressMap} type="monotone" dataKey="Von_Mises_Stress" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                                    <Tooltip />
                            </LineChart>
                            </ResponsiveContainer>
                            <h4>Von Mises Stress of Selected Nodes (Top Circumferential Node)</h4>
                            <ResponsiveContainer width="100%" height={200} >
                            <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                                    <XAxis dataKey="node" xAxisId={"zeros"} label={{ value: 'node',  position: 'bottom' ,offset:-7}}/>
                                    <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure(Pa)', angle: -90, position: 'insideLeft', offset:7, units: 'Pa' }} />
                                    <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />
                                    <Line xAxisId={"zeros"} data={strainMap} type="monotone" dataKey="Von_Mises_Stress" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                                    <Tooltip />
                            </LineChart>
                            </ResponsiveContainer>
        
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        return tab;
    }
    // <GraphView type="stress" onClick={() => showModal(1)} />
    // {isOpen && (modalID == 1) && (
    //     <ModalContent onClose={() => setIsopen(false)}>
    //         <div className="modal_c">
    //             <h3>{modalID}</h3>
    //             <GraphView type="stress" a="modal-graph" />
    //             <p> </p>
    //         </div>
    //     </ModalContent>
    // )}
    function ui() {
        const ui =
            <div className="lower" style={{ height: '100%' }}>
                <Container fluid style={{ height: '100%' }}>
                    <Row style={{ height: '100%' }}>
                        <Col style={{ height: '100%', position: 'relative' }}>
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', padding: '0 .5rem' }}>
                                <NewSimulation />
                            </div>
                        </Col>
                        <Col style={{ height: '100%', position: 'relative' }}>{stressTab()}</Col>
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

export default Simulation;