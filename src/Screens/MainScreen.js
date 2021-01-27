import React from 'react';
import {Select} from "../funcComponents"
import '../style.css';
import axios from "axios";
import DataForm from './DataForm';
import { Button, FormLabel} from "@material-ui/core";

class MainScreen extends React.Component{
   constructor(props){
        super(props);
        this.state = {experimentsBase:[], experiments:[], screen:0, product:"",prodBase:[],
        experiment:undefined, expName:""
    };
    }


    componentDidMount = () => {
        this.refresh();
    }

    refresh = ()=> {
        //żądania typu get do API
        axios.get("/api/experiment/Experiment/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.id,obj.name]);});

            this.setState({experimentsBase:res.data, experiments:arr});
        }).catch(console.log("Experiments failure \n"));
    }

// /api/experiment/Experiment/
    handleChangeExp = (v) => {
        this.setState({experiment:this.state.experimentsBase.find((obj)=>{return (obj.id === v)}),expName:v})
    }
    
    handleChangeExpPublic = (v)=>{{
        this.setState({experiment:this.state.experimentsBase.find((obj)=>{return (obj.id === v)})})
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
                        <Button className="line" variant="contained" type="button" >Usuń</Button>
                        <span className="line"/>
                        <Button className="line"  variant="contained" type="button" onClick={(e)=>{this.setState({screen:4})}}>Edytuj eksperyment</Button>
                        <span className="line"/>
                        <Button className="line"  variant="contained" type="button" onClick={(e)=>{this.setState({screen:5})}}>Przeglądaj eksperyment</Button>
                        <span className="line"/>
                        <Button className="line2" variant="contained" type="button" onClick={(e)=>{this.setState({screen:1})}}>Nowy eksperyment</Button>
                        <span className="line"/>
                    <FormLabel className="line">
                        Publiczne:
                        <Select onChange={this.handleChangeExpPublic} array={this.state.prodBase}/>
                        <Button className="line" variant="contained" type="button" onClick={(e)=>{this.setState({screen:6})}}>Przeglądaj udostępniony eksperyment</Button>
                    </FormLabel>
                    
            </div>
        );
        switch (this.state.screen) {
            case 1:
                res = <DataForm closeProc={backToMS}/>
                break;
            case 4:
                res = <DataForm obj={this.state.experiment} closeProc={backToMS}/>
                break;
            default:
                break;
        }
        return res
    }
}

export default MainScreen;