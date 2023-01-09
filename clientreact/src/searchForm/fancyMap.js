import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
//import './_fancyMap.scss';
import base from "../base";
import * as ReactDOM from 'react-dom';
import _centerMarker from '../img/center.svg';
import _marker1 from '../img/m1.svg';
import _marker2 from '../img/m2.svg';
import _marker3 from '../img/m3.svg';
import _marker4 from '../img/m4.svg';
import _marker5 from '../img/m5.svg';
import _marker6 from '../img/m6.svg';
import _marker7 from '../img/m7.svg';
import _marker8 from '../img/m8.svg';
import _marker9 from '../img/m9.svg';
import _marker10 from '../img/m10.svg';


export default function Map(props){
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng,setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom] = useState(11);
  const [theme,setTheme] = useState(props.theme);
  //const [API_KEY] = useState('JmWkWCCVOHGr3jjU9XFl');
  //6wC04qdD2l62vv5ZOnUd9Sr1zgr5y9aveTdOVXcXLmLXmf77ShlFngdXITbtnHTq
  
  
  useEffect(() => {
   setLat(props.lat);
   setLng(props.lng);
    if (map.current && theme===props.theme) return;
    setTheme(props.theme)
    const markerHeight = 35, markerRadius = 10, linearOffset = 10;
   const popupOffsets = {
   'top': [0, 0],
   'top-left': [0,0],
   'top-right': [0,0],
   'bottom': [0, -markerHeight],
   'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
   'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
   'left' : [markerRadius, (markerHeight - markerRadius) * -1],
   'right' : [-markerRadius, (markerHeight - markerRadius) * -1],
   };
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      //style: `https://api.maptiler.com/maps/positron/style.json?key=${API_KEY}`,
      //style:`https://api.jawg.io/styles/jawg-light.json?access-token=6wC04qdD2l62vv5ZOnUd9Sr1zgr5y9aveTdOVXcXLmLXmf77ShlFngdXITbtnHTq`,
      style: base + `/${props.theme}MapStyle`,
      center: [props.lng, props.lat],
      zoom: zoom,
    });
    map.current.scrollZoom.disable();
    const centerMarker = document.createElement("div");
    ReactDOM.render(<img src={_centerMarker} alt="marker" width="35" height="35" />,centerMarker);
    centerMarker.onmouseover=() => {centerMarker.style.opacity = "0.5"};
    centerMarker.onmouseleave=() => {centerMarker.style.opacity = "1.0"};
    const markerList = []
    const markerSrcList = [_marker1,_marker2,_marker3,_marker4,_marker5,_marker6,_marker7,_marker8,_marker9,_marker10]
  
    for(let i = 0; i < 10;i++) {
      const marker = document.createElement("div");
      ReactDOM.render(<img src={markerSrcList[i]} alt="marker" width="35" height="35" />,marker);
      markerList.push(marker);
      marker.onmouseover=() => {marker.style.opacity = "0.5"};
      marker.onmouseleave=() => {marker.style.opacity = "1"};
    }
    //el.onclick=() => {ReactDOM.render(<MapPinActive/>,el);}
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    new maplibregl.Marker({element : centerMarker, anchor : "bottom"})
      .setLngLat([props.lng,props.lat])
      .setPopup(new maplibregl.Popup({offset : popupOffsets, closeButton : false}).setText("Your location"))
      .addTo(map.current);
     
      const businessList = props.results.businesses;
      for(let i = 0; i < businessList.length; i++) {
         if(i == 10) {
            break;
         }
         const business = businessList[i];
         const popover = document.createElement("div");
         ReactDOM.render(<Popover business = {business} SearchFormContext={props.SearchFormContext}/>,popover);
         new maplibregl.Marker({element : markerList[i], anchor : "bottom"})
         .setLngLat([business.coordinates.longitude,business.coordinates.latitude])
         .setPopup(new maplibregl.Popup({offset : popupOffsets, closeButton : false}).setDOMContent(popover))
         .addTo(map.current);
         
      }
      
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}


function Popover(props) {
   return(
      <div>
      <div className="alwaysBlack">{props.business.name}</div>
      <a className='blue' 
         onClick ={() => {
            props.SearchFormContext.setState({showDetailFromMapID : props.business.id, showDetailFromMap : true})
         }}>
         Show Detail 
      </a>

      </div>
   )
}
