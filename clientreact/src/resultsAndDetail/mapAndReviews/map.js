import * as React from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";


let mapHeight = "470px";
export default function businessMap(props) {
    
    let lat = props.lat;
    let lng = props.lng;
    let center = {lat: Number(lat), lng:Number(lng)}
    
    
    return(
        <div style={{height : mapHeight, width:"100%"}} className="my-4">
            <Wrapper apiKey={"AIzaSyAakOkX978ZyZRyGFox_SLcqI35gtbaXZY"} >
                  <Maps center = {center} >
                  <Marker position={center}/>
                  </Maps>
            </Wrapper>
        </div>
    )
    
}

function Maps(props) {
    const ref = React.useRef(null);
    const [map, setMap] = React.useState(false);
    React.useEffect(() => {
    if (ref.current && !map) {
        setMap(new window.google.maps.Map(ref.current, {
            zoom: 16,
            center: props.center,
        }));
    }
    }, [ref, map]);
    return (
        <>
          <div ref={ref} style={{height : mapHeight, width:"100%"}} />
          {React.Children.map(props.children,(child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { map });
            }
          })}
        </>
      );
}


const Marker = (options) => {
    const [marker, setMarker] = React.useState();
  
    React.useEffect(() => {
       ("called")
      if (!marker) {
        setMarker(new window.google.maps.Marker());
      }
      return () => {
        if (marker) {
          marker.setMap(null);
        }
      };
    }, [marker]);
    React.useEffect(() => {
      if (marker) {
        marker.setOptions(options);
      }
    }, [marker, options]);
    return null;
  };