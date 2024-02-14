import React, { useEffect, useRef, memo, useState } from "react";
import { loadModules } from "esri-loader";
import lat from './StressData/lat.json';
import long from './StressData/long.json';
import PiSAOutVMStress from './StressData/PiSAOutVMStress.json';
import Altitude from './AltKM.json';
import Distance from './TotDist.json';
import { Radio } from "react-loader-spinner";
import getPump from "../LeakDetection/pumpStation";
//console.log(lat[0]);
//console.log(long[0]);

//first index represents the node
//second index represents the timefram? 
console.log(PiSAOutVMStress[0][4])
var currentStress = 0;

var stressMatrix = [[], []];
console.log(PiSAOutVMStress[1].slice(3,));
var index = [];
for (var i = 0; i < PiSAOutVMStress.length; i++) {
  stressMatrix[i] = PiSAOutVMStress[i].slice(3,);
}
for (var i = 0; i < PiSAOutVMStress[0].length - 3; i++) {
  index[i] = i;
}
console.log("here is the stress matrix");
console.log(stressMatrix);
console.log(PiSAOutVMStress[0][0])
console.log(PiSAOutVMStress[0][1])
console.log(PiSAOutVMStress[0][2])
console.log(PiSAOutVMStress[1][0])
console.log(PiSAOutVMStress[1][1])
console.log(PiSAOutVMStress[1][2])
console.log(PiSAOutVMStress[2][0])
console.log(PiSAOutVMStress[2][1])
console.log(PiSAOutVMStress[2][2])
let stressmap = index.map((time, ix) => ({ time, Stress: stressMatrix[0][ix] }));

