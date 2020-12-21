
import React from 'react';
import DataForm from "./DataForm";
import axios from "axios";
import { Select } from "./funcComponents";
import { getCSRFToken } from './csrftoken.js'
import './style.css';
import DetailedMetricForm from "./DetailedMetricForm";
class SampleForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            supplementsBase:[], supplements:[], supplement:"",
            externalFactors:[], externalFactor:""
        }
    }
    componentDidMount = () => {
        this.refresh()
    }
    refresh = ()=> {
        //żądania typu get do API
     axios.get("http://localhost:8000/api/experiment/Supplement/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name+" - "+obj.percentage+"%"]);});
        this.setState({supplementsBase:arr});
    }).catch(console.log("Metric failure \n"));
        axios.get("http://localhost:8000/api/experiment/ExternalFactor/").then((res)=>{
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
        
        axios.post("http://localhost:8000/api/experiment/Sample/",data,{ headers:headers })
            .then((res)=>{
                this.componentWillUnmount();
                alert("Wstawiono");
            })
            .catch((e)=>{
                console.log("Something's wrong with inserting detailed metric");
                alert("Nie wstawiono")
            })
    }
    componentWillUnmount = ()=>{
        this.props.closeProc(0)
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
            let pred = (vP,i,a)=>{return vP !==v};
            var arr2 = this.state.supplements;
            this.setState({supplements:arr2.filter(pred)});
        }
        return(<div>
            {props.text}
            <button type="button" onClick={() => deleter(props.value)}>
                Usuń dodatek
            </button>
        </div>)
    } 
    makeLine = (arr,v)=>{
        let t = arr.filter((pair)=>{return v===pair[0]})[0][1]
        return <this.Line text={t} value={v} onButton={this.handleDelDM}/>
    }
    render(){
        return <div className="box">
            <button type="button" onClick={this.componentWillUnmount}>X</button>
            <label className="line2">
                Czynnik zewnętrzny:
                <Select array={this.state.externalFactors}
                        onChange={this.handleChangeEF}
                        value={this.state.externalFactor}
                ></Select>
            </label>
            <label className="line2">
                Dodatek:
                <Select array={this.state.supplementsBase}
                        onChange={this.handleChangeSupplements}
                        value={this.state.supplement}
                ></Select>
                <button type="button"
                        onClick={this.handleAddSupplement}>
                        Dodaj dodatek
                </button>
            </label>
            {this.state.supplements.map((v,n,a)=>{ return this.makeLine(this.state.supplementsBase,v)})}
            <button type="button" onClick={this.handleInsert}>Dodaj próbkę</button>
        </div>
    }
}

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={experiment_data:{},section:[null,null]};
    }

    closeWindow = (ind)=>{
        var arr = this.state.section
        arr[ind] = null
        this.setState({section:arr})
    }

    addSection = (obj,ind)=>{
        var arr = this.state.section
        arr[ind] = obj
        this.setState({section:arr})
    }

    render = ()=>{
        return <div id ="App">
            <nav className="box">
                <div>
                <button onClick={(e)=>{ this.addSection(<SampleForm closeProc={this.closeWindow}/>,0) }}>Nowa próbka</button>
                <button onClick={(e)=>{ this.addSection(<DetailedMetricForm closeProc={this.closeWindow} />,1) } }>Nowa metryka szczegółowa</button>
                </div>
            </nav>
            {this.state.section.map((v)=>{return v})}
            <DataForm/>
        </div>
    }
}

export default App;