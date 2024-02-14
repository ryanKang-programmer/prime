import React, { useEffect, useRef, useState } from 'react';
import { Viewer, CameraFlyTo, Camera } from "resium";
import Button from 'react-bootstrap/Button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Cartesian3, Math as CMath, Color, Cartesian2, ArcGisMapServerImageryProvider, Rectangle, ScreenSpaceEventHandler,
    ScreenSpaceEventType, Cartographic, KeyboardEventModifier, VerticalOrigin, PinBuilder, Matrix4, ParticleSystem,
    SphereEmitter, ArcGISTiledElevationTerrainProvider, ImageryLayer } from 'cesium';
import lat from '../StressAnalysis/StressData/lat.json';
import lon from '../StressAnalysis/StressData/long.json';
import "./NewSimulation.css";
import { handleAuthRedirect } from 'realm-web';
import particle from '../../Images/circular_particle.png'

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
    const pinBuilder = new PinBuilder();
    let rain;

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

            console.log(waterCrossing);
            
            imageryLayers.add(waterCrossing)

            console.log(imageryLayers);
        }

        if (imageryLayers) {
            //addLayer();
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
            handler.setInputAction((movement) => {
                const cartesian = viewer.current?.cesiumElement?.camera.pickEllipsoid(
                    movement.position,
                    scene.globe.ellipsoid
                );
                if (cartesian) {
                    const cartographic = Cartographic.fromCartesian(
                    cartesian
                    );

                    const position = [cartographic.longitude, cartographic.latitude];
                    console.log(twoPointsRef.current);
                    if (twoPointsRef.current === null) {
                        setTwoPoints([position, undefined]);
                    } else {
                        if (twoPointsRef.current[0] === undefined && twoPointsRef.current[1] === undefined) {
                            setTwoPoints([position, undefined]);
                            drawFlag(true, position);
                        } else if (twoPointsRef.current[0] !== undefined && twoPointsRef.current[1] === undefined) {
                            setTwoPoints([twoPointsRef.current[0], position]);
                            drawFlag(false, position);
                        } else if (twoPointsRef.current[0] !== undefined && twoPointsRef.current[1] !== undefined) {
                            viewer.current?.cesiumElement?.entities?.removeById('From')
                            viewer.current?.cesiumElement?.entities?.removeById('To')
                            viewer.current?.cesiumElement?.entities?.removeById('rectangle')
                            setTwoPoints([position, undefined]);
                            drawFlag(true, position);
                        }
                    }
                }
            }, ScreenSpaceEventType.LEFT_CLICK, KeyboardEventModifier.SHIFT);
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
            const params = {x: (Cartesian3.fromRadians(...twoPoints[0]).x + Cartesian3.fromRadians(...twoPoints[1]).x) / 2,
            y: (Cartesian3.fromRadians(...twoPoints[0]).y + Cartesian3.fromRadians(...twoPoints[1]).y) / 2,
            z: 5000000}
            startRain(params);
        }

    }, twoPoints);

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

    return (
        <div class={'lower'} style={{display: 'flex', height: '100%', width: '100%', flexDirection: 'column'}}>
            <div class={'container-fluid'} style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <div class={'row'} style={{height: '100%', width: '100%'}}>
                    <div style={{flex: 0.5, height: '100%', position: 'relative'}}>
                        <Viewer full ref={viewer} {...viewerOption} >
                            <Camera ref={camera} onMoveEnd={() => getPosition()}/>
                        </Viewer>
                        <div style={{position: 'absolute', top: 0, left: 0, width: '15vw',backgroundColor: 'lightgray', padding: '0.5rem', display: 'flex', flexDirection: 'column', ...styles.shadowBox}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>From</span>
                                <span>{twoPoints[0] === undefined ? 'Not Selected' : `${(twoPoints[0][0] * 180 / Math.PI).toFixed(3)}, ${(twoPoints[0][1] * 180 / Math.PI).toFixed(3)}`}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>To</span>
                                <span>{twoPoints[1] === undefined ? 'Not Selected' : `${(twoPoints[1][0] * 180 / Math.PI).toFixed(3)}, ${(twoPoints[1][1] * 180 / Math.PI).toFixed(3)}`}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{flex: 0.5, height: '100%', position: 'relative'}}>
                        <div className='tabber' style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', paddingRight: '.5rem'}}>
                            <Tabs>
                                <TabList>
                                    <Tab>New Simulation</Tab>
                                    <Tab>Result</Tab>
                                </TabList>
                                <TabPanel>
                                <div>
                                    <h3> Disaster type </h3>
                                    <div style={{padding: '1rem'}}>
                                        <div>
                                            <input type={'radio'} name={'disaster'} id={'Wildfire'}/>
                                            <label style={{...styles.label}} for={'Wildfire'}>Wildfire</label>
                                        </div>
                                        <div>
                                            <input type={'radio'} name={'disaster'} id={'Earthquake'}/>
                                            <label style={{...styles.label}}  for={'Earthquake'}>Earthquake</label>
                                        </div>
                                        <div>
                                            <input type={'radio'} name={'disaster'} id={'Flood'}/>
                                            <label style={{...styles.label}}  for={'Flood'}>Flood</label>
                                        </div>
                                        <div>
                                            <input type={'radio'} name={'disaster'} id={'Blizzard'}/>
                                            <label style={{...styles.label}}  for={'Blizzard'}>Blizzard</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3>Parameter profile</h3>
                                    <div style={{padding: '1rem'}}>
                                        <div>
                                            <input type={'radio'} name={'profile'} id={'Default'}/>
                                            <label style={{...styles.label}}  for={'Default'}>Default</label>
                                        </div>
                                        <div>
                                            <input type={'radio'} name={'profile'} id={'Custom'}/>
                                            <label style={{...styles.label}}  for={'Custom'}>Custom 1</label>
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.btnContainer}>
                                    <Button variant="outline-primary" onClick={() => alert('Clicked')} >
                                        Submit Inputs
                                    </Button>
                                </div>
                                </TabPanel>
                                <TabPanel>
                                </TabPanel>
                            </Tabs>
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