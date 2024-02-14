import React, { useEffect, useRef, useState } from 'react';
import { Viewer, CameraFlyTo, Camera } from "resium";
import Button from 'react-bootstrap/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Cartesian3, Math as CMath, Color, Cartesian2, ArcGisMapServerImageryProvider, Rectangle, ScreenSpaceEventHandler,
    ScreenSpaceEventType, Cartographic, KeyboardEventModifier, VerticalOrigin, PinBuilder, Matrix4, ParticleSystem,
    SphereEmitter, ArcGISTiledElevationTerrainProvider, ImageryLayer, PolygonHierarchy, EntityCluster, LabelStyle, NearFarScalar, CustomDataSource } from 'cesium';
import lat from '../StressAnalysis/StressData/lat.json';
import lon from '../StressAnalysis/StressData/long.json';
import "./NewSimulation.css";
import dataFromPaper from "./simulation/data.json"

// import earthquake from './riskInfo/earthquake.json';
// import flooding from './riskInfo/flooding.json';
import temperature from './riskInfo/temperature.json';
// import wildfire from './riskInfo/wildfire.json';

import factory from './areaInfo/factory.json';
import school from './areaInfo/school.json';
import residence from './areaInfo/residence.json';
import population from './areaInfo/population.json';
import population2 from './areaInfo/Metropolitan_AB.json';

import schoolsInAlberta from './areaInfo/SchoolsInAB.json';
import weatherStations from './areaInfo/weatherStations.json';

import AlbertaEarthquakes from './riskInfo/AlbertaEarthquakes.json';
import wildfire_hotspots_AB from './riskInfo/wildfire_hotspots_AB.json';
import FloodCoordinates from './riskInfo/FloodCoordinates.json';
import {getDistanceFromLatLonInKm} from '../Utils/Common'
// Cesium.EntityCluster.newClusterCallback(clusteredEntities, cluster)

import { IoSchoolSharp } from "react-icons/io5";
import { Prev } from 'react-bootstrap/esm/PageItem';
import { getPopoverUtilityClass } from '@mui/material';
import axios from "axios";
import { textAlign } from '@mui/system';
// Your access token can be found at: https://ion.cesium.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.

// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjA5NWE1OS05MmQxLTRlYmItOTE4NC0xMjZkMTJiYjRmNjUiLCJpZCI6NDE5NDIsImlhdCI6MTYxMDcyMDExM30.07VbAP-b3Q5o19g1Jkwt3WefBGS73IGSCcXNCWBLr9U';

// Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.

const viewerOption = {
    shouldAnimate: true,
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: true,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    imageryProvider: new ArcGisMapServerImageryProvider({
        url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    }),
}

