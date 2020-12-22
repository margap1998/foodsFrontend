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
    this.state = {name:null, desc:null, 
        num_repeats:"", num_features:0, sample:1, metricID:"",
        paper:"", private:false, product:"", metric:"", filename:"",
        metricGeneral:"", generated:false, file:"", loaded:false,
        experiments:[], ingredients:[], metrics:[],
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
    //żądania typu get do API
    axios.get("/api/experiment/Experiment/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw kategorii
        res.data.forEach((obj)=>{arr.push(obj.name);});

        this.setState({experiments:arr});
    }).catch(console.log("Experiments failure \n"));
}

// /api/experiment/Experiment/
    handleChangeExp = (v) => {    
        this.setState({category: v});
        var arr = []
        this.state.prodObj.forEach((lv,i,a)=>{if(lv.category === v){arr.push(lv.name)}})
        this.setState({experiments:arr, product:""})
    }
 
    render(){
    return(
        <form className="box" id="dataform" onSubmit={this.handleSubmit}>
			<label className="line3">
                    Ekran Stratowy:
                </label>
                <label className="line2">
                    Moje eksperymenty:
                    <Select onChange={this.handleChangeExp} array={this.state.experiments}/>
                </label>
				<div>
                    <button type="button" onClick={this.handleInsert}>Usuń</button>
                    <button type="button" onClick={this.handleChange}>Dodaj eksperyment</button>
                </div>
				<label className="line2">
                    Udostępnione dla mnie:
                    <Select onChange={this.handleChangeProd} array={this.state.prodBase}/>
                </label>
                
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
  