//import "./submitButton.scss"
//props:
//spinner : bool
//text : string
//execution : func
/*
{ props.spinner && <div style = {{height : "19px", width : "19px", display : "inline-block", verticalAlign:"middle",marginBottom : "2px" }} 
            className="spinner-border text-light me-1"  role="status" >
      </div>}
      */
export default function SubmitButton(props) {
   return (
      <button type="button" className={"btn btn-primary mx-2 submitButton "}
      onClick={props.execution}>
      { props.spinner && <span className="spinnerWrapper"><div style = {{height : "19px", width : "19px", display : "inline-block", verticalAlign:"middle",marginBottom : "2px" }} 
            className="spinner-border text-light me-1"  role="status" >
      </div></span>}
      {!props.spinner && <div className="submitButtonTxt d-inline my-auto">{props.text}</div>}
      </button>
   )
}