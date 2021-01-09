import React from 'react';
import download from 'downloadjs';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { Select } from "../funcComponents.js";
import DetailedMetricForm from './DetailedMetricForm.js';
import { Button, InputLabel, Input, TextareaAutosize,TextField } from "@material-ui/core";
//Komponenet odpowiedzialny za formularz eksperymentu
class DataForm extends React.Component{
    constructor(props){
     super(props);
     //inicjalizacja stanu komponentu
     //TODO: przerobić tak by wykorzystać jeszcze do edycji istniejącego eksperymentu
     //if (props.obj === undefined || props.obj === null){
     this.state = {name:null, desc:null, window:null,
         num_repeats:"", num_features:0, sample:1, metricID:"",
         paper:"", private:false, product:"", metric:"", filename:"",
         metricGeneral:"", generated:false, file:"", loaded:false,
         categories:[], ingredients:[], metrics:[],
         prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
         metricsDetailed:[], sampleBase:[],recipeBase:[]
        }
    }
 //komponent odpowiedzialny za usuwalną linijkę z metryką szczegółową
 //props.obj - metryka szczegółowa do obskoczenia
 // props.onButton - funkcja do wywołania dla przycisku usuń
 Line = (props) => {
     return(<div>
         {props.obj['id']+":"+" type:"+props.obj['metric']+" number of repeats:"+props.obj['numberOfRepeat']}
         <Button type="button" onClick={(e) => props.onButton(props.obj)}>
             Usuń
         </Button>
     </div>)
 } 
 componentDidMount = () => {
     this.refresh()
 }
 componentWillUnmount = () => {
}
 refresh = ()=> {
     //żądania typu get do API
     axios.get("/api/experiment/Category/").then((res)=>{
         var arr = [];
         //wyłuskanie nazw kategorii
         res.data.forEach((obj)=>{arr.push([obj.name,obj.name]);});
 
         this.setState({categories:arr});
     }).catch(console.log("Categories failure \n"));
     axios.get("/api/experiment/DetailedMetrics/").then((res)=>{
         this.setState({metricsDetailedBase:res.data});
     }).catch(console.log("Metric failure \n"));
     axios.get("/api/experiment/Metrics/").then((res)=>{
         var arr = [];
         //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name+" - "+obj.unit]);});
         this.setState({metricsGeneral:arr});
     }).catch(console.log("Metric failure \n"));
     axios.get("/api/experiment/Product/").then((res)=>{
         this.setState({prodObj:res.data});
     }).catch(console.log("Product failure \n"));
 }
 
