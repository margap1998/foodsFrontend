import React from 'react';
import {Select} from "../funcComponents"
import '../style.css';
import axios from "axios";
import DataForm from './DataForm';
import AdminPanel from './AdminPanel';
import Product from "./Product";
import { Button, FormLabel, AppBar } from "@material-ui/core";

class MainScreen extends React.Component{
   constructor(props){
        super(props);
        this.state = {experimentsBase:[], experiments:[], screen:0, product:"",prodBase:[]};
    }


    componentDidMount = () => {
        this.refresh();
    }

    refresh = ()=> {
        //żądania typu get do API
        axios.get("/api/experiment/Experiment/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw kategorii
            res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});

            this.setState({experimentsBase:res.data, experiments:arr});
        }).catch(console.log("Experiments failure \n"));
    }

// /api/experiment/Experiment/
    handleChangeExp = (v) => {    
    }
    
    handleChangeExpPublic = ()=>{}
    render = ()=>{
        let backToMS = ()=>{this.setState({screen:0})}
        var res = (
            <div className="box0" id="dataform" >
                    <FormLabel ><h3>Ekran Startowy:</h3>
                    </FormLabel>
                    <FormLabel className="line2">
                        Moje eksperymenty:
                        <Select onChange={this.handleChangeExp} array={this.state.experiments}/>
                    </FormLabel>
                    <div className="line2">
                        <Button variant="contained" color="primary" type="button" >Usuń</Button>
                        <Button variant="contained" color="primary" type="button" onClick={(e)=>{this.setState({screen:4})}}>Edytuj eksperyment</Button>
                        <Button variant="contained" color="primary" type="button" onClick={(e)=>{this.setState({screen:5})}}>Przeglądaj eksperyment</Button>
                    </div>
                    <FormLabel className="line2">
                        Udostępnione dla mnie:
                        <Select onChange={this.handleChangeExpPublic} array={this.state.prodBase}/>
                        <Button variant="contained" color="primary" type="button" onClick={(e)=>{this.setState({screen:5})}}>Przeglądaj eksperyment</Button>
                    </FormLabel>
                <Button className="line2" variant="contained" color="primary" type="button" onClick={(e)=>{this.setState({screen:1})}}>Nowy eksperyment</Button>
                <Button className="line2" variant="contained" color="primary" type="button" onClick={(e)=>{this.setState({screen:2})}}>Panel administracyjny</Button>
                <Button className="line2" variant="contained" color="primary" type="button" onClick={(e)=>{this.setState({screen:3})}}>Produkty</Button>
                    
            </div>
        );
        switch (this.state.screen) {
            case 1:
                res = <DataForm closeProc={backToMS}/>
                break;
            case 2:
                res = <AdminPanel closeProc={backToMS}/>
                break;
            case 3:
                res = <Product closeProc={backToMS}/>
                break;
            default:
                break;
        }
        return res
    }
}

export default MainScreen;