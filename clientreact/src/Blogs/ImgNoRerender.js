import React from "react";
function Image(props) {
   return (<img src={props.src} className="card-img-top postImg"/>)
}

export default React.memo(Image);