import {Button, Toolbar, Paper, TextField, FormLabel, Input} from "@material-ui/core"
import React from 'react';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { SelectArrayElement } from "../funcComponents.js";


class ProductForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "nameProduct": "",
            "descriptionProduct": "",
            "categoryProduct": null,
            "recipeProduct": null,
            categories:[], categoriesBase:[]
        }
    }
    componentDidMount = () => {
        this.refresh()
    }
    componentWillUnmount = () => {
   }
    refresh = ()=> {
        //żądania typu get do API
        axios.get("/api/experiment/Category/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
    
            this.setState({categories:arr, categoriesBase:res.data});
        }).catch(console.log("Categories failure \n"));
    }
    handleSubmit = ()=>{
        let product = {
            "name": "",
            "description": "",
            "category": null,
            "recipe": null
        }
        alert("XD")
    }

    handleCategory = ()=>{

    }
    render = ()=> {
        return( 
        <form id="ProductForm" className="box0" onSubmit={this.handleSubmit}>
            <Toolbar>
                <Button variant="contained" color="primary" onClick={this.props.closeProc}>X</Button>
            </Toolbar>
            <FormLabel className="line2">
                Nazwa:
                <Input className="line" type="text" inputProps={this.state.nameProduct} 
                        onChange={(e)=>{ this.setState({nameProduct:e.target.value})}}
                />
            </FormLabel>
            <FormLabel className="line2">
                Opis:
                <Input className="line" type="text" inputProps={this.state.descriptionProduct} 
                        onChange={(e)=>{ this.setState({nameProduct:e.target.value})}}
                />
            </FormLabel>
            <FormLabel className="line2">
                Kategoria:
                <SelectArrayElement array={this.state.categories} onChange={this.handleCategory} label="Kategoria"></SelectArrayElement>
            </FormLabel>
                <Button variant="contained" color="primary" type="submit">Dodaj</Button>
        </form>
        )
    }
}

export default ProductForm