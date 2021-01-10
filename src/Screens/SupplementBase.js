import {getCSRFToken} from "../csrftoken"
import '../style.css';
import React from 'react';
import Axios from "axios";

class SupplementBase extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:""
        }
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/SupplementBase/",data,{headers:headers, withCredentials:true})
            .then((e)=>{ alert("Wstawiono"); this.componentWillUnmount() ;})
            .catch((e)=>{alert("Nie wstawiono")})
    }
    render = ()=>{
        return(
        <div className="box0">
            <label className="line2">
                Nazwa:
                <input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}></input>
            </label>
            <button className="line" onClick={this.handleSubmit}>Dodaj kategorię</button>
        </div>
        )
}
}

export default SupplementBase