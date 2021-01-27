import React from 'react'
import axios from 'axios'
import { getCSRFToken } from "../csrftoken"
import { Button, Checkbox, Input, FormLabel } from '@material-ui/core'
import { SelectArrayElement } from "../funcComponents"
class MetricForm extends React.Component{
    constructor(props){
        super(props)
        this.state={ new:true,metricsGeneral:[], metricsDB:[],
            metric:{
                "name": "",
                "unit": "",
                "scale": ""
            }
        }
    }
    componentDidMount = ()=>{
        this.refreshDB()
    }
    refreshDB = ()=>{
        axios.get("/api/experiment/Metrics/").then((res)=>{
            var arr = [];
            //wyłuskanie nazw metryk
           res.data.forEach((obj)=>{arr.push([obj.name,obj.name,obj.unit]);});
            this.setState({metricsGeneral:arr, metricsDB:res.data});
        }).catch(console.log("Metric failure \n"));
    }
    selectMetric = (v)=>{
        let marr = this.state.metricsDB.find((o)=>{return o.name===v})
        this.setState({metric:marr})
    }
    changeName = (e)=>{
        let m = this.state.metric
        m.name = e.target.value
        this.setState({metric:m})
    }
    changeScale = (e)=>{
        let m = this.state.metric
        m.scale = e.target.value
        this.setState({metric:m})
    }
    changeUnit = (e)=>{
        let m = this.state.metric
        m.unit = e.target.value
        this.setState({metric:m})
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        axios.post("/api/experiment/Metrics/",this.state.metric,{headers:headers, withCredentials:true}).then((e)=>{
            this.refreshDB()
            alert(`Wstawiono metrykę "${this.state.metric.name} - ${this.state.metric.unit}"`)
        }).catch((e)=>{alert(`Nie wstawiono metryki "${this.state.metric.name} - ${this.state.metric.unit}"`)})
    }

    handleUpdate = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        axios.put(`/api/experiment/Metrics/${this.state.metric.name}/`,this.state.metric,{headers:headers, withCredentials:true}).then((e)=>{
            this.refreshDB()
            alert(`Zmieniono metrykę "${this.state.metric.name} - ${this.state.metric.unit}"`)
        }).catch((e)=>{alert(`Nie zmieniono metryki "${this.state.metric.name} - ${this.state.metric.unit}"`)})
    }

    handleDelete = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        axios.delete(`/api/experiment/Metrics/${this.state.metric.name}`,{headers:headers, withCredentials:true}).then((e)=>{
            alert(`Usunięto metrykę "${this.state.metric.name} - ${this.state.metric.unit}"`);
            this.refreshDB()
        }).catch((e)=>{alert(`Nie usunięto metryki "${this.state.metric.name} - ${this.state.metric.unit}"`)})
    }


    
    render = ()=>{
        return <div>
            <FormLabel className>
                <Checkbox checked={this.state.new}
                    onChange={()=>{this.setState({new:!this.state.new})}}
                />
                Nowa
            </FormLabel>
            <span className="line"/>
            <FormLabel className="line">
                Nazwa
                {(this.state.new)?
                    <Input value={this.state.metric.name} onChange={this.changeName} className="line"/>:
                    <SelectArrayElement values={this.state.metric.name} array={this.state.metricsGeneral} className="line" onChange={this.selectMetric}/>
                }
            </FormLabel>
            <FormLabel className="line">
                Skala
                <Input value={this.state.metric.scale} className="line" onChange={this.changeScale}/>
            </FormLabel>
            <FormLabel className="line">
                Jednostka
                <Input value={this.state.metric.unit} className="line" onChange={this.changeUnit}/>
            </FormLabel>
            <span className="margin"/>
        {(this.state.new)?
                <Button variant="contained" onClick={this.handleSubmit}>Dodaj metrykę</Button>:
            <span>
                <Button variant="contained"  onClick={this.handleUpdate}>Zmień metrykę</Button>
                <span className="margin"/>
                <Button variant="contained" onClick={this.handleDelete}>Usuń metrykę</Button>
            </span>
        }
        </div>
    }
}

export default MetricForm