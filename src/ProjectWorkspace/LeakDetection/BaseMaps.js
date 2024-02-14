import React, { useEffect, useRef, memo, useState } from "react";
import { loadModules } from "esri-loader";
import GeoData from '../Utils/Data/geoData.json'
import Pressure from '../Utils/Data/pressure.json'
import lat from '../StressAnalysis/StressData/lat.json';
import long from '../StressAnalysis/StressData/long.json';
import { what } from './LeakDetection.js';
import { Radio } from "react-loader-spinner";
import '../../../src/common.css'
import getPump from "./pumpStation";

import ldb from 'localdata';
import Chart from 'chart.js/auto';

var inputCoord = {
  table: []
};
var presArr = [];
var arr = [0];
var locData = [];

// ldb.get('JSONOBJECT', function (jsontest) {
//   console.log('And the value is', jsontest);
//   Pressure = jsontest.Pressure;
// });


for (let i = 0; i < lat.length; i++) {
  locData[i] = [lat[i] * (180 / 3.14159265359), long[i] * (180 / 3.14159265359), GeoData[0][2]];
}

export const BaseMaps = (props) => {
  const [isLoad, setIsLoad] = useState(false);
  const mapRef = useRef();
  var nodeNum = 0;
  const { setNode } = props;

  useEffect(() => {
    setIsLoad(true);
    let view;

    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/PopupTemplate", "esri/core/promiseUtils", "esri/widgets/BasemapGallery", "esri/Graphic", "esri/layers/FeatureLayer", "esri/popup/content/CustomContent", "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/domReady!"],
      { css: true }
    ).then(([ArcGISMap, MapView, PopupTemplate, BasemapGallery, promiseUtils, Graphic, FeatureLayer, CustomContent, domConstruct, domReady]) => {
      const map = new ArcGISMap({
        basemap: "hybrid"
      });

      // load the map view at the ref's DOM node
      view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-113.437450863206, 53.4102240122668],
        zoom: 9,
        popup: {
          dockEnabled: true,
          dockOptions: {
            position: 'top-right',
            buttonEnabled: false,
            breakpoint: false
          }
        }
      });

      view.when(function () {
        setIsLoad(false);
      })

      const editThisAction = {
        title: "Select Node",
        id: "edit-this",
        className: "esri-icon-favorites"
      };

      // const popupTemplate = {
      //   // autocasts as new PopupTemplate()
      //   title: "{Name}",
      //   // Set content elements in the order to display.
      //   // The first element displayed here is the fieldInfos.
      //   content: [
      //     {
      //       type: "fields",
      //       fieldInfos: [
      //         { fieldName: "Name" },
      //         { fieldName: "Latitude" },
      //         { fieldName: "Longitude" },
      //         { fieldName: "Altitude" },
      //         { fieldName: "Pressure" },
      //       ],
      //     },
      //   ],
      //   actions: [editThisAction]
      // }

      // console.log("printing pressurehere  !11")
      // console.log(Pressure[0][0]);
      // console.log(Pressure[99][Pressure[0].length - 1]);
      // console.log(Pressurelength);

      var zLatitude = lat;
      var zLongitude = long;

      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
          color: [226, 119, 40], // White
          width: 1
        }
      };

      const simpleMarkerSymbol2 = {
        type: "simple-marker",
        color: [0, 0, 225],  // Orange
        outline: {
          color: [0, 0, 225], // White
          width: 1
        }
      };
      let customContent = new CustomContent({
        outFields: ["*"],
        creator: (event) => {
          console.log("inside custom content");
          let canvas = createChart();


          let div = document.createElement("div");
          div.appendChild(canvas);
          return div;
        },
      });
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
              },
              {
                fieldName: "Pressure"
              },


            ],


          },
          customContent
        ],
        actions: [editThisAction]
      }
      console.log("pressure object", Pressure)
      let lineChart;
      //use this to make a graph for each point for the pressure time steps
      function createChart() {
        let canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = 416;
        canvas.height = 208;
        const ctx = canvas.getContext("2d");
        const config = {
          type: "line",
          data: {
            labels: ["val1", "val2", "val3", "val4", "val5"],
            datasets: [{
              data: [10, 50, 100, 150, 200],
              label: "Values",
              borderColor: "#3e95cd",
              fill: false,
            },],
          },
        };
        console.log("creating chart");
        lineChart = new Chart(canvas, config);
        return canvas;
      }


      for (var i = 0; i < long.length; i++) {
        arr[i] = [zLatitude[i] * (180 / 3.14159265359), zLongitude[i] * (180 / 3.14159265359)];
      }
      console.log("printing arr", arr);
      const polyline = {
        type: "polyline", // autocasts as new Polygon()
        paths: [arr]
      };

      const lineSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: [226, 119, 40],
        width: 10
      };

      const polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: lineSymbol,
      });

      view.graphics.add(polylineGraphic);

      for (var k = 0; k < Pressure[0].length; k++) {
        presArr[k] = (Pressure[Pressure.length - 1][k] / 1000000).toFixed(3);
      }
      // console.log(presArr[0]);
      for (var i = 0; i < long.length; i++) {
        //   var La = GeoData[i][0];
        //  var lo = GeoData[i][1];
        //  var Alti = GeoData[i][2]; 
        map.popupTemplate = popupTemplate;

        // Create a point
        var point = {
          type: "point",
          latitude: zLongitude[i] * (180 / 3.14159265359),
          longitude: zLatitude[i] * (180 / 3.14159265359),
        };

        var j = i + 1;
        nodeNum = j;

        //const pres= Pressure[i][0]
        const attributes = {
          Name: i == 0 || i == GeoData.length - 1 ? "Node Number: " + j + " (Pump Station)" : "Node Number: " + j + " (Arbitrary Node)",
          Latitude: zLatitude[i] * (180 / 3.14159265359),
          Longitude: zLongitude[i] * (180 / 3.14159265359),
          Altitude: 0 + " m",
          Pressure: Pressure[0][i] + " Pa",
          ID : i
        }

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: i == 0 || i == GeoData.length - 1 ? simpleMarkerSymbol2 : simpleMarkerSymbol,
          attributes: attributes,
          popupTemplate: popupTemplate
        });
 

        view.graphics.add(pointGraphic);

        if (i == 0 || i == 1350 || i == 2580 || i == 2850 || i == 3390 || i == 4560 || i == 7016 || i == 8005) {
          let pumpSymbol = {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "https://static.arcgis.com/images/Symbols/Utilities/Sewer/SewerDevice-ReliefValve.png",
            width: "70px",
            height: "70px"
          };
         
          const attributes = {
            Name: "Node Number: " + j + " (Pump Station)",
            Latitude: zLatitude[i] * (180 / 3.14159265359),
            Longitude: zLongitude[i] * (180 / 3.14159265359),
            Altitude: 0 + " m",
            Pressure: presArr[i] + " MPa"

          }
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: pumpSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate
          });

          view.graphics.add(pointGraphic);
        }
      }

      var holder = [];

      function selectNode() {
        inputCoord.table.push({ long: view.popup.selectedFeature.attributes.Longitude, lat: view.popup.selectedFeature.attributes.Latitude });

        var point = {
          type: "point",
          latitude: view.popup.selectedFeature.attributes.Longitude,
          longitude: view.popup.selectedFeature.attributes.Latitude,
          Altitude: view.popup.selectedFeature.attributes.Altitude,
          Pressure: view.popup.selectedFeature.attributes.Pressure
        };


        const attributesNew = {
          Name: "Node Number: " + j + " (Arbitrary Node)",
          Latitude: view.popup.selectedFeature.attributes.Longitude,
          Longitude: view.popup.selectedFeature.attributes.Latitude,
          Altitude: view.popup.selectedFeature.attributes.Altitude,
          Pressure: view.popup.selectedFeature.attributes.Pressure

        }
        const simpleMarkerSymbol = {
          type: "simple-marker",
          color: [106, 13, 174],  // Orange
          outline: {
            color: [106, 13, 174], // White
            width: 204
          }
        };

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          attributes: attributesNew,
          popupTemplate: popupTemplate
        });

        view.graphics.add(pointGraphic);

        const simpleMarkerSymbolReset = {
          type: "simple-marker",
          color: [226, 119, 40],  // Orange
          outline: {
            color: [226, 119, 40], // White
            width: 1
          }
        };

        holder.push(pointGraphic);
        if (holder.length == 2) {
          holder[0].symbol = simpleMarkerSymbolReset;
          holder = [];
          holder.push(pointGraphic);

        }
        console.log(holder.length);
        console.log("do we get ehre? ");
        what();

        view.popup.content =
          "Currently Selected Node" + "<div style='background-color:DarkGray;color:white'> " +
          view.popup.selectedFeature.attributes.Latitude +
          "<div style='background-color:DarkGray;color:white'> " +
          view.popup.selectedFeature.attributes.Longitude +
          " </div>";
      }
  
      function renderGraphs() {
        let canvas = document.createElement("canvas");

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = 416;
        canvas.height = 208;
        const ctx = canvas.getContext("2d");
        let lab = [];
        let Pressures = [];
        let nodenumber = view.popup.selectedFeature.attributes.ID;
        console.log("this is the node number", nodenumber);
        for (let i = 0; i < Pressure.length; i++) {
          //console.log(Pressure[i][nodenumber]);
          lab.push(i);
          Pressures.push(Pressure[i][nodenumber]);
        }
        console.log("Pressures", Pressures);
        const config = {
          type: "line",
          data: {
            labels: lab,
            datasets: [{
              data: Pressures,
              label: "Pressure",
              borderColor: "#3e95cd",
              fill: false,

            },],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Timestep"
                }
              },
              y: {
                title: {
                  display: true,
                  text: "Pressure (Pa)"
                }
              }
            },
            plugins: {
             
            }
          }
        };
        console.log("creating chart");
        lineChart = new Chart(canvas, config);
        view.popup.content = canvas;
      }

      view.popup.on("trigger-action", (event) => {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "edit-this") {
          selectNode();
          renderGraphs();
        }
      });

      view.popup.watch('selectedFeature', (obj) => {
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

    })
      .catch(e => {
        console.log(e);
      }).finally(() => {
        // setIsLoad(false);
      });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <>
      {isLoad ?
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Radio
            colors={['#51E5FF', '#7DE2D1', '#FF7E6B']}
          />
          <div class='waviy' style={{ display: 'flex' }}>
            <h1 style={{ color: 'white' }}>Loading</h1><span>.</span><span>.</span><span>.</span>
          </div>
        </div> : null}
      <div className="webmap" style={{ height: '100%' }} ref={mapRef} />
    </>
  );

};

export function inputs() {
  return inputCoord;
}

export var inputCoord;
export var locData;
export var arr;
export default memo(BaseMaps);