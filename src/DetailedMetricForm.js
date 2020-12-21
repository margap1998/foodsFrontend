import React from 'react';
import axios from "axios";
import { Select } from "./funcComponents";
import { getCSRFToken } from './csrftoken.js'
import './style.css';


class DetailedMetricForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            num_repeats:0,
            num_series:0,
            samplesBase:[], metricsGeneral:[],
            metric:"",
            sample:""
        }
    }
    componentDidMount = () => {
        this.refresh()
    }
    refresh = ()=> {
        //żądania typu get do API
     axios.get("/api/experiment/Metrics/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name+" - "+obj.unit]);});
        this.setState({metricsGeneral:arr});
    }).catch(console.log("Metric failure \n"));
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
        this.props.closeProc(1)
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
    handleChangeMetric = (v)=>{ this.setState({ metric:v }) }
    handleChangeSample = (v)=>{ this.setState({ sample:v }) }
    handleInsert = ()=>{
        let token = getCSRFToken()
             //stworzenie odpowiedniego nagłówka zapytania
        let headers = {"X-CSRFTOKEN": token}
        let data = {
                "numberOfRepeat": this.state.num_repeats,
                "numberOfSeries": this.state.num_series,
                "metric": this.state.metric,
                "sample": this.state.sample
            }
        
        axios.post("/api/experiment/DetailedMetrics/",data,{ headers:headers })
            .then((res)=>{
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
                Liczba powtórzeń:
                <input className="line" type="text" value={this.state.num_repeats} onChange={this.handleChangeRepeats} />
            </label>
            <label className="line2">
                Liczba serii:
                <input className="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
            </label>
            <label className="line2">
                Metryka ogólna:
                <Select array={this.state.metricsGeneral}  
                        onChange={this.handleChangeMetric}
                        value={this.state.metric}
                ></Select>
            </label>
            <label className="line2">
                Próbka:
                <Select array={this.state.samplesBase}
                        onChange={this.handleChangeSample}
                        value={this.state.sample}
                ></Select>
            </label>
            <button type="button" onClick={this.handleInsert}>Dodaj</button>
        </div>
    }

}

export default DetailedMetricForm