import React, { useEffect, useRef,memo } from "react";
import { loadModules } from "esri-loader";
import TextField from '@mui/material/TextField';
import LeakDetection from "./LeakDetection";
import { requirePropFactory } from "@mui/material";
import { stack } from "d3";
import GeoData from '../Utils/Data/geoData.json'



export const SoilMap = () => {
    const mapRef = useRef();
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    useEffect(() => {
    loadModules(
      ["esri/config","esri/Map", "esri/views/SceneView", "esri/layers/FeatureLayer",  ],
      { css: true }
    ).then(([esriConfig, Map, SceneView, FeatureLayer,]) => {
        esriConfig.apiKey = "AAPK94903abfd629432a88f23cfcbab16804e7k-8SjOcKXFHLFBD0nX2rkQ_zBxjiHPnN4PfMhuBoghnB7DhhhYLqJPy-uQgOCh";
        const map = new Map({
            basemap: "hybrid",
          });

      // load the map view at the ref's DOM node
      const view = new SceneView({
        container: mapRef.current,
        map: map,
        center: [-113.437450863206,53.4102240122668],
        zoom: 9,
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false
          }
        }
      });


      const SoilsDataLayer = new FeatureLayer({
        url: "https://services2.arcgis.com/XSv3KNGfmrd1txPN/arcgis/rest/services/Soils_of_Canada_WFL1/FeatureServer"
      });

      map.add(SoilsDataLayer);

      return () => {
        if (view) {
          // destroy the map view

        }
      };
    });

});
return <div className="webmap" style={{height: '100%'}} ref={mapRef} />;

};

export default memo(SoilMap);