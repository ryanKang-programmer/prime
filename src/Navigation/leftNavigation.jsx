import {React, useState, useEffect} from 'react';
import { GiLeak, GiLeadPipe, GiDistressSignal, GiThink } from "react-icons/gi";
import { DiGoogleAnalytics } from "react-icons/di";
import { RxDashboard } from "react-icons/rx";
import { GoReport } from "react-icons/go";
import { SiOpenstreetmap } from "react-icons/si";
import { NavLink } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery'
import './leftNavigation.css'
import pec_logo from '../Images/pec_logo.png'

library.add(faChevronRight, faChevronDown);

const lists = [
    {
        title: 'Dashboard',
        url: '/',
    },
    {
        title: 'Pipeline',
        url: '/pipe',
        submenu: [
            {
                title: 'Overview',
                url: '/pipe/overview',
            },
            // {
            //     title: 'Search On Map',
            //     url: '/pipe/map',
            // },
            {
                title: 'Import Coordinates',
                url: '/pipe/importCoord',
            },
            {
                title: 'Export Coordinates',
                url: '/pipe/exportCoord',
            },
            // {
            //     title: 'Hazard Simulation',
            //     url: '/pipe/hazard',
            // },
        ]
    },
    {
        title: 'Leak Detection',
        url: '/leak',
        submenu: [
            // {
            //     title: 'Real-time',
            //     url: '/leak/realtime',
            // },
            {
                title: 'Leak Simulation',
                url: '/leak/simulation',
            },
            {
                title: 'Leak Localization',
                url: '/leak/localization',
            },
        ],
    },
    {
        title: 'Stress Analysis',
        url: '/stress',
        submenu: [
            // {
            //     title: 'Real-time',
            //     url: '/stress/realtime',
            // },
            {
                title: 'Stress Simulation',
                url: '/stress/simulation',
            },
        ],
    },
    {
        title: 'Risk Analysis',
        url: '/comprehensive',
        // submenu: [
        //     {
        //         title: 'Leak assessment',
        //         url: '/risk/leak',
        //     },
        //     {
        //         title: 'Stress assessment',
        //         url: '/risk/stress',
        //     },
        //     {
        //         title: 'Combined assessment',
        //         url: '/risk/combined',
        //     },
        // ]
    },
    {
        title: 'WhatIf? Scenario',
        url: '/whatIf',
        submenu: [
            {
                title: 'New Simulation',
                url: '/whatIf/simulation',
            },
            {
                title: 'New Analysis',
                url: '/whatIf/analysis',
            },
            {
                title: 'Modify Boundary Conditions',
                url: '/whatIf/boundary',
            },
        ]
    },
    /*{
        title: 'Risk Analysis',
        url: '/risk',
        // submenu: [
        //     {
        //         title: 'Leak assessment',
        //         url: '/risk/leak',
        //     },
        //     {
        //         title: 'Stress assessment',
        //         url: '/risk/stress',
        //     },
        //     {
        //         title: 'Combined assessment',
        //         url: '/risk/combined',
        //     },
        // ]
    },*/
    {
        title: 'Report',
        url: '/report',
    },
]

const toggleEvt = (e, idx, isShow, setIsShow) => {
    const target = $(e.currentTarget);

    let submenuContainer = target.siblings('.submenuContainer');

    const copyData = [...isShow];

    if (copyData[idx] === true) {
        (submenuContainer).slideUp();
        copyData[idx] = false;
    } else {
        (submenuContainer).slideDown();
        copyData[idx] = true;
    }
    
    setIsShow(copyData);
}

const ToggleImg = (prop) => {
    const isShow = prop.isShow;

    return isShow ? <FontAwesomeIcon icon="chevron-down" /> : <FontAwesomeIcon icon="chevron-right" />
}

