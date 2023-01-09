import * as React from "react";
//import "./results.scss"

import axios from "axios";
import Detail from "./detail.js";
import base from "../base"
import { Zoom } from "@mui/material";

//let detail = null;


class Results extends React.Component{
    constructor(props) {
        super(props);
        this.resultElement = React.createRef();
        window.onscroll = () => {
            try{this._recordSecPos()}
            catch(e) {
            }

        }
        window.onresize = () => {
            this._recordSecPos()
        }
        this.state = {
            sectionPosX : "",
            sectionPosY : "",
            sectionWidth : "",
            sectionHeight : "",
            show : 'Result',
            justLoadedDetail : true,
            detailInfo : null,
            reservationInfo : null,
            clientX : null,
            clientY : null,
        }
    }

    _recordSecPos() {
        try{
            let elementRec = this.resultElement.current.getBoundingClientRect();
            let yOffset = window.scrollY;
                this.setState(
                {sectionPosX : elementRec.x,
                sectionPosY : elementRec.y + yOffset, 
                sectionWidth : elementRec.width, 
                sectionHeight : elementRec.height})
                }
        catch (e){

        }
        
    }


    componentDidMount() {
        let elementRec = this.resultElement.current.getBoundingClientRect();
        let yOffset = window.scrollY;
            this.setState(
            {sectionPosX : elementRec.x,
            sectionPosY : elementRec.y + yOffset, 
            sectionWidth : elementRec.width, 
            sectionHeight : elementRec.height})
        /*
        if(document.getElementById("resultHead")) {
            document.getElementById("resultHead").scrollIntoView();
        }
        */
    }
    
    componentDidUpdate() {
        if(this.props.showDetailFromMap) {
            this.setState({clientX : null, clientY : null})
            getDetail(this.props.showDetailFromMapID, this, null, null, this.sectionPosX, this.sectionPosY);
            this.props.SearchFormContext.setState({showDetailFromMap : false});
        }
        if(this.state.justLoadedDetail) {

        }
    }

    render() {
        
        let props = this.props
        if(!props.showResult) {
            return <div ref = {this.resultElement}></div>
        }
        if(props.result == "Invalid Location") {
            return <div ref = {this.resultElement} className="text-center fix-table-height"><span className="noRecords">Invalid Location</span></div>
        }
        else {
            let resultObj = props.result
            let list = [];
            for(let business of resultObj.businesses) {
                let id = business.id;
                let name = business.name;
                let rating = business.rating;
                let distance = business.distance;
                if(id && name && rating && distance) {
                    let businessInfo = {
                        id : id,
                        name : name,
                        rating : rating, 
                        distance : distance
                    };
                    if(!business.image_url) {
                        businessInfo.imageSrc = "https://i.imgur.com/GQPN5Q9.jpeg";
                    }
                    else {
                        businessInfo.imageSrc = business.image_url;
                    }
                    list.push(businessInfo);
                    if(list.length == 10) {
                        break;
                    }
                }
            }
            if(list.length == 0) {
               return <div ref = {this.resultElement} className="text-center fix-table-height" ><span className="noRecords">No results available</span></div>;
            }
            else {
                let businessList = [];
                let count = 1;
                for(let businessInfo of list) {
                    businessList.push(
                        <React.Fragment><tr className="resultRow" onClick={(e) => {
                            this.setState({clientX : e.clientX, clientY : e.clientY});
                            getDetail(businessInfo.id, this, e.clientX,e.clientY,this.state.sectionPosX,this.state.sectionPosY,this.state.sectionWidth,this.state.sectionHeight);
                    }}>
                            <td className="resultItem NoR" >{count}</td>
                            <td className="resultItem imageR"><img src={businessInfo.imageSrc}></img></td>
                            <td className="resultItem nameR"><div className="nameR">{businessInfo.name}</div></td>
                            <td className="resultItem ratingR">{Number(businessInfo.rating).toFixed(1)}</td>
                            <td className="resultItem distanceR">{(Number(businessInfo.distance) / 1609.344).toFixed(1)}</td>
                        </tr></React.Fragment>
                    )
                    count++;
                }
                return (
                    <div className="searchPageGridCol">
                    <div className="mx-auto resultTable text-center mt-0 table-responsive fix-table-height" ref = {this.resultElement}>
                        <table className="table table-striped table-hover mb-0" style={{width:"100%!important"}}>
                            <thead>
                                <tr className="container" id="resultHead">
                                    <th scope=" col" className="resultHead NoR">#</th>
                                    <th scope="col" className="resultHead imageR" >Image</th>
                                    <th scope="col" className="resultHead nameR">Business Name</th>
                                    <th scope="col" className="resultHead ratingR ">Rating</th>
                                    <th scope="col" className="resultHead distanceR">Miles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {businessList}
                            </tbody>
                        </table>
                        {this.state.show == "Detail" && 
                        <Detail response = {this.state.detailInfo} 
                        upperContext={this} 
                        loggedIn = {this.props.loggedIn} 
                        reservationInfo={this.props.loggedIn ? this.state.reservationInfo : undefined}
                        clientX = {this.state.clientX} clientY = {this.state.clientY}
                        PosX = {this.state.sectionPosX} PosY = {this.state.sectionPosY}
                        width = {this.state.sectionWidth} height = {this.state.sectionHeight}
                        />}
                    
                    </div>
                    <div style={{height:"20px"}}/>
                    </div>

                )
            }
        }
    }

    
}

