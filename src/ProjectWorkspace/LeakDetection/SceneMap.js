import React, { useEffect, useRef, memo, useState } from "react";
import { loadModules } from "esri-loader";
import { Radio } from "react-loader-spinner";
import getPump from "./pumpStation";

const { locData } = require('./BaseMaps.js');
//still need to figure out how to utilize the selected node within the sceneview map .
var inputCoord = {
  table: []
}
export const SceneMap = (props) => {
  const {setNode} = props;
  const mapRef = useRef();
  const [isLoad, setIsLoad] = useState(false);

  // lazy load the required ArcGIS API for JavaScript modules and CSS
  useEffect(() => {
    setIsLoad(true);

    loadModules(
      ["esri/config", "esri/Map", "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/Graphic"],
      { css: true }
    ).then(([esriConfig, Map, SceneView, GraphicsLayer, Graphic]) => {
      esriConfig.apiKey = "AAPK0080788afd03490c9a4bee696c521857Tg4SrLo03jptSPFGwWPg45Pe5ZOf1ESgFBF1M7MPeYfS7Nwqr0gsrxEMjpy-6b9v";
      const map = new Map({
        basemap: "hybrid",
        ground: "world-elevation",
      });
      const editThisAction = {
        title: "Select Node",
        id: "edit-this",
        className: "esri-icon-favorites"
      };
      // load the map view at the ref's DOM node
      const view = new SceneView({
        container: mapRef.current,
        map: map,
        camera: {
          position: [locData[0][0], locData[0][1], 5184],
          tilt: 4
        }
      });

      view.when(function(){
        setIsLoad(false);
      })

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const popupTemplate = {
        // autocasts as new PopupTemplate()
        title: "{Name}",

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
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
        actions: [editThisAction]
      }

      for (var h = 0; h < locData.length; h++) {

        const attributes = {
          Name: "Node Number: " + h + " (Arbitrary Node)",
          Latitude: locData[h][1],
          Longitude: locData[h][0],
          Altitude: locData[h][2]
        }
        const point = {
          type: "point", // autocasts as new Point()
          x: locData[h][0],
          y: locData[h][1],
          z: locData[h][2]
        };

        const markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40],
          width: 1,
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
          popupTemplate: popupTemplate
        });

        graphicsLayer.add(pointGraphic);
      }

      const polyline = {
        type: "polyline", // autocasts as new Polyline()
        paths: locData
      };
      console.log("printing locData");
      console.log(locData);

      const lineSymbol = {
        type: "simple-line",
        color: [226, 119, 40],
        width: 20
      };

      const polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: lineSymbol,
        style: "solid"
      });

      graphicsLayer.add(polylineGraphic);
      var holder = [];


      function selectNode() {
        console.log("the edit button was pressed!!!");
        console.log(view.popup.selectedFeature.attributes.Latitude);
        inputCoord.table.push({ long: view.popup.selectedFeature.attributes.Longitude, lat: view.popup.selectedFeature.attributes.Latitude });
        var point = {
          type: "point",
          x: view.popup.selectedFeature.attributes.Latitude,
          y: view.popup.selectedFeature.attributes.Longitude,
          z: view.popup.selectedFeature.attributes.Altitude
        };


        const attributesNew = {
          Name: view.popup.selectedFeature.attributes.Name,
          Latitude: view.popup.selectedFeature.attributes.Longitude,
          Longitude: view.popup.selectedFeature.attributes.Latitude,
          Altitude: view.popup.selectedFeature.attributes.Altitude

        }
        const simpleMarkerSymbol = {
          type: "simple-marker",
          color: [106, 13, 174],  // Orange
          outline: {
            color: [106, 13, 174], // White
            width: 500
          }
        };
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          attributes: attributesNew,
          popupTemplate: popupTemplate
        });
        const simpleMarkerSymbolReset = {
          type: "simple-marker",
          color: [250, 183, 51],  // Orange
          outline: {
            color: [250, 183, 51], // White
            width: 1
          }
        };
        console.log(inputCoord);
        holder.push(pointGraphic);
        if (holder.length == 3) {
          holder[0].symbol = simpleMarkerSymbolReset;
          holder[1].symbol = simpleMarkerSymbolReset;
          holder = [];
          holder.push(pointGraphic);

        }
        console.log(holder.length);
        view.graphics.add(pointGraphic);
        view.popup.content =
          "Currently Selected Node" +
          view.popup.selectedFeature.attributes.Latitude +
          "<div style='background-color:DarkGray;color:white'> " +
          view.popup.selectedFeature.attributes.Longitude +
          " </div>";

      }
      view.popup.on("trigger-action", (event) => {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "edit-this") {
          selectNode();

        }
      });

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
  return (
    <>
      {isLoad ?
      <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          <Radio
            colors={['#51E5FF', '#7DE2D1', '#FF7E6B']}
          />
          <div class='waviy' style={{display: 'flex'}}>
            <h1 style={{color: 'white'}}>Loading</h1><span>.</span><span>.</span><span>.</span>
          </div>
      </div> : null}
      <div className="webmap" style={{height: '100%'}} ref={mapRef} />
    </>);

};

export default memo(SceneMap);