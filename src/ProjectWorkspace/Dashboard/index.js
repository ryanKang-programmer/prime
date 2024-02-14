import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import "./index.css";
import { AiFillCloseCircle } from "react-icons/ai";
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
/**
 * Pipeline Overview
 */

const data = [
    { no: "1", lineID: "019841023", operation: "On", map: "true" },
    { no: "2", lineID: "1203918204", operation: "Off", map: "false" },
    { no: "3", lineID: "478192742", operation: "On", map: "false" },
    { no: "4", lineID: "5123819748", operation: "On", map: "false" },
    { no: "5", lineID: "581723918", operation: "Off", map: "false" },
    { no: "6", lineID: "098120941", operation: "Off", map: "false" },
    { no: "7", lineID: "32418983", operation: "Off", map: "false" },
    { no: "8", lineID: "512351927", operation: "On", map: "false" },
    { no: "1", lineID: "019841023", operation: "On", map: "true" },
    { no: "2", lineID: "12039182", operation: "Off", map: "false" },
    { no: "3", lineID: "478192742", operation: "On", map: "false" },
    { no: "4", lineID: "5123819748", operation: "On", map: "false" },
    { no: "5", lineID: "581723918", operation: "Off", map: "false" },
    { no: "6", lineID: "098123841", operation: "Off", map: "false" },
    { no: "7", lineID: "32418983", operation: "Off", map: "false" },
    { no: "8", lineID: "512351938", operation: "On", map: "false" },
]

const data2 = [
    {time: new Date().getTime(), node: 354, percentage: '2%'},
    {time: new Date().getTime() - 5215458, node: 243, percentage: '9%'},
    {time: new Date().getTime() - 5215458, node: 134, percentage: '10%'},
    {time: new Date().getTime() - 5354789, node: 547, percentage: '15%'},
    {time: new Date().getTime() - 5458796, node: 951, percentage: '19%'},
    {time: new Date().getTime() - 5545793, node: 248, percentage: '21%'},
    {time: new Date().getTime() - 5687941, node: 952, percentage: '25%'},
    {time: new Date().getTime() - 5789541, node: 743, percentage: '32%'},
    {time: new Date().getTime() - 5895431, node: 652, percentage: '35%'},
    {time: new Date().getTime() - 5985674, node: 438, percentage: '39%'},
]

const data3 = [
    {time: new Date().getTime(), from: 143, to: 553, highPressure: 241},
    {time: new Date().getTime() - 9215458, from: 243, to: 253, highPressure: 251},
    {time: new Date().getTime() - 9215458, from: 134, to: 153, highPressure: 139},
    {time: new Date().getTime() - 9354789, from: 547, to: 553, highPressure: 551},
    {time: new Date().getTime() - 9458796, from: 951, to: 953, highPressure: 952},
    {time: new Date().getTime() - 9545793, from: 248, to: 253, highPressure: 251},
    {time: new Date().getTime() - 9687941, from: 952, to: 953, highPressure: 952},
    {time: new Date().getTime() - 9789541, from: 743, to: 753, highPressure: 751},
    {time: new Date().getTime() - 9895431, from: 652, to: 753, highPressure: 695},
    {time: new Date().getTime() - 9985674, from: 438, to: 553, highPressure: 459},
]

const data4 = [
    {time: new Date().getTime(), from: 143, to: 553, percentage: '24%'},
    {time: new Date().getTime() - 9215458, from: 243, to: 253, percentage: '25%'},
    {time: new Date().getTime() - 9215458, from: 134, to: 153, percentage: '13%'},
    {time: new Date().getTime() - 9354789, from: 547, to: 553, percentage: '55%'},
    {time: new Date().getTime() - 9458796, from: 951, to: 953, percentage: '95%'},
    {time: new Date().getTime() - 9545793, from: 248, to: 253, percentage: '25%'},
    {time: new Date().getTime() - 9687941, from: 952, to: 953, percentage: '95%'},
    {time: new Date().getTime() - 9789541, from: 743, to: 753, percentage: '75%'},
    {time: new Date().getTime() - 9895431, from: 652, to: 753, percentage: '69%'},
    {time: new Date().getTime() - 9985674, from: 438, to: 553, percentage: '45%'},
]

