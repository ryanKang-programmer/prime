// NOT BEING USED.
import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';

var long =0;
var lat =0;

function setCoords(x , y){

    long =x;
    lat = y;

}

const MapPoints = (props) => {

    const [graphic, setGraphic] = useState(null);
    useEffect(() => {

        loadModules(['esri/Graphic']).then(([Graphic]) => {
            // Create a polygon geometry
            const polyline = {
                type: "polyline", // autocasts as new Polygon()
                paths: [
                    [-113.356950616192,53.5487787521731],
                    [-113.36629583349,53.512236697973],
                    [-113.381239628637,53.4711909094966],
                    [-113.405630677499,53.4297633042764],
                    [-113.437450863206,53.4102240122668],
                    [-113.470773064644,53.3668539097147],
                    [-113.483405508952,53.3308356150573],
                    [-113.550743448617,53.3298451123017],
                    [-113.568423884194,53.3109234107413],
                    [-113.562018266786,53.2798647060548]
                ]
            };
             const simpleMarkerSymbol = {
                type: "simple-marker",
                color: [226, 119, 40],  // Orange
                outline: {
                    color: [255, 255, 255], // White
                    width: 1
                }
             };
             const zLongitude = [ -113.356950616192,
             -113.36629583349,
             -113.381239628637,
             -113.405630677499,
             -113.437450863206,
             -113.470773064644,
             -113.483405508952,
             -113.550743448617,
             -113.568423884194,
             -113.562018266786,]
             const zLatitude = [53.5487787521731,
                53.512236697973,
                53.4711909094966,
                53.4297633042764,
                53.4102240122668,
                53.3668539097147,
                53.3308356150573,
                53.3298451123017,
                53.3109234107413,
                53.2798647060548]
                
                
             for (var i=0; i< zLongitude.length; i++ ){
                // Create a point
                var point = {
                  type: "point",
                  longitude: zLongitude[i],
                  latitude: zLatitude[i],
                };
    
                const pointGraphic = new Graphic({
                  geometry: point,
                  symbol: simpleMarkerSymbol
                });

                setGraphic(pointGraphic);
                props.view.graphics.add(pointGraphic);
              }
              
             
            const popupTemplate = {
                title: "{Name}",
                content: "{Description}"

            }
            const attributes = {
                Name : "Edmonton - Leduc Segment",
                Description : "41.9KM Distance"
            }

            // Create a symbol for rendering the graphic
            const SimpleLineSymbol = {
                type: "simple-line", // autocasts as new SimpleFillSymbol()
                color: [0,250,0],
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 1
                }
            };

            // Add the geometry and symbol to a new graphic
            const graphic = new Graphic({
                geometry: polyline,
                symbol: SimpleLineSymbol,
                attributes: attributes,
                popupTemplate: popupTemplate
            });

            setGraphic(graphic);
            props.view.graphics.add(graphic);
     
        }).catch((err) => console.error(err));

        return function cleanup() {
            props.view.graphics.remove(graphic);
        };
    }, [ graphic, props ]);

    return null;

}

export default MapPoints;