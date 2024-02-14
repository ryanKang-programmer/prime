import React, { useEffect, useRef,memo } from "react";
import { loadModules } from "esri-loader";
import GeoData from '../Utils/Data/geoData.json'
import getPump from "./pumpStation";

const {locData} = require('./BaseMaps.js');
const coordsArr = [];
export const MuskegMap = (props) => {
    const mapRef = useRef();
    const {setNode} = props;
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    useEffect(() => {
    loadModules(
      ["esri/config","esri/Map", "esri/views/SceneView", "esri/layers/FeatureLayer","esri/layers/GraphicsLayer", "esri/Graphic" ],
      { css: true }
    ).then(([esriConfig, Map, SceneView, FeatureLayer,GraphicsLayer,Graphic ]) => {
        esriConfig.apiKey = "AAPK94903abfd629432a88f23cfcbab16804e7k-8SjOcKXFHLFBD0nX2rkQ_zBxjiHPnN4PfMhuBoghnB7DhhhYLqJPy-uQgOCh";
        const map = new Map({
            basemap: "hybrid",
          });

      // load the map view at the ref's DOM node
      const view = new SceneView({
        container: mapRef.current,
        map: map,
        camera: {
          position: [-113.323975, 	53.631611, 5184],
          tilt: 80
        }
      });

      const peatlandLayer = new FeatureLayer({
        url: "https://services2.arcgis.com/BPanpTIPlgauyyhp/arcgis/rest/services/Global_Peatland_Distribution/FeatureServer"
      });

      map.add(peatlandLayer);
      const popupTemplate= {
        // autocasts as new PopupTemplate()
        title: "{Name}",

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content : [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "Name"
              },

              {
                fieldName: "Latitude"
              },
              {
                fieldName: "Longitude"
              },
              {
                fieldName: "Altitude"
              }
       
            ],
     
          },
        ],
      }
      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      console.log(GeoData[0][0]);

      coordsArr.push(GeoData);

      for( var h =0; h<GeoData.length; h++){

        const attributes={
          Name:"Node Number: "+h+" (Arbitrary Node)",
          Latitude : GeoData[h][1],
          Longitude : GeoData[h][0],
          Altitude : GeoData[h][2]
        }
      const point = {
        type: "point", // autocasts as new Point()
        x: locData[h][0],
        y:locData[h][1],
        z: locData[h][2]
      };

      const markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        width : 1,
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [226, 119, 40],
          width: 1
        }
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: attributes,
        popupTemplate : popupTemplate
      });

      graphicsLayer.add(pointGraphic);
    }

    view.popup.watch('selectedFeature',(obj) => {
      if (obj === null) {
        return;
      }
      const nodeId = obj?.attributes?.Name?.split('Node Number:')[1]?.split(' (')[0];

      let leakPositioning;

      if (nodeId == 0) {
          leakPositioning = 0;
      }
      else if (nodeId <= 1350) {
          leakPositioning = nodeId / 1350;
      }
      else if (nodeId <= 2580) {
          leakPositioning = (nodeId - 1350)/(2580 - 1350);
      }
      else if (nodeId <= 2850) {
          leakPositioning = (nodeId - 2580)/(2850 - 2580);
      }
      else if (nodeId <= 3390) {
          leakPositioning = (nodeId - 2850) / (3390 - 2850);
      }
      else if (nodeId <= 4560) {
          leakPositioning = (nodeId - 3390) / (4560 - 3390);
      }
      else if (nodeId <= 7016) {
          leakPositioning = (nodeId - 4560)/ (7016 - 4560);
      }
      else if (nodeId <= 8005) {
          leakPositioning = (nodeId - 7016) / (8005 - 7016);
      } else {
        leakPositioning = 1;
      }

      const param = {
        id: nodeId,
        lat: obj?.attributes?.Latitude,
        lng: obj?.attributes?.Longitude,
        pump: getPump(nodeId),
        position: Math.round(leakPositioning * 1000) / 1000,
      };

      setNode(param);
      // alert(1);
    })

      return () => {
        if (view) {
          // destroy the map view

        }
      };
    });

}, []);
return <div className="webmap" style={{height: '100%'}} ref={mapRef} />;

};

export default memo(MuskegMap);