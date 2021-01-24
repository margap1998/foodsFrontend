import {getCSRFToken} from "../csrftoken"
import '../style.css';
import React from 'react';
import Axios from "axios";
import { Button, Input, FormLabel} from "@material-ui/core"
import { SelectArrayElement } from '../funcComponents'

class SupplementBase extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:"", newName:"", categories:[], category:""
        }
    }
    componentDidMount = ()=>{
        this.refreshDB()
    }
    refreshDB = ()=>{
        Axios.get("/api/experiment/SupplementBase/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
    
            this.setState({categories:arr});
        }).catch(console.log("SupplementBase failure \n"));
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/SupplementBase/",data,{headers:headers, withCredentials:true}).then((e)=>{ alert("Wstawiono");
            this.refreshDB()
            alert(`Wstawiono kategorię "${data.name}"`)
        }).catch((e)=>{alert(`Nie wstawiono kategorii "${data.name}"`)})
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        Axios.delete(`/api/experiment/SupplementBase/${this.state.category}`,{headers:headers, withCredentials:true}).then((e)=>{
            alert(`Usunięto składnik "${this.state.category}"`);
            this.refreshDB()
        }).catch((e)=>{alert(`Nie usunięto kategorii "${this.state.category}"`)})
    }
    render = ()=>{
        return(
        <div>
            <FormLabel className="line">
                Nowy dodatek:
                <div className="line">
                    <Input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}/>
                    <Button variant="contained" color="primary" className="line" onClick={this.handleSubmit}>Dodaj dodatek</Button>
                </div>
            </FormLabel>

            <FormLabel className="line">
                Dodatek do usunięcia: 
                <SelectArrayElement className="line" array={this.state.categories} onChange={(v)=>{this.setState({category:v})}}/>
                <Button variant="contained" color="secondary" className="line" onClick={this.handleDelete}>Usuń dodatek</Button>
            </FormLabel>
        </div>
        )
}
}

export default SupplementBase