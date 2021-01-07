import React from 'react';
import axios from "axios";
import { Select } from "../funcComponents";
import { getCSRFToken } from '../csrftoken.js'
import '../style.css';
import SampleForm from './SampleForm';


class DetailedMetricForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            num_repeats:0,
            num_series:0,
            samplesBase:[], metricsGeneral:[],
            sample:"",
            window:undefined
        }
    }
    componentDidMount = () => {
        this.refreshBase()
    }
    refreshBase = ()=> {
        axios.get("/api/experiment/Sample/").then((res)=>{
            var arr = []
            res.data.forEach((obj)=>{arr.push([obj.id,obj.supplement.reduce((pV,cV)=>{return pV+" "+cV})])})
            this.setState({samplesBase:arr});
        }).catch(console.log("Samples failure \n"));
    }
    handleChangeRepeats = (event)=>{    
        const regExp = /^[0-9]*$/;
        const a = event.target.value;
        let test = regExp.test(a)
        if(test){
            this.setState({num_repeats: a});
        }else{
            this.setState({num_repeats: this.state.num_repeats})
        }

    }
    componentWillUnmount = ()=>{
        this.props.closeProc()
    }
    handleChangeSeries = (event)=>{    
        const regExp = /^[0-9]*$/;
        const a = event.target.value;
        let test = regExp.test(a)
        if(test){
            this.setState({num_series: a});
        }else{
            this.setState({num_series: this.state.num_series})
        }
    }
    handleChangeSample = (v)=>{ this.setState({ sample:v }) }
    handleInsert = ()=>{
        let token = getCSRFToken()
             //stworzenie odpowiedniego nagłówka zapytania
        let headers = {"X-CSRFTOKEN": token}
        let data = {
                "numberOfRepeat": this.state.num_repeats,
                "numberOfSeries": this.state.num_series,
                "metric": this.props.metric,
                "sample": this.state.sample
            }
        
        axios.post("/api/experiment/DetailedMetrics/",data,{ headers:headers })
            .then((res)=>{
                this.props.refreshDB()
                this.componentWillUnmount()
                alert("Wstawiono");
            })
            .catch((e)=>{
                console.log("Something's wrong with inserting detailed metric");
                alert("Nie wstawiono")
            })
    }

    render(){
        return <div className="box">
            <button type="button" onClick={this.componentWillUnmount}>X</button>
            <label className="line2">
                    Metryka: {this.props.metric}
            </label>
            <label className="line2">
                            Próbka:
                <Select array={this.state.samplesBase}
                        onChange={this.handleChangeSample}
                        value={this.state.sample}
                ></Select>
                <button onClick={ (e)=>{ this.setState({window:<SampleForm refreshDB={this.refreshBase} closeProc={()=>{this.setState({window:undefined})}}/>}) } }>Nowa próbka</button>
            </label>
            {this.state.window}
            <label className="line2">
                Liczba powtórzeń:
                <input className="line" type="text" value={this.state.num_repeats} onChange={this.handleChangeRepeats} />
            </label>
            <label className="line2">
                Liczba serii:
                <input className="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
            </label>
            <button type="button" onClick={this.handleInsert}>Dodaj</button>
        </div>
    }

}

export default DetailedMetricForm