import * as React from "react";

//import './_detail.scss';
import Tabs , { tabsClasses }from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl } from "@mui/material";
import { useState } from 'react';
import Map from './mapAndReviews/map';
import Reviews from './mapAndReviews/reviews';
//import BusinessDetails from "./businessDetails"
import axios from "axios";
import base from "../base.js"
import BusinessDetails from "./businessDetails";
import BackButton from "../ReusableModules/backButton";


const theme = createTheme({
  palette: {
    
    primary: {
      light: 'black',
      main: 'black',
      dark: 'black',
      contrastText: 'black',
    },
    secondary: {
      light: 'var(--dark-text-color)',
      main: 'var(--dark-text-color)',
      dark: 'var(--dark-text-color)',
      contrastText: 'var(--dark-text-color)',
    },
   
  },
});



function Detail(props) {
    let details = props.response;
  
    const [tabValue, setTabValue] = React.useState(0);
    const [windowWidth, setWidth] = React.useState(window.innerWidth);
   
    const [wrapperHeight, setWrapperHeight] = useState(null);
    const [animation, setAnimation] = useState(0);
    const transformOriginX = (Number(props.clientX) - (Number(props.PosX))).toFixed(5);
    const transformOriginY = (Number(props.clientY) - (Number(props.PosY))).toFixed(5);
    
    return (
        //I used this piece of code from :
        //https://mui.com/material-ui/react-tabs/#main-content
        <div className={(" detailWrapper text-start")}style={{width : props.width, height : props.height, top : `${props.PosY}px`, left : `${props.PosX}px`, transformOrigin : (props.clientX === null ? undefined : `${transformOriginX}px ${transformOriginY}px`)}}>
        <div className={" card mx-auto mb-0 mt-0" + (" detailCard")}
         id="detailHead" 
         style={{height : props.height, transformOrigin : (props.clientX === null ? undefined : `${transformOriginX}px ${transformOriginY}px`)}}>
        <div className="text-left ms-3 mt-3"><BackButton execution={() =>{props.upperContext.setState({justLoadedDetail : true, show : "Result"})}}/></div>
        <div className="text-center detailTitle mb-3 mt-2" >{details.name}</div>
        <Box sx={{ width: '100%', height:"48px"}} >
        <CustomTabs winWidth = {windowWidth} tabValue={tabValue} setTabValue={setTabValue} setWrapperHeight = {setWrapperHeight} setAnimation = {setAnimation}/>
        </Box>
             {/**Wrapper for Scrolling*/}
            <div style={{ height: "530px"}} className={"contentWrapper" + " slide" + animation}>
            {/**Detail Page*/}
            
            <article className="content"><BusinessDetails details={details} loggedIn = {props.loggedIn} reservationInfo={props.reservationInfo}/></article>
            
            {/**Map Page*/}
            <article className="content" ><Map lat={details.coordinates.latitude} lng={details.coordinates.longitude}/></article>
            {/**Review Page*/}
            <article className="content" ><Reviews businessId={details.id}/></article>
            </div>
          </div>
          </div>
    );
}

function CustomTabs(props){
  let value = props.tabValue;
  let setValue = props.setTabValue;

    return(
      <ThemeProvider theme={theme}>
        <div className = "Tab">
        <Tabs className="TabLine" sx={{bgcolor: "#76bbed"}} indicatorColor="secondary"
        //centered
            value={value}
            onChange={(e,newValue) => {
                setValue(newValue);
                props.setAnimation((value+1) * 10 + newValue + 1);
            }}
            variant= {"scrollable"}   
            >
            <Tab sx={{textTransform: 'none',} }  label="Business details"></Tab>
            <Tab  sx={{textTransform: 'none',} } label="Google Map" />
            <Tab  sx={{textTransform: 'none',} } label="Reviews" />
        </Tabs>
        </div>
      </ThemeProvider>
  );
}






export default Detail;