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
    handleUpdate = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token, name:this.state.category}
        let data = {
            "name": this.state.newName
            }
        let a = this.state.categories.find((v)=>{return v[0]==this.state.newName})
        if( a==undefined){
            Axios.put("/api/experiment/BasicIngredientBase/"+this.state.category+"/",data,{headers:headers, withCredentials:true}).then((e)=>{
                this.refreshDB()
            }).catch((e)=>{alert("Nie zmieniono")})
        }else{alert("Nie zmieniono")}
    }
    render = ()=>{
        return(
        <div>
            <FormLabel className="line2">
                Nowy składnik:
                <div className="line2">
                    Nazwa
                    <Input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}/>
                    <Button className="line2" onClick={this.handleSubmit}>Dodaj składnik</Button>
                </div>
            </FormLabel>

            <FormLabel className="line2">
                Zmiana dodatku: 
                <SelectArrayElement array={this.state.categories} onChange={(v)=>{this.setState({category:v})}}/>
                <span className="line2">
                    Nowa nazwa składniku:
                    <Input value={this.state.newName} onChange={(e) =>{this.setState({newName:e.target.value})}}/>
                    <Button onClick={this.handleUpdate}>Zmień składnik</Button>
                </span>
                <Button className="line2" onClick={this.handleDelete}>Usuń składnik</Button>
            </FormLabel>
        </div>
        )
}
}


export default BasicIngredientBase