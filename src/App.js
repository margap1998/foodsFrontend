import React from 'react';
import DataForm from "./DataForm";
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
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
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
        </div>
    }

}

class SampleForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }
    }
    componentWillUnmount = ()=>{
        this.props.closeProc(0)
    }
    render(){
        return <div className="box">
            <button type="button" onClick={this.componentWillUnmount}>X</button>
            ijoiji
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