let alt = Distance.map((TotalDistance, ix) => ({ TotalDistance, PipelineAltitude: Altitude[ix] }));
export const BaseMaps = (props) => {
  const [isLoad, setIsLoad] = useState(false);
  const mapRef = useRef();
  const expandRef = useRef();
  const { setNoder } = props;

  useEffect(() => {
    let view;
    setIsLoad(true);
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/BasemapGallery",
      "esri/Graphic",
      "esri/popup/content/support/ChartMediaInfoValue",
      "esri/popup/content/LineChartMediaInfo",
      "esri/widgets/Expand",
    ],
      { css: true }
    ).then(([ArcGISMap, MapView, BasemapGallery, Graphic, ChartMediaInfoValue, LineChartMediaInfo, Expand]) => {
      const map = new ArcGISMap({
        basemap: "streets-vector"
      });
      let editor, features;
      // load the map view at the ref's DOM node
      view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-113.437450863206, 53.4102240122668],
        zoom: 9
      });

      view.when(function(){
        setIsLoad(false);
      })
      
      // const basemapGallery = new BasemapGallery({
      //   view: view,
      //   container: expandRef.current,
      // });

      var basemapGallery = new BasemapGallery({
        view,
      });

      // basemapGallery.headingLevel = 2;

      // view.ui.add(basemapGallery, {
      //   position: "top-left",
      //   width: 1
      // });
      
      // Create an Expand instance and set the content
      // property to the DOM node of the basemap gallery widget
      
      const bgExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        view,
        content: basemapGallery,
        // container: expandRef.current,
      });

      // // Add the expand instance to the ui

      basemapGallery.watch("activeBasemap", () => {
        const mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";

        if (mobileSize) {
          bgExpand.collapse();
        }
      });
      
      view.ui.add(bgExpand, "top-right");

      let lineChartValue = new ChartMediaInfoValue({
        fields: [stressmap],
        normalizeField: null,
        tooltipField: "Stress"
      });

      // Create the LineChartMediaInfo media type
      let lineChart = new LineChartMediaInfo({
        title: "<b>Count by type</b>",
        caption: "Per block",
        value: lineChartValue
      });

      var zLongitude = long
      var zLatitude = lat

      const arr = [];

      console.log("heeyehhehehehehe")
      console.log(PiSAOutVMStress[0][3])
      console.log(PiSAOutVMStress[1][3])
      console.log(PiSAOutVMStress[2][3])
      console.log(PiSAOutVMStress[3][3])
      console.log(PiSAOutVMStress[4][3])
      console.log(PiSAOutVMStress[5][3])

      var largest = 0
      var mean = 0
      const N = PiSAOutVMStress[0].length;
      const editThisAction = {
        title: "SELECT",
        id: "edit-this",
        className: "esri-icon-edit"
      };
      const yax = Array.from(Array(N + 1).keys()).slice(1);
      const popupTemplate = {
        title: "{Name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "Name"
              },
              {
                fieldName: "VonMisesStress"
              },
              {
                fieldName: "Latitude"
              },
              {
                fieldName: "Longitude"
              },
              {
                fieldName: "Stress",
                visible: false
              }
            ],

          },
    
        ],
        actions: [editThisAction]
      }
      for (var i = 0; i < long.length; i++) {
        arr[i] = [zLatitude[i] * (180 / 3.14159265359), zLongitude[i] * (180 / 3.14159265359)];
      }
      const polyline = {
        type: "polyline", // autocasts as new Polygon()
        paths: [arr]
      };

      const lineSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: [0, 0, 0],
        width: 1
      };

      const polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: lineSymbol,
      });

      view.graphics.add(polylineGraphic);

      var inputCoord = {
        table: []
      };

      for (var i = 0; i < long.length; i++) {
        //console.log(arr[i]);
        mean += PiSAOutVMStress[i][3];
        if (PiSAOutVMStress[i][3] > largest) {
          largest = PiSAOutVMStress[i][3];
        }
        // console.log(PiSAOutVMStress[i][3]);
        currentStress = PiSAOutVMStress[i][3];
        // Create a point
        var point = {
          type: "point",
          latitude: zLongitude[i] * (180 / 3.14159265359),
          longitude: zLatitude[i] * (180 / 3.14159265359),
        };

        var j = i + 1;
        
        //only the third index works since the static on displays 1 stress
        var stressholder = (PiSAOutVMStress[i][3]).toFixed(3)
        const attributes = {
          Name: "Node Number: " + j + " (Arbitrary Node)",
          VonMisesStress: stressholder / 1000000 + " (MPa)",
          Latitude: zLatitude[i] * (180 / 3.14159265359),
          Longitude: zLongitude[i] * (180 / 3.14159265359),
          xaxis: alt,

        }
        // const attributes2 = {
        //   Name: "Node Number: " + j + " (Pump Station)",
        //   VonMisesStress: "Von Mises Stress is : " + stressholder + " Mega Pascals",
        //   Length: " joe",
        //   Xaxis: PiSAOutVMStress[i],


        // }
        // console.log("printing out the von mises stress value "+PiSAOutVMStress[i][0]);
        if (PiSAOutVMStress[i][3] < 28838078.267315757) {
          //return [105, 179, 76];
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [105, 179, 76],  // Orange
            outline: {
              color: [105, 179, 76], // White
              width: 1
            }
          };
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate
          });

          view.graphics.add(pointGraphic);
        }
        if (PiSAOutVMStress[i][3] == 28838078.267315757) {
          //return [250, 183, 51];
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [250, 183, 51],  // Orange
            outline: {
              color: [250, 183, 51], // White
              width: 1
            }
          };
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate
          });

          view.graphics.add(pointGraphic);
        }

        if (PiSAOutVMStress[i][3] > 28838078.267315757) {
          //return [255, 13, 13];
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [255, 13, 13],  // Orange
            outline: {
              color: [255, 13, 13], // White
              width: 10
            }
          };

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate
          });

          view.graphics.add(pointGraphic);
        }

        if (i == 0 || i == 1350 || i == 2580 || i == 2850 || i == 3390 || i == 4560 || i == 7016 || i == 8005) {
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [0, 0, 255],  // Orange
            outline: {
              color: [0, 0, 0], // White
              width: 10
            }
          };

          const attributes = {
            Name: "Node Number: " + j + " (PUMP STATION)",
            VonMisesStress: stressholder + " (MPa)",
            Latitude: zLatitude[i] * (180 / 3.14159265359),
            Longitude: zLongitude[i] * (180 / 3.14159265359),
            xaxis: alt

          }

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate
          });

          view.graphics.add(pointGraphic);
        }
      }
      
      // console.log("the largest is : ")
      // console.log(largest)
      // console.log("the mean is : ")
      // console.log(mean / 8005)

      var holder = [];
      function measureThis() {
        console.log("the edit button was pressed!!!");
        console.log(view.popup.selectedFeature.attributes.Latitude);
        inputCoord.table.push({ long: view.popup.selectedFeature.attributes.Longitude, lat: view.popup.selectedFeature.attributes.Longitude });
        var point = {
          type: "point",
          latitude: view.popup.selectedFeature.attributes.Longitude,
          longitude: view.popup.selectedFeature.attributes.Latitude,
        };


        const attributes = {
          Name: "Node Number: " + j + " (Arbitrary Node)",
          VonMisesStress: PiSAOutVMStress[i][3] + " (Pa)",
          Latitude: view.popup.selectedFeature.attributes.Longitude,
          Longitude: view.popup.selectedFeature.attributes.Latitude,
          xaxis: alt

        }
        const simpleMarkerSymbol = {
          type: "simple-marker",
          color: [106, 13, 174],  // Orange
          outline: {
            color: [106, 13, 174], // White
            width: 20
          }
        };
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          attributes: attributes,
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
        holder.push(pointGraphic);
        if (holder.length == 3) {
          holder[0].symbol = simpleMarkerSymbolReset;
          holder[1].symbol = simpleMarkerSymbolReset;
          holder = [];
          holder.push(pointGraphic);

        }
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
          measureThis();
        }
      });
      
      view.popup.watch('selectedFeature', (obj) => {
        if (obj === null) {
          return;
        }

        const nodeId = obj?.attributes?.Name?.split('Node Number:')[1]?.split(' (')[0];

   
        const param = {
          id: nodeId,
          lat: obj?.attributes?.Latitude,
          lng: obj?.attributes?.Longitude,
          pump: getPump(nodeId),
        
        };

        setNoder(param);
        // alert(1);
      })

    }).catch(() => {
      alert('Error occured')
      setIsLoad(false);
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
      <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          <Radio
            colors={['#51E5FF', '#7DE2D1', '#FF7E6B']}
          />
          <div class='waviy' style={{display: 'flex'}}>
            <h1 style={{color: 'white'}}>Loading</h1><span>.</span><span>.</span><span>.</span>
          </div>
      </div> : null}
      <div className="webmap" style={{height: '100%'}} ref={mapRef} />
      <div ref={expandRef} style={{width: 40, padding: 10}}></div>
    </>
    );
};

export default memo(BaseMaps);