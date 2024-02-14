import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useRef } from 'react';
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
import { useSelector, useDispatch } from "react-redux";
import { saveLeak } from "../../Strore/reducers/Leak";
import ldb from 'localdata';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery'



import '../Utils/GraphView.css';



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
        whatIn = h;
    }
    else if (h <= 2580) {
        curPump = [1, 2]
        whatIn = h - 1350;
    }
    else if (h <= 2850) {
        curPump = [2, 3]
        whatIn = h - 2580;

    }
    else if (h <= 3390) {
        curPump = [3, 4]
        whatIn = h - 2850;
    }
    else if (h <= 4560) {
        curPump = [4, 5]
        whatIn = h - 3390;
    }
    else if (h <= 7016) {
        curPump = [5, 6]
        whatIn = h - 4560;
    }
    else if (h <= 8005) {
        curPump = [6, 7]
        whatIn = h - 7016;
    }

    // whatIn = h;
    console.log("this is whatin", whatIn);

    return (
        whatIn + 1
    );

}

let json_obj = 0;
export function Simulation(props) {
    const [pipeDiameter, setPipeDiameter] = useState(0);
    const [update, setUpdate] = useState(false);
    const [isOpen, setIsopen] = useState(false);
    const [data, setData] = useState({ pressureArray: [[0], [0]], flowArray: [[0], [0]] });
    const [node, setNode] = useState({ id: 0, lat: null, lng: null, pump: [null, null], position: null });

    const [nodePressure, setNodePressure] = useState(new Map())
    const [nodeFlow, setNodeFlow] = useState(new Map())
    const [zoneElev, setZoneElev] = useState(new Map())
    const [zonePressure, setZonePressure] = useState(new Map())
    const [zoneVelocity, setZoneVelocity] = useState(new Map())

    const stateRef = useRef();
    const [modalID, setModalID] = useState(0);
    const [percentage, setPercentage] = useState(null)
    const [timestamp, setTimestamp] = useState(null);
    const [isShow, setIsShow] = useState(true);
    const app = new App({ id: "application-1-ekucx" });
    const credentials = Credentials.anonymous();
    const NodeGraph = [];
    const [Mapitems] = useState([
        <BaseMaps setNode={setNode} />,
        <Vegetation setNode={setNode} />,
        <MuskegMap setNode={setNode} />,
        <SoilMap setNode={setNode} />,
        <SceneMap setNode={setNode} />,
        <Weather setNode={setNode} />,
    ]);

    const dispatch = useDispatch();

    const { leakHistory } = useSelector(state => state.leak);

    const saveLeakToLocal = (obj) => {
        dispatch(saveLeak(obj));
    };

    useEffect(() => {
        if (window.localStorage.getItem("nodePressure") !== undefined &&
        window.localStorage.getItem("nodePressure") !== null &&
        Object.keys(JSON.parse(window.localStorage.getItem("nodePressure"))).length > 0) {
            setNodePressure(new Map(JSON.parse(window.localStorage.getItem("nodePressure"))));
        }
        if (window.localStorage.getItem("nodeFlow") !== undefined &&
        window.localStorage.getItem("nodeFlow") !== null &&
        Object.keys(JSON.parse(window.localStorage.getItem("nodeFlow"))).length > 0) {
            setNodeFlow(new Map(JSON.parse(window.localStorage.getItem("nodeFlow"))));
        }
        if (window.localStorage.getItem("zoneElev") !== undefined &&
        window.localStorage.getItem("zoneElev") !== null &&
        Object.keys(JSON.parse(window.localStorage.getItem("zoneElev"))).length > 0) {
            setZoneElev(new Map(JSON.parse(window.localStorage.getItem("zoneElev"))));
        }
        if (window.localStorage.getItem("zonePressure") !== undefined &&
        window.localStorage.getItem("zonePressure") !== null &&
        Object.keys(JSON.parse(window.localStorage.getItem("zonePressure"))).length > 0) {
            setZonePressure(new Map(JSON.parse(window.localStorage.getItem("zonePressure"))));
        }
        if (window.localStorage.getItem("zoneVelocity") !== undefined &&
        window.localStorage.getItem("zoneVelocity") !== null &&
        Object.keys(JSON.parse(window.localStorage.getItem("zoneVelocity"))).length > 0) {
            setZoneVelocity(new Map(JSON.parse(window.localStorage.getItem("zoneVelocity"))));
        }
    },[]);

    useEffect(() => {
        window.localStorage.setItem("nodePressure", JSON.stringify(Array.from(nodePressure.entries())));
        window.localStorage.setItem("nodeFlow", JSON.stringify(Array.from(nodeFlow.entries())));
        window.localStorage.setItem("zoneElev", JSON.stringify(Array.from(zoneElev.entries())));
        window.localStorage.setItem("zonePressure", JSON.stringify(Array.from(zonePressure.entries())));
        window.localStorage.setItem("zoneVelocity", JSON.stringify(Array.from(zoneVelocity.entries())));
        
    }, [nodePressure, nodeFlow, zoneElev, zonePressure, zoneVelocity]);


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
        if (h == 0) {
            curPump = [0, 1]
            whatIn = h;
        }
        else if (h <= 1350) {
            curPump = [0, 1]
            whatIn = h;
        }
        else if (h <= 2580) {
            curPump = [1, 2]
            whatIn = h - 1350;
        }
        else if (h <= 2850) {
            curPump = [2, 3]
            whatIn = h - 2580;
    
        }
        else if (h <= 3390) {
            curPump = [3, 4]
            whatIn = h - 2850;
        }
        else if (h <= 4560) {
            curPump = [4, 5]
            whatIn = h - 3390;
        }
        else if (h <= 7016) {
            curPump = [5, 6]
            whatIn = h - 4560;
        }
        else if (h <= 8005) {
            curPump = [6, 7]
            whatIn = h - 7016;
        }
    
        // whatIn = h;
        //console.log("this is whatin", whatIn);
        //whatIn = h;
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

        // var xhr = new XMLHttpRequest();

        // xhr.open("POST", "https://dicetunnel.lhr.rocks/RTTMEngine/scriptRun");
        //xhr.setRequestHeader("Content-Type", "application/json");


        // xhr.send(data);
        let inputlink = "http://136.159.140.66/RTTM/Liquid/?leakPercentage=" + leakEdit + "&leakPosition=" + leakPositioning + "&leakZone=" + zoneEdit;

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

        json_obj = JSON.parse(httpreq.responseText);


        console.log("python object", json_obj);

        const dataArrays = {
            pressureArray: json_obj?.Pressure,
            flowArray: json_obj?.Velocity
        };
        setData(dataArrays);
        let nodePressureHolder = [];
        let nodeVelocityHolder = [];
        let nodeIndexes = [];
        let altitudeIndex = [];
        let zoneAltitudeHolder = [];
        let zonePressureHolder = [];
        let zonePressureIndex = [];
        let zoneVelocityHolder = [];
        let zoneVelocityIndex = [];
        zonePressureHolder = json_obj?.Pressure[json_obj?.Pressure.length - 1];
        zoneVelocityHolder = json_obj?.Velocity[json_obj?.Velocity.length - 1];
        for (var i = 0; i < zonePressureHolder.length; i++) {
            zonePressureIndex[i] = i;
            zoneVelocityIndex[i] = i;
        }
        for (var i =0; i<json_obj?.elevation_profiles.length; i++){
            altitudeIndex[i] = i;
            zoneAltitudeHolder[i] = parseFloat((json_obj?.elevation_profiles[i]).toFixed(3));
        }

        let zonePressureMap = zonePressureIndex.map((node, ix) => ({ node, Pressure: zonePressureHolder[ix] }));
        let zoneVelocityMap = zoneVelocityIndex.map((node, ix) => ({ node, FlowRate: zoneVelocityHolder[ix] }));
        let zoneAltitudeMap = altitudeIndex.map((node, ix) => ({ node, Altitude: zoneAltitudeHolder[ix] }));

        console.log("zone altitude map", zoneAltitudeMap);

        setZoneElev(zoneAltitudeMap);
        setZonePressure(zonePressureMap);
        setZoneVelocity(zoneVelocityMap);
        console.log("dataArrays",dataArrays)
        console.log("whatIn",whatIn)
        if(whatIn > dataArrays.pressureArray[0].length){
            whatIn = dataArrays.pressureArray[0].length - 1;
        }
        for (var i = 0; i < dataArrays.pressureArray.length && dataArrays!=null; i++) {
            nodePressureHolder[i] = parseFloat((dataArrays.pressureArray[i][whatIn] / 1000000).toFixed(3));
            nodeVelocityHolder[i] = parseFloat((dataArrays.flowArray[i][whatIn]).toFixed(3));
            nodeIndexes[i] = i;
        }

        let nodePressureMap = nodeIndexes.map((node, ix) => ({ node, Pressure: nodePressureHolder[ix] }));
        let nodeVelocityMap = nodeIndexes.map((node, ix) => ({ node, FlowRate: nodeVelocityHolder[ix] }));

        setNodePressure(nodePressureMap);
        setNodeFlow(nodeVelocityMap);
        setPipeDiameter(json_obj?.PipeDiameter);

        const date = new Date();

        saveLeakToLocal({
            time: date.getTime(),
            node: node.id,
            percentage: LeakPercentage.current.value,
            zonePressureMap,
            zoneVelocityMap,
            nodePressureMap,
            nodeVelocityMap
        })

        console.log("node pressure", nodePressure);
        console.log("data", data)

        //need to use ldb instead of local storage since local storage has a 5mb limit
        ldb.clear(function () {
            console.log('Storage cleared')
        });


        ldb.set('JSONOBJECT', json_obj);

        // console.log("let us empty the local storage")
        // window.localStorage.removeItem("JSONOBJECT");

        // window.localStorage.setItem("JSONOBJECT", JSON.stringify(json_obj));
        // let jsontest = window.localStorage.getItem("JSONOBJECT");\

        ldb.get('JSONOBJECT', function (jsontest) {
            console.log('And the value is', jsontest);
        });
        //const anchor = document.getElementById("LeakDetection");
        //const result = anchor.toString();
        //console.log("this is the anchor", result);
        setUpdate(!update);

        setTimestamp(date.toLocaleString('en-us', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }));
        alert("Node and Zone Graphs have been Updated")

    }

    function renderToast(percent) {
        console.log("toast");
        //toast("LIQUID RTTM Progress: "+percent+"%", {
        toast("LIQUID RTTM Simulation Complete", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: updateProgress,
        });
    }

    // useEffect(() => {
    //     const fetchData = async () => {

    //         const newData = {
    //             pressureArray: json_obj.Pressure,
    //             flowArray: json_obj.Velocity
    //         };
    //         setData(newData);
    //     };
    //     fetchData();
    // }, [json_obj]);


    // useEffect(() => {
    //     stateRef.current = { data, node };
    //     let i = 0;
    //     const interval = setInterval(() => {
    //         const { data, node } = stateRef.current;
    //         if (data.pressureArray != null && 200 >= 0 && 200 < data.pressureArray.length) {
    //             pressureHolder[i] = data.pressureArray[i][200];
    //             console.log("stateArray", data.pressureArray[i][200]);
    //             console.log("pressure holder", pressureHolder[i]);
    //             console.log("length", data.pressureArray.length)
    //             console.log("i", i)
    //             indexes[i] = i;
    //             i++;
    //         }
    //     }, 1066);
    //     pipepressure = indexes.map((node, ix) => ({ node, Pressure: pressureHolder[ix] }));
    //     setPipePressure(pipepressure);
    //     console.log("pipe pressure", pipePressure)
    //     return () => clearInterval(interval);
    // }
    //     , [data, node]);



    function nodeGraphRender(prop) {
        const modal = <div>
            <List>
                {update}
                <h5>Pressure of Node : {node.id}</h5>
                <ResponsiveContainer width="100%" height={180} >
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                        <XAxis dataKey="node" xAxisId={"pressIndex"} label={{ value: 'Timesteps (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (MPa)', angle: -90, position: 'Left' }} />
                        <Line xAxisId={"pressIndex"} data={nodePressure} type="monotone" dataKey="Pressure" stroke="#b11540" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
                <h5>Flow rate of Node : {node.id}</h5>

                <ResponsiveContainer width="100%" height={180}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                        <XAxis dataKey="node" xAxisId={"velIndex"} label={{ value: 'Timesteps (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} label={{ value: 'FlowRate (cms)', angle: -90, position: 'Left' }} />
                        <Line xAxisId={"velIndex"} data={nodeFlow} type="monotone" dataKey="FlowRate" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>

            </List>
        </div>
        return modal;
        // let pipepressure;
        // let pipevelocity;
        // var indexes = [];
        // var pressureHolder = [];
        // var velocityHolder = [];
        // let Pressure = [0];
        // let Velocity = [0];

        // ldb.get('JSONOBJECT', function (jsontest) {
        //     console.log('And the value is', jsontest);
        //     if (jsontest == null) {
        //         jsontest = [0];
        //     }
        //     else {
        //         Pressure = jsontest.Pressure;
        //         Velocity = jsontest.Velocity;
        //         for (var i = 0; i < Pressure.length; i++) {
        //             pressureHolder[i] = parseFloat((Pressure[i][200] / 1000000).toFixed(3));
        //             velocityHolder[i] = parseFloat((Velocity[i][200]).toFixed(3));
        //             indexes[i] = i;
        //         }

        //         pipepressure = indexes.map((node, ix) => ({ node, Pressure: pressureHolder[ix] }));
        //         console.log("pipepressure", pipepressure); 
        //         pipevelocity = indexes.map((node, ix) => ({ node, FlowRate: velocityHolder[ix] })); 
        //     }
        //     //pipepressure = indexes.map((node, ix) => ({ node, Pressure: pressureHolder[ix] }));
        //     // if (pressureData != null) {
        //     //     for (var i = 0; i < pressureData.length; i++) {
        //     //         pressureHolder[i] = pressureData[i][200];
        //     //         indexes[i] = i;
        //     //         console.log("pressuraarrayinodeid", pressureData[i][200]);
        //     //         // console.log("node.id", node.id);
        //     //     }
        //     //     console.log("pressureHolder", pressureHolder);
        //     // }



        // });


        // return (


        //     <ResponsiveContainer width="100%" height={180} >
        //         <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
        //             <XAxis dataKey="node" xAxisId={"pressIndex"} label={{ value: 'Node No.', angle: 0, position: 'bottom', offset: -4 }} />

        //             <XAxis hide={true} dataKey="node" xAxisId={"velIndex"} />
        //             <XAxis hide={true} dataKey="node" xAxisId={"altIndex"} />
        //             <Legend />
        //             <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (MPa)', angle: -90, position: 'Left' }} />


        //             <Line xAxisId={"pressIndex"} data={pipepressure} type="monotone" dataKey="Pressure" stroke="#b11540" dot={null} activeDot={{ r: 5 }} />


        //             <Tooltip />
        //         </LineChart>
        //     </ResponsiveContainer>


        // );

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
                <GraphView type="line" onClick={() => showModal(2)} />
                {isOpen && (modalID == 2) && (
                    <ModalContent onClose={() => setIsopen(false)}>
                        <div className="modal_c">
                            <h3>Outlet  Flow-Rate Measured vs Simulated</h3>
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

    const LeakPercentage = React.useRef();
    const LeakPosition = React.useRef();

    //const LeakZone = React.useRef();
    const handleSubmit = () => {
        const date = new Date();
        // console.log(LeakPercentage.current.value, LeakZone.current.value);
        UseScript(LeakPercentage.current.value)
        if (node.id === null || node.pump[0] === null || node.pump[1] === null) {
            alert('Select a pipeline node to simulate.')
        } else {
            setTimestamp(date.toLocaleString('en-us', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }));
        }
        const min = 0;
        const max = 5;
        const temp = Math.floor(Math.random() * (max - min + 1) * 100) / 100 + min;
        // setPercentage(temp);
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

    // 1 - inlet pressure
    // 2 - inlet pressure control point
    // 3 - inlet flow rate
    // 4 - inlet flow rate control point
    // 5 - outlet pressure
    // 6 - outlet pressure control point
    // 7 - outlet flow rate
    // 8 - outlet flow rate control point

    const bc_one = [
        { value: 1, label: 'inlet pressure' },
        { value: 2, label: 'inlet pressure control point' },
        { value: 3, label: 'inlet flow rate' },
        { value: 4, label: 'inlet flow rate control point' },
    ]

    const bc_two = [
        { value: 5, label: 'outlet pressure' },
        { value: 6, label: 'outlet pressure control point' },
        { value: 7, label: 'outlet flow rate' },
        { value: 8, label: 'outlet flow rate control point' },
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
        const alt = // removes graph and graph2 for now
            <div className='alter'>
                <h3>Selected zone info</h3>
                <div style={{ padding: '1rem' }}>
                    Zone {node.pump[1]} Currently Selected
                </div>
                <h3>Timestamp</h3>
                <div style={{ padding: '1rem' }}>
                    <h3>{new Date().toLocaleString("en-US", options)} {new Date().toLocaleTimeString()}</h3>
                </div>
                <h3>Graphs</h3>
                <Container fluid>
                    <Row>
                        <Col>
               
                        </Col>
                        <Col>
                    
                        </Col>
                    </Row>
                </Container>

                <h5>Elevation profile of Zone : {node.pump[1]}</h5>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                        <XAxis dataKey="node" xAxisId={"velIndex"} label={{ value: 'Node', angle: 0, position: 'bottom', offset: -4 }} />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} label={{ value: 'meters (m)', angle: -90, position: 'Left' }} />
                        <Line xAxisId={"velIndex"} data={zoneElev} type="monotone" dataKey="Altitude" stroke="#82ca9d" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>

                <h5>Pressure of Zone : {node.pump[1]}</h5>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                        <XAxis dataKey="node" xAxisId={"velIndex"} label={{ value: 'Node', angle: 0, position: 'bottom', offset: -4 }} />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} label={{ value: 'Pressure (Pa)', angle: -90, position: 'Left' }} />
                        <Line xAxisId={"velIndex"} data={zonePressure} type="monotone" dataKey="Pressure" stroke="#FF0000" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>

                <h5>Velocity of Zone : {node.pump[1]}</h5>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
                        <XAxis dataKey="node" xAxisId={"velIndex"} label={{ value: 'Node', angle: 0, position: 'bottom', offset: -4 }} />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} label={{ value: 'FlowRate (cms)', angle: -90, position: 'Left' }} />
                        <Line xAxisId={"velIndex"} data={zoneVelocity} type="monotone" dataKey="FlowRate" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        return alt;
    }

    function getWhatin() {
        return whatIn;
    }

    function toggleEvt(e) {
        const target = $(e.currentTarget);

        const submenuContainer = target.siblings('.submenuContainer');

        if (isShow === true) {
            (submenuContainer).slideUp();
            setIsShow(false);
        } else {
            (submenuContainer).slideDown();
            setIsShow(true);
        }
    }

    function tab() {
        const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        }


        const tab =
            <div className='tabber' style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem' }}>
                <Tabs>
                    <TabList>
                        <Tab>Leakage Setting</Tab>
                        <Tab>Node {node.id}</Tab>
                        <Tab>Zone {node.pump[1]}</Tab>
                    </TabList>
                    <TabPanel>
                        <div>
                            <div>
                                <h3> Instruction </h3>
                                <div style={{ padding: '1rem' }}>
                                    <span>Select a pipeline node on the map.</span>
                                </div>
                            </div>
                            <div>
                                <h3> Inputs for Leak Simulation </h3>
                                <div style={{ padding: '1rem' }}>
                                    <ul>

                                        <li>Selected node info
                                            <div>Node ID: {node.id}</div>
                                            <div>Pump station: {node.pump[0]} - {node.pump[1]}</div>
                                        </li>
                                        <li>
                                            <div className="div.b">
                                                <label>
                                                    Relative Leak Position
                                                </label>
                                                <br />
                                                <input ref={LeakPosition} disabled={true} value={node.position} />
                                                {"\n\n"}
                                                <br />
                                            </div>
                                        </li>
                                        <li>
                                            {index()}
                                            <span id={'leakagePercentage'}> {percentage}</span>
                                        </li>
                                        <li>
                                            <label> Fluid Composition</label> <Select options={choices} placeholder='CH4_Hyd_90' />
                                        </li>
                                        <li>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0' }} onClick={(e) => toggleEvt(e)}>
                                                <label> Advanced</label> {isShow ? <FontAwesomeIcon icon="chevron-down" /> : <FontAwesomeIcon icon="chevron-right" />}
                                            </div>
                                            <div class='submenuContainer'>
                                                <label>Boundary Condition Type One</label><Select options={bc_one} placeholder={'inlet pressure'} />
                                                <label>Boundary Condition Type Two</label><Select options={bc_two} placeholder={'outlet pressure'} />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div style={styles.btnContainer}>
                                    <div style={{ ...styles.btnContainer, justifyContent: 'flex-start' }}>
                                        <button
                                            style={{
                                                ...styles.submitBtn,
                                                backgroundColor: node.id === null ? 'lightgrey' : '#ec7210'
                                            }}
                                            onClick={handleSubmit}
                                            disabled={node.id === null ? true : false}>
                                            Start Leak Simulation
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ padding: '1rem' }}>
                                    <ul>
                                        <li>
                                            Timestamp: <span>{timestamp}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h3>Selected node info</h3>
                        <div style={{ padding: '1rem' }}>
                            Node {node.id} {node.id === null ? 'Not Selected' : 'Currently Selected'} <br />
                            PUMP STATIONS : {node.pump[0]} - {node.pump[1]}<br />
                            Node 1 : Lat: -113.3569, Long: 53.54877 <br />
                            Node 1351: Lat: -113.5979, Long: 53.2801
                        </div>
                        <h3>Timestamp</h3>

                        <div style={{ padding: '1rem' }}>

                            <h3>{new Date().toLocaleString("en-US", options)} {new Date().toLocaleTimeString()}</h3>

                            <div><span>{timestamp}</span></div>
                        </div>
                        <h3>Graphs</h3>
                        <div style={{ padding: '1rem' }}>
                            {nodeGraphRender()}

                        </div>
                    </TabPanel>
                    <TabPanel>

                        {altitude()}
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


export default Simulation;