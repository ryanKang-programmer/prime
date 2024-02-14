import React from 'react';
import './AIBC.css'
import Button from '../Utils/Button.js'
import DropdownMini from './DropdownMini.js'
import Dropdown from 'react-bootstrap/Dropdown'
import ImageView from '../Utils/ImageView.js'
import GraphView from '../Utils/GraphView.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faPrint } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import {useState} from 'react';


/**
 * AI Boundary Conditions
 * @param {*} props: index
 * @returns left and right components of page
 */

function AIBC(props) {

    const [click, setClick] = useState(" ")
    const [active, setActive] = useState(0)

    // STRUCTURE OF DATA TYPE TO INPUT IN DROPDOWNMINI:
    // array of objects
    const data = [
        // object 1, array of objects
        { type: 'dropdown', style: 'root', tog: '>', text: 'header 1', active: true, value: [
          // object 1.1
          { type: 'dropdown', style: 'secondary', tog: '>', text: '  header 1.1', active: false, value: [
            // data array
            { type: 'num', text: '    data 1.1', active: false, value: 1.1 },
            { type: 'num', text: '    data 1.2', active: false, value: 1.2 }]
          },  
          // object 1.2
          { type: 'dropdown', style: 'secondary', tog: '>', text: '  header 1.2', active: false, value: [
            // data array
            { type: 'num', text: '    data 1.3', active: false, value: 1.3 },
            { type: 'num', text: '    data 1.4', active: false, value: 1.4 }]
          }]
        }, 
        // object 2, array of objects
        { type: 'dropdown', style: 'root', tog: '>', text: 'header 1', active: true, value: [
          // object 2.1
          { type: 'dropdown', style: 'secondary', tog: '>', text: 'header 1.1', active: false, value: [
            // data array
            { type: 'num', text: '    data 1.1', active: false, value: 1.1 },
            { type: 'num', text: '    data 1.2', active: false, value: 1.2 }]
          },
          // object 2.2
          { type: 'dropdown', style: 'secondary', tog: '>', text: 'header 1.2', active: false, value: [
            // data array
            { type: 'num', text: '    data 1.3', active: false, value: 1.3 },
            { type: 'num', text: '    data 1.4', active: false, value: 1.4 }]
          }]
        } 
     ]

    function handleClick () {
      let ret = def();
      switch(click) {
          case "newSim":
              ret = newSim()
              break;
          case "newAnalysis":
              ret = newAnalysis()
              break;
          case "modifyBC":
              ret = modifyBC()
              break;
          default:
              ret = def()
              break;
      }
      return ret;
    }

    function newSim() {
      const modal = <h4>New Simulation</h4>
      return modal;
    }

    function newAnalysis() {
      const modal = <h4>New Analysis</h4>
      return modal;
    }

    function modifyBC() {
      const modal = <h4>Modify Boundary Conditions</h4>
      return modal;
    }

    function activeButton(num, clicked) {
      if (active == num) {
          setActive(0)
          setClick(" ")
          console.log("unclick")
      } else {
          setActive(num)
          setClick(clicked)
          console.log("click")
      }
    }

    function def() {
      const left = <div className="flexAIBC">
                <ImageView text="3D" status="1" id = "map"/>
                <div className="flexAIBC-row">
                  <FontAwesomeIcon icon={faDownload} class="faButton" style={{ height: "35px" }}/>
                  <FontAwesomeIcon icon={faPrint} class="faButton" style={{ height: "35px" }}/>
                  <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Region X
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Region A</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Region B</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Region C</Dropdown.Item>
                          <Dropdown.Item href="#/action-4">Region D</Dropdown.Item>
                          <Dropdown.Item href="#/action-5">Region E</Dropdown.Item>
                          <Dropdown.Item href="#/action-6">Region F</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                </div>
            </div>
        return left;
    }

    // Parsing left/mid/right returns based on prop
    function index() {
        const left = <div className="flexAIBC">
            <h4 className="region">Region X</h4>
            <div className="flexAIBC-center">
                <DropdownMini data={data}/>
                <Button text="NEW SIMULATION" more="no" status={active == 1} onClick={() => activeButton(1, "newSim")}/>
                <Button text="NEW ANALYSIS" more="no" status={active == 2} onClick={() => activeButton(2, "newAnalysis")}/>
                <Button text="MODIFY BOUNDARY CONDITIONS" more="no" status={active == 3} onClick={() => activeButton(3, "modifyBC")}/>
            </div>
        </div>
        return left;
    }

    function ui() {
      const ui = <div className="lower">
          <Container>
              <Row>
                  <Col xs={3} className = "one">{index()}</Col>
                  <Col xs={9} className = "two">{handleClick()}</Col>
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

export default AIBC;