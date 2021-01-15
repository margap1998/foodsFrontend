import React from 'react';
import '../style.css';
import axios from "axios";
import {getCSRFToken} from '../csrftoken'
import { Button, InputLabel, Input } from "@material-ui/core";

//Komponenet odpowiedzialny za formularz eksperymentu
class ExternalFactor extends React.Component{
   constructor(props){
    super(props);
    //inicjalizacja stanu komponentu
    //TODO: przerobić tak by wykorzystać jeszcze do edycji istniejącego eksperymentu
    //if (props.obj === undefined || props.obj === null){
    this.state = {name:null, numberOfVal:1, unit:null, values:null, desc:null, 
        num_repeats:"", num_features:0, sample:1, metricID:"",
        paper:"", private:false, product:"", metric:"", filename:"",
        metricGeneral:"", generated:false, file:"", loaded:false,
        categories:[], ingredients:[], metrics:[],
        prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
        metricsDetailed:[], sampleBase:[],recipeBase:[]
    }
    
}
//komponent odpowiedzialny za usuwalną linijkę z metryką szczegółową
//props.obj - metryka szczegółowa do obskoczenia
// props.onButton - funkcja do wywołania dla przycisku usuń
Line = (props) => {
    return(<div>
        {props.obj['id']+":"+" type:"+props.obj['metric']+" number of repeats:"+props.obj['numberOfRepeat']}
        <Button type="button" onClick={(e) => props.onButton(props.obj)}>
            Usuń
        </Button>
    </div>)
} 

// /api/experiment/Experiment/
//name:null, numberOfVal:1, unit:null, values:null,
    handleChangeName = (event) => {    this.setState({name: event.target.value});}
    handleChangeNumOfVal = (event) => {    this.setState({numberOfVal: event.target.value});}
    handleChangeUnit = (event) => {    this.setState({unit: event.target.value});}
	handleChangeValues = (event) => {    this.setState({values: event.target.value});}
	
    handleInsert =(e) =>{if (! ( this.state.numberOfVal<1 && this.state.name == "" && this.state.unit == "" && this.state.values == "")){
            var split_str = this.state.values.split(",");
			let result = true;
			if(split_str.length != this.state.numberOfVal){
				result = false;
				alert("Niepoprawna liczba wartosci");
				}


			if(result == true){
				//pobranie znacznika CSRF z ciasteczka 
				let token = getCSRFToken()
				//stworzenie odpowiedniego nagłówka zapytania
				const headers = {"X-CSRFTOKEN": token}
				//obiekt z danymi do bazy
				
				
				let arr = []
				this.state.metrics.forEach((v)=>{arr.push(v.id)})
				var exp_head = {
					"name": this.state.name,
					"numberOfValues": this.state.numberOfVal,
					"unit": this.state.unit,
					"values": this.state.values
				}

				axios.post("/api/experiment/ExternalFactor/",exp_head,{ headers:headers }).then((res)=>{
					alert(res.statusText);
				}).catch((e)=>{console.log("Something's wrong with inserting experiment");})
			}
		}else{
            alert("Uzupełnij")
            }
    }


    render(){
    return(
        <form id="externalFactorForm">
                <InputLabel className="line">
                    Nazwa:
                    <Input className="line" type="text" value={this.state.name} onChange={this.handleChangeName} />
                </InputLabel>
                <InputLabel className="line2">
                    Liczba Wartosci:
                    <Input className="line" type="text" value={this.state.numberOfVal} onChange={this.handleChangeNumOfVal} />
                </InputLabel>
                <InputLabel className="line2">
                    Jednostka:
                    <Input className="line" type="text" value={this.state.unit} onChange={this.handleChangeUnit} />
                </InputLabel>
                <InputLabel className="line2">
                    Wartosci:
                    <Input className="line" type="text" value={this.state.values} onChange={this.handleChangeValues}/>
                </InputLabel>
                <div>
                    <Button className="line"  type="button" onClick={this.handleInsert}>Dodaj</Button>
                </div>
                
        </form>
        )
    }
}

export default ExternalFactor