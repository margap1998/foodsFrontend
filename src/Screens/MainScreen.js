import React from 'react';
import {Select} from "../funcComponents"
import '../style.css';
import axios from "axios";
import DataForm from './DataForm';
import AdminPanel from './AdminPanel';


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
            <form className="box" id="dataform" >
                <label className="line3">
                        Ekran Stratowy:
                    </label>
                    <label className="line2">
                        Moje eksperymenty:
                        <Select onChange={this.handleChangeExp} array={this.state.experiments}/>
                    </label>
                    <div>
                        <button type="button" >Usuń</button>
                        <button type="button" value={1} onClick={(e)=>{this.setState({screen:1})}}>Nowy eksperyment</button>
                    </div>
                    <label className="line2">
                        Udostępnione dla mnie:
                        <Select onChange={this.handleChangeExpPublic} array={this.state.prodBase}/>
                    </label>
                <button type="button" onClick={(e)=>{this.setState({screen:2})}}>Panel administracyjny</button>
                    
            </form>
        );
        switch (this.state.screen) {
            case 1:
                res = <DataForm closeProc={backToMS}/>
                break;
            case 2:
                res = <AdminPanel closeProc={backToMS}/>
                break;
            default:
                break;
        }
        return res
    }
}

export default MainScreen;