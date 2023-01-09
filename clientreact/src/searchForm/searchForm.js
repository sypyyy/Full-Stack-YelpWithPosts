import * as React from "react";
//import "./_searchForm.scss"
import Result from "../resultsAndDetail/results.js";

import axios from 'axios';
import base from "../base"
import SubmitButton from "../ReusableModules/submitButton";
import MapSection from "./MapSection"
import { containerClasses } from "@mui/system";

let baseUrl = "";





class Form extends React.Component{
    constructor(props) {
        super(props);
        this.state = 
        {
            showResult : false,
            disableLoc : false,
            location : "",
            distance : 10,
            category : "Default",
            keyword : "",
            count : 0,
            autoComplete : [],
            hideAutoComplete : true,
            ResultKey : false,
            res : null,
            autoCompleteRestriction : false,
            definiteHide : true,
            intervalID : null,
            needRequest : true,
            requestThis : true,
            loggedIn : false,
            spinner : false,
            lat : "",
            lng : "",
            mapsKey : true,
            showRecommendation : true,
            recommendCategory : "Default",
            showDetailFromMapID : "",
            showDetailFromMap : false,
            searched : false,
        }
        this.formRef = React.createRef();
        this.keywordRef = React.createRef();
        this.results = React.createRef();
        this.validateAndSubmit = this.validateAndSubmit.bind(this);
        this.recordKeywordAndAutoComplete = this.recordKeywordAndAutoComplete.bind(this);
    }
    
    componentDidMount() {
        this.requestIPInfo(this);
    }
    componentDidUpdate() {
        if(this.state.showRecommendation && (this.state.category !== this.state.recommendCategory)) {
            this.setState({recommendCategory : this.state.category, spinner : true})
            this.requestIPInfo(this);
        }
    }

