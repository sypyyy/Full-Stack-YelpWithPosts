import Map from "../searchForm/fancyMap";
//import "./_MapSection.scss";
export default function MapSec(props) {
   return (
      <div>
      <div className="MapSecCard card mx-auto mb-1">
      <div className="text-center">
         <div style={{width : "85%", height:props.showRecommendation ? "60px":"35px", fontSize:(props.showRecommendation ? "small" : "large")}} className={"text-center mx-auto mapTitle"}>
         {props.showRecommendation ? `Recommended places near you. Current category : ${props.category}. You can switch recommend category in the search form above.`
         : "Search results shown below."}
         </div>
      </div>
         <Map lat = {props.lat} lng = {props.lng} results = {props.results} SearchFormContext={props.SearchFormContext} theme={props.theme}/>
      </div>
      <div className="p-1"></div>
      </div>
   )
}