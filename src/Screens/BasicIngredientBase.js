import {getCSRFToken} from "../csrftoken"
import '../style.css';
import React from 'react';
import Axios from "axios";
import { Button, Input, FormLabel} from "@material-ui/core"
import { SelectArrayElement } from '../funcComponents'

class BasicIngredientBase extends React.Component{
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
        Axios.get("/api/experiment/BasicIngredientBase/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
    
            this.setState({categories:arr});
        }).catch(console.log("BasicIngredientBase failure \n"));
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/BasicIngredientBase/",data,{headers:headers, withCredentials:true}).then((e)=>{ alert("Wstawiono");
            this.refreshDB()
        }).catch((e)=>{alert("Nie wstawiono")})
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        Axios.delete("/api/experiment/BasicIngredientBase/"+this.state.category,{headers:headers, withCredentials:true}).then((e)=>{
            alert("Usunięto");
            this.refreshDB()
        }).catch((e)=>{alert("Nie usunięto")})
    }
    render = ()=>{
        return(
        <div>
            <FormLabel className="line">
                <div className="line">
                Nowy składnik:
                    <Input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}/>
                    <Button className="line" variant="contained" color="primary" onClick={this.handleSubmit}>Dodaj składnik</Button>
                </div>
            </FormLabel>

            <FormLabel className="line">
                Składnik do usunięcia: 
                <SelectArrayElement className="line" array={this.state.categories} onChange={(v)=>{this.setState({category:v})}}/>
                <Button className="line" variant="contained" color="secondary" onClick={this.handleDelete}>Usuń składnik</Button>
            </FormLabel>
        </div>
        )
}
}


export default BasicIngredientBase