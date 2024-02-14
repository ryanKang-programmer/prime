import React from "react";
import { useState } from "react";
import './GraphView.css';
import Wavelet from "./Wavelet";








import Altitude from './Data/Altitude/AltKM.json';
import Distance from './Data/Altitude/TotDist.json';




//import Pressure from './Data/pressure.json';


import Stress from '../StressAnalysis/StressData/PiSAOutVMStress.json';
//localstorage alternative
import ldb from 'localdata';


import {
    BarChart, Bar, Cell, Label, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';
import * as d3 from "d3";
import Simulation from "../StressAnalysis/Simulation";
//reading in the Python JSON object




//let jsontest = window.localStorage.getItem("JSONOBJECT");

let StressArray = [0]
if(JSON.parse(window.localStorage.getItem('StressObject')) !=null || JSON.parse(window.localStorage.getItem('StressObject')) != undefined)
{
    StressArray = JSON.parse(window.localStorage.getItem('StressObject'));
    console.log("StressArray", StressArray);
}
let Pressure = [0];
let Velocity = [0];
let ElevationProf = [0];
let InFlowMeasured = [0];
let InFlow = [0];
let InFlowSimSamp = [0];
let OutflowMeasured = [0];
let OutflowSim = [0];
let InPressSim = [0];
let OutPressSim = [0];
let OutPressMeasured = [0];
let InFlowSimFlow = [0];
let InPressMeasured = [0];


let pipeelevationprof;
let pipepressure;

let nodepipepressure;
let nodepipevelocity;

let pipevelocity;
let obj;
let FlowSim;
let OutM;
let OutS;
let InPressM;
let InPressSi;
let OutPressM;
let OutPressSi;
var resi = [];
let Residue;
var pressureHolder = [];
var nodePressureHolder = [];
var nodeVelocityHolder = [];
var velocityHolder = [];
var elevProfHolder = [];
var indexes = [];
var nodeIndexes = [];

ldb.get('JSONOBJECT', function (jsontest) {
    console.log('And the value is', jsontest);


    if (jsontest == null) {
        jsontest = [0];


    }
    else {
        //console.log("json object", JSON.parse(jsontest));



        //SimSample
        //import InFlowSimSamp from './Data/InletFlow/InFlowSimSamp.json';




        //Measured Sample
        //import InFlowMeasured from './Data/InletFlow/InFlowMeasured.json';
        InFlowMeasured = jsontest.MeasuredSamp;
        console.log("Inflowmeasured", InFlowMeasured);
        //inlet flow
        //import InFlow from './Data/InletFlow/InFlow.json';
        InFlow = jsontest.InFlowMeasure;
        console.log("InFlow in GraphView.js", InFlow)
        //import InFlowSimFlow from './Data/InletFlow/InFlowSimFlow.json';
        InFlowSimFlow = jsontest.InFlowSim;
        console.log("InFlowSimFlow in GraphView.js", InFlowSimFlow)


        //Outlet flow
        //import OutflowMeasured from './Data/OutletFlow/OutflowMeasure.json';
        OutflowMeasured = jsontest.OutflowMeasure;
        //import OutflowSim from './Data/OutletFlow/OutflowSim.json';
        OutflowSim = jsontest.OutflowSim;




        //inlet Pressure
        //import InPressMeasured from './Data/InletPressure/InPressMeasured.json';
        InPressMeasured = jsontest.InPressMeasure;
        //import InPressSim from './Data/InletPressure/InPressSim.json';
        InPressSim = jsontest.InPressSim;




        //Outlet Pressure
        //import OutPressMeasured from './Data/OutletPressure/OutPressMeasured.json';
        OutPressMeasured = jsontest.OutPressMeasure;
        //import OutPressSim from './Data/OutletPressure/OutPressSim.json';
        OutPressSim = jsontest.OutPressSim;




        Pressure = jsontest.Pressure;
        Velocity = jsontest.Velocity;
        ElevationProf = jsontest.elevation_profiles;
        console.log("Pressure", Pressure);
        //Measured Sample
        InFlowSimSamp = jsontest.SimSamp;
        //window.location.reload(false);
        for (var i = 0; i < Pressure[0].length; i++) {
            pressureHolder[i] = parseFloat((Pressure[Pressure.length - 1][i] / 1000000).toFixed(3));
            velocityHolder[i] = parseFloat((Velocity[Velocity.length - 1][i]).toFixed(3));
            elevProfHolder[i] = parseFloat((ElevationProf[i] * 150).toFixed(3));
            indexes[i] = i;

            
        }
        let x = Math.floor((Math.random() * 500) + 1);
        for (var i = 0; i < Pressure.length; i++) {
            nodePressureHolder[i] = parseFloat((Pressure[i][x] / 1000000).toFixed(3));
            nodeVelocityHolder[i] = parseFloat((Velocity[i][x]).toFixed(3));
            nodeIndexes[i] = i;
        }
        console.log("indexes", indexes)
        console.log(pressureHolder);
        pipeelevationprof = indexes.map((node, ix) => ({ node, Elevation: elevProfHolder[ix] }));
        pipepressure = indexes.map((node, ix) => ({ node, Pressure: pressureHolder[ix] }));
        nodepipepressure = nodeIndexes.map((node, ix) => ({ node, Pressure: nodePressureHolder[ix] }));
        console.log("pipepressure", pipepressure)

        pipevelocity = indexes.map((node, ix) => ({ node, FlowRate: velocityHolder[ix] }));
        nodepipevelocity = nodeIndexes.map((node, ix) => ({ node, FlowRate: nodeVelocityHolder[ix] }));





        //inlet flow
        obj = InFlowMeasured.map((Sample, ix) => ({ Sample, Measured_Flow: InFlow[ix] }));


        FlowSim = InFlowSimSamp.map((Sample, ix) => ({ Sample, RTTM_Flow: InFlowSimFlow[ix] }));


        //outlet flow
        OutM = InFlowMeasured.map((Sample, ix) => ({ Sample, Measured_Flow: OutflowMeasured[ix] }));


        OutS = InFlowSimSamp.map((Sample, ix) => ({ Sample, RTTM_Flow: OutflowSim[ix] }));


        //inlet pressure
        InPressM = InFlowMeasured.map((Sample, ix) => ({ Sample, Measured_Pressure: InPressMeasured[ix] }));


        InPressSi = InFlowSimSamp.map((Sample, ix) => ({ Sample, RTTM_Pressure: InPressSim[ix] }));


        //outlet pressure
        OutPressM = InFlowMeasured.map((Sample, ix) => ({ Sample, Measured_Pressure: OutPressMeasured[ix] }));


        OutPressSi = InFlowSimSamp.map((Sample, ix) => ({ Sample, RTTM_Pressure: OutPressSim[ix] }));






        for (let x = 0; x < OutPressSim.length; x++) {
            resi[x] = parseFloat(Math.abs(OutPressMeasured[x] - OutPressSim[x]));


        }
        console.log(OutPressMeasured)
        console.log(OutPressSim)
        console.log("resi", resi)
        Residue = InFlowSimSamp.map((Sample, ix) => ({ Sample, Residue_Pressure: resi[ix] }));
    }
});


console.log("Pressure after get", ElevationProf);
var hey = Stress[0];
const N = Stress[0].length;
let zeros = [0];
if(StressArray  == null || StressArray == undefined){
    StressArray = [0];
}
for (let i = 0; i<StressArray.length; i++){
    zeros[i] = i;
}
//let StressArray2 = zeros.map((time, ix) => ({ time, Von_Mises_Stress: StressArray[ix] }));

let StressArray2 = zeros.map((node, ix) => ({ node, Von_Mises_Stress: StressArray[ix] }));



let alt = Distance.map((TotalDistance, ix) => ({ TotalDistance, PipelineAltitude: Altitude[ix] }));
const yax = Array.from(Array(N).keys());


//let stress = yax.map((time, ix) => ({ time, Von_Mises_Stress: hey[ix] }));








console.log(Stress);










const colors = [
    "#70B0FA",
    "#3D6BD4",
    "#3D36B2",
    "#7DEBD9",
    "#00A7BD",
    "#017991",
    "#C996BF",
    "#850A4D",
    "#600336"
];


/**
 *
 required data structure:


 const data = [
    {time: ~float~, y1: ~float~, y2: ~float~ ... },
    ...
 ]


 *
 */






class GraphView extends React.Component {


    fetchChart = (type) => {
        switch (type) {
            case "line": return <LineGraph onClick={this.props.onClick} />
            case "outlet": return <OutletGraph onClick={this.props.onClick} />
            case "inpress": return <InPressGraph onClick={this.props.onClick} />
            case "outpress": return <OutPressGraph onClick={this.props.onClick} />
            case "outpressresidue": return <OutPressResidueGraph onClick={this.props.onClick} />
            case "altitude": return <AltitudeGraph onClick={this.props.onClick} />
            case "pressure": return <PressureGraph onClick={this.props.onClick} />
            case "velocity": return <VelocityGraph onClick={this.props.onClick} />
            case "nodepressure": return <NodePressureGraph onClick={this.props.onClick} />
            case "nodevelocity": return <NodeVelocityGraph onClick={this.props.onClick} />
            case "stress": return <StressGraph onClick={this.props.onClick} />
            case "bar": return <BarGraph data={this.props.data} />
            case "wavelet": return <Wavelet />
            default: break;
        }
    }


    render() {
        return (
            <div>
                {this.fetchChart(this.props.type)}
            </div>
        )
    }
}


class LineGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="Sample" xAxisId={"Measured_Sample"} label={{ value: 'Time (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="Sample" xAxisId={"RTTM_Sample"} />


                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'FlowRate (cms)', angle: -90, position: 'Left' }} />
                        <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />


                        <Line xAxisId={"RTTM_Sample"} data={FlowSim} type="monotone" dataKey="RTTM_Flow" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                        <Line xAxisId={"Measured_Sample"} data={obj} type="monotone" dataKey="Measured_Flow" stroke="#82ca9d" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}




class OutletGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="Sample" xAxisId={"Measured_Sample"} label={{ value: 'Time (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="Sample" xAxisId={"RTTM_Sample"} />


                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'FlowRate (cms)', angle: -90, position: 'Left'}} />
                        <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />


                        <Line xAxisId={"RTTM_Sample"} data={OutS} type="monotone" dataKey="RTTM_Flow" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                        <Line xAxisId={"Measured_Sample"} data={OutM} type="monotone" dataKey="Measured_Flow" stroke="#82ca9d" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
class InPressGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="Sample" xAxisId={"Measured_Sample"} label={{ value: 'Time (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="Sample" xAxisId={"RTTM_Sample"} />


                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (Pa)', angle: -90, position: 'Left' }} />
                        <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />


                        <Line xAxisId={"RTTM_Sample"} data={InPressSi} type="monotone" dataKey="RTTM_Pressure" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                        <Line xAxisId={"Measured_Sample"} data={InPressM} type="monotone" dataKey="Measured_Pressure" stroke="#82ca9d" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}


class OutPressGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="Sample" xAxisId={"Measured_Sample"} label={{ value: 'Time (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="Sample" xAxisId={"RTTM_Sample"} />


                        <Legend />


                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (Pa)', angle: -90, position: 'Left' }} />


