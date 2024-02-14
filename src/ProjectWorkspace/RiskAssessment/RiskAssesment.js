import React from 'react';
import './RiskAssessment.css'
import Button from '../Utils/Button.js'
import { useState } from 'react';
import Table from '../Utils/Table.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import GraphView from '../Utils/GraphView.js';

function RiskAssessment(props) {

    const [active, setActive] = useState("1");

    function activeButton(value) {
        console.log("value: " + value)
        setActive(value)
    }

    function handleClick () {
        let ret = def();
        return ret;
    }

    const data = [
        { name: "Page A", value: 2400 },
        { name: "Page B", value: 1000 },
        { name: "Page C", value: 1500 },
        { name: "Page D", value: 2000 },
        { name: "Page E", value: 156 },
        { name: "Page F", value: 850 },
        { name: "Page G", value: 2100 },
        { name: "Page H", value: 1337 },
        { name: "Page I", value: 2150 }
      ];
    
    const tableConstants = [
                    [2, 2, 3, 4, 4],
                    [2, 3, 3, 4, 5],
                    [3, 4, 4, 5, 5],
                    [5, 5, 5, 5, 6],
                    [6, 6, 6, 6, 6]
                ]
    const xLabels = ["Zero", "Very Low", "Low", "High", "Critical"];
    const yLabels = ["Low", "Moderate", "High", "Critical", "AAAAAAAAAAA"];

    function def() {
        const left = 
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', borderBottom: '1px solid black', paddingBottom: '20px'}}>
                <a href="#section-1"><Button text="LEAK ASSESSMENT" more="menuButton" id="1" onClick={id=>activeButton("1")} status={active == "1"}/></a>
                <a href="#section-2"><Button text="STRESS ASSESSMENT" more="menuButton" id="2" onClick={id=>activeButton("2")} status={active ==="2"}/></a>
                <a href="#section-3"><Button text="COMBINED ASSESSMENT" more="menuButton" id="3" onClick={id=>activeButton("3")} status={active ==="3"}/></a>
            </div>
            <div className="riskAssessmentFlex-scroll scroll" style={{padding: 0, flex: 1}}>
                <div style={{padding: '1rem', paddingBottom: '2rem', borderBottom: '0.5px solid lightgray'}}>
                    <h2 id="section-1" style={{paddingTop: '2rem', marginTop: 0, fontWeight: 700}}>LEAK ASSESSMENT</h2>
                    <section style={{padding: '1rem'}}>
                        <Table tableName="matrix"/>
                    </section>
                </div>
                <div style={{padding: '1rem', paddingBottom: '2rem', borderBottom: '0.5px solid lightgray'}}>
                    <h2 id="section-2" style={{display: 'block', marginTop: 0, paddingTop: '2rem', fontWeight: 700}}>STRESS ASSESSMENT</h2>
                    <section style={{padding: '1rem'}}>
                        <GraphView type="bar" data = {data} />
                    </section>
                </div>
                <div style={{padding: '1rem', paddingBottom: '2rem'}}>
                    <h2 id="section-3" style={{paddingTop: '2rem', fontWeight: 700}}>COMBINED ASSESSMENT</h2>
                    <section style={{padding: '1rem'}}>
                        <h1>Butter</h1>
                        <p style={{whiteSpace: 'break-spaces'}}>{'\t'}Butter is a dairy product made from the fat and protein components of churned cream. It is a semi-solid emulsion at room temperature, consisting of approximately 80% butterfat. It is used at room temperature as a spread, melted as a condiment, and used as a fat in baking, sauce-making, pan frying, and other cooking procedures. Most frequently made from cow's milk, butter can also be manufactured from the milk of other mammals, including sheep, goats, buffalo, and yaks. It is made by churning milk or cream to separate the fat globules from the buttermilk. Salt was added to butter from antiquity to help to preserve it, particularly when being transported; salt may still play a preservation role but is less important today as the entire supply chain is usually refrigerated. In modern times salt may be added for its taste.[1] Food colorings are sometimes added to butter. Rendering butter, removing the water and milk solids, produces clarified butter or ghee, which is almost entirely butterfat. </p>
                    </section>
                </div>
            </div>
        </div>
        return left;
    }

    function index() {
        const left = 
        <div className="riskAssessmentFlex"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'stretch',
            }}>
            <h4 style={{padding: '1rem', fontWeight: '700', alignSelf: 'center'}}>Inspection History</h4>
            <Table tableName="blah" className="riskAssessment-table"/>
        </div>
        return left;
    }

    function ui() {
        const ui = 
        <div className="lower" style={{height: '100vh', position :'relative'}}>
            <Container>
                <Row>
                    <Col xs={3} class="one" style={{borderRight: '0.5px solid lightgray', position: 'absolute', left: 0, top: 0, bottom: 0}}>{index()}</Col>
                    <Col xs={9} class="two" style={{position: 'absolute', right: 0, top: 0, bottom: 0}}>{handleClick()}</Col>
                </Row>
            </Container>
        </div>
        return ui
    }

    return (
        <div>
            {ui()}
        </div>
    );

}

export default RiskAssessment;