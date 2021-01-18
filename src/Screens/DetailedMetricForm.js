import React from 'react';
import axios from "axios";
import { Select } from "../funcComponents";
import { getCSRFToken } from '../csrftoken.js'
import '../style.css';
import SampleForm from './SampleForm';
import { Button, InputLabel, Input } from "@material-ui/core";
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";


class DetailedMetricForm extends React.Component{
    constructor(props){
        super(props)
            this.state={
                num_repeats:0,
                num_series:0,
                sample:"",
                id:0,
                window:undefined
            }
    }
    componentDidMount = () => {
    }
    componentDidUpdate = ()=>{
        if (this.state.id != this.props.metricObj.id){
            this.setState({
                sample :        this.props.metricObj.sample,
                num_repeats :   this.props.metricObj.numberOfRepeat,
                num_series :    this.props.metricObj.numberOfSeries,
                id :            this.props.metricObj.id

            })
        }
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
                this.props.refreshDB(res.data)
                this.setState({id:res.id})
                alert("Wstawiono");
            })
            .catch((e)=>{
                console.log("Something's wrong with inserting detailed metric");
                alert("Nie wstawiono")
            })
    }
    handleDelete = ()=>{
        let token = getCSRFToken()
             //stworzenie odpowiedniego nagłówka zapytania
        let headers = {"X-CSRFTOKEN": token}
        axios.delete("/api/experiment/DetailedMetrics/"+this.state.id+"/",{headers:headers, withCredentials:true}).then(_=>{
            alert("Usunięto")
            this.props.refreshDB()
        }).catch(()=>{alert("Nie usunięto")})
    }
    handleUpdate = ()=>{
        let token = getCSRFToken()
             //stworzenie odpowiedniego nagłówka zapytania
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "numberOfRepeat": this.state.num_repeats,
            "numberOfSeries": this.state.num_series,
            "metric": this.props.metric,
            "sample": this.state.sample
        }
        axios.put("/api/experiment/DetailedMetrics/"+this.state.id+"/",data,{headers:headers, withCredentials:true}).then(_=>{
            alert("zmieniono")
        }).catch((e)=>{alert("Nie zmieniono")})
    }
    addSampl = (v)=>{
        this.props.addSampl(v)
        this.setState({sample:v.id})
    }
    render = ()=>{
        return <div className="line">
            <InputLabel className="line2">
                    Metryka: {this.props.metric}
            </InputLabel>
            <InputLabel className="line2">
                Próbka:
                <div className="line2">
                    <Select array={this.props.sampleBase}
                            onChange={this.handleChangeSample}
                            value={this.state.sample}
                            className="line"
                    ></Select>
                </div>
            </InputLabel>
            <Accordion className="line">
                <AccordionSummary className="line">
                    Edycja próbki
                </AccordionSummary>
                <AccordionDetails className="line">
                    <SampleForm afterCreate={this.addSampl} sampleID={this.state.sample} closeProc={()=>{this.setState({window:undefined})}}/>
                </AccordionDetails>
            </Accordion>
            <InputLabel className="line2">
                Liczba serii:
                <Input className="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
            </InputLabel>
            <InputLabel className="line2">
                Liczba powtórzeń:
                <Input className="line" type="text" value={this.state.num_repeats} onChange={this.handleChangeRepeats} />
            </InputLabel>
            <Button className="line2" type="button" onClick={this.handleInsert}>Dodaj nową metrykę szczegółową</Button>
            <span className="line2"></span>
            <Button className="line2" type="button" onClick={this.handleDelete}>Usuń metrykę szczegółową</Button>
            <span className="line2"></span>
            <Button className="line2" type="button" onClick={this.handleUpdate}>Zmień dane metryki szczegółowej</Button>
        </div>
    }

}

export default DetailedMetricForm