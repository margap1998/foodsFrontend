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
        }).catch(()=>{console.log("Categories failure \n")});
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/Category/",data,{headers:headers, withCredentials:true}).then(()=>{ alert("Wstawiono");
            this.refreshDB()
        }).catch(()=>{alert("Nie wstawiono")})
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        Axios.delete("/api/experiment/Category/"+this.state.category,{headers:headers, withCredentials:true}).then(()=>{
            alert("Usunięto");
            this.refreshDB()
        }).catch(()=>{alert("Nie usunięto")})
    }
    render = ()=>{
        return(
        <div>
            <FormLabel className="line">
                Nowa kategoria:
                <div className="line">
                    <Input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}/>
                    <Button className="line" variant="contained" color="primary" onClick={this.handleSubmit}>Dodaj kategorię</Button>
                </div>
            </FormLabel>

            <FormLabel className="line">
                Kategoria do usunięcia: 
                <SelectArrayElement className="line" array={this.state.categories} onChange={(v)=>{this.setState({category:v})}}/>
                <Button className="line" variant="contained" color="secondary" onClick={this.handleDelete}>Usuń kategorię</Button>
            </FormLabel>
        </div>
        )
}
}

export default CategoryAdminForm