 // /api/experiment/Experiment/
     handleChangeName = (event) => {    this.setState({name: event.target.value});}
     handleChangeDesc = (event) => {    this.setState({desc: event.target.value});}
     handleChangePaper = (event) => {    this.setState({paper: event.target.value});}
     handleChangeCat = (v) => {    
         this.setState({category: v});
         var arr = []
         this.state.prodObj.forEach((lv,i,a)=>{if(lv.category === v){arr.push([lv.name,lv.name+" - "+lv.description])}})
         this.setState({prodBase:arr, product:""})
     }
     handlePrivate = (e) => {
         this.setState({private:!this.state.private})
     }
     handleChangeProd = (v)=>{
         this.setState({product: v});
     }
     handleChangeMetric = (v)=>{
         var arr = []

         this.state.metricsDetailedBase.forEach((lv,i,a)=>{ if(v===lv.metric){arr.push(
             [lv.id,"Serii-"+lv.numberOfSeries+" Powtórzeń-"+lv.numberOfRepeat])}})
         this.setState({
             metricsDetailed : arr,
             metricGeneral: v,
             metricID:""
         })
     }
     handleChangeDetailedMetric = (v)=>{
         if (v === ""){
             this.setState({dialog: null, metric:null, metricID:""})
         }else{
             var obj = null
             this.state.metricsDetailedBase.forEach((lv) => {if (v==lv.id){obj = lv}})
             //zmiana stanu i dałożenie okienka z właściwościami
             this.setState({metric: obj, metricID:v})
         }
     }
     handleAddDM = (e)=>{if (this.state.metricID !=""){
         var arr = this.state.metricsDetailedBase;
         var arr2 = this.state.metrics;
         var obj;
         arr.forEach((v,i,a)=>{if( v.id == this.state.metricID) obj = v})
         
         arr2.push(obj)
         this.setState({num_features: (this.state.num_features+1),metrics:arr2});
        }
     }
     handleDelDM = (obj)=>{
         let pred = (v,i,a)=>{return !(v.id == obj.id  && obj.type==v.type)};
         var arr2 = this.state.metrics;
         this.setState({num_features: (this.state.num_features-1),metrics:arr2.filter(pred)});
     }
     handleLoadXLSX = (e)=>{
         this.setState({ filename: e.target.files[0].name, loaded:true, file:e.target.files[0]});
         }
     handleSubmitXLSX = (e)=>{
         if (this.state.file !=null){
 
             let token = getCSRFToken()
             var formData = new FormData();
             formData.append("file", this.state.file);
             formData.append("title", this.state.filename);
             axios.post('/api/experiment/readXlsx/', formData, {
                 headers: {
                 'Content-Type': 'multipart/form-data',
                 "X-CSRFTOKEN": token
                 }
             })
             .then((res)=>{alert(res.statusText)})
             .catch((a)=>{console.log("Something's wrong with file uploading");})
             this.setState({file:null,filename:"", loaded:false})
         }
     }
     handleInsert =(e) =>{if (! ( this.state.metrics.length<1 && this.state.name == "" && this.state.desc == "" && this.state.paper == "" && this.state.product == "")){
             //pobranie znacznika CSRF z ciasteczka 
             let token = getCSRFToken()
             //stworzenie odpowiedniego nagłówka zapytania
             const headers = {"X-CSRFTOKEN": token}
             //obiekt z danymi do bazy
        
             let arr = []
             this.state.metrics.forEach((v)=>{arr.push(v.id)})
             var exp_head = {
                 "name": this.state.name,
                 "description": this.state.desc,
                 "link": this.state.paper,
                 "numberOfMeasuredProperties": this.state.num_features,
                 "publicView": this.state.private,
                 "author": 1,
                 "product": this.state.product,
                 "detailedMetrics": arr
             }
 
             axios.post("/api/experiment/Experiment/",exp_head,{ headers:headers }).then((res)=>{
                 alert(res.statusText);
             }).catch((e)=>{console.log("Something's wrong with inserting experiment");})
         }else{
             alert("Uzupełnij")
             }
     }
 
