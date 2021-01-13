import React from 'react';
import axios from "axios";
import { Select } from "../funcComponents";
import { getCSRFToken } from '../csrftoken.js'
import '../style.css';
import SampleForm from './SampleForm';
import { Paper, Button, InputLabel, Input, TextareaAutosize} from "@material-ui/core";


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
            res.data.forEach((obj)=>{arr.push([obj.id,JSON.stringify(obj)])})
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
        return <Paper className="line2"><div className="box0">
            <Button  variant="contained"  className="line2" type="button" onClick={this.componentWillUnmount}>X</Button>
            <InputLabel className="line2">
                    Metryka: {this.props.metric}
            </InputLabel>
            <InputLabel className="line2">
                Próbka:
                <div className="line2">
                    <Select array={this.state.samplesBase}
                            onChange={this.handleChangeSample}
                            value={this.state.sample}
                    ></Select>
                    <Button onClick={ (e)=>{ this.setState({window:<SampleForm refreshDB={this.refreshBase} closeProc={()=>{this.setState({window:undefined})}}/>}) } }>Nowa próbka</Button>
                </div>
            </InputLabel>
            {this.state.window}
            <InputLabel className="line2">
                Liczba powtórzeń:
                <Input className="line" type="text" value={this.state.num_repeats} onChange={this.handleChangeRepeats} />
            </InputLabel>
            <InputLabel className="line2">
                Liczba serii:
                <Input className="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
            </InputLabel>
            <Button className="line2" type="button" onClick={this.handleInsert}>Dodaj</Button>
            </div></Paper>
    }

}

export default DetailedMetricForm