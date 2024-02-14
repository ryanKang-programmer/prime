import './Navbar.css'
import NavElements from './NavElement'
import {React, useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import Dropdown from 'react-bootstrap/Dropdown'
import PipelineOverview from '../PipelineOverview/PipelineOverview.js'
import StressAnalysis from '../StressAnalysis/StressAnalysis.js'
import AIBC from '../AIBC/AIBC.js'
import RiskAssessment from '../RiskAssessment/RiskAssesment.js';
import LeakDetection from '../LeakDetection/LeakDetection.js';
import Button from '../Utils/Button.js'
import $ from 'jquery';

/**
 * Navbar
 * Central system
 * @returns 
 */

function Navbar() {

    const [active, setActive] = useState(localStorage.getItem( 'activeNav' ) || "1");
    const [resize, setResize] = useState("1");
    const [active2, setActive2] = useState(-1);
    const [click, setClick] = useState(" ");

    // for buttons
    function activeButton(value) {
        if (value != "0") {
            console.log("value: " + value)
            localStorage.setItem( 'activeNav', value);
            setActive(value)
        }
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

    // for resizing
    const handleResize = () => {
        if (window.innerWidth < 1300 && window.innerWidth > 1000) {
            setResize("2");
        } else if (window.innerWidth <= 1000) {
            setResize("3");
        } else if (window.innerWidth >= 1300) {
            setResize("1");
        }
      };
    
    useEffect(() => {
        console.log(window.innerWidth)
        window.addEventListener("resize", handleResize);
    }, []);

    // determines if we want a 3 : 9 layout or 3 : 6 : 3 layout
    function parser(index) {
        switch(index) {
            case "0":
                break;
            case "1":
                return <PipelineOverview/>
            case "2" :
                return <LeakDetection />
            case "3":
                return <StressAnalysis />
            case "4":
                return <AIBC />
            case "5":
                return <RiskAssessment />
            case "6":
                return Bootstrap_FourByEight();
            default:
                break;
        }
    }

    // fills in elements based on active button from navbar
    function parser_2(index, num) {
        switch(index) {
            case "4":
                break;
            case "5":
                return <RiskAssessment index={num}/>
                // break;
            case "6":
                break;
            default:
                break;
        }
    }

    // 3 : 9
    function Bootstrap_FourByEight() {
        return(
            <div className="lower">
                <Container>
                    <Row>
                        <Col xs={3} className = "one">{parser_2(active, 0)}</Col>
                        <Col xs={9} className = "two">{parser_2(active, 1)}</Col>
                    </Row>
                </Container>
            </div>
        );
    }

    // 3 : 6 : 3
    function Bootstrap_FourByFourByFour() {
        return(
            <div className="lower">
                <Container>
                    <Row>
                        <Col xs={3} className = "one">{parser_2(active, 0)}</Col>
                        <Col xs={6} className = "two">{parser_2(active, 1)}</Col>
                        <Col xs={3} className = "three">{parser_2(active, 2)}</Col>
                    </Row>
                </Container>
            </div>
        );
    }

    // navbars based on window size
    const longNav = <div style={{flexDirection: 'column', display: 'flex'}}>
                        <NavElements title="Pipeline Overview" id="1"
                            onClick={e=>{
                                activeButton('1'); $(e.target).slideToggle(); console.log($(this))
                            }}
                            status={active === "1"} a="b">
                            <Button text="SEARCH ON MAP" more="no" status={active2 == 10} onClick={() => activeButton2(10, "searchMap")}/>
                            <Button text="IMPORT COORDINATES" more="no" status={active2 == 9} onClick={() => activeButton2(9, "importCoords")}/>
                            <Button text="EXPORT COORDINATES" more="no" status={active2 == 8} onClick={() => activeButton2(8, "exportCoords")}/>
                            <Button text="HAZARD SIMULATION" more="no" status={active2 == 7} onClick={() => activeButton2(7, "hazardSim")}/>
                        </NavElements>
                        <NavElements title="Leak Detection" id="2" onClick={id=>activeButton(id)} status={active === "2"} a="b">
                        </NavElements>
                        <NavElements title="Stress Analysis" id="3" onClick={id=>activeButton(id)} status={active === "3"} a="b">
                        </NavElements>
                        <NavElements title="WhatIf? Scenario" id="4" onClick={id=>activeButton(id)} status={active === "4"} a="b">
                            <li>New simulation</li>
                            <li>New analysis</li>
                            <li>Modify boundary conditions</li>
                        </NavElements>
                        <NavElements title="Risk Analysis" id="5" onClick={id=>activeButton(id)} status={active === "5"} a="b">
                            <li>Leak assessment</li>
                            <li>Stress assessment</li>
                            <li>Combined assessment</li>
                        </NavElements>
                        <NavElements title="Report" id="6" onClick={id=>activeButton(id)} status={active === "6"} a="b">
                        </NavElements>
                    </div>;
    
    const shortNav = <div className="flex">

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                ...
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Pipeline Overview</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Leak Detection</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Stress Analysis</Dropdown.Item>
                                <Dropdown.Item href="#/action-4">WhatIf? Scenario</Dropdown.Item>
                                <Dropdown.Item href="#/action-5">Risk Anlysis</Dropdown.Item>
                                <Dropdown.Item href="#/action-6">Report</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>;

    const midNav = <div className='flex'>
                        <NavElements title="< Change Operator" id="0" onClick={id => activeButton(id)} status={active === "0"} a="a"/>
                        <NavElements title="Pipeline Overview" id="1" onClick={id=>activeButton(id)} status={active === "1"} a="b"/>
                        <NavElements title="Leak Detection" id="2" onClick={id=>activeButton(id)} status={active === "2"} a="b"/>
                        <NavElements title="Stress Analysis" id="3" onClick={id=>activeButton(id)} status={active === "3"} a="b"/>
                        <NavElements title="WhatIf? Scenario" id="4" onClick={id=>activeButton(id)} status={active === "4"} a="b"/>
                        <NavElements title="Risk Analysis" id="5" onClick={id=>activeButton(id)} status={active === "5"} a="b"/>
                        <NavElements title="Report" id="6" onClick={id=>activeButton(id)} status={active === "6"} a="c"/>
                    </div>

    let nav = longNav;

    if (resize == "1") {
        nav = longNav;
    } else if (resize == "2") {
        nav = midNav;
    } else if (resize == "3") {
        nav = shortNav;
    }

    // check window size on first mount since resize would be default
    if (window.innerWidth < 1300 && window.innerWidth > 1000) {
        nav = midNav;
    } else if (window.innerWidth <= 1000) {
        nav = shortNav;
    } else if (window.innerWidth >= 1300) {
        nav = longNav;
    }
    
    return (
        <div>
            {/* <Container>
                <Row> */}
                <Container fluid style={{display: 'flex'}}>
                    {nav}
                    <div className="display" style={{width: '100%'}}>
                        {parser(active)}
                    </div>
                </Container>
                {/* </Row>
            </Container> */}
        </div>
    );
  };

  export default Navbar;