const LeftNavigation = ({style}) => {
    const [isShow, setIsShow] = useState(new Array(lists.length).fill(true));

    return(
        <div class="scrollContainer" style={style}>
            <NavLink to={'/'}>
                <div style={{padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 800, cursor: 'pointer'}}>
                    <span style={{color: 'navy', padding: '0 .05rem'}}>P</span>
                    <span style={{color: 'gold', padding: '0 .05rem'}}>R</span>
                    <span style={{color: 'green', padding: '0 .05rem'}}>I</span>
                    <span style={{color: 'red', padding: '0 .05rem'}}>M</span>
                    <span style={{color: 'blue', padding: '0 .05rem'}}>E</span>
                </div>
            </NavLink>
            {lists.map((obj, idx) =>
                <div class={'menuContainer'} style={styles.menuContainer}>
                    <NavLink to={obj.submenu ? null : obj.url} onClick={(e) => obj.submenu ? toggleEvt(e, idx, isShow, setIsShow) : null} className={({ isActive, isPending }) =>
                      obj.submenu ? null :
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>
                        <div class={'menu'} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '.5rem', position: 'relative'}}>
                            {obj.title.toLocaleLowerCase() === 'leak detection' ? <GiLeak size={iconSize} style={styles.icon}/> : 
                            obj.title.toLocaleLowerCase() === 'pipeline' ? <GiLeadPipe size={iconSize}  style={styles.icon}/> :
                            obj.title.toLocaleLowerCase() === 'stress analysis' ? <GiDistressSignal size={iconSize}  style={styles.icon}/> :
                            obj.title.toLocaleLowerCase() === 'risk analysis' ? <DiGoogleAnalytics size={iconSize}  style={styles.icon}/> :
                            obj.title.toLocaleLowerCase() === 'whatif? scenario' ? <GiThink size={iconSize}  style={styles.icon}/> :
                            obj.title.toLocaleLowerCase() === 'dashboard' ? <RxDashboard size={iconSize}  style={styles.icon}/> :
                            obj.title.toLocaleLowerCase() === 'risk analysis' ? <SiOpenstreetmap size={iconSize}  style={{...styles.icon, top: '.5rem'}}/> :
                            <GoReport size={iconSize}  style={styles.icon}/>}
                            {obj.submenu ? <div class="toggle" style={{right: 0, position: 'absolute'}}><ToggleImg isShow={isShow[idx]}/></div> : null}
                            <div style={styles.menu}>{obj.title}</div>
                        </div>
                    </NavLink>
                    {obj.submenu ?
                        <div class="submenuContainer">
                        {obj.submenu.map(menu =>
                            <NavLink to={menu.url} className={({ isActive, isPending }) =>
                            isActive
                              ? "active"
                              : isPending
                              ? "pending"
                              : ""
                          }>
                                <div class={'submenu'} style={styles.submenu}>{menu.title}</div>
                            </NavLink>
                        )}
                        </div>
                    : null}
                </div>
            )}
            <div style={{padding: '1rem'}}>
                <img src={pec_logo} alt="" style={{width: '100%'}}/>
                <div style={{textAlign: 'center'}}>
                    <a href='mailto:pec@ucalgary.ca' style={{color: 'red', textDecoration: 'underline'}}>
                        pec@ucalgary.ca
                    </a>
                </div>
                <h4 style={{textAlign: 'center', padding: '1rem 0'}}>DISCLAIMER</h4>
                <span style={{whiteSpace: 'break-spaces'}}>This tool is still in development and its outputs should not be used in a production environment</span>
            </div>
        </div>
    )
}

const iconSize = '1.4rem';

const styles = {
    menuContainer: {
        padding: '1rem',
    },
    menu: {
        fontSize: '1.4rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginLeft: '1rem',
        whiteSpace: 'break-spaces',
    },
    submenu: {
        paddingBottom: '.5rem',
        fontSize: '1rem',
        paddingLeft: '1rem',
        cursor: 'pointer'
    },
    icon: {
        position: 'absolute',
        marginLeft: '-0.5rem',
    }
}

export default LeftNavigation;