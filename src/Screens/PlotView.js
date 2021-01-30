import '../style.css';
import React from 'react';
import Axios from "axios";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormLabel } from "@material-ui/core";
import { SelectArrayElement } from '../funcComponents';
import axios from "axios";

class BarLinearPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {exp:"",ef:"",met:"",dm:"",series:1, images:[], sm:[], seriesArr:[]}
    }

    plotHandle= (type)=>{
        let p = {
            experiment_id:this.props.experiment.id,
            series_metric: this.state.sm
        }
        Axios.post(this.props.apiURL,p).then( res =>{
            let images = this.state.images.concat(res.data.plots.map(pl=>{return "data:image/png;base64,"+pl}))
            this.setState({images:images})
        }).catch( e =>{
            alert("Problem z wygenerowaniem wykresu")
        })
    }
    addButton = ()=>{
        let arr = this.state.sm
        arr.push([this.state.series,this.state.dm])
        this.setState({sm:arr})
    }
    onChangeDM = (v)=>{
        let dm = this.props.base.metricsDetailedBase.find((m)=>{return m.id === v})
        let arr = []
        for(let i = 1; i<=parseInt(dm.numberOfSeries);i++){
            arr.push([i,i])
        }
        this.setState({seriesArr:arr,dm:v})
    }
    onChangeSeries = (v)=>{this.setState({series:v})}
    render = ()=>{
        return <div className="line">
            <div className="box">
            <div className="line">Pamiętaj, aby metryki szczegółowe byłyby tego samego typu metryki</div>
            <div className="line"> i dotyczyły próbek z tego samego czynnika zewnętrznego!</div>
            </div>
            <FormLabel>Metryka szczegółowa<SelectArrayElement onChange={this.onChangeDM} value={this.state.dm} array={this.props.base.metricsDetailed}/></FormLabel>
            <FormLabel>Seria<SelectArrayElement onChange={this.onChangeSeries} array={this.state.seriesArr} value={this.state.series}/></FormLabel> 
            <Button onClick={this.addButton}>Dodaj</Button>
            <Button onClick={()=>{this.setState({sm:[]})}}>Wyczyść tablicę</Button>
            <Button onClick={()=>{this.setState({images:[]})}}>Wyczyść obrazy</Button>
            <Button className="line" onClick={() =>{this.plotHandle("")}}>Wykres</Button>
            <div className="line">Seria z metryki do pokazania: {JSON.stringify(this.state.sm)}</div>
           <FormLabel><div className="line">Wykresy:</div>{this.state.images.map((v)=>{return <img width="100%" src={v}/>})}</FormLabel> 

        </div>
    }
}

class RadarPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {exp:"",ef:"",met:"",sample:"", images:[], metrics:[],samples:[]}
    }
    plotHandle= (type)=>{
        let p = {
            experiment_id:this.props.experiment.id,
            samples:this.state.samples,
            metrics:this.state.metrics
        }
        Axios.post(`/api/experiment/generateRadarPlots/`,p).then( res =>{
            let images = this.state.images.concat(res.data.plots.map(pl=>{return "data:image/png;base64,"+pl}))
            this.setState({images:images})
        }).catch( e =>{
            alert("Problem z wygenerowaniem wykresu")
        })
    }
    onChangeMet = (v)=>{this.setState({met:v})}
    onChangeSamp = (v)=>{this.setState({sample:v})}
    addButtonMet = ()=>{
        let arr = this.state.metrics
        arr.push(this.state.met)
        this.setState({metrics:arr})
    }
    addButtonSamp = ()=>{
        let arr = this.state.samples
        arr.push(this.state.sample)
        this.setState({samples:arr})
    }
    render = ()=>{
        return <div className="line"> 
            <FormLabel>Metryka<SelectArrayElement onChange={this.onChangeMet} value={this.state.met} array={this.props.base.metricsGeneral}/></FormLabel>
            <FormLabel>Próbka<SelectArrayElement onChange={this.onChangeSamp} value={this.state.sample} array={this.props.base.samples}/></FormLabel> 
            <Button onClick={this.addButtonMet}>Dodaj metrykę</Button> 
            <Button onClick={this.addButtonSamp}>Dodaj próbkę</Button>
            <Button onClick={()=>{this.setState({metrics:[]})}}>Wyczyść tablicę metryk</Button>
            <Button onClick={()=>{this.setState({samples:[]})}}>Wyczyść tablicę próbek</Button>
            <Button onClick={()=>{this.setState({images:[]})}}>Wyczyść obrazy</Button>
            <Button className="line" onClick={() =>{this.plotHandle("")}}>Wykres</Button>
            <div className="line">Metryki do pokazania: {JSON.stringify(this.state.metrics)}</div>
            <div className="line">Próbki do pokazania: {JSON.stringify(this.state.samples)}</div>
            <FormLabel><div className="line">Wykresy:</div>{this.state.images.map((v)=>{return <img width="100%" src={v}/>})}</FormLabel> 
        </div>
    }
}
class PlotView extends React.Component{
    constructor(props){
        super(props)
        this.state = {metricsGeneral:[],metricsDetailedBase:[],metricsDetailed:[],sampleBase:[], samples:[],externalFactors:[]}
    }
    componentDidMount = ()=>{
        this.refreshDB()
    }
    refreshDB = ()=>{
        axios.get("/api/experiment/Sample/").then((resS)=>{
            let sarr =resS.data.map((s)=>{
                return [s.id,"Dodatki: "+ JSON.stringify(s.supplement)+" Czynnik:"+s.externalFactor]
            })
            axios.get("/api/experiment/DetailedMetrics/").then((resD)=>{
                let darr = []
                let samplesDM = []
                let metricsDM = []
                let efDM = []
                resD.data.forEach((lv,i,a)=>{ if(this.props.experiment.detailedMetrics.includes(lv.id)){
                    samplesDM.push(lv.sample)
                    metricsDM.push(lv.metric)
                    let s = resS.data.find((samp)=>{return samp.id === lv.sample})
                    efDM.push(s.externalFactor)
                    darr.push([lv.id,lv.metric+" - "+
                        "(serii:  "+lv.numberOfSeries+"; powtórzeń:  "+lv.numberOfRepeat+")",
                        " Dodatki: "+ JSON.stringify(s.supplement)+" Czynnik:"+s.externalFactor])}})
                    this.setState({
                        metricsDetailedBase:resD.data,
                        metricsDetailed : darr});
                    axios.get("/api/experiment/Metrics/").then((resM)=>{
                        var marr = [];
                        //wyłuskanie nazw metryk
                        resM.data.forEach((obj)=>{if(metricsDM.includes(obj.name)){marr.push([obj.name,obj.name,obj.unit])}});
                        this.setState({metricsGeneral:marr});
                    }).catch(console.log("Metric failure \n"));
                    axios.get("/api/experiment/ExternalFactor/").then((resF)=>{
                        var farr = []
                        resF.data.forEach((obj)=>{if(efDM.includes(obj.name)){farr.push([obj.name, obj.name,"["+obj.values+"]"+" "+obj.unit])}})
                        this.setState({externalFactors:farr});
                    }).catch(console.log("Samples failure \n"));
                    sarr = sarr.filter((v)=>{return samplesDM.includes(v[0])})
                    this.setState({sampleBase:resS.data, samples:sarr})
            }).catch(console.log("Metric failure \n"));
        }).catch(()=>{console.log("Sample failure <DataForm/>")})


       
    }
    render = ()=>{
        return <div>
            <Button className="line" onClick={this.props.closeProc}>Powróć</Button>
            <Accordion>
                <AccordionSummary className="line">
                    Wykres liniowy
                </AccordionSummary>
                <AccordionDetails className="line">
                    <BarLinearPanel experiment={this.props.experiment} base={this.state} apiURL="/api/experiment/generateLinearPlots/"/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary className="line">
                    Wykres kolumnowy
                </AccordionSummary>
                <AccordionDetails className="line">
                    <BarLinearPanel apiURL="/api/experiment/generateBarPlots/" experiment={this.props.experiment} base={this.state}/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary className="line">
                    Wykres radarowy
                </AccordionSummary>
                <AccordionDetails className="line">
                    <RadarPanel apiURL="/api/experiment/generateBarPlots/" experiment={this.props.experiment} base={this.state}/>
                </AccordionDetails>
            </Accordion>
        </div>
    }
}

export default PlotView