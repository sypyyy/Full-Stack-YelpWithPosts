import * as React from "react";

import axios from "axios";
import "./reviews.scss"
import base from "../../base.js"

export default function Reviews(props){
    const [items, setItems] = React.useState([]);
    // (items)
    const [ready, setReview] = React.useState(false);
    const [called, setCalled] = React.useState(false);
    React.useEffect(() => {
        if(!called) {
            axios.get(base+"/Review",{
                params: {
                  id : props.businessId
                }
              }) .then(function (response) {
           
                setCalled(true);
                    let reviews =response.data.reviews;
                    let count = 0;
                    for(let review of reviews) {
                        count++;
                        if(review.user.name && review.rating && review.text && review.time_created && items.length < 3) {
                            items.push(<tr key={"row"+count}><td className="reviewRow">
                                <div ><b className="reviewName" style={{fontWeight :"2000"}}>{review.user.name}</b></div>
                                <div>Rating: {review.rating}/5</div>
                                <br/>
                                <div>{review.text}</div>
                                <br/>
                                <div>{review.time_created.split(" ")[0]}</div>
                                <br/>
                                </td></tr>)
                        }
                    }
                    setReview(true)
                  })
                  .catch(function (error) {
              
                  })
        }
        
    })
    

    return(
        <table className="table table-striped mb-0" style={{height:"500px"}}>
        <tbody>
        {ready? <>{items}</>
        : <><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></>}
        </tbody>
        </table>
    )

}