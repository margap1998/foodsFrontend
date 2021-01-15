import React from 'react';
import '../style.css';
import axios from "axios";
import { Select } from "../funcComponents";
import {getCSRFToken} from '../csrftoken'
import { Button, InputLabel, Input } from "@material-ui/core";

//Komponenet odpowiedzialny za formularz eksperymentu
class Supplement extends React.Component{
   constructor(props){
    super(props);
    //inicjalizacja stanu komponentu
    //TODO: przerobić tak by wykorzystać jeszcze do edycji istniejącego eksperymentu
    //if (props.obj === undefined || props.obj === null){
    this.state = {name:props.name, perecent_val:0,
        b_i_b:"",s_b:"",
        metricGeneral:"", generated:false, file:"", loaded:false,
        metrics:[],basic_ingredient_base:[], supplement_base:[],nameOld:""
    }
    
}
componentDidUpdate = ()=>{
    if(this.props.name !== this.state.nameOld){
        axios.get("/api/experiment/Supplement/"+this.props.name+"/").then((res)=>{
            this.setState({nameOld:this.props.name,name:res.data.name,
            perecent_val:res.data.percentage,
            b_i_b:res.data.basicIngredientBase,
            s_b: res.data.supplementBase
        });
        }).catch(console.log("SupplementBase \n"));
    }
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
                this.props.afterCreate()
			}).catch((e)=>{console.log("Something's wrong with inserting experiment");})
		
		}else{
            alert("Uzupełnij")
            }
    }

    
    render(){
    return(
        <div>
                <InputLabel className="line2">
                    Nazwa starego dodatku:
                    <Input className="line" type="text" value={this.state.nameOld} readonly />
                </InputLabel>
                <InputLabel className="line2">
                    Zawartość procentowa:
                    <Input className="line" type="text" value={this.state.perecent_val} onChange={this.handleChangePercentVal} />
                </InputLabel>
                <InputLabel className="line2">
                    Bazowy składnik zmniejszany na rzecz dodatku:
                    <Select className="line" value={this.state.b_i_b} onChange={this.handleChangeBIB} array={this.state.basic_ingredient_base}/>
                </InputLabel>
                <InputLabel className="line2">
                    Dodatek:
                    <Select className="line" value={this.state.s_b} onChange={this.handleChangeSupBase} array={this.state.supplement_base}/>
                </InputLabel>
                    <Button className="line" type="button" onClick={this.handleUpdate}>Zmodyfikuj dodatek</Button>
                    <span className="line"/>
                    <Button className="line" type="button" onClick={this.handleDelete}>Usuń dodatek</Button>

                <div>
                    <InputLabel className="line2">
                        Nazwa nowego dodatku:
                        <Input className="line" type="text" value={this.state.name} readonly />
                    </InputLabel>
                    <Button className="line" type="button" onClick={this.handleInsert}>Dodaj nowy dodatek</Button>
                </div>
                
        </div>
    )
    //return <Line obj={obj} onButton={this.handleDelDM}></Line>})}
    }
}

export default Supplement