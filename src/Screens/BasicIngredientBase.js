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
            name:"", newName:"", basicIngredients:[], basicIngredient:""
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
    
            this.setState({basicIngredients:arr});
        }).catch(console.log("BasicIngredientBase failure \n"));
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/BasicIngredientBase/",data,{headers:headers, withCredentials:true}).then((e)=>{ alert("Wstawiono składnik o nazwie \""+data.name+"\"");
            this.refreshDB()
        }).catch((e)=>{alert("Nie wstawiono składnika \""+data.name+"\"")})
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        Axios.delete("/api/experiment/BasicIngredientBase/"+this.state.basicIngredient,{headers:headers, withCredentials:true}).then((e)=>{
            alert(`Usunięto składnik "${this.state.basicIngredient}"`);
            this.refreshDB()
        }).catch((e)=>{alert(`Nie usunięto składniku "${this.state.basicIngredient}"`)})
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
                <SelectArrayElement className="line" array={this.state.basicIngredients} onChange={(v)=>{this.setState({basicIngredient:v})}}/>
                <Button className="line" variant="contained" color="secondary" onClick={this.handleDelete}>Usuń składnik</Button>
            </FormLabel>
        </div>
        )
}
}


export default BasicIngredientBase