const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title:{
        text: "Bounce Rate by Week of Year"
    },
    axisY: {
        title: "Bounce Rate",
        suffix: "%"
    },
    axisX: {
        title: "Week of Year",
        prefix: "W",
        interval: 2
    },
    data: [{
        type: "line",
        toolTipContent: "Week {x}: {y}%",
        dataPoints: [
            { x: 1, y: 64 },
            { x: 2, y: 61 },
            { x: 3, y: 64 },
            { x: 4, y: 62 },
            { x: 5, y: 64 },
            { x: 6, y: 60 },
            { x: 7, y: 58 },
            { x: 8, y: 59 },
            { x: 9, y: 53 },
            { x: 10, y: 54 },
            { x: 11, y: 61 },
            { x: 12, y: 60 },
            { x: 13, y: 55 },
            { x: 14, y: 60 },
            { x: 15, y: 56 },
            { x: 16, y: 60 },
            { x: 17, y: 59.5 },
            { x: 18, y: 63 },
            { x: 19, y: 58 },
            { x: 20, y: 54 },
            { x: 21, y: 59 },
            { x: 22, y: 64 },
            { x: 23, y: 59 }
        ]
    }]
}

const optionStr = JSON.stringify({...options});

function Dashboard(props) {

    const { leakHistory } = useSelector(state => state.leak);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [leakModalNode, setLeakModalNode] = React.useState(null);
    const [leakModalPercentage, setLeakModalPercentage] = React.useState(null);
    const [leakModalTimestamp, setLeakModalTimestamp] = React.useState(null);
    const [graph1, setGraph1] = React.useState();
    const [graph2, setGraph2] = React.useState();
    const [graph3, setGraph3] = React.useState();
    const [graph4, setGraph4] = React.useState();

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal(e) {
        setIsOpen(false);
        e.stopPropagation();
    }

    useEffect(() => {
        if (!modalIsOpen) {
            setGraph1();
            setGraph2();
            setGraph3();
            setGraph4();
        }
    }, [modalIsOpen])

    function leakModal(idx) {
        console.log(idx);
        const obj = leakHistory[idx];
        setLeakModalNode(obj.node);
        setLeakModalPercentage(obj.percentage);
        setLeakModalTimestamp(obj.time);

        //node Pressure

        if (obj.nodePressureMap !== undefined && obj.nodePressureMap.length > 0) {
            const data = obj.nodePressureMap.map(o => {
                return ({
                    x: o.node,
                    y: o.Pressure
                })
            });

            const _o = JSON.parse(optionStr);
            _o.title.text = 'Node Pressure Map'
            _o.axisX.title = 'Node'
            delete _o.axisX.prefix
            delete _o.axisX.interval
            _o.axisY.title = 'Pressure'
            delete _o.axisY.suffix
            _o.data[0].toolTipContent = "Node {x}: {y}";
            _o.data[0].dataPoints = data;
            setGraph1(_o);
        }
        //node FlowRate
        if (obj.nodeVelocityMap !== undefined && obj.nodeVelocityMap.length > 0) {
            const data = obj.nodeVelocityMap.map(o => {
                return ({
                    x: o.node,
                    y: o.FlowRate
                })
            });
            console.log(data);

            const _o = JSON.parse(optionStr);
            _o.title.text = 'Node Velocity Map'
            _o.axisX.title = 'Node'
            delete _o.axisX.prefix
            delete _o.axisX.interval
            _o.axisY.title = 'Velocity'
            delete _o.axisY.suffix
            _o.data[0].toolTipContent = "Node {x}: {y}";
            _o.data[0].dataPoints = data;

            setGraph2(_o);
        }
        //node Pressure
        if (obj.zonePressureMap !== undefined && obj.zonePressureMap.length > 0) {
            const data = obj.zonePressureMap.map(o => {
                return ({
                    x: o.node,
                    y: o.Pressure
                })
            });
            console.log(data);

            const _o = JSON.parse(optionStr);
            _o.title.text = 'Zone Pressure Map';
            _o.axisX.title = 'Node'
            delete _o.axisX.prefix
            delete _o.axisX.interval
            _o.axisY.title = 'Pressure'
            delete _o.axisY.suffix
            _o.data[0].toolTipContent = "Node {x}: {y}";
            _o.data[0].dataPoints = data;
            setGraph3(_o);
        }
        //node FlowRate
        if (obj.zoneVelocityMap !== undefined && obj.zoneVelocityMap.length > 0) {
            const data = obj.zoneVelocityMap.map(o => {
                return ({
                    x: o.node,
                    y: o.FlowRate
                })
            });
            console.log(data);

            const _o = JSON.parse(optionStr);
            console.log(_o);
            _o.title.text = 'Zone Velocity Map';
            _o.axisX.title = 'Node'
            delete _o.axisX.prefix
            delete _o.axisX.interval
            _o.axisY.title = 'Velocity'
            delete _o.axisY.suffix
            _o.data[0].toolTipContent = "Node {x}: {y}";
            _o.data[0].dataPoints = data;
            setGraph4(_o);
        }

        setIsOpen(true);
    }

    return (
        <div style={{display: 'flex', height: '100vh', width: '100%', padding: '1rem 2rem', flexDirection: 'column', position: 'relative'}}>
            <div style={{display: 'flex', flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                <div style={{...styles.left, justifyContent: 'space-between', alignItems: 'strech'}}>
                    <div style={{...styles.container, width: '100%'}}>
                        <div style={{...styles.header}}>
                            <h5 style={{fontWeight: '700'}}>Pipeline</h5>
                        </div>
                        <div style={{...styles.body, position: 'relative'}}>
                            <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                                <div style={{...styles.tableHeader, flex: 0.1}}>No.</div>
                                <div style={{...styles.tableHeader, flex: 0.6}}>Line ID</div>
                                <div style={{...styles.tableHeader, flex: 0.3}}>Operation</div>
                            </div>
                            {data.map(obj => {
                                return (
                                <div style={{padding: '.5rem', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{...styles.tableContent, flex: 0.1}}>{obj.no}</div>
                                    <div style={{...styles.tableContent, flex: 0.6}}>{obj.lineID}</div>
                                    <div style={{...styles.tableContent, flex: 0.3, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        <div style={{
                                            height: '20px',
                                            width: '20px',
                                            borderRadius: '10px',
                                            backgroundColor: obj.operation === 'Off' ? 'red' : 'lightgreen'
                                        }}>
                                        </div>
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                    <div style={{...styles.container}}>
                        <div style={{...styles.header}}>
                            <h5 style={{fontWeight: '700'}}>Leak Detection</h5>
                        </div>
                        <div style={{...styles.body, position: 'relative'}}>
                            <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                                <div style={{...styles.tableHeader, flex: 0.4}}>Time</div>
                                <div style={{...styles.tableHeader, flex: 0.3}}>Node No.</div>
                                <div style={{...styles.tableHeader, flex: 0.3}}>Percentage</div>
                            </div>
                            {
                            leakHistory.filter(obj => obj !== null).length === 0 ? 
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '.5rem'}}>
                                No history
                            </div> :
                            leakHistory.map((obj, idx) => {
                                return (
                                obj === null ? '' :
                                <div class='li-items' style={{padding: '.5rem', display: 'flex', flexDirection: 'row', cursor: 'pointer'}} onClick={() => leakModal(idx)}>
                                    <div style={{...styles.tableContent, flex: 0.4}}>
                                        {new Date(obj.time).toLocaleString('en-us',
                                            { 
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                    </div>
                                    <div style={{...styles.tableContent, flex: 0.3}}>{obj.node}</div>
                                    <div style={{...styles.tableContent, flex: 0.3}}>{obj.percentage}</div>
                                </div>)
                            })
                            }
                        </div>
                    </div>
                    <div style={{...styles.container}}>
                        <div style={{...styles.header}}>
                            <h5 style={{fontWeight: '700'}}>Stress Analysis</h5>
                        </div>
                        <div style={{...styles.body, position: 'relative'}}>
                            <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                                <div style={{...styles.tableHeader, flex: 0.4}}>Time</div>
                                <div style={{...styles.tableHeader, flex: 0.2}}>From</div>
                                <div style={{...styles.tableHeader, flex: 0.2}}>To</div>
                                <div style={{...styles.tableHeader, flex: 0.2}}>High Pressure</div>
                            </div>
                            {data3.map(obj => {
                                return (
                                <div style={{padding: '.5rem', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{...styles.tableContent, flex: 0.4}}>
                                        {new Date(obj.time).toLocaleString('en-us',
                                            { 
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })
                                        }    
                                    </div>
                                    <div style={{...styles.tableContent, flex: 0.2}}>{obj.from}</div>
                                    <div style={{...styles.tableContent, flex: 0.2, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        {obj.to}
                                    </div>
                                    <div style={{...styles.tableContent, flex: 0.2, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        {obj.highPressure}
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                    <div style={{...styles.container}}>
                        <div style={{...styles.header}}>
                            <h5 style={{fontWeight: '700'}}>WhatIf?</h5>
                        </div>
                        <div style={{...styles.body, position: 'relative'}}>
                            <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                                <div style={{...styles.tableHeader, flex: 0.4}}>Time</div>
                                <div style={{...styles.tableHeader, flex: 0.2}}>From</div>
                                <div style={{...styles.tableHeader, flex: 0.2}}>To</div>
                                <div style={{...styles.tableHeader, flex: 0.2}}>Percentage</div>
                            </div>
                            {data4.map(obj => {
                                return (
                                <div style={{padding: '.5rem', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{...styles.tableContent, flex: 0.4}}>
                                        {new Date(obj.time).toLocaleString('en-us',
                                        { 
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                                        })}    
                                    </div>
                                    <div style={{...styles.tableContent, flex: 0.2}}>{obj.from}</div>
                                    <div style={{...styles.tableContent, flex: 0.2, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        {obj.to}
                                    </div>
                                    <div style={{...styles.tableContent, flex: 0.2, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        {obj.percentage}
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                    <div style={{...styles.container}}>
                        <div style={{...styles.header}}>
                            <h5 style={{fontWeight: '700'}}>Risk Analysis</h5>
                        </div>
                        <div style={{...styles.body, position: 'relative'}}>
                            <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                                <div style={{...styles.tableHeader, flex: 0.4}}>Time</div>
                                <div style={{...styles.tableHeader, flex: 0.3}}>Node No.</div>
                                <div style={{...styles.tableHeader, flex: 0.3}}>Percentage</div>
                            </div>
                            {data2.map(obj => {
                                return (
                                <div style={{padding: '.5rem', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{...styles.tableContent, flex: 0.4}}>
                                        {new Date(obj.time).toLocaleString('en-us',
                                            { 
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                    </div>
                                    <div style={{...styles.tableContent, flex: 0.3}}>{obj.node}</div>
                                    <div style={{...styles.tableContent, flex: 0.3}}>{obj.percentage}</div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
                {/* <div style={styles.right}>
                    <div style={{flex: 1, border: '.5px solid lightgrey'}}>
                        <div style={{...styles.header}}>
                            <h5 style={{fontWeight: '700'}}>Simulation History</h5>
                        </div>
                        <div style={{...styles.body}}>

                        </div>
                    </div>
                </div> */}
                <div style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', inset: 0, display: modalIsOpen ? 'block' : 'none'}} >
                    <div style={{backgroundColor: 'white', inset: '5vh 5vw', position: 'absolute', padding: '3rem'}}>
                        <div style={{display: 'flex', height: '100%'}}>
                            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                <div style={{display: 'flex'}}>
                                    <h2>Node: {leakModalNode}</h2>
                                    <div style={{padding: '0 1.5rem'}}></div>
                                    <h2>Percentage: {leakModalPercentage}</h2>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'flex-end', paddingBottom: '3rem'}}>
                                    <h2>
                                    {new Date(leakModalTimestamp).toLocaleString('en-us',
                                        { 
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                                        })}
                                    </h2>
                                </div>
                                <div style={{flex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflowY: 'auto'}}>
                                    <div style={{width: '40%'}}>
                                        {graph1 !== undefined ? <CanvasJSChart options = {graph1} />
                                        :
                                        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <h2>No data</h2>
                                        </div>}
                                    </div>
                                    <div style={{width: '40%'}}>
                                        {graph2 !== undefined ? <CanvasJSChart options = {graph2} />
                                        :
                                        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <h2>No data</h2>
                                        </div>}
                                    </div>
                                    <div style={{width: '40%'}}>
                                        {graph3 !== undefined ? <CanvasJSChart options = {graph3} />
                                        :
                                        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <h2>No data</h2>
                                        </div>}
                                    </div>
                                    <div style={{width: '40%'}}>
                                        {graph4 !== undefined ? <CanvasJSChart options = {graph4} />
                                        :
                                        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <h2>No data</h2>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{top: 0, right: 0, paddingRight: '1rem', position: 'absolute', fontSize: '3rem', cursor: 'pointer'}} onClick={closeModal}>
                            <AiFillCloseCircle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        width: 'calc(50% - 1rem)',
        height: '30%',
        border: '.5px solid lightgrey',
        display: 'flex',
        flexDirection: 'column',
    },
    left: {
        display: 'flex',
        flex: 1,
        padding: '1rem',
        flexDirection : 'row',
        flexWrap: 'wrap',
    },
    right: {
        display: 'flex',
        flex: 0.3,
        padding: '1rem',
    },
    header: {
        padding: '.5rem',
        backgroundColor: '#eeeeee',
    },
    body: {
        flex: 1,
        overflow: 'auto',
    },
    tableHeader: {
        textAlign: 'center',
        fontWeight: 700
    },
    tableContent: {
        textAlign: 'center',
    }
}

export default Dashboard;