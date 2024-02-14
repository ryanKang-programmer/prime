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

const pumpData = [
    {a: '10-30-067 04w6m', b: 3077, c: true, d: 6912.1, e: new Date().getTime()},
    {a: '10-30-067 04w6m', b: 3077, c: true, d: 6912.1, e: new Date().getTime()},
    {a: '10-30-067 04w6m', b: 3077, c: true, d: 6912.1, e: new Date().getTime()},
    {a: '10-30-067 04w6m', b: 3077, c: true, d: 6912.1, e: new Date().getTime()},
    {a: '10-30-067 04w6m', b: 3077, c: true, d: 6912.1, e: new Date().getTime()},
    {a: '10-30-067 04w6m', b: 3077, c: true, d: 6912.1, e: new Date().getTime()},
];

function PipelineOverview(props) {
    return (
        <div style={{display: 'flex', height: '100vh', width: '100%', padding: '1rem 2rem', flexDirection: 'column', position: 'relative'}}>
            <div style={{flex: 1, display: 'flex', flexDirection: 'row', marginBottom: '2rem', height: 'calc(50% - 1rem)'}}>
                <div style={{...styles.container, flex: 1, marginRight: '2rem'}}>
                    <div style={{...styles.header}}>
                        <h5 style={{fontWeight: '700'}}>Active Lines</h5>
                    </div>
                    <div style={{...styles.body, position: 'relative'}}>
                        <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                            <div style={{...styles.tableHeader, flex: 0.1}}>No.</div>
                            <div style={{...styles.tableHeader, flex: 0.3}}>Name</div>
                            <div style={{...styles.tableHeader, flex: 0.1}}>Selected</div>
                            <div style={{...styles.tableHeader, flex: 0.3}}>Contents</div>
                            <div style={{...styles.tableHeader, flex: 0.2}}>Length</div>
                        </div>
                        {[{no: 1, name: 'Alberta Products Pipeline', selected: true, contents: 'Hydrogen Methane', length: 156}].map(obj => {
                            return (
                            <div style={{padding: '.5rem', display: 'flex', flexDirection: 'row'}}>
                                <div style={{...styles.tableContent, flex: 0.1}}>{obj.no}</div>
                                <div style={{...styles.tableContent, flex: 0.3}}>{obj.name}</div>
                                <div style={{...styles.tableContent, flex: 0.1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                    <div style={{
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '10px',
                                        backgroundColor: obj.selected === false ? 'red' : 'lightgreen'
                                    }}>
                                    </div>
                                </div>
                                <div style={{...styles.tableContent, flex: 0.3}}>{obj.contents}</div>
                                <div style={{...styles.tableContent, flex: 0.2}}>{obj.length} Km</div>
                            </div>)
                        })}
                    </div>
                </div>
                <div style={{...styles.container, flex: 1}}>
                    <div style={{...styles.header}}>
                        <h5 style={{fontWeight: '700'}}>Pump Stations</h5>
                    </div>
                    <div style={{...styles.body, position: 'relative', overflowY: 'auto'}}>
                        <div style={{position: 'sticky', top: 0, display: 'flex', backgroundColor: 'white', padding: '.5rem'}}>
                            <div style={{...styles.tableHeader, flex: 0.1}}>No.</div>
                            <div style={{...styles.tableHeader, flex: 0.6}}>Location</div>
                            <div style={{...styles.tableHeader, flex: 0.3}}>Mean</div>
                        </div>
                        {[
                            {no: 1, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 2, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 3, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 4, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 5, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 6, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 7, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 8, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 9, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 10, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 11, location : 'X, Y, Z', mean: 'P, Q, R'},
                            {no: 12, location : 'X, Y, Z', mean: 'P, Q, R'},
                        ].map(obj => {
                            return (
                            <div style={{padding: '.5rem', display: 'flex', flexDirection: 'row'}}>
                                <div style={{...styles.tableContent, flex: 0.1}}>{obj.no}</div>
                                <div style={{...styles.tableContent, flex: 0.6}}>{obj.location}</div>
                                <div style={{...styles.tableContent, flex: 0.3}}>{obj.mean}</div>
                            </div>)
                        })}
                    </div>
                </div>
            </div>
            <div style={{flex: 1, display: 'flex', position: 'relative', height: 'calc(50% - 1rem)'}}>
                <div style={{...styles.container, flex: 1, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}}>
                    <div style={{...styles.header}}>
                        <h5 style={{fontWeight: '700'}}>Pump Stations</h5>
                    </div>
                    <div style={{...styles.body, position: 'relative', display: 'flex', flexDirection: 'row', overflowX: 'scroll'}}>
                        {pumpData.map(obj => {
                            return (
                            <div style={{flex: '0 0 10vw', padding: '.5rem', display: 'flex', flexDirection: 'column', marginLeft: '10rem'}}>
                                <div style={{display: 'flex', flexDirection: 'column', padding: '1rem'}}>
                                    <div style={{...styles.tableContent, height: '2.5rem'}}>{obj.a}</div>
                                    <div style={{...styles.tableContent, height: '2.5rem'}}>{obj.b} meters</div>
                                </div>
                                <div style={{...styles.shadowBox, flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', justifyContent: 'center', position: 'relative'}}>
                                    <div style={{...styles.tableContent}}>Comms {obj.c === true ? 'OK': 'Not OK'} </div>
                                    <div style={{...styles.tableContent, fontWeight: 700}}>{obj.d} kPa</div>
                                    <div style={{padding: '2rem'}}></div>
                                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
                                        <div style={{...styles.tableContent}}>Last RTU Comm:</div>
                                        <div style={{...styles.tableContent}}>{new Date(obj.e).toLocaleString('en-us',
                                                { 
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        })}
                        <>
                            <div style={{position: 'absolute', top: '12rem', left: 0,
                                width: 'calc(5vw + 10rem)', height: '3rem', backgroundColor: 'lightgrey', zIndex: 9999,
                                borderTop: '0.3rem solid grey', borderBottom: '0.3rem solid grey'
                                }}>
                            </div>
                        </>
                        {pumpData.map((obj, idx) => {
                            return (
                            <>
                                <div style={{position: 'absolute', top: '12rem', left: `calc(10rem + 5vw + (10rem + 10vw) * ${idx})`,
                                    width: pumpData.length == idx + 1 ? 'calc(10rem + 5vw)' : 'calc(10vw + 10rem)', height: '3rem', backgroundColor: 'lightgrey', zIndex: 9999,
                                    borderTop: '0.3rem solid grey', borderBottom: '0.3rem solid grey'
                                    }}>
                                </div>
                            </>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
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
    },
    tableHeader: {
        textAlign: 'center',
        fontWeight: 700
    },
    tableContent: {
        textAlign: 'center',
    },
    shadowBox: {
        boxShadow: '0 1px 1px 0 rgba(0, 28, 36, 0.3), 1px 1px 1px 0 rgba(0, 28, 36, 0.15), -1px 1px 1px 0 rgba(0, 28, 36, 0.15)',
        borderTop: '1px solid #eaeded',
        borderRadius: '0px',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
        zIndex: 1,
    }
}

export default PipelineOverview;