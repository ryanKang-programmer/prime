import React, { useEffect, useRef,memo } from "react";
import { loadModules } from "esri-loader";
import TextField from '@mui/material/TextField';
import LeakDetection from "./LeakDetection";
import { requirePropFactory } from "@mui/material";
import { stack } from "d3";
import GeoData from '../Utils/Data/geoData.json'



export const Vegetation = () => {
    const mapRef = useRef();
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    useEffect(() => {
    loadModules(
      ["esri/config","esri/Map", "esri/views/SceneView", "esri/layers/FeatureLayer" ],
      { css: true }
    ).then(([esriConfig, Map, SceneView, FeatureLayer ]) => {
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

      const VegetationLayer = new FeatureLayer({
        url: "https://maps-cartes.services.geo.ca/server_serveur/rest/services/NRCan/vegetation_zones_of_canada_2020_en/MapServer"
      });

      map.add(VegetationLayer);

      return () => {
        if (view) {
          // destroy the map view

        }
      };
    });

});
return <div className="webmap" style={{height: '100%'}} ref={mapRef} />;

};

export default memo(Vegetation);