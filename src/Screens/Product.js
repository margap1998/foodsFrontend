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
            recipe:props.recipe
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
            let ing = res.data.filter((v)=>{return this.props.recipe.ingredients.includes(v.name)})
            let p = this.state.percent
            ing.forEach((v)=>{ p+= parseInt(v.percentage)})
            this.setState({ingredients:ing, percent:p})
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
    
            axios.post("/api/experiment/BasicIngredient/",this.state.ingredient,{headers:headers, withCredentials:true}).catch(()=>{})
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
                this.props.changeRecipe(rec)
            }
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
                <Input type="number" value={this.state.recipe.basicWeight} onChange={this.handleWeight}/>
            </FormLabel>
            <FormLabel className="line2">
                Składnik:
                <SelectArrayElement array={this.state.ingredientsTypeBase} onChange={this.handleIngredientBase}/>
                Procent:
                <Input type="number" value={this.state.ingredient.percentage} onChange={this.handleIngredientPercent}/>
                Nazwa :
                <Input type="text" readOnly value={this.state.ingredient.name}/>
            </FormLabel>
            <FormLabel className="line2">
            <Button variant="contained" color="primary" className="line2"  onClick={this.handleIngredient}> Dodaj składnik</Button>
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
            prodObj:[],
            "nameProduct": props.name,
            "descriptionProduct": "",
            "categoryProduct": null,
            "recipeProduct": null,
            rf:undefined,
            categories:[], categoriesBase:[],
            recipe:{
                id:"-1",
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
        axios.get("/api/experiment/Product/").then((res1)=>{
            let pr = res1.data.find(v=>{return v.name == this.props.name})
            if (pr != undefined){
            this.setState({prodObj:res1.data,
                "descriptionProduct": pr.description,
                "categoryProduct": pr.category,
                "recipeProduct": pr.recipe,
            });
            axios.get("/api/experiment/Recipe/").then((res2)=>{
                let rec = res2.data.find((v)=>{return v.id===pr.recipe})
                this.setState({recipe:rec, rf:<RecipeForm recipe={rec} changeRecipe={this.changeRecipe} className="line"/>})
            }).catch(console.log("Categories failure \n"));
        }else{
            this.setState({rf:<RecipeForm recipe={{
                id:"-1",
                "basicWeight": null,
                "ingredients": []
            }} changeRecipe={this.changeRecipe} className="line"/>})
        }
        }).catch(console.log("Product failure \n"));
        //żądania typu get do API
        axios.get("/api/experiment/Category/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
    
            this.setState({categories:arr});    
        }).catch(console.log("Categories failure \n"));
    }

    handleSubmit = ()=>{
        let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
        //obiekt z danymi do bazy
        axios.post("/api/experiment/Recipe/",this.state.recipe,{headers:headers, withCredentials:true}).then(res1=>{    
            let product = {
                "name": this.state.nameProduct,
                "description": this.state.descriptionProduct,
                "category": this.state.categoryProduct,
                "recipe": res1.data.id
            }
            axios.post("/api/experiment/Product/",product,{headers:headers, withCredentials:true}).then(res2=>{
                this.props.changeProductName(product.name)
                this.props.closeProc()
            })
        })
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
        //obiekt z danymi do bazy
        axios.delete("/api/experiment/Recipe/"+this.state.recipe.id+"/",{headers:headers, withCredentials:true}).then(res1=>{
            this.setState({
                "nameProduct": "",
                "descriptionProduct": "",
                "categoryProduct": null,
                "recipeProduct": null,
            })
            this.props.changeProductName("")
        })
        
    }
    handleCategory = (v)=>{
        this.setState({
            "categoryProduct": v,
        })
    }
    render = ()=> {
        return(<Paper className="line2">
        <div id="ProductForm" className="box0">
            <Button className="line2" variant="contained" onClick={this.props.closeProc}>X</Button>
            <FormLabel className="line2">
                Nazwa:
                <Input className="line" type="text" value={this.state.nameProduct} 
                        onChange={(e)=>{ this.setState({nameProduct:e.target.value})}}
                />
            </FormLabel>
            <FormLabel className="line2">
                Opis:
                <Input className="line" type="text" value={this.state.descriptionProduct} 
                        onChange={(e)=>{ this.setState({descriptionProduct:e.target.value})}}
                />
            </FormLabel>
            <FormLabel className="line2">
                Kategoria:
                <SelectArrayElement value={this.state.categoryProduct} className="line" array={this.state.categories} onChange={this.handleCategory} label="Kategoria"></SelectArrayElement>
            </FormLabel>
            <FormLabel className="line2">
                Receptura:
                {this.state.rf}
            </FormLabel>
            <Button variant="contained" color="primary" className="line2" type="submit"  onClick={this.handleSubmit}>Dodaj</Button>
            <Button variant="contained" color="primary" className="line2" type="submit"  onClick={this.handleDelete}>Usuń</Button>
        </div>
        </Paper>
        )
    }
}

export default ProductForm