function getDetail(id,resultArea,clientX,clientY,sectionPosX,sectionPosY) {
     
    axios.get(base+"/Detail",{
        params: {
          id : id
        }
      })
          .then(function (response1) {
            //DETAIL
            resultArea.setState({detailInfo : response1.data});
            if(resultArea.props.loggedIn) {
                axios.get(base+"/ifReservedThisBusiness",{
                    params: {
                      id : id
                    }
                  })
                    .then((response2) => {
                        //detail = <Detail response = {detailInfo} upperContext={resultArea} loggedIn = {resultArea.props.loggedIn} reservationInfo={response2.data}/>
                        createDetailExpandAnimation(clientX,clientY,sectionPosX,sectionPosY);
                        resultArea.setState({show : "Detail", reservationInfo : response2.data});
                    }).catch(e => {})
            } else {
                createDetailExpandAnimation(clientX,clientY,sectionPosX,sectionPosY);
                //detail = <Detail response = {detailInfo} upperContext={resultArea} loggedIn = {resultArea.props.loggedIn}/>
                resultArea.setState({show : "Detail"});
            }
            
            

          })
          .catch(function (error) {
            
          })
          .then(function () {
          });
}

function createDetailExpandAnimation(clientX,clientY,sectionPosX,sectionPosY) {
    let detailExpandable = document.querySelector('.ExpandAnimation');
    if(!detailExpandable) {
        detailExpandable = document.createElement('style');
        detailExpandable.classList.add('ExpandAnimation');
    }
    let wrapperAnimation = [];
    let invertAnimation = [];
    
    for(let i = 0; i <= 100; i+=1) {
        
        const step = _ease(i / 100).toFixed(5);
        const wrapperScale = step;
        const InvScale = (1 / step).toFixed(5);
        
        wrapperAnimation.push(`
        ${i}% {
          transform: scale(${wrapperScale});
        }`)
        invertAnimation.push(`${i}% {
            transform: scale(${InvScale});
          }`)
    }
    detailExpandable.textContent = `
    @keyframes ExpandAnimation {
      ${wrapperAnimation.join('')}
    }

    @keyframes ExpandContentsAnimation {
      ${invertAnimation.join('')}
    }
    `
    document.head.appendChild(detailExpandable);
    //detailExpandable.textContent = 
}


function _ease (v,pow = 4) { v = _clamp(v, 0.1, 1); return _clamp(v, 0.1, 1); }
//function _ease (v,pow = 4) { v = _clamp(v, 0, 1); return 1 - Math.pow(1 - v, pow); }
function _clamp (value, min, max) {
    return Math.max(min, Math.min(max, value));
}
export default Results;
