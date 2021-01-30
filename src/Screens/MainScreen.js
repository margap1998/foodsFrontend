import React from 'react';
import {Select} from "../funcComponents"
import { getCSRFToken } from '../csrftoken.js'
import '../style.css';
import axios from "axios";
import DataForm from './DataForm';
import ExperimentOverview from './ExperimentOverview.js';
import { Button, FormLabel} from "@material-ui/core";

class MainScreen extends React.Component{
   constructor(props){
        super(props);
		
        this.state = {experimentsBase:[], experiments:[], screen:0, product:"",prodBase:[], prod:[],
        experiment:undefined, pubExperiment:undefined, expName:"", pubExpName:""
    };
    }


    componentDidMount = () => {
        this.refresh();
    }
	

    refresh = ()=> {
        //żądania typu get do API
        axios.get("/api/experiment/Experiment/").then((res)=>{
            var arr = [];
			var arr2 = [];
            //wyłuskanie nazw kategorii
			this.setState({prodBase:res.data.filter(obj => obj.author_name != this.props.user && obj.publicView == true)});
			this.setState({experimentsBase:res.data.filter(obj => obj.author_name == this.props.user)});
			this.state.prodBase.forEach((v)=>{arr2.push([v.id,v.name]);});
            this.state.experimentsBase.forEach((obj)=>{arr.push([obj.id,obj.name]);});
            this.setState({ experiments:arr, prod:arr2});
        }).catch(console.log("Experiments failure \n"));
    }
	
	alertme = ()=>{alert("Jo")}
	
	handleDeleteExp = ()=>{
		
		let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
		
		axios.delete("/api/experiment/Experiment/"+this.state.experiment.id+"/",{ headers:headers }).then(()=>{
			 alert("Usunięto");
			 this.refresh();
			 this.setState({experiment:undefined});
		}).catch(()=>{console.log("Something's wrong with deleting experiment"); alert("Nie można usunąć!")})    
	}

// /api/experiment/Experiment/
    handleChangeExp = (v) => {
        this.setState({experiment:this.state.experimentsBase.find((obj)=>{return (obj.id === v)}),expName:v})
    }
    
    handleChangeExpPublic = (v)=>{{
        this.setState({pubExperiment:this.state.prodBase.find((obj)=>{return (obj.id === v)}),pubExpName:v})
    }}
    render = ()=>{
        let backToMS = ()=>{this.setState({screen:0}); this.refresh()}
        var res = (
            <div className="box0" id="dataform" >
                    <FormLabel ><h3>Ekran Startowy:</h3>
                    </FormLabel>
                    <FormLabel className="line">
                        Moje eksperymenty:
                        <Select onChange={this.handleChangeExp} value={this.state.expName} array={this.state.experiments}/>
                    </FormLabel>
                        <Button className="line" variant="contained" type="button" onClick={(e)=>{this.handleDeleteExp()}}>Usuń</Button>
                        <span className="line"/>
                        <Button className="line"  variant="contained" type="button" onClick={(e)=>{this.setState({screen:4})}}>Edytuj eksperyment</Button>
                        <span className="line"/>
                        <Button className="line"  variant="contained" type="button" onClick={(e)=>{this.setState({screen:5})}}>Przeglądaj eksperyment</Button>
                        <span className="line"/>
                        <Button className="line2" variant="contained" type="button" onClick={(e)=>{this.setState({screen:1})}}>Nowy eksperyment</Button>
                        <span className="line"/>
                    <FormLabel className="line">
                        Publiczne:
                        <Select onChange={this.handleChangeExpPublic} value={this.state.pubExpName} array={this.state.prod}/>
                        <Button className="line" variant="contained" type="button" onClick={(e)=>{this.setState({screen:6})}}>Przeglądaj udostępniony eksperyment</Button>
                    </FormLabel>
                    
            </div>
        );
        switch (this.state.screen) {
            case 1:
                res = <DataForm closeProc={backToMS} user={this.props.user}/>
                break;
            case 4:
                res = <DataForm obj={this.state.experiment} closeProc={backToMS} user={this.props.user}/>
                break;
            case 5:
                if(this.state.experiment === undefined){
                    this.setState({screen:0});
                    alert("Proszę wybrać Eksperyment");
                }else{
                    res = <ExperimentOverview obj={this.state.experiment} closeProc={backToMS}/>
                }
                break;
			case 6:
				if(this.state.pubExperiment === undefined){
                    this.setState({screen:0});
                    alert("Proszę wybrać udostępniony Eksperyment ");
                }else{
                    res = <ExperimentOverview obj={this.state.pubExperiment} closeProc={backToMS}/>
                }
                break;
            default:
                break;
        }
        return res
    }
}

export default MainScreen;