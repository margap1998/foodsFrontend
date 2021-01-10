import {Button, Toolbar, FormLabel, Input, Paper} from "@material-ui/core"
import React from 'react';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { SelectArrayElement } from "../funcComponents.js";

class RecipeForm extends React.Component{
    constructor(props){
        super(props)
        this.state={ ingredientsTypeBase:[], ingredientsBase:[], percent:0, ingredients: [],
            ingredient:{
                "name": "",
                "percentage": 0,
                "basicIngredientBase": ""
            },
            recipe:{
                "basicWeight": null,
                "ingredients": []
            }
        }
    }

    componentDidMount = ()=>{
        this.downloadDB()
    }
    downloadDB = ()=>{
        axios.get("/api/experiment/BasicIngredientBase/").then( res =>{
            this.setState({ingredientsTypeBase:res.data.map((v)=>{return [v.name,v.name]})})
        })
        axios.get("/api/experiment/BasicIngredient/").then( res =>{
            this.setState({ingredientsBase:res.data})
        })
    }
    handleIngredientBase = (v)=>{
        this.setState({
            ingredient:{
                "name": v+" "+this.state.ingredient.percentage.toString()+"%",
                "percentage": this.state.ingredient.percentage,
                "basicIngredientBase": v
            }
        })
    }

    checkTypeInIngredients = (type)=>{
        var result = false
        this.state.ingredients.forEach((v)=>{ 
            result = (result || (v.basicIngredientBase===type))}
        )
        return result
    }

    handleIngredient = ()=>{ let token = getCSRFToken()
        let diffPer = this.state.percent+parseInt(this.state.ingredient.percentage)
        if(this.state.ingredient.percentage>0 && diffPer<=100 && !this.checkTypeInIngredients(this.state.ingredient.basicIngredientBase)){
            //stworzenie odpowiedniego nagłówka zapytania
            const headers = {"X-CSRFTOKEN": token}
            //obiekt z danymi do bazy
    
            axios.post("/api/experiment/BasicIngredient/",this.state.ingredient,{headers:headers, withCredentials:true})
            var arr = this.state.ingredients
            arr.push(this.state.ingredient)
            var arrRec = this.state.recipe.ingredients
            arrRec.push(this.state.ingredient.name)
            let rec = {
                "basicWeight": this.state.recipe.basicWeight,
                "ingredients": arrRec
            }
            this.props.changeRecipe(rec)
            this.setState({
                percent:diffPer,
                ingredient:{
                    "name": "",
                    "percentage": 0,
                    "basicIngredientBase": this.state.ingredient.basicIngredientBase
                }
            })
        }
    }
    handleIngredientPercent = (e)=>{
            if(e.target.value>-1 && e.target.value<101){
                this.setState({
                    ingredient:{
                        "name": this.state.ingredient.basicIngredientBase+" "+e.target.value.toString()+"%",
                        "percentage": e.target.value,
                        "basicIngredientBase": this.state.ingredient.basicIngredientBase
                    }
                })
            }
    }
    handleWeight = (e)=>{
            let rec = {
                "basicWeight": e.target.value,
                "ingredients": this.state.recipe.ingredients
            }
            if(e.target.value>-1){
                this.setState({
                        recipe: rec
                })
            }
            this.props.changeRecipe(rec)
    }
    Line = (props)=>{
        let onClick = (name)=>{
            var arr = this.state.ingredients.filter((v)=>{return(name!=v.name)})
            let rec = {
                "basicWeight": this.state.recipe.basicWeight,
                "ingredients": arr.map((v=> {return v.name}))
            }
            let newPercent = this.state.percent-parseInt(props.obj.percentage)
            this.setState({
                ingredients:arr, recipe:rec,percent:newPercent
            })
            this.props.changeRecipe(rec)
        }

        return <div className="line2">
        <FormLabel>
            {props.obj.name}
            <Button type="button"  onClick={_=>{onClick(props.obj.name)}}> Usuń składnik</Button>
        </FormLabel>
        </div>
    }
    render = ()=>{

        return <div className="box0" className="line2"><Paper>
            <FormLabel className="line2">
                Waga w gramach:
                <Input type="number" value={this.state.recipe.basicWeighteight} onChange={this.handleWeight}/>
            </FormLabel>
            <FormLabel className="line2">
                Składnik:
                <SelectArrayElement array={this.state.ingredientsTypeBase} onChange={this.handleIngredientBase}/>
                Procent:
                <Input type="number" value={this.state.ingredient.percentage} onChange={this.handleIngredientPercent}/>
                Nazwa :
                <Input type="text" readOnly value={this.state.ingredient.name}/>
                <Button onClick={this.handleIngredient}> Dodaj składnik</Button>
            </FormLabel>
            <FormLabel className="line2">
                <div className="line">Pozostało {100-this.state.percent}% składników</div>
                {this.state.ingredients.map(obj =>{return <this.Line obj={obj}></this.Line>})}
            </FormLabel>
        </Paper></div>
    }
}

class ProductForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "nameProduct": "",
            "descriptionProduct": "",
            "categoryProduct": null,
            "recipeProduct": null,
            categories:[], categoriesBase:[],
            recipe:{
                "basicWeight": null,
                "ingredients": []
            }
        }
    }
    componentDidMount = () => {
        this.refresh()
    }
    changeRecipe = (v)=>{
        this.setState({recipe:v})
    }
    refresh = ()=> {
        //żądania typu get do API
        axios.get("/api/experiment/Category/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
    
            this.setState({categories:arr});
        }).catch(console.log("Categories failure \n"));
    }
    handleSubmitProduct = ()=>{
        let product = {
            "name": "",
            "description": "",
            "category": null,
            "recipe": null
        }
    }

    handleSubmit = ()=>{

    }

    handleCategory = (v)=>{
        this.setState({
            "categoryProduct": v,
        })
    }
    render = ()=> {
        return( 
        <div id="ProductForm" className="box0">
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
                <SelectArrayElement className="line" array={this.state.categories} onChange={this.handleCategory} label="Kategoria"></SelectArrayElement>
            </FormLabel>
            <FormLabel className="line2">
                Receptura:
                <RecipeForm changeRecipe={this.changeRecipe} className="line"/>
            </FormLabel>
            <Button variant="contained" color="primary" className="line2" type="submit"  onClick={this.handleSubmit}>Dodaj</Button>
        </div>
        )
    }
}

export default ProductForm