import React from 'react';
import axios from "axios";
import { Select } from "../funcComponents";
import { getCSRFToken } from '../csrftoken.js'
import ExternalFactor from './ExternalFactor';
import Supplement from './Supplement'
import { Button, InputLabel, Paper, Accordion, AccordionDetails, AccordionSummary} from "@material-ui/core";
class SampleForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            supplementsBase:[], supplements:[], supplement:"",
            externalFactors:[], externalFactor:"", window:undefined,
            sampleID:props.sampleID
        }
    }
    componentDidMount = () => {
        this.refresh()
    }
    componentDidUpdate = () => {
        if (this.state.sampleID !== this.props.sampleID && this.props.sampleID !== undefined){
            axios.get("/api/experiment/Sample/"+this.props.sampleID+"/").then(res=>{
                this.setState({
                    externalFactor:res.data.externalFactor,
                    supplements: res.data.supplement,
                    sampleID:res.data.id
                })
            }).catch(()=>{})
        }
    }
    refresh = ()=> {
        //żądania typu get do API
     axios.get("/api/experiment/Supplement/").then((res)=>{
        var arr = [];
        //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name+" - "+obj.percentage+"%",`Zastępuje - ${obj.basicIngredientBase}`]);});
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
        axios.post("/api/experiment/Sample/",data,{ headers:headers, withCredentials:true }).then((res)=>{
            this.props.afterCreate(res.data)
            alert("Wstawiono próbkę z dodatkami "+JSON.stringify(res.data.supplement));
        }).catch((e)=>{
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
        let t = arr.find((pair)=>{return v===pair[0]})
        if (t===undefined) {return undefined} else {return <this.Line text={t[0]} value={v} onButton={this.handleDelDM}/>}
    }

    addEF = (v)=>{
        var arr = this.state.externalFactors
        arr.push([v.name, v.name+" ["+v.values+"]"+" "+v.unit])
        this.setState({externalFactors:arr, externalFactor:v.name})
    }
    addSupl = (v)=>{
        var arr = this.state.supplementsBase;
        //wyłuskanie nazw metryk
        arr.push([v.name,v.name+" - "+v.percentage+"%"])
        this.setState({supplementsBase:arr, supplement:v.name});
        
    }
    render(){
        
        return  <div>
            <InputLabel className="line2">
                Czynnik zewnętrzny:
                <span className="line2"><Select array={this.state.externalFactors}
                        onChange={this.handleChangeEF}
                        value={this.state.externalFactor}
                ></Select>
                </span>
            </InputLabel>
            <Accordion className="line">
                    <AccordionSummary className="line">
                        Nowy czynnik zewnętrzny
                    </AccordionSummary>
                    <AccordionDetails className="line">
                        <ExternalFactor afterCreate={this.addEF} refresh={this.refresh}/>
                    </AccordionDetails>
            </Accordion>
            <Accordion className="line">
                    <AccordionSummary className="line">
                        Edytuj czynnik zewnętrzny
                    </AccordionSummary>
                    <AccordionDetails className="line">
                        <ExternalFactor name={this.state.externalFactor} afterCreate={this.addEF} refresh={this.refresh}/>
                    </AccordionDetails>
            </Accordion>
            <InputLabel className="line2">
                Dodatek:
                <Select  className="line2"
                        array={this.state.supplementsBase}
                        onChange={this.handleChangeSupplements}
                        value={this.state.supplement}
                ></Select>
                <Button className="margin"
                        type="button"
                        onClick={this.handleAddSupplement}>
                        Dodaj dodatek
                </Button>
            </InputLabel>
            <Accordion className="line">
                <AccordionSummary className="line">
                    Nowy dodatek
                </AccordionSummary>
                <AccordionDetails>
                    <Supplement afterCreate={this.addSupl}/>
                </AccordionDetails>
            </Accordion>
            <Accordion className="line">
                <AccordionSummary className="line">
                    Edytuj dodatek
                </AccordionSummary>
                <AccordionDetails>
                    <Supplement name={this.state.supplement} afterCreate={this.addSupl}/>
                </AccordionDetails>
            </Accordion>
            {this.state.supplements.map((v,n,a)=>{ return this.makeLine(this.state.supplementsBase,v)})}
            <Button color="primary" className="line2" type="button" onClick={this.handleInsert}>Dodaj próbkę</Button>
            <Button color="primary" className="line2" type="button" onClick={this.handleUpdate}>Zmień próbkę</Button>
            <Button color="primary" className="line2" type="button" onClick={this.handleDelete}>Usuń próbkę</Button>
        </div>
    }
}

export default SampleForm