     handleChange =(e) =>{if (! ( this.state.metrics.length<1 && this.state.name == "" && this.state.desc == "" && this.state.paper=="" && this.state.product=="")){
             //pobranie znacznika CSRF z ciasteczka 
             let token = getCSRFToken()
             //stworzenie odpowiedniego nagłówka zapytania
             const headers = {"X-CSRFTOKEN": token}
             //obiekt z danymi do bazy
             let arr = []
             this.state.metrics.forEach((v)=>{arr.push(v.id)})
             var exp_head = {
                 "name": this.state.name,
                 "description": this.state.desc,
                 "link": this.state.paper,
                 "numberOfMeasuredProperties": this.state.num_features,
                 "publicView": this.state.private,
                 "author": 1,
                 "product": this.state.product,
                 "detailedMetrics": arr
             }
 
             axios.put("/api/experiment/Experiment/",exp_head,{ headers:headers }).then((res)=>{
                 alert(res.statusText);
             }).catch((e)=>{console.log("Something's wrong with inserting experiment");})
         }else{
             alert("Uzupełnij")
         }
     }
     handleSubmit = (event) => { if (! ( this.state.metrics.length<1 && this.state.name == "" && this.state.desc == "" && this.state.paper=="" && this.state.product=="")){
         //pobranie znacznika CSRF z ciasteczka 
         let token = getCSRFToken()
         //stworzenie odpowiedniego nagłówka zapytania
         const headers = {"X-CSRFTOKEN": token}
         var now = new Date();//Pobranie daty .getMonth() zwraca int<0,11>, zatem trzeba dodać 1 XD
         var metrics = [];
         //zmapowanie metryk z bazy na metryki do wygenerowania excela w nieładny sposób
         this.state.metrics.forEach((obj)=>{
             metrics.push(
                 [obj.metric, obj.numberOfSeries, obj.numberOfRepeat, obj.sample, "3", ["120","140","150"],obj.id])
         })
         //wyłuskanie wartości id
         //nagłówek eksperymentu
         var experiment_data = [this.state.name, this.state.desc,this.state.paper, 1, now.getDate()+"."+(now.getMonth()+1)+"."+now.getFullYear()]
         //obiekt z żądaniem
         var req = {
             experiment_data : experiment_data,
             metrics : metrics
         };
         //wysłanie żądania do generowania excela
         axios.post("/api/experiment/geneerateXlsx/",req,{ headers:headers, withCredentials:true, responseType: 'blob'}).then((res)=>{
             //sprytna funkcja do pobrania danych wzięta z repozytorium npm
             download(res.data,experiment_data[0]+"_"+experiment_data[3]+'.xlsx')
             this.setState({generated:true});
         }).catch((e)=>{console.log("Something's wrong with download of file")})
 
     }
     else{
         alert("Uzupełnij")
         }
     }
     openWindow = ()=>{
         let refDM = ()=>{       
            axios.get("/api/experiment/DetailedMetrics/").then((res)=>{
                this.setState({metricsDetailedBase:res.data});
                this.handleChangeMetric(this.state.metricGeneral)
            }).catch(console.log("Metric failure \n"));
         }
        this.setState({window:<DetailedMetricForm refreshDB={refDM} closeProc={this.closeWindow} metric ={this.state.metricGeneral}/>})
     }
     closeWindow =()=>{ this.setState({window:null}) }
     render(){
     return(
         <div className="box0" id="dataform">
                <Button variant="contained" className="line2" type="button" onClick={this.props.closeProc}>X</Button>
                 <InputLabel className="line2">
                     Nazwa:
                     <Input className="line" type="text" value={this.state.name} onChange={this.handleChangeName} />
                 </InputLabel>
                 <InputLabel className="line2">
                     Opis:
                     <TextareaAutosize className="line" type="text" value={this.state.desc} onChange={this.handleChangeDesc} />
                 </InputLabel>
                 <InputLabel className="line2">
                     URL pracy:
                     <Input className="line" type="text" value={this.state.paper} onChange={this.handleChangePaper} />
                 </InputLabel>
                 <InputLabel className="line2">
                     Kategoria:
                     <Select value={this.state.category} onChange={this.handleChangeCat} array={this.state.categories}/>
                 </InputLabel>
                 <InputLabel className="line2">
                     Produkt:
                     <Select onChange={this.handleChangeProd} array={this.state.prodBase}/>
                 </InputLabel>
                 <InputLabel className="line2">
                     Prywatny
                     <Input type="checkbox" value={this.state.private} onChange={this.handlePrivate}/>
                 </InputLabel>
                 <InputLabel className="line2">
                     Metryka:
                     <Select onChange={this.handleChangeMetric} array={this.state.metricsGeneral}/>
                     Metryka szczegółowa:
                     <Select value={this.state.metricID} onChange={this.handleChangeDetailedMetric} array={this.state.metricsDetailed}/>
                     <Button variant="contained" color="primary" type="button" onClick={this.handleAddDM}>
                             Przypisz
                         </Button>
                     <Button variant="contained" color="primary" type="button" onClick={ this.openWindow}>
                             Nowa
                         </Button>
                 </InputLabel>
                 {this.state.dialog}
                 {this.state.window}
                 {this.state.metrics.map((obj,n,a)=>{ return <this.Line obj={obj} onButton={this.handleDelDM}/>})}
                 <div className="box2">
                     <Button variant="contained" color="primary" type="button" onClick={this.handleInsert}>Dodaj</Button>
                     <Button variant="contained" color="primary" type="button" onClick={this.handleChange}>Zmień</Button>
                     <Button variant="contained" color="primary" type="button" onClick={this.handleSubmit}>Generuj</Button>
                 </div>
                 <div className="box2">
                         <Input type="file"
                             id="XLSXFileChoose" name="XLSXChoose"
                             accept=".xlsx" onChange ={this.handleLoadXLSX}/>
                         <Button variant="contained" color="primary" className={"visible"+this.state.loaded.toString()} onClick={this.handleSubmitXLSX} type="button" >Załaduj</Button>
                 </div>
         </div>
     )
     //return <Line obj={obj} onButton={this.handleDelDM}></Line>})}
     }
 }

 export default DataForm