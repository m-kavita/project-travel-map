import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoia2F2aXRhLW0iLCJhIjoiY2t6eHI1MDE5MDFxZzJ5czBkcGgxYnc3cSJ9.A_e5omC4geboxl5q00bJnQ';

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(13.0138);
  const [lat, setLat] = useState(26.9115);
  const [zoom, setZoom] = useState(1.66);

  useEffect(() => {
  if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/kavita-m/cl08ayfiw000c15o3e9q8ur3f',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
  if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  //checking map hover - 1
  useEffect(() => {
  if (!map.current) return;
    map.current.on('load', () => {
    map.current.addSource('cbs', {
    'type': 'geojson',
    'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
    });

    map.current.addLayer({
      'id': 'cf',         // country-fills
      'type': 'fill',
      'source': 'cbs',
      'layout': {},
      'paint': {
      'fill-color': '#BFBAAD',
      'fill-opacity': 0.1
      }
    });
    
    map.current.addLayer({
    'id': 'cb',         // country-borders
    'type': 'line',
    'source': 'cbs',
    'layout': {},
    'paint': {
    'line-color': '#BFBAAD',
    'line-width': 1
    }
    });

    map.current.addLayer({
      "id": "cfh",  // country-fills-hover,
      "type": "fill",
      "source": "cbs",
      "layout": {},
      "paint": {
          "fill-color": "#BFBAAD",
          "fill-opacity": 0.5
      },
      "filter": ["==", "name", ""]
    });

    // When the user moves their mouse over the page, we look for features
    // at the mouse position (e.point) and within the states layer (states-fill).
    // If a feature is found, then we'll update the filter in the state-fills-hover
    // layer to only show that state, thus making a hover effect.
    map.current.on("mousemove", function(e) {
        var features = map.current.queryRenderedFeatures(e.point, { layers: ["cf"] });
        
        if (features.length) {
            map.current.getCanvas().style.cursor = 'pointer';
            map.current.setFilter("cfh", ["==", "name", features[0].properties.name]);
            } else {
            map.current.setFilter("cfh", ["==", "name", ""]);
            map.current.getCanvas().style.cursor = 'default';
        }
    });
  
    // Reset the state-fills-hover layer's filter when the mouse leaves the map
    map.current.on("mouseout", function() {
        map.current.getCanvas().style.cursor = 'auto';
        map.current.setFilter("cfh", ["==", "name", ""]);
    });
    
    map.current.on("click", function(e) {
      var features = map.current.queryRenderedFeatures(e.point, { layers: ["cf"] });
      if (features.length) {
        console.log(e, features[0].properties.name);
      }
    });

    // When a click event occurs on a feature in the states layer,
    // open a popup at the location of the click, with description
    // HTML from the click event's properties.
    map.current.on('click', 'cfh', (e) => {
    });
    
    // Change the cursor to a pointer when
    // the mouse is over the states layer.
    var popupbox = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      closeOnMove: true,
      maxWidth: "300px"
    });

    map.current.on('mouseenter', 'cfh', (e) => {
      if (!e.features.length) {
        popupbox.remove();
        return;
      };
    
      popupbox.setLngLat(e.lngLat)
      .setHTML('<h1>Country: </h1>'+e.features[0].properties.name)
      .addTo(map.current);
      map.current.getCanvas().style.cursor = 'pointer';
    });
   
    // Change the cursor back to a pointer
    // when it leaves the states layer.
    map.current.on('mouseleave', 'cfh', (e) => {
      popupbox.remove();
      map.current.getCanvas().style.cursor = 'default';
    });

  });
});
//end of map hover

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div>
      <div ref={mapContainer} className='h-screen' />
      </div>
    </div>
  );
}

export default Map;