                        <Line xAxisId={"RTTM_Sample"} data={OutPressSi} type="monotone" dataKey="RTTM_Pressure" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />
                        <Line xAxisId={"Measured_Sample"} data={OutPressM} type="monotone" dataKey="Measured_Pressure" stroke="#82ca9d" dot={null} activeDot={{ r: 5 }} />


                        <Tooltip />


                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}




class OutPressResidueGraph extends React.Component {


    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="Sample" xAxisId={"Residue_Pressure"} label={{ value: 'Time (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="Sample" xAxisId={"RTTM_Sample"} />


                        <Legend />


                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (kPa)', angle: -90, position: 'Left' }} />


                        <Line xAxisId={"Residue_Pressure"} data={Residue} type="monotone" dataKey="Residue_Pressure" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />




                        <Tooltip />


                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
class AltitudeGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis hide={true} dataKey="node" xAxisId={"pressIndex"} />
                        <XAxis hide={true} dataKey="node" xAxisId={"velIndex"} />
                        <XAxis dataKey="node" xAxisId={"altIndex"} label={{ value: 'Node No.', angle: 0, position: 'bottom', offset: -4 }} />
                        <Legend />
                        <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />






                        <Line xAxisId={"altIndex"} data={pipeelevationprof} type="monotone" dataKey="Elevation" stroke="#1FFD26" dot={null} activeDot={{ r: 5 }} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
class NodePressureGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="node" xAxisId={"pressIndex"} label={{ value: 'Timesteps (s)', angle: 0, position: 'bottom', offset: -4 }} />

                        <XAxis hide={true} dataKey="node" xAxisId={"velIndex"} />
                        <XAxis hide={true} dataKey="node" xAxisId={"altIndex"} />
                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (MPa)', angle: -90, position: 'Left' }} />


                        <Line xAxisId={"pressIndex"} data={nodepipepressure} type="monotone" dataKey="Pressure" stroke="#b11540" dot={null} activeDot={{ r: 5 }} />


                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
class PressureGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="node" xAxisId={"pressIndex"} label={{ value: 'Node No.', angle: 0, position: 'bottom', offset: -4 }} />

                        <XAxis hide={true} dataKey="node" xAxisId={"velIndex"} />
                        <XAxis hide={true} dataKey="node" xAxisId={"altIndex"} />
                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (MPa)', angle: -90, position: 'Left' }} />


                        <Line xAxisId={"pressIndex"} data={pipepressure} type="monotone" dataKey="Pressure" stroke="#b11540" dot={null} activeDot={{ r: 5 }} />


                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

class NodeVelocityGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis hide={true} dataKey="node" xAxisId={"pressIndex"} />
                        <XAxis dataKey="node" xAxisId={"velIndex"} label={{ value: 'Timesteps (s)', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="node" xAxisId={"altIndex"} />
                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} label={{ value: 'FlowRate (cms)', angle: -90, position: 'Left' }} />




                        <Line xAxisId={"velIndex"} data={nodepipevelocity} type="monotone" dataKey="FlowRate" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />


                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
class VelocityGraph extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis hide={true} dataKey="node" xAxisId={"pressIndex"} />
                        <XAxis dataKey="node" xAxisId={"velIndex"} label={{ value: 'Node No.', angle: 0, position: 'bottom', offset: -4 }} />
                        <XAxis hide={true} dataKey="node" xAxisId={"altIndex"} />
                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} label={{ value: 'FlowRate (cms)', angle: -90, position: 'Left' }} />




                        <Line xAxisId={"velIndex"} data={pipevelocity} type="monotone" dataKey="FlowRate" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />


                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}




class StressGraph extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div onClick={this.props.onClick} className="graph">
                <ResponsiveContainer width="100%" height={180} className={this.props.a}>
                    <LineChart width={600} height={400} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>




                        <XAxis dataKey="node" xAxisId={"zeros"} />


                        <Legend />
                        <YAxis width={100} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short", maximumSignificantDigits: 3 }).format(value)} padding={{ top: 13, bottom: 13 }} label={{ value: 'Pressure (Pa)', angle: -90, position: 'Left' }} />
                        <YAxis padding={{ top: 13, bottom: 13 }} domain={['auto', 'auto']} />

           


                        <Line xAxisId={"zeros"} data={StressArray2} type="monotone" dataKey="Von_Mises_Stress" stroke="#8884d8" dot={null} activeDot={{ r: 5 }} />


                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}






class BarGraph extends React.Component {
    render() {
        return (
            <BarChart width={600} height={300} data={this.props.data} barCategoryGap="1%">
                <CartesianGrid strokeDasharray="3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="value">
                    {this.props.data.map((entry, index) => (
                        <Cell fill={colors[index]} />
                    ))}
                </Bar>
            </BarChart>
        );
    }
}


export default GraphView