    validateAndSubmit() {
        
        const form = this.formRef.current;
        if(form.reportValidity()) {
            this.setState({spinner : true, searched:true});
            if(!this.state.disableLoc) {
                this.request(base + "/SearchResults" 
                + "?location=" + this.state.location
                + "&keyword=" + this.state.keyword
                + "&category=" + this.state.category
                + "&distance=" + this.state.distance
                + "&directSearch=false",this);
            }
            else {
                this.requestIPInfo(this);
            }
        }
    }
    requestIPInfo(context) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200) {
                let locationJSON = JSON.parse(this.response);
                let loc = locationJSON.loc;
                let latandlng = loc.split(",");
                let lat = latandlng[0];
                let lng = latandlng[1];

                context.request(base + "/SearchResults" 
                + "?lat=" + lat
                + "&lng=" + lng
                + "&keyword=" + context.state.keyword
                + "&category=" + (context.state.category)
                + "&distance=" + context.state.distance
                + "&directSearch=true", context)
            }
        }

        xhttp.open('GET',"https://ipinfo.io/?token=79d343391119dd");
        xhttp.send();
    }
    request (url, context) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200) {
                let resObj = JSON.parse(this.response);
                //context.res = resObj.result;
                context.setState({
                    res : resObj.result, 
                    lat : resObj.lat,
                    lng : resObj.lng,
                    mapsKey : !context.state.mapsKey,
                    showRecommendation : !context.state.searched
                })
                axios.get(base + "/isLoggedIn")
                    .then((response) => {
                        context.setState({loggedIn: response.data.loggedIn});
                        context.setState({showResult: true, spinner : false});
                        context.setState({ResultKey: !context.state.ResultKey});
                    }).catch((e) => {});
                
            }
        }
        xhttp.open('GET',url);
        xhttp.send();
    }

    recordLocation(e) {
        this.setState(() => {
            return({location : e.target.value})
        })
    }
    recordCategories(e) {
        this.setState((state) => { return {category : e.target.value, count: state.count + 1} })
    }
    recordDistance(e) {
        this.setState(() => {
            return({distance : e.target.value})
        })
    }
    recordKeywordAndAutoComplete(e,request) {
        this.setState(() => {
            return({keyword : e.target.value})
        })
        if(!request) {
            this.setState({hideAutoComplete : true, autoCompleteRestriction : false, needRequest : true});
        }
        let currentText = e.target.value;
        
        if(currentText !== "" && (this.state.needRequest && request) || this.state.requestThis) {
            this.setState(() => {
                return {
                    needRequest : false,
                    requestThis : false
                }
            });
            let context = this;
            axios.get(base + '/autoComplete',{
                params: {
                text : currentText
                }
            })
            .then(function (response) {
                    let newAutoComplete = [];
                    // (response.data)
                    for(let item of response.data.categories) {
                        if(item.title) {
                            newAutoComplete.push(item.title)
                        }
                    }
                    for(let item of response.data.terms) {
                        if(item.text) {
                            newAutoComplete.push(item.text)
                        }
                    }
              
                    if(e.target.value === currentText && (!context.state.definiteHide)) {

                        context.setState(() => {
                            return {
                                autoComplete : newAutoComplete,
                                needRequest : false
                            }
                        });
                        context.setState({hideAutoComplete : false});
                        if(newAutoComplete.length < 6) {
                            context.setState(() => {
                                return {
                                    autoCompleteRestriction : false
                                }
                            });
                        }
                        else {
                            context.setState(() => {
                                return {
                                    autoCompleteRestriction : true
                                }
                            });
                        }
                    }
                    
                    // (newAutoComplete);
                    
            })
            .catch(function (error) {
                // (error);
            })
            .then(function () {
            });
            }
        this.setState({lastRequest : currentText});
    }

    toggleLocationField(e) {
        if(e.target.checked) {
            this.setState(() => {
                return {disableLoc : true, location : ""};
            })
        }
        else {
            this.setState(() => {
                return {disableLoc : false, location : ""};
            })
        }
    }

    render() {
     
        return(
            <div className="searchPageGridWrapper mx-auto" >
            <div className="searchPageGridCol">
            <div className="FormCard card mx-auto mb-3">
                <form ref = {this.formRef}>
                    <div className="text-left">
                        <h3 className="BStitle mb-2 ">
                        Business search
                        </h3>
                    </div>
                    <div className="mb-1 mx-auto keyword">
                        <label htmlFor="keyword" className="form-label mb-1">Keyword <span className="star">*</span></label>
                        {/**KEYWORD */}
                        <input required type="text" ref = {this.keywordRef} className="form-control" 
                        onChange = {(e) => {this.recordKeywordAndAutoComplete(e,false)}}
                        onFocus = {(e) =>{let id = setInterval(() => {this.recordKeywordAndAutoComplete(e,true);}, 200);  this.setState({definiteHide : false, intervalID : id})}}
                        onBlur={() => {this.setState({hideAutoComplete : true, autoCompleteRestriction : false, definiteHide : true, requestThis : true}); clearInterval(this.state.intervalID)}}
                        value ={this.state.keyword} id="keyword" autoComplete="off">
                        
                        </input>
                        {(!this.state.hideAutoComplete) && <AutoComplete  items = {this.state.autoComplete} restriction={this.state.autoCompleteRestriction} context = {this}/>}

                    </div>
                    <div className="mb-1 distance">
                        
                        <label htmlFor="distance" className="form-label mb-1">Distance (miles)</label>
                        {/**DISTANCE */}
                        <input type="number" className="form-control" autoComplete="off" min="0" onChange = {this.recordDistance.bind(this)}  id="distance" placeholder="10"></input>
                    </div>
                    <div className="mb-1 categories">
                        <label htmlFor="categories" className="form-label mb-1">Categories <span className="star">*</span></label>
                        {/**CATEGORIES */}
                        <select className="search-select form-control" onChange = {this.recordCategories.bind(this)} id="categories">
                            <option>Default</option>
                            <option>Food</option> 
                            <option>Entertainment</option> 
                            <option>Health</option> 
                            <option>Hotels</option> 
                            
                        </select>
                    </div>
                    <div className="mb-1 mx-auto location">
                        <label htmlFor="location" className="form-label mb-1">Location <span className="star">*</span></label>
                        {/**LOCATION */}
                        <input required value = {this.state.location} disabled={this.state.disableLoc} onChange = {this.recordLocation.bind(this)}autoComplete="off" type="text" className="form-control" id="location"></input>
                    </div>
                    <div className="mb-3 form-check checkbox">
                        {/**CHECK BOX */}
                        <input type="checkbox" onChange = {this.toggleLocationField.bind(this)} className="form-check-input" id="checkIP" ></input>
                        <label className="form-check-label" htmlFor="checkIP">Auto-detect my location</label>
                    </div>
                    <div className="container text-center mx-auto buttons">
                        <SubmitButton text="Submit" spinner = {this.state.spinner} execution={this.validateAndSubmit}/>
                        <button type="button" className="btn btn-danger mx-2 " onClick={()=>{this.props.refresh(!this.props.refreshKey)}}>Clear</button>

                    </div>
                </form>
            </div>
            
            {this.state.showResult && <MapSection lat = {this.state.lat} lng = {this.state.lng} results = {this.state.res} key = {this.state.mapsKey} SearchFormContext={this} showRecommendation = {this.state.showRecommendation} category={this.state.category} theme={this.props.theme}/>}
            </div>
            

            {  
                
                <Result result = {this.state.res} key={this.state.ResultKey}
                loggedIn = {this.state.loggedIn}
                 showRecommendation = {this.state.showRecommendation}
                 category = {this.state.category}
                 showResult = {this.state.showResult}
                 SearchFormContext = {this}
                 showDetailFromMapID = {this.state.showDetailFromMapID}
                 showDetailFromMap = {this.state.showDetailFromMap}
                 /> 
            
                 }
        </div>
        );
    }
}
function AutoComplete(props) {
    // (props);
    let list = [];
    for(let i = 0; i < props.items.length; i++) {
        if(i == props.items.length - 1) {
            list.push(<div className = "autoCompleteOption lastAutoCompleteOption" onMouseDown = {function(){CompleteKeyword(props.items[i],props.context);}}><span className="autoCompleteInner">{props.items[i]}</span></div>);
        }
        else {
            list.push(<div className = "autoCompleteOption" onMouseDown = {function(){CompleteKeyword(props.items[i],props.context);}}><span className="autoCompleteInner">{props.items[i]}</span></div>);
        }
    }
    return(<div className={(props.context.hideAutoComplete ? "hiddenAutoComplete" : "autoComplete")+" "+(props.restriction? "restriction" : null)}>{list}</div>);
}
function CompleteKeyword(item, context) {
    context.setState({hideAutoComplete : true, keyword : item});
}
export default Form;
