import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import axios from "axios";
import download from 'downloadjs';
import {getCSRFToken} from './csrftoken'

//komponent funk. przekształcający tablicę 1-D z wartościami w listę rozwijaną z elementem "pustym"
function Select(props){
    var q =[""]
    q = q.concat(props.array)//tablica z wartościami
    var op = q.map(value =>{return(<option value={value}>{value}</option>)}) // zrobienie opcji
    return(
        <select value={props.value} onChange={e => props.onChange(e.target.value) /* element typu select z listą rozwijaną*/}> 
            {op /* tablica z mapowanymymi wartościami na elementy typu option*/}
        </select>
    )
}

//Komponenet odpowiedzialny za formularz eksperymentu
class DataForm extends React.Component{
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
        <button type="button" onClick={(e) => props.onButton(props.obj)}>
            Usuń
        </button>
    </div>)
} 
componentDidMount = () => {
    this.refresh()
}
refresh = ()=> {
 
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
        <form className="box" id="dataform" onSubmit={this.handleSubmit}>
				<label className="line3">
                    Dodawanie czynnika zewnetrznego:
                </label>
                <label className="line2">
                    Nazwa:
                    <input className="line" type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>
                <label className="line2">
                    Liczba Wartosci:
                    <input className="line" type="text" value={this.state.numberOfVal} onChange={this.handleChangeNumOfVal} />
                </label>
                <label className="line2">
                    Jednostka:
                    <input className="line" type="text" value={this.state.unit} onChange={this.handleChangeUnit} />
                </label>
                <label className="line2">
                    Wartosci:
                    <input className="line" type="text" value={this.state.values} onChange={this.handleChangeValues}/>
                </label>
                <div>
                    <button type="button" onClick={this.handleInsert}>Dodaj</button>
                </div>
                
        </form>
    )
    //return <Line obj={obj} onButton={this.handleDelDM}></Line>})}
    }
}


class App extends React.Component{
    constructor(props){
        super(props)
        this.state={experiment_data:{},section:"form"}
    }
    render(){
        var section = (<div>Coś się popsuło</div>);
        switch(this.state.section){
            case "form":
                section = <DataForm/>
            break;
            default:
            break;
        }
        return <div id ="App">
            {section}
        </div>
    }
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
  