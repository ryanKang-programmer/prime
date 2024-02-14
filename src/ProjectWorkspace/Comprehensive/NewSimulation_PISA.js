import React, { useEffect, useRef, useState } from 'react';
import { Viewer, CameraFlyTo, Camera } from "resium";
import Button from 'react-bootstrap/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Cartesian3, Math as CMath, Color, Cartesian2, ArcGisMapServerImageryProvider, Rectangle, ScreenSpaceEventHandler,
    ScreenSpaceEventType, Cartographic, KeyboardEventModifier, VerticalOrigin, PinBuilder, Matrix4, ParticleSystem,
    SphereEmitter, ArcGISTiledElevationTerrainProvider, ImageryLayer, PolygonHierarchy, EntityCluster, LabelStyle, NearFarScalar, CustomDataSource, Entity, defined, defaultValue } from 'cesium';
    
import lat from '../StressAnalysis/StressData/lat.json';
import lon from '../StressAnalysis/StressData/long.json';
import simulation_pisa from './simulation/pisa_output.json';
import "./NewSimulation.css";

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

    const [diaster, setDiaster] = useState([false, false, false, true]);
    const [area, setArea] = useState([false, false, false, false]);
    const [radius, setRadius] = useState(30000.0);

    const [wildfireInArea, setWildfireInArea] = useState(0);
    const [earthquakeInArea, setEarthquakeInArea] = useState(0);
    const [floodingInArea, setFloodingInArea] = useState(0);
    
    const [schoolInArea, setSchoolInArea] = useState(0);
    const [residenceInArea, setResidenceInArea] = useState(0);

    const [schoolDS, setSchoolDS] = useState(null);

    const [i_diameter, setI_diameter] = useState(undefined);
    const [i_thickness, setI_thickness] = useState(undefined);
    const [i_length, setI_length] = useState(undefined);
    const [i_force,setI_force] = useState(undefined);
    const [i_boundary_type,setI_boundary_type] = useState(undefined);
    const [o_stress,setO_stress] = useState(undefined);
    const [o_maxUz,setO_maxUz] = useState(undefined);
    const [selectedLeakId, setSelectedLeakId] = useState(undefined);

    const schoolsNearPipe = schoolsInAlberta.filter(o => o.Longitude > -115.009 && o.Longitude < -112.009 && o.Latitude > 50.876 && o.Latitude < 53.866);

    const pinBuilder = new PinBuilder();
    let rain;
    let ds;

    const max_stress_x70 = 550;

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

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

    useEffect(() => {        
        const length = Math.min(lat.length, lon.length);
        const coords = [];
        const forRect = [];
        const leaks = [];
        const shuffled_simulation_pisa = shuffle(simulation_pisa);
        for (let i = 0; i < length; i++) {
            const obj = [
                lat[i] * (180 / Math.PI),
                lon[i] * (180 / Math.PI)
            ]

            if (i === 0 || i === length - 1 || i % 30 === 0) {
                coords.push(...obj);
                forRect.push(obj);
            }

            if (i % 300 === 0) {
                leaks.push(obj);
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
        leaks.forEach((o, idx) => {
            viewer.current?.cesiumElement?.entities.add({
                id: `flood${idx}`,
                position : Cartesian3.fromDegrees(o[0], o[1], 1000),
                billboard :{
                    image: '/water-solid.svg',
                    width: 30,
                    height: 30,
                },
                description: shuffled_simulation_pisa[idx],
            });
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

                    const picked = viewer.current?.cesiumElement?.scene.pick(movement.position);
                    if (defined(picked)) {
                        const id = defaultValue(picked.id, picked.primitive.id);
                        if (id instanceof Entity) {
                            if (id.description._value.length !== 7) {
                                return;
                            } else {
                                setI_diameter(id.description._value[0]);
                                setI_thickness(id.description._value[1]);
                                setI_length(id.description._value[2]);
                                setI_force(id.description._value[3]);
                                setO_stress(id.description._value[4]);
                                setO_maxUz(id.description._value[5]);
                                setI_boundary_type(id.description._value[6]);
                                setSelectedLeakId(id.id);
                                viewer.current?.cesiumElement?.entities.add({
                                    position: Cartesian3.fromRadians(...position),
                                    id: 'circle',
                                    ellipse: {
                                      semiMinorAxis: radius,
                                      semiMajorAxis: radius,
                                      height: 0,
                                      material: id.description._value[4]/max_stress_x70 < 0.8 ? Color.GREEN.withAlpha(0.25)
                                      : id.description._value[4]/max_stress_x70 >= 1 ? Color.RED.withAlpha(0.25) : Color.DARKORANGE.withAlpha(0.25),
                                      outline: false, // height must be set for outline to display
                                    },
                                });
                            }
                            return id;
                        }
                    }
                    return undefined;
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

            
            const params = {x: (Cartesian3.fromRadians(...twoPoints[0]).x + Cartesian3.fromRadians(...twoPoints[1]).x) / 2,
            y: (Cartesian3.fromRadians(...twoPoints[0]).y + Cartesian3.fromRadians(...twoPoints[1]).y) / 2,
            z: 5000000}
            startRain(params);
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

    return (
        <div class={'lower'} style={{display: 'flex', height: '100%', width: '100%', flexDirection: 'column'}}>
            <div class={'container-fluid'} style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <div class={'row'} style={{height: '100%', width: '100%'}}>
                    <div style={{flex: 0.5, height: '100%', position: 'relative'}}>
                        <Viewer full ref={viewer} {...viewerOption} >
                            <Camera ref={camera} onMoveEnd={() => getPosition()}/>
                        </Viewer>
                        {/* <div style={{position: 'absolute', top: 0, left: 0, width: '15vw',backgroundColor: 'lightgray', padding: '0.5rem', display: 'flex', flexDirection: 'column', ...styles.shadowBox}}> */}
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
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Flooding</span>
                                    <span>{floodingInArea}</span>
                                </div>
                                <span>{twoPoints[0] === undefined ? 'Not Selected' : `${(twoPoints[0][0] * 180 / Math.PI).toFixed(3)}, ${(twoPoints[0][1] * 180 / Math.PI).toFixed(3)}`}</span>
                            </div> */}
                            {/* <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                                <span style={{fontWeight: 'bold', fontSize: '1.5rem'}}>Failure consequence</span>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>School</span>
                                    <span>{schoolInArea}</span>
                                </div>
                                <div style={{padding: '0 1rem', display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Residence</span>
                                    <span>{residenceInArea}</span>
                                </div>

                                //<span>{twoPoints[1] === undefined ? 'Not Selected' : `${(twoPoints[1][0] * 180 / Math.PI).toFixed(3)}, ${(twoPoints[1][1] * 180 / Math.PI).toFixed(3)}`}</span>
                            </div> */}
                        {/* </div> */}
                    </div>
                    <div style={{flex: 0.5, height: '100%', position: 'relative'}}>
                        <div className='tabber' style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem'}}>
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
                            <div>
                                <h3>Risk value</h3>
                                {selectedLeakId !== undefined ? (
                                    <div style={{padding: '0 1rem'}}>
                                        <div style={{fontSize: '1.5rem', padding: '1rem 0'}}>Selected leak ID: <span style={{fontWeight: 800}}>{selectedLeakId}</span></div>
                                        <div style={{padding: '1rem 0'}}>
                                            <div>Material: X70. </div>
                                            <div>Internal fluid: natural gas with 5 MPa pressure.</div>
                                            <div>Soil overburden height:  2 m</div>
                                        </div>
                                        <div style={{padding: '1rem 0'}}>
                                            <h4>Input</h4>
                                            <div>
                                                Diameter (inch) {i_diameter}
                                            </div>
                                            <div>
                                                Thickness (mm) {i_thickness}
                                            </div>
                                            <div>
                                                Length (m) {i_length}
                                            </div>
                                            <div>
                                                Force (KN) {i_force}
                                            </div>
                                        </div>
                                        <div style={{padding: '1rem 0'}}>
                                            <h4>Output</h4>
                                            <div>
                                                <span style={{fontWeight: 800}}>Stress</span>
                                                &nbsp;(MPa) (Max550MPa)&nbsp;
                                                <span style={{
                                                    fontWeight: 800,
                                                    color: o_stress/max_stress_x70 < 0.8 ? 'green' : o_stress/max_stress_x70 >= 1 ? 'red' : 'darkorange'}}>
                                                        {o_stress}
                                                </span>
                                            </div>
                                            <div>Max Uz (mm) {o_maxUz}</div>
                                        </div>
                                        <div style={{padding: '1rem 0'}}>
                                            <h3>Boundary Conditions</h3>
                                            {i_boundary_type === 0? (
                                            <div style={{position: 'relative'}}>
                                                <div style={{display: 'flex', padding: '0 1rem'}}>
                                                    <div style={{flex: 1, backgroundColor: '#796842', height: '3vh'}}></div>
                                                    <div style={{flex: 2, backgroundColor: 'blue', height: '3vh'}}></div>
                                                    <div style={{flex: 1, backgroundColor: '#796842', height: '3vh'}}></div>    
                                                </div>
                                                <div style={{position: 'absolute', display: 'flex', padding: '0 1rem', inset: 0}}>
                                                    <div style={{position: 'absolute',left: '0%', top: '3vh', fontWeight: 800, transform: 'translateX(5px)'}}>
                                                        <img src='/clamp_sharp.png' width={30}/>
                                                    </div>
                                                    <div style={{position: 'absolute',left: '25%', fontWeight: 800}}></div>
                                                    <div style={{position: 'absolute',right: '25%', fontWeight: 800}}></div>
                                                    <div style={{position: 'absolute',right: '0%', top: '3vh', fontWeight: 800, transform: 'translateX(-5px)'}}>
                                                        <img src='/clamp_sharp.png' width={30}/>
                                                    </div>
                                                </div>
                                            </div>
                                            ) : (
                                            <div style={{position: 'relative'}}>
                                                <div style={{display: 'flex', padding: '0 1rem'}}>
                                                    <div style={{flex: 1, backgroundColor: '#796842', height: '3vh'}}></div>
                                                    <div style={{flex: 2, backgroundColor: 'blue', height: '3vh'}}></div>
                                                    <div style={{flex: 1, backgroundColor: '#796842', height: '3vh'}}></div>    
                                                </div>
                                                <div style={{position: 'absolute', display: 'flex', padding: '0 1rem', inset: 0}}>
                                                    <div style={{position: 'absolute',left: '0%', fontWeight: 800}}></div>
                                                    <div style={{position: 'absolute',left: '25%', top: '3vh', fontWeight: 800, transform: 'translateX(-5px)'}}>
                                                        <img src='/clamp_sharp.png' width={30}/>
                                                    </div>
                                                    <div style={{position: 'absolute',right: '25%', top: '3vh', fontWeight: 800, transform: 'translateX(5px)'}}>
                                                        <img src='/clamp_sharp.png' width={30}/>
                                                    </div>
                                                    <div style={{position: 'absolute',right: '0%', fontWeight: 800}}></div>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontSize: '1.5rem'}}>
                                        Select flooding case (<img src='/water-solid.svg' width={20}/>) on the map.
                                    </div>
                                )}
                            </div>
                            {/* <div style={styles.btnContainer}>
                                <Button variant="outline-primary" onClick={() => alert('Clicked')} >
                                    Calculate Risk
                                </Button>
                            </div> */}
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
    }
}

export default NewSimulation;