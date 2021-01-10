import React from 'react';
import axios from "axios";
import { Select } from "../funcComponents";
import { getCSRFToken } from '../csrftoken.js'
import ExternalFactor from './ExternalFactor';
import { Button, InputLabel, Paper} from "@material-ui/core";
class SampleForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            supplementsBase:[], supplements:[], supplement:"",
            externalFactors:[], externalFactor:"", window:undefined
        }
    }
    componentDidMount = () => {
        this.refresh()
    }
    refresh = ()=> {
        //żądania typu get do API
     axios.get("/api/experiment/Supplement/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name+" - "+obj.percentage+"%"]);});
        this.setState({supplementsBase:arr});
    }).catch(console.log("Metric failure \n"));
        axios.get("/api/experiment/ExternalFactor/").then((res)=>{
            var arr = []
            res.data.forEach((obj)=>{arr.push([obj.name, obj.name+" ["+obj.values+"]"+" "+obj.unit])})
            this.setState({externalFactors:arr});
        }).catch(console.log("Samples failure \n"));
    }
    handleInsert = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "externalFactor": this.state.externalFactor,
            "supplement": this.state.supplements
        }
        
        axios.post("/api/experiment/Sample/",data,{ headers:headers })
            .then((res)=>{
                this.componentWillUnmount();
                this.props.refreshDB()
                alert("Wstawiono");
            })
            .catch((e)=>{
                console.log("Something's wrong with inserting detailed metric");
                alert("Nie wstawiono")
            })
    }
    componentWillUnmount = ()=>{
        this.props.closeProc()
    }
    handleChangeEF = (v)=>{ this.setState({externalFactor:v}) }
    handleChangeSupplements = (v) =>{
        this.setState({supplement:v})
    }
    handleAddSupplement = () =>{
        let v = this.state.supplement
        if(v!==""){
            var arr = this.state.supplements
            if (!(v == "" || this.state.supplements.includes(v))){
                arr.push(v)
            }
            this.setState({supplements:arr, supplement:""})
        }
    }
    

    Line = (props) => {
        let deleter = (v)=>{
            let pred = (vP)=>{return vP !==v};
            var arr2 = this.state.supplements;
            this.setState({supplements:arr2.filter(pred)});
        }
        return(<div>
            {props.text}
            <Button type="button" onClick={() => deleter(props.value)}>
                Usuń dodatek
            </Button>
        </div>)
    } 
    makeLine = (arr,v)=>{
        let t = arr.filter((pair)=>{return v===pair[0]})[0][1]
        return <this.Line text={t} value={v} onButton={this.handleDelDM}/>
    }

    newExternalFactor = (e)=>{
        let closeProc = ()=>{
            this.setState({window:undefined})
        }
        this.setState({window:<ExternalFactor closeProc={closeProc}/>})
    }
    render(){
        
        return  <div className="box0"><Paper className="line2">
            <Button variant="contained" className="line2" type="button" onClick={()=>{this.componentWillUnmount()}}>X</Button>
            <InputLabel className="line2">
                Czynnik zewnętrzny:
                <span className="line2"><Select array={this.state.externalFactors}
                        onChange={this.handleChangeEF}
                        value={this.state.externalFactor}
                ></Select>
                <Button type="button" onClick={()=>{this.newExternalFactor()}}>Nowy</Button></span>
            </InputLabel>
            {this.state.window}
            <InputLabel className="line2">
                Dodatek:
                <span className="line2">
                <Select array={this.state.supplementsBase}
                        onChange={this.handleChangeSupplements}
                        value={this.state.supplement}
                ></Select>
                <Button type="button"
                        onClick={this.handleAddSupplement}>
                        Dodaj dodatek
                </Button>
                </span>
            </InputLabel>
            {this.state.supplements.map((v,n,a)=>{ return this.makeLine(this.state.supplementsBase,v)})}
            <Button type="button" onClick={this.handleInsert}>Dodaj próbkę</Button>
            </Paper></div>
    }
}

export default SampleForm