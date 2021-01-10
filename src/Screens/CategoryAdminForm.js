import {getCSRFToken} from "../csrftoken"
import '../style.css';
import React from 'react';
import Axios from "axios";
import { SelectArrayElement } from '../funcComponents'
import { Button, Input, FormLabel} from "@material-ui/core"
class CategoryAdminForm extends React.Component{
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
        Axios.get("/api/experiment/Category/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
    
            this.setState({categories:arr});
        }).catch(console.log("Categories failure \n"));
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/Category/",data,{headers:headers, withCredentials:true}).then((e)=>{ alert("Wstawiono");
            this.refreshDB()
        }).catch((e)=>{alert("Nie wstawiono")})
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        Axios.delete("/api/experiment/Category/"+this.state.category,{headers:headers, withCredentials:true}).then((e)=>{
            alert("Usunięto");
            this.refreshDB()
        }).catch((e)=>{alert("Nie usunięto")})
    }
    handleUpdate = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.newName
            }
        let a = this.state.categories.find((v)=>{return v[0]==this.state.newName})
        if( a==undefined){
            Axios.delete("/api/experiment/Category/"+this.state.category,{headers:headers, withCredentials:true}).then((e)=>{
                Axios.post("/api/experiment/Category/",data,{headers:headers, withCredentials:true}).then((e)=>{ alert("Zmieniono");
                    this.refreshDB()
                }).catch(()=>{alert("Nie zmieniono")})
            }).catch((e)=>{})
        }else{alert("Nie zmieniono")}
    }
    render = ()=>{
        let q = this.state.categories
        return(
        <div>
            <FormLabel className="line2">
                Nowa kategoria:
                <div className="line2">
                    Nazwa
                    <Input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}/>
                    <Button className="line2" onClick={this.handleSubmit}>Dodaj kategorię</Button>
                </div>
            </FormLabel>

            <FormLabel className="line2">
                Zmiana kategorii: 
                <SelectArrayElement array={this.state.categories} onChange={(v)=>{this.setState({category:v})}}/>
                <span className="line2">
                    Nazwa nowej kategorii:
                    <Input value={this.state.newName} onChange={(e) =>{this.setState({newName:e.target.value})}}/>
                    <Button onClick={this.handleUpdate}>Zmień kategorię</Button>
                </span>
                <Button className="line2" onClick={this.handleDelete}>Usuń kategorię</Button>
            </FormLabel>
        </div>
        )
}
}

export default CategoryAdminForm