function NewSimulation(props) {
    const [twoPoints, _setTwoPoints] = useState([undefined, undefined]);
    const twoPointsRef = useRef(twoPoints);
    const setTwoPoints = data => {
        console.log(data);
        twoPointsRef.current = data;
        _setTwoPoints(data);
    }
    const viewer = useRef();
    const camera = useRef();

    const [diaster, setDiaster] = useState([false, false, false, false]);
    const [area, setArea] = useState([false, false, false, false]);
    const [radius, setRadius] = useState(30000.0);

    const [wildfireInArea, setWildfireInArea] = useState(0);
    const [earthquakeInArea, setEarthquakeInArea] = useState(0);
    const [floodingInArea, setFloodingInArea] = useState(0);
    
    const [schoolInArea, setSchoolInArea] = useState(0);
    const [residenceInArea, setResidenceInArea] = useState(0);

    const [schoolDS, setSchoolDS] = useState(null);

    const [decisionTree, setDecisionTree] = useState();
    const [linearRegression, setLinearRegression] = useState();
    const [randomForest, setRandomForest] = useState();
    const [svm, setSvm] = useState();

    const [decisionTree2, setDecisionTree2] = useState();
    const [linearRegression2, setLinearRegression2] = useState();
    const [randomForest2, setRandomForest2] = useState();
    const [svm2, setSvm2] = useState();

    const [scaleMax, scaleMin] = [51.41295282, 4.828301765];

    const schoolsNearPipe = schoolsInAlberta.filter(o => o.Longitude > -115.009 && o.Longitude < -112.009 && o.Latitude > 50.876 && o.Latitude < 53.866);

    const pinBuilder = new PinBuilder();
    let rain;
    let ds;

    function computeCircle(radius) {
        const positions = [];
        for (let i = 0; i < 360; i++) {
            const radians = CMath.toRadians(i);
            positions.push(
            new Cartesian2(
                radius * Math.cos(radians),
                radius * Math.sin(radians)
            )
            );
        }
        return positions;
    }

    // rain
    const rainParticleSize = 15.0;
    const rainRadius = 100000.0;
    const rainImageSize = new Cartesian2(
        rainParticleSize,
        rainParticleSize * 2.0
    );
    let rainGravityScratch = new Cartesian3();
    const rainUpdate = function (particle, dt) {
        rainGravityScratch = Cartesian3.normalize(
            particle.position,
            rainGravityScratch
        );
        rainGravityScratch = Cartesian3.multiplyByScalar(
            rainGravityScratch,
            -1050.0,
            rainGravityScratch
        );

        particle.position = Cartesian3.add(
            particle.position,
            rainGravityScratch,
            particle.position
        );

        const distance = Cartesian3.distance(
            viewer.current?.cesiumElement?.scene.camera.position,
            particle.position
        );

        if (distance > rainRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha =
            Color.BLUE.alpha / (distance / rainRadius + 0.1);
        }
    };

    function startRain(params) {
        const scene = viewer.current?.cesiumElement?.scene;
        // scene.primitives.removeAll();

        if (rain !== undefined) {
            scene.primitives.remove(rain);
        }

        rain = new ParticleSystem({
            modelMatrix: new Matrix4.fromTranslation(
                params
            ),
            speed: -1.0,
            lifetime: 15.0,
            emitter: new SphereEmitter(rainRadius),
            startScale: 1.0,
            endScale: 0.0,
            image: '/circular_particle.png',
            emissionRate: 9000.0,
            startColor: new Color(0.27, 0.5, 0.7, 0.0),
            endColor: new Color(0.27, 0.5, 0.7, 0.98),
            imageSize: rainImageSize,
            updateCallback: rainUpdate,
        })

        scene.primitives.add(
            rain
        );

        scene.skyAtmosphere.hueShift = -0.97;
        scene.skyAtmosphere.saturationShift = 0.25;
        scene.skyAtmosphere.brightnessShift = -0.4;
        scene.fog.density = 0.00025;
        scene.fog.minimumBrightness = 0.01;
    }

    useEffect(() => {        
        const length = Math.min(lat.length, lon.length);
        const coords = [];
        const forRect = [];

        for (let i = 0; i < length; i++) {
            const obj = [
                lat[i] * (180 / Math.PI),
                lon[i] * (180 / Math.PI)
            ]

            if (i === 0 || i === length - 1 || i % 30 === 0) {
                coords.push(...obj);
                forRect.push(obj);
            }
        }

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

        const imageryLayers = viewer.current?.cesiumElement?.imageryLayers;

        async function addLayer() {
            const waterCrossing = new ImageryLayer(
                await Promise.resolve(
                    new ArcGisMapServerImageryProvider({
                        url : 'https://services.arcgis.com/wjcPoefzjpzCgffS/ArcGIS/rest/services/Water_Bodies_in_Canada_2/FeatureServer',
                    })
                )
            )
            // const waterCrossing = ArcGisMapServerImageryProvider.fromUrl(
            //     'https://services.arcgis.com/wjcPoefzjpzCgffS/arcgis/rest/services/Water_Bodies_in_Canada_2/FeatureServer'
            // )
            imageryLayers.add(waterCrossing)
        }

        if (imageryLayers) {
            // addLayer();
        }
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

        const terrainProvider = new ArcGISTiledElevationTerrainProvider({
            url : 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
        });

        viewer.current.cesiumElement.terrainProvider = terrainProvider;

        viewer.current?.cesiumElement?.entities?.add({
            polylineVolume: {
                positions: Cartesian3.fromDegreesArray(coords),
                shape: computeCircle(400.0),
                material: Color.RED,
            },
        });

        const rect = Rectangle.fromDegrees(
            Math.min(...forRect.map(v => v[0])) - 0.3,
            Math.min(...forRect.map(v => v[1])) - 0.3,
            Math.max(...forRect.map(v => v[0])) + 0.3,
            Math.max(...forRect.map(v => v[1])) + 0.3,
        );

        viewer.current?.cesiumElement?.camera?.flyTo({
            destination : rect,
        });

        const scene = viewer.current?.cesiumElement?.scene;

        if (scene) {
            const handler = new ScreenSpaceEventHandler(scene.canvas);
            // handler.setInputAction((movement) => {
            //     const cartesian = viewer.current?.cesiumElement?.camera.pickEllipsoid(
            //         movement.position,
            //         scene.globe.ellipsoid
            //     );
            //     if (cartesian) {
            //         const cartographic = Cartographic.fromCartesian(
            //         cartesian
            //         );

            //         const position = [cartographic.longitude, cartographic.latitude];
            //         console.log(twoPointsRef.current);
            //         if (twoPointsRef.current === null) {
            //             setTwoPoints([position, undefined]);
            //         } else {
            //             if (twoPointsRef.current[0] === undefined && twoPointsRef.current[1] === undefined) {
            //                 setTwoPoints([position, undefined]);
            //                 drawFlag(true, position);
            //             } else if (twoPointsRef.current[0] !== undefined && twoPointsRef.current[1] === undefined) {
            //                 setTwoPoints([twoPointsRef.current[0], position]);
            //                 drawFlag(false, position);
            //             } else if (twoPointsRef.current[0] !== undefined && twoPointsRef.current[1] !== undefined) {
            //                 viewer.current?.cesiumElement?.entities?.removeById('From')
            //                 viewer.current?.cesiumElement?.entities?.removeById('To')
            //                 viewer.current?.cesiumElement?.entities?.removeById('rectangle')
            //                 setTwoPoints([position, undefined]);
            //                 drawFlag(true, position);
            //             }
            //         }
            //     }
            // }, ScreenSpaceEventType.LEFT_CLICK, KeyboardEventModifier.SHIFT);

            handler.setInputAction((movement) => {

                const obj = viewer.current?.cesiumElement?.entities?.getById(`circle`);
                if (obj !== undefined) {
                    viewer.current?.cesiumElement?.entities?.removeById(`circle`)
                }

                const cartesian = viewer.current?.cesiumElement?.camera.pickEllipsoid(
                    movement.position,
                    scene.globe.ellipsoid
                );
                if (cartesian) {
                    const cartographic = Cartographic.fromCartesian(
                    cartesian
                    );

                    const position = [cartographic.longitude, cartographic.latitude];

                    viewer.current?.cesiumElement?.entities.add({
                        position: Cartesian3.fromRadians(...position),
                        id: 'circle',
                        ellipse: {
                          semiMinorAxis: radius,
                          semiMajorAxis: radius,
                          height: 0,
                          material: Color.GRAY.withAlpha(0.5),
                          outline: false, // height must be set for outline to display
                        },
                    });

                    //30000 radius circle
                    const loc = {
                        lng: position[0] * (180 / Math.PI),
                        lat: position[1] * (180 / Math.PI)
                    }

                    const schoolsInCircle = schoolsInAlberta.filter(o => {
                        return (getDistanceFromLatLonInKm(loc.lat, loc.lng,  o.Latitude, o.Longitude) < 30);
                    });

                    setSchoolInArea(schoolsInCircle.length);
                    
                    const earthquakesInCircle = AlbertaEarthquakes.filter(o => {
                        return (getDistanceFromLatLonInKm(loc.lat, loc.lng, o.y_coordinate, o.x_coordinate) < 30);
                    });                    

                    setEarthquakeInArea(earthquakesInCircle.length);
                    
                    const floodingInCircle = FloodCoordinates.CROSSSECTIONS.filter(o => {
                        return (getDistanceFromLatLonInKm(loc.lat, loc.lng, o.start_y, o.start_x) < 30 ||
                        getDistanceFromLatLonInKm(loc.lat, loc.lng, o.end_y, o.end_x) < 30);
                    });                    

                    setFloodingInArea(floodingInCircle.length);
                    
                }
            }, ScreenSpaceEventType.LEFT_CLICK);


            var dataSourceForCluster = new CustomDataSource('schoolCluster');

            schoolsInAlberta.forEach((o, idx) => {
                dataSourceForCluster.entities.add({
                    id: `school${idx}`,
                    position : Cartesian3.fromDegrees(o.Longitude, o.Latitude),
                    billboard :{
                        image: '/school.png',
                        width: 20,
                        height: 20,
                    }
                });
            });

            const dataSourcePromise = viewer.current?.cesiumElement?.dataSources.add(dataSourceForCluster);

            dataSourcePromise.then(function(dataSource){
                const pixelRange = 15;
                const minimumClusterSize = 3;
                const enabled = true;

                dataSource.clustering.enabled = enabled;
                dataSource.clustering.pixelRange = pixelRange;
                dataSource.clustering.minimumClusterSize = minimumClusterSize;
                dataSource.show = false;

                setSchoolDS(dataSource);
            });
            //Calculate distance between schools and nodes
            const length = Math.min(lat.length, lon.length);
            const coords = [];

            for (let i = 0; i < length; i++) {
                const obj = [
                    lat[i] * (180 / Math.PI),
                    lon[i] * (180 / Math.PI)
                ]

                if (i === 0 || i === length - 1 || i % 30 === 0) {
                    coords.push(obj);
                }
            }

            // console.log(schoolsInAlberta.length);
            // console.log(schoolsInAlberta.filter(o => o.Longitude > -115.009 && o.Longitude < -112.009 && o.Latitude > 50.876 && o.Latitude < 53.866).length);            
            // getDistanceFromLatLonInKm(1, 1, 1, 1);

            coords.forEach(c => {
                schoolsNearPipe.forEach(s => {
                    const d = getDistanceFromLatLonInKm(c[0], c[1], s.Longitude, s.Latitude);
                    if (d < 10) {
                        // console.log(d);
                    }
                })
            });
        }
    }, []);

    useEffect(() => {
        if (twoPoints[0] !== undefined && twoPoints[1] !== undefined) {

            console.log(Cartesian3.fromRadians(...twoPoints[0]));
            console.log(Cartesian3.fromDegrees(...twoPoints[0]));
            console.log(CMath.toDegrees(twoPoints[0][0]));
            console.log(CMath.toDegrees(twoPoints[0][1]));

            const rectangle = Rectangle.fromRadians(
                Math.min(twoPoints[0][0], twoPoints[1][0]),
                Math.min(twoPoints[0][1], twoPoints[1][1]),
                Math.max(twoPoints[0][0], twoPoints[1][0]),
                Math.max(twoPoints[0][1], twoPoints[1][1])
            );

            viewer.current?.cesiumElement?.entities?.add({
                id: 'rectangle',
                rectangle: {
                    coordinates: rectangle,
                    fill: false,
                    outline: true,
                    outlineColor: Color.RED,
                    outlineWidth: 2.0,
                    // extrudedHeight: 5000.0,
                },
            });

            const length = Math.min(lat.length, lon.length);
            const nodes = [];
            for (let i = 0; i < length; i++) {
                const obj = [
                    lat[i],
                    lon[i]
                ]
    
                nodes.push(obj);
            }

            console.log(
                Math.min(twoPoints[0][0], twoPoints[1][0]),
                Math.min(twoPoints[0][1], twoPoints[1][1]),
                Math.max(twoPoints[0][0], twoPoints[1][0]),
                Math.max(twoPoints[0][1], twoPoints[1][1])
            )

            const nodesInRect = nodes.filter(n => 
                n[0] > Math.min(twoPoints[0][0], twoPoints[1][0]) &&
                n[1] > Math.min(twoPoints[0][1], twoPoints[1][1]) &&
                n[0] < Math.max(twoPoints[0][0], twoPoints[1][0]) &&
                n[1] < Math.max(twoPoints[0][1], twoPoints[1][1]))

            console.log(nodes.length);
            console.log(nodesInRect.length);

            /*
            const params = {x: (Cartesian3.fromRadians(...twoPoints[0]).x + Cartesian3.fromRadians(...twoPoints[1]).x) / 2,
            y: (Cartesian3.fromRadians(...twoPoints[0]).y + Cartesian3.fromRadians(...twoPoints[1]).y) / 2,
            z: 5000000}
            startRain(params);
            */
        }

    }, twoPoints);

    useEffect(() => {
        if (diaster[0]) {
            wildfire_hotspots_AB.forEach((o, idx) => {
                const obj = viewer.current?.cesiumElement?.entities?.getById(`wildfire${idx}`);
                const color = o.Gi_Bin + 1;
                if (obj === undefined) {
                    viewer.current?.cesiumElement?.entities?.add({
                        id: `wildfire${idx}`,
                        name: `wildfire${idx}`,
                        rectangle: {
                            coordinates: Rectangle.fromDegrees(o.min_x, o.min_y, o.max_x, o.max_y),
                            material: Color.RED.withAlpha(0.2 * color),
                        }
                    })
                }
            })
        } else {
            wildfire_hotspots_AB.forEach((obj, idx) => {
                viewer.current?.cesiumElement?.entities?.removeById(`wildfire${idx}`)
            })
        }

        if (diaster[1]) {
            AlbertaEarthquakes.filter(o => o.magnitude_codelist.toString() !== '<2').forEach((o, idx) => {
                const obj = viewer.current?.cesiumElement?.entities?.getById(`earthquake${idx}`);
                if (obj === undefined) {
                    viewer.current?.cesiumElement?.entities?.add({
                        id: `earthquake${idx}`,
                        name: `earthquake${idx}`,
                        position: Cartesian3.fromDegrees(o.x_coordinate, o.y_coordinate),
                        billboard: {
                            image: '/earthquake.png',
                            width: 30,
                            height: 30,
                        },
                        label: {
                            text: o.magnitude_codelist.toString(),
                            font: "24px Helvetica",
                            fillColor: Color.BLACK,
                            outlineColor: Color.BLACK,
                            outlineWidth: 2,
                            style: LabelStyle.FILL_AND_OUTLINE,
                        },
                    })
                }
            })
        } else {
            AlbertaEarthquakes.forEach((obj, idx) => {
                viewer.current?.cesiumElement?.entities?.removeById(`earthquake${idx}`)
            })
        }

        if (diaster[2]) {
            const obj = viewer.current?.cesiumElement?.entities?.getById('temperature');
            if (obj === undefined) {
                viewer.current?.cesiumElement?.entities?.add({
                    id: 'temperature',
                    name: 'temperature',
                    polygon: {
                    hierarchy: new PolygonHierarchy(
                        Cartesian3.fromDegreesArray([...temperature])
                    ),
                    material: Color.BLUEVIOLET.withAlpha(0.5),
                    }
                })
            }
        } else {
            viewer.current?.cesiumElement?.entities?.removeById('temperature')
        }

        // if (diaster[3]) {
        //     console.log();
        //     const obj = viewer.current?.cesiumElement?.entities?.getById('flooding');
        //     if (obj === undefined) {
        //         viewer.current?.cesiumElement?.entities?.add({
        //             id: 'flooding',
        //             name: 'flooding',
        //             polygon: {
        //             hierarchy: new PolygonHierarchy(
        //                 Cartesian3.fromDegreesArray([...flooding])
        //             ),
        //             material: Color.BLUE.withAlpha(0.5),
        //             }
        //         })
        //     }
        // } else {
        //     viewer.current?.cesiumElement?.entities?.removeById('flooding')
        // }

        if (diaster[3]) {
            FloodCoordinates.CROSSSECTIONS.forEach((o, idx) => {
                const obj = viewer.current?.cesiumElement?.entities?.getById(`flooding${idx}`);
                if (obj === undefined) {
                    viewer.current?.cesiumElement?.entities?.add({
                        id: `flooding${idx}`,
                        name: `flooding${idx}`,
                        polyline: {
                            positions: Cartesian3.fromDegreesArray([o.start_x, o.start_y, o.end_x, o.end_y]),
                            material: Color.BLUE.withAlpha(0.5),
                            width: 5,
                        }
                    })
                }
            })
        } else {
            FloodCoordinates.CROSSSECTIONS.forEach((obj, idx) => {
                viewer.current?.cesiumElement?.entities?.removeById(`flooding${idx}`)
            })
        }

    }, diaster);

    useEffect(() => {
        if (area[0]) {
            factory.forEach((o, idx) => {
                console.log(...o);
                const obj = viewer.current?.cesiumElement?.entities?.getById(`factory${idx}`);
                if (obj === undefined) {
                    viewer.current?.cesiumElement?.entities?.add({
                        id: `factory${idx}`,
                        name: `factory${idx}`,
                        position: Cartesian3.fromDegrees(...o),
                        billboard: {
                            image: '/factory.png',
                            width: 30,
                            height: 30,
                        }
                    })
                }
            })
        } else {
            factory.forEach((obj, idx) => {
                viewer.current?.cesiumElement?.entities?.removeById(`factory${idx}`)
            })
        }

        if (area[1]) {
            if (schoolDS != undefined && schoolDS != null) {
                schoolDS.show = true;
            }
        } else {
            if (schoolDS != undefined && schoolDS != null) {
                schoolDS.show = false;
            }
            // schoolsInAlberta.forEach((obj, idx) => {
            //     // viewer.current?.cesiumElement?.entities?.removeById(`school${idx}`)
            // });
        }

        if (area[2]) {
            const _pop = population.reduce((prev, curr) => {
                const existedObj = prev.find(o => o.OID === curr.OID)

                if (existedObj === undefined) {
                    const _o = {
                        OID: curr.OID,
                        coords: [curr.X, curr.Y],
                        population: curr.CMApop2016,
                    }

                    prev.push(_o);
                } else {
                    existedObj.coords.push(curr.X, curr.Y)
                }

                return prev;
            }, [])

            const maxPop = Math.max(..._pop.map(_p => _p.population));
            

            _pop.forEach(p => {
                // const color = (p.population / maxPop);
                const obj = viewer.current?.cesiumElement?.entities?.getById(`population${p.OID}`);
                if (obj === undefined) {
                    viewer.current?.cesiumElement?.entities?.add({
                        id: `population${p.OID}`,
                        name: p.OID,
                        polygon: {
                        hierarchy: new PolygonHierarchy(
                            Cartesian3.fromDegreesArray([...p.coords])
                        ),
                            material: Color.GREEN.withAlpha(0.5),
                        }
                    })
                }
            })
        } else {
            const _pop = population.reduce((prev, curr) => {
                const existedObj = prev.find(o => o.OID === curr.OID)

                if (existedObj === undefined) {
                    const _o = {
                        OID: curr.OID,
                        coords: [curr.X, curr.Y],
                        population: curr.CMApop2016,
                    }

                    prev.push(_o);
                } else {
                    existedObj.coords.push(curr.X, curr.Y)
                }

                return prev;
            }, [])

            _pop.forEach((obj, idx) => {
                viewer.current?.cesiumElement?.entities?.removeById(`population${obj.OID}`)
            })
        }

        if (area[3]) {
            const _pop = population2.reduce((prev, curr) => {
                const existedObj = prev.find(o => o.OID === curr.OID)

                if (existedObj === undefined) {
                    const _o = {
                        OID: curr.OID,
                        coords: [curr.X, curr.Y],
                        population: curr.CMApop2016,
                    }

                    prev.push(_o);
                } else {
                    existedObj.coords.push(curr.X, curr.Y)
                }

                return prev;
            }, [])

            const maxPop = Math.max(..._pop.map(_p => _p.population));
            

            _pop.forEach(p => {
                // const color = (p.population / maxPop);
                const obj = viewer.current?.cesiumElement?.entities?.getById(`population2${p.OID}`);
                if (obj === undefined) {
                    viewer.current?.cesiumElement?.entities?.add({
                        id: `population2${p.OID}`,
                        name: p.OID,
                        polygon: {
                        hierarchy: new PolygonHierarchy(
                            Cartesian3.fromDegreesArray([...p.coords])
                        ),
                            material: Color.BLUE.withAlpha(0.5),
                        }
                    })
                }
            })
        } else {
            const _pop = population.reduce((prev, curr) => {
                const existedObj = prev.find(o => o.OID === curr.OID)

                if (existedObj === undefined) {
                    const _o = {
                        OID: curr.OID,
                        coords: [curr.X, curr.Y],
                        population: curr.CMApop2016,
                    }

                    prev.push(_o);
                } else {
                    existedObj.coords.push(curr.X, curr.Y)
                }

                return prev;
            }, [])

            _pop.forEach((obj, idx) => {
                viewer.current?.cesiumElement?.entities?.removeById(`population2${obj.OID}`)
            })
        }
    }, area);

    function drawFlag(isStart, position) {
        viewer.current?.cesiumElement?.entities?.add({
            id: isStart ? "From" : "To",
            name: isStart ? "From" : "To",
            position: Cartesian3.fromRadians(...position),
            billboard: {
                image: pinBuilder.fromText(isStart ? "From" : "To", Color.BLACK, 48).toDataURL("image/png", 1.0),
                verticalOrigin: VerticalOrigin.BOTTOM,
            },
        });
    }

    function getPosition() {
        // console.log(camera);
        // console.log(camera.current?.cesiumElement);
        // console.log(camera.current?.cesiumElement?.positionCartographic);

        const radians = camera.current?.cesiumElement?.positionCartographic;
        
        if (radians !== undefined) {
            const coords = Cartesian3.fromRadians(radians.longitude, radians.latitude, radians.height);

            console.log(coords);
        }
    }

    const switchDiaster = (idx) => {
        const copyArr = [...diaster];
        copyArr[idx] = !diaster[idx];
        setDiaster(copyArr);
    }

    const switchArea = (idx) => {
        const copyArr = [...area];
        copyArr[idx] = !area[idx];
        setArea(copyArr);
    }

    const returnRiskLevel = (val) => {
        const nomalizedVal = ((val-scaleMin)/(scaleMax-scaleMin))
        if (nomalizedVal > 0.75) {
            return (<span style={{color: 'red', fontWeight: '800'}}>Severe</span>);
        } else if (nomalizedVal > 0.50) {
            return (<span style={{color: 'orange', fontWeight: '800'}}>High</span>);
        } else if (nomalizedVal > 0.25) {
            return (<span style={{color: 'gold', fontWeight: '800'}}>Moderate</span>);
        } else {
            return (<span style={{color: 'olive', fontWeight: '800'}}>Low</span>);
        }
    }

    const tab = () => {
        return (
            <div className='tabber' style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', padding: '0 .5rem' }}>
                <Tabs>
                    <TabList>
                        <Tab>Using Map</Tab>
                        <Tab>Using Parameters</Tab>
                    </TabList>
                    <TabPanel>
                        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                            <div>
                                <h3> Disaster type </h3>
                                <div style={{padding: '1rem'}}>
                                    <div>
                                        <input type={'checkbox'} name={'disaster'} id={'Wildfire'} value={diaster[0]} onClick={() => switchDiaster(0)}/>
                                        <label style={{...styles.label}} for={'Wildfire'}>Wildfire</label>
                                    </div>
                                    <div>
                                        <input type={'checkbox'} name={'disaster'} id={'Earthquake'} value={diaster[1]} onClick={() => switchDiaster(1)}/>
                                        <label style={{...styles.label}}  for={'Earthquake'}>Earthquake</label>
                                    </div>
                                    {/* <div>
                                        <input type={'checkbox'} name={'disaster'} id={'Flood'} value={diaster[2]} onClick={() => switchDiaster(2)}/>
                                        <label style={{...styles.label}}  for={'Flood'}>Temperature</label>
                                    </div> */}
                                    <div>
                                        <input type={'checkbox'} name={'disaster'} id={'Blizzard'} value={diaster[3]} onClick={() => switchDiaster(3)}/>
                                        <label style={{...styles.label}}  for={'Blizzard'}>Flooding</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3>Areas</h3>
                                <div style={{padding: '1rem'}}>
                                    {/* <div>
                                        <input type={'checkbox'} name={'area'} id={'Factory'} value={area[0]} onClick={() => switchArea(0)}/>
                                        <label style={{...styles.label}}  for={'Factory'}>Factory</label>
                                    </div> */}
                                    <div>
                                        <input type={'checkbox'} name={'area'} id={'School'} value={area[1]} onClick={() => switchArea(1)}/>
                                        <label style={{...styles.label}}  for={'School'}>School</label>
                                    </div>
                                    <div>
                                        <input type={'checkbox'} name={'area'} id={'Residence'} value={area[2]} onClick={() => switchArea(2)}/>
                                        <label style={{...styles.label}}  for={'Residence'}>Residence</label>
                                    </div>
                                    {/* <div>
                                        <input type={'checkbox'} name={'area'} id={'Residence2'} value={area[3]} onClick={() => switchArea(3)}/>
                                        <label style={{...styles.label}}  for={'Residence'}>Residence2</label>
                                    </div> */}
                                </div>
                            </div>
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                <h3>Risk value</h3>
                                <div style={{padding: '0 0 0 1rem', flex: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    {(decisionTree === undefined || decisionTree === null) &&
                                        (linearRegression === undefined || linearRegression === null) &&
                                        (randomForest === undefined || randomForest === null) &&
                                        (svm === undefined || svm === null)
                                        ? (<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800'}}>Select the point in the map</div>)
                                        : (<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Type</div><div style={{...styles.textCenter, fontWeight: '800'}}>Accuracy(±30%)</div><div style={{...styles.textCenter, fontWeight: '800'}}>MSE</div><div style={{...styles.textCenter, fontWeight: '800'}}>Predict</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>SVM</div><div div style={{...styles.textCenter}}>{svm.accuracy.toFixed(3)}</div><div div style={{...styles.textCenter}}>{svm.mse.toFixed(3)}</div><div div style={{...styles.textCenter}}>{returnRiskLevel(svm.predict)}</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Linear Regression</div><div div style={{...styles.textCenter}}>{linearRegression.accuracy.toFixed(3)}</div><div div style={{...styles.textCenter}}>{linearRegression.mse.toFixed(3)}</div><div div style={{...styles.textCenter}}>{returnRiskLevel(linearRegression.predict)}</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Random Forest</div><div div style={{...styles.textCenter}}>{randomForest.accuracy.toFixed(3)}</div><div div style={{...styles.textCenter}}>{randomForest.mse.toFixed(3)}</div><div div style={{...styles.textCenter}}>{returnRiskLevel(randomForest.predict)}</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Decision Tress</div><div div style={{...styles.textCenter}}>{decisionTree.accuracy.toFixed(3)}</div><div div style={{...styles.textCenter}}>{decisionTree.mse.toFixed(3)}</div><div div style={{...styles.textCenter}}>{returnRiskLevel(decisionTree.predict)}</div>
                                            </div>
                                        </div>)
                                    }
                                </div>
                                <div style={styles.btnContainer}>
                                    <Button variant="outline-primary" onClick={() => calculate()} >
                                        Calculate Risk
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                    <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', inset: '5rem 2rem 5rem 3rem', height: '100vh'}}>
                        <div style={{border: '2px solid black', padding: '10px 20px', flex: 1, borderBottom: 'none'}} class="input-container">
                            <div style={{display: 'flex', justifyContent: 'center', padding: '0 0 10px 0'}}>
                                <h1>Parameters</h1>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                <div style={{flex: 0.4}}>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="D">D mm</label>
                                        <input id="D" placeholder='[200-1000]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="tmm">t mm</label>
                                        <input id="tmm" placeholder='[5-18]' />
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="L">L mm</label>
                                        <input id="L" placeholder='[0-1500]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="d">d mm</label>
                                        <input id="d" placeholder='[0-15]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="YS">YS MPa</label>
                                        <input id="YS" placeholder='[300-800]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="UTS">UTS MPa</label>
                                        <input id="UTS" placeholder='[400-800]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="Exp">Exp. MPa</label>
                                        <input id="Exp" placeholder='[0-30]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="B31G">B31G Mpa</label>
                                        <input id="B31G" placeholder='[0-30]'/>
                                    </div>
                                </div>
                                <div style={{flex: 0.4}}>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="MB31G">M.B31G Mpa</label>
                                        <input id="MB31G" placeholder='[0-30]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="DNV">DNV Mpa</label>
                                        <input id="DNV" placeholder='[0-30]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="Battelle">Battelle Mpa</label>
                                        <input id="Battelle" placeholder='[0-30]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="Shell">Shell Mpa</label>
                                        <input id="Shell" placeholder='[0-30]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="Netto">Netto Mpa</label>
                                        <input id="Netto" placeholder='[0-30]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="School">School</label>
                                        <input id="School" placeholder='[0-1]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="Population">Population</label>
                                        <input id="Population" placeholder='[0-1]'/>
                                    </div>
                                    <div style={{...styles.inputRow}}>
                                        <label style={{padding: '10px 0'}} for="Water">Water</label>
                                        <input id="Water" placeholder='[0-1]'/>
                                    </div>
                                </div>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div style={{borderRadius: '10px', padding: '10px 20px', backgroundColor: '#0071e3', cursor: 'pointer', margin: '10px 0', color: 'white'}}
                            onClick={() => predict()}>
                                Predict
                            </div>
                            </div>
                        </div>
                        <div style={{border: '2px solid black', padding: '10px 20px', flex: 1, display: 'flex', 'flexDirection': 'column', position: 'relative'}} class="output-container">
                                <div style={{display: 'flex', justifyContent: 'center', padding: '0 0 10px 0'}}>
                                <h1>Predictions</h1>
                                </div>
                                <div style={{display: 'flex', flex: 1, width: '100%'}}>
                                <div style={{width: '100%'}} id="result-body">
                                    <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {(decisionTree2 === undefined || decisionTree2 === null) &&
                                        (linearRegression2 === undefined || linearRegression2 === null) &&
                                        (randomForest2 === undefined || randomForest2 === null) &&
                                        (svm2 === undefined || svm2 === null)
                                        ? (<div style={{fontSize: '2em'}}>Input parameters and Predict!</div>)
                                        : (<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Type</div><div style={{...styles.textCenter, fontWeight: '800'}}>Predict</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>SVM</div><div div style={{...styles.textCenter}}>{returnRiskLevel(svm2.predict)}</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Linear Regression</div><div div style={{...styles.textCenter}}>{returnRiskLevel(linearRegression2.predict)}</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Random Forest</div><div div style={{...styles.textCenter}}>{returnRiskLevel(randomForest2.predict)}</div>
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div style={{...styles.textCenter, fontWeight: '800'}}>Decision Tress</div><div div style={{...styles.textCenter}}>{returnRiskLevel(decisionTree2.predict)}</div>
                                            </div>
                                        </div>)
                                    }    
                                    </div>
                                </div>
                                </div>
                        </div>
                    </div>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }

    const calculate =  async () => {
        const obj = viewer.current?.cesiumElement?.entities?.getById(`circle`);

        if (obj === undefined) {
            alert('Please select the area on the map');
            return;
        }
        
        const randObj = dataFromPaper[Math.floor(Math.random() * dataFromPaper.length)];

        console.log(randObj);

        const params = {
            D: randObj['D mm'],
            t: randObj['t mm'],
            L: randObj['L mm'],
            d: randObj['d mm'],
            YS: randObj['YS MPa'],
            UTS: randObj['UTS MPa'],
            Exp: randObj['Exp. MPa'],
            B31G: randObj['B31G MPa'],
            MB31G: randObj['M.B31G Mpa'],
            DNV: randObj['DNV Mpa'],
            Shell: randObj['Shell Mpa'],
            Netto: randObj['Netto Mpa'],
            Battelle: randObj['Battelle Mpa'],
            Water: randObj['Water'],
            School: randObj['School'],
            Population: randObj['Population'],
            // Water: floodingInArea,
            // School: schoolInArea,
            // Population: residenceInArea,
            rangePercent: 0.3,
            Result: randObj['Result'],
        }

        console.log(params);

        axios.get("http://localhost:5000/mlPredict", {
            params: {...params},
        })
        .then((res) => {
            console.log(res);

            const result = res.data;

            const {decisionTree, linearRegression, randomForest, svm} = result;

            console.log(decisionTree, linearRegression, randomForest, svm);

            setDecisionTree(decisionTree)
            setLinearRegression(linearRegression);
            setRandomForest(randomForest);
            setSvm(svm);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const predict =  async () => {
        let D = document.getElementById("D").value;
        let tmm = document.getElementById("tmm").value;
        let L = document.getElementById("L").value;
        let d = document.getElementById("d").value;
        let YS = document.getElementById("YS").value;
        let UTS = document.getElementById("UTS").value;
        let Exp = document.getElementById("Exp").value;
        let B31G = document.getElementById("B31G").value;
        let MB31G = document.getElementById("MB31G").value;
        let DNV = document.getElementById("DNV").value;
        let Battelle = document.getElementById("Battelle").value;
        let Shell = document.getElementById("Shell").value;
        let Netto = document.getElementById("Netto").value;
        let School = document.getElementById("School").value;
        let Population = document.getElementById("Population").value;
        let Water = document.getElementById("Water").value;

        const randObj = dataFromPaper[Math.floor(Math.random() * dataFromPaper.length)];

        console.log(randObj);

        if (D === '') {
            const [max, min] = [1000, 200];
            document.getElementById("D").focus();
            // document.getElementById("D").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("D").value = randObj['D mm'];
        }

        if (tmm === '') {
            const [max, min] = [18, 5];
            document.getElementById("tmm").focus();
            // document.getElementById("tmm").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("tmm").value = randObj['t mm'];
        }

        if (L === '') {
            const [max, min] = [1500, 0];
            document.getElementById("L").focus();
            // document.getElementById("L").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("L").value = randObj['L mm'];
        }

        if (d === '') {
            const [max, min] = [15, 0];
            document.getElementById("d").focus();
            // document.getElementById("d").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("d").value = randObj['d mm'];
        }

        if (YS === '') {
            const [max, min] = [800, 300];
            document.getElementById("YS").focus();
            // document.getElementById("YS").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("YS").value = randObj['YS MPa'];
        }

        if (UTS === '') {
            const [max, min] = [800, 400];
            document.getElementById("UTS").focus();
            // document.getElementById("UTS").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("UTS").value = randObj['UTS MPa'];
        }

        if (Exp === '') {
            const [max, min] = [30, 0];
            document.getElementById("Exp").focus();
            // document.getElementById("Exp").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("Exp").value = randObj['Exp. MPa'];
        }

        if (B31G === '') {
            const [max, min] = [30, 0];
            document.getElementById("B31G").focus();
            // document.getElementById("B31G").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("B31G").value = randObj['B31G MPa'];
        }

        if (MB31G === '') {
            const [max, min] = [30, 0];
            document.getElementById("MB31G").focus();
            // document.getElementById("MB31G").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("MB31G").value = randObj['M.B31G Mpa'];
        }

        if (DNV === '') {
            const [max, min] = [30, 0];
            document.getElementById("DNV").focus();
            // document.getElementById("DNV").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("DNV").value = randObj['DNV Mpa'];
        }

        if (Battelle === '') {
            const [max, min] = [30, 0];
            document.getElementById("Battelle").focus();
            // document.getElementById("Battelle").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("Battelle").value = randObj['Battelle Mpa'];
        }

        if (Shell === '') {
            const [max, min] = [30, 0];
            document.getElementById("Shell").focus();
            // document.getElementById("Shell").value = Math.floor(Math.random() * (max - min + 1)) + min;
            document.getElementById("Shell").value = randObj['Shell Mpa'];
        }

        if (Netto === '') {
            const [max, min] = [30, 0];
            document.getElementById("Netto").focus();
            // document.getElementById("Netto").value = Math.floor(Math.random() * (max - min + 1)) + min;.
            document.getElementById("Netto").value = randObj['Netto Mpa'];
        }

        if (School === '') {
            const [max, min] = [1, 0];
            document.getElementById("School").focus();
            // document.getElementById("School").value = Math.floor(Math.random() * 100) / 100;
            document.getElementById("School").value = randObj['School'];
        }

        if (Population === '') {
            const [max, min] = [1, 0];
            document.getElementById("Population").focus();
            // document.getElementById("Population").value = Math.floor(Math.random() * 100) / 100;
            document.getElementById("Population").value = randObj['Population'];
        }

        if (Water === '') {
            const [max, min] = [1, 0];
            document.getElementById("Water").focus();
            // document.getElementById("Water").value = Math.floor(Math.random() * 100) / 100;
            document.getElementById("Water").value = randObj['Water'];
        }

        D = document.getElementById("D").value;
        tmm = document.getElementById("tmm").value;
        L = document.getElementById("L").value;
        d = document.getElementById("d").value;
        YS = document.getElementById("YS").value;
        UTS = document.getElementById("UTS").value;
        Exp = document.getElementById("Exp").value;
        B31G = document.getElementById("B31G").value;
        MB31G = document.getElementById("MB31G").value;
        DNV = document.getElementById("DNV").value;
        Battelle = document.getElementById("Battelle").value;
        Shell = document.getElementById("Shell").value;
        Netto = document.getElementById("Netto").value;
        School = document.getElementById("School").value;
        Population = document.getElementById("Population").value;
        Water = document.getElementById("Water").value;

        const params = {
            D: D?D:0,
            t: tmm?tmm:0,
            L: L?L:0,
            d: d?d:0,
            YS: YS?YS:0,
            UTS: UTS?UTS:0,
            Exp: Exp?Exp:0,
            B31G: B31G?B31G:0,
            MB31G: MB31G?MB31G:0,
            DNV: DNV?DNV:0,
            Shell: Shell?Shell:0,
            Netto: Netto?Netto:0,
            Battelle: Battelle?Battelle:0,
            Water: Water?Water:0,
            School: School?School:0,
            Population: Population?Population:0,
            // Water: floodingInArea,
            // School: schoolInArea,
            // Population: residenceInArea,
            rangePercent: 0.3,
            Result: 0,
        }

        console.log(params);

        axios.get("http://localhost:5000/mlPredict", {
            params: {...params},
        })
        .then((res) => {
            console.log(res);

            const result = res.data;

            const {decisionTree, linearRegression, randomForest, svm} = result;

            console.log(decisionTree, linearRegression, randomForest, svm);

            setDecisionTree2(decisionTree)
            setLinearRegression2(linearRegression);
            setRandomForest2(randomForest);
            setSvm2(svm);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return (
        <div class={'lower'} style={{display: 'flex', height: '100%', width: '100%', flexDirection: 'column'}}>
            <div class={'container-fluid'} style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <div class={'row'} style={{height: '100%', width: '100%'}}>
                    <div style={{flex: 0.5, height: '100%', position: 'relative'}}>
                        <Viewer full ref={viewer} {...viewerOption} >
                            <Camera ref={camera} onMoveEnd={() => getPosition()}/>
                        </Viewer>
                        <div style={{position: 'absolute', top: 0, left: 0, width: '15vw',backgroundColor: 'lightgray', padding: '0.5rem', display: 'flex', flexDirection: 'column', ...styles.shadowBox}}>
                            {/* <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                                <span style={{fontWeight: 'bold', fontSize: '1.5rem'}}>Probability</span>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Wildfire</span>
                                    <span>{wildfireInArea}</span>
                                </div>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Earthquake</span>
                                    <span>{earthquakeInArea}</span>
                                </div>
                                <span>{twoPoints[0] === undefined ? 'Not Selected' : `${(twoPoints[0][0] * 180 / Math.PI).toFixed(3)}, ${(twoPoints[0][1] * 180 / Math.PI).toFixed(3)}`}</span>
                            </div> */}
                            <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                                <span style={{fontWeight: 'bold', fontSize: '1.5rem'}}>Failure consequence</span>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>School</span>
                                    <span>{schoolInArea}</span>
                                </div>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Residence</span>
                                    <span>{residenceInArea}</span>
                                </div>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Water</span>
                                    <span>{floodingInArea}</span>
                                </div>
                                {/* <span>{twoPoints[1] === undefined ? 'Not Selected' : `${(twoPoints[1][0] * 180 / Math.PI).toFixed(3)}, ${(twoPoints[1][1] * 180 / Math.PI).toFixed(3)}`}</span> */}
                            </div>
                        </div>
                    </div>
                    <div style={{flex: 0.5, height: '100%', position: 'relative'}}>
                        <div className='tabber' style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem'}}>
                            {tab()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    label: {
        fontSize: '1rem',
        paddingLeft: '1rem',
    },
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
    },
    shadowBox: {
        boxShadow: '0 1px 1px 0 rgba(0, 28, 36, 0.3), 1px 1px 1px 0 rgba(0, 28, 36, 0.15), -1px 1px 1px 0 rgba(0, 28, 36, 0.15)',
        borderTop: '1px solid #eaeded',
        borderRadius: '0px',
        boxSizing: 'border-box',
        backgroundColor: '#eeeeee',
        zIndex: 999,
    },
    textCenter: {
        textAlign: 'center',
        fontSize: '1.5rem',
        flex: 1,
    },
    inputRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}

export default NewSimulation;