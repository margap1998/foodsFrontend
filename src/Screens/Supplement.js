import React from 'react';
import '../style.css';
import axios from "axios";
import { Select } from "../funcComponents";
import {getCSRFToken} from '../csrftoken'

//Komponenet odpowiedzialny za formularz eksperymentu
class Supplement extends React.Component{
   constructor(props){
    super(props);
    //inicjalizacja stanu komponentu
    //TODO: przerobić tak by wykorzystać jeszcze do edycji istniejącego eksperymentu
    //if (props.obj === undefined || props.obj === null){
    this.state = {name:null, perecent_val:null,
        b_i_b:"",s_b:"",
        metricGeneral:"", generated:false, file:"", loaded:false,
        metrics:[],basic_ingredient_base:[], supplement_base:[],
    }
    
}
componentWillUnmount = ()=>{
}


componentDidMount = () => {
    this.refresh()
}
refresh = ()=> {
	
	axios.get("/api/experiment/BasicIngredientBase/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw podstawowego składnika
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});

        this.setState({basic_ingredient_base:arr});
    }).catch(console.log("BasicIngredientBase \n"));
	
	axios.get("/api/experiment/SupplementBase/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw podstawowego dodatku
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});

        this.setState({supplement_base:arr});
    }).catch(console.log("SupplementBase \n"));
	
}

// /api/experiment/Experiment/
    handleChangeNumOfVal = (event) => {    this.setState({numberOfVal: event.target.value});}
	handleChangePercentVal = (event) => {    this.setState({perecent_val: event.target.value});
    this.setState({name: this.state.s_b +" "+ event.target.value +"%"}); }
	handleChangeBIB = (v) => {    
        this.setState({b_i_b: v});
    }
	handleChangeSupBase = (v) => {    
        this.setState({s_b: v});
		this.setState({name: v +" "+ this.state.perecent_val+"%"});
    }
	
    handleInsert =(e) =>{if (! ( this.state.name == "" && this.state.perecent_val == "")){

			//pobranie znacznika CSRF z ciasteczka 
			let token = getCSRFToken()
			//stworzenie odpowiedniego nagłówka zapytania
			const headers = {"X-CSRFTOKEN": token}
			//obiekt z danymi do bazy
			
			
			let arr = []
			this.state.metrics.forEach((v)=>{arr.push(v.id)})
			var exp_head = {
				"name": this.state.name,
				"percentage": this.state.perecent_val,
				"basicIngredientBase": this.state.b_i_b,
				"supplementBase": this.state.s_b
			}
			axios.post("/api/experiment/Supplement/",exp_head,{ headers:headers }).then((res)=>{
				alert(res.statusText);
			}).catch((e)=>{console.log("Something's wrong with inserting experiment");})
		
		}else{
            alert("Uzupełnij")
            }
    }

    
    render(){
    return(
        <form className="box0" id="dataform" onSubmit={this.handleSubmit}>
				<label className="line3">
                    Dodawanie dodatku:
                </label>
                <label className="line2">
                    Nazwa:
                    <input className="line" type="text" value={this.state.name} onChange={this.handleChangeName} readonly />
                </label>
				
                <label className="line2">
                    Zawartość procentowa:
                    <input className="line" type="text" value={this.state.perecent_val} onChange={this.handleChangePercentVal} />
                </label>
                <label className="line2">
                    Bazowy składnik zmniejszany na rzecz dodatku:
                    <Select onChange={this.handleChangeBIB} array={this.state.basic_ingredient_base}/>
                </label>
                <label className="line2">
                    Dodatek:
                    <Select onChange={this.handleChangeSupBase} array={this.state.supplement_base}/>
                </label>
                <div>
                    <button type="button" onClick={this.handleInsert}>Dodaj</button>
                </div>
                
        </form>
    )
    //return <Line obj={obj} onButton={this.handleDelDM}></Line>})}
    }
}

export default Supplement