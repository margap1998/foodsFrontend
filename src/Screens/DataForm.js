import React from 'react';
import download from 'downloadjs';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { Select } from "../funcComponents.js";
import DetailedMetricForm from './DetailedMetricForm.js';
import { Button, InputLabel, Input, TextareaAutosize, Checkbox,
        Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup,
        Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import ProductForm from './Product.js';
//Komponenet odpowiedzialny za formularz eksperymentu
class DataForm extends React.Component{
    constructor(props){
     super(props);
     //inicjalizacja stanu komponentu
     //TODO: przerobić tak by wykorzystać jeszcze do edycji istniejącego eksperymentu
     if (props.obj === undefined || props.obj === null){
        this.state = {name:null, desc:null, window:null, metricID:"",
            paper:"", private:false, product:undefined, metric:"", filename:"",
            metricGeneral:"", generated:false, file:"", loaded:false,
            samples:[], ingredients:[], metrics:[],exp:props.obj,
            prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
            metricsDetailed:[], sampleBase:[], idExp:undefined,
            productWindow:undefined, new:true, openDialog:false
            }
        }else{
            this.state = {
                name:props.obj.name, desc:props.obj.description, window:null, metricID:"",
                paper:props.obj.link, private:props.obj.publicView, product:props.obj.product, metric:"",
                filename:"",metricGeneral:"", generated:false, file:"", loaded:false,
                samples:[], ingredients:[], metrics:[], openDialog:false,
                prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
                metricsDetailed:[], sampleBase:[],exp:props.obj,
                productWindow:null, new:false, idExp:props.obj.id
                }        
            axios.get("api/experiment/Result/").then((res)=>{
                if(res.data.find((v)=>{return v.experiment == this.props.obj.id})===undefined){
                    this.setState({new:true})
                }
            })
        }

    }
 //komponent odpowiedzialny za usuwalną linijkę z metryką szczegółową
 //props.obj - metryka szczegółowa do obskoczenia
 // props.onButton - funkcja do wywołania dla przycisku usuń
 Line = (props) => {
     if(this.state.sampleBase.length>0){
     let lv = props.obj
     let s = this.state.sampleBase.find((samp)=>{return samp.id === lv.sample})
     return(<div>
         {"(serii:  "+lv.numberOfSeries+"; powtórzeń:  "+lv.numberOfRepeat+")"+" Dodatki: "+ JSON.stringify(s.supplement)+" Czynnik:"+s.externalFactor}
         <Button type="button" onClick={(e) => props.onButton(props.obj)}>
             Usuń
         </Button>
     </div>)
    } else{
        return null
    }
    }
 componentDidMount = () => {
     this.refresh()
 }
 componentWillUnmount = () => {
}
 refresh = ()=> {
    //żądania typu get do API
     axios.get("/api/experiment/DetailedMetrics/").then((res)=>{
        if(this.props.obj !==undefined && this.props.obj.detailedMetrics !== undefined) {
            let arr = res.data.filter((dm =>{return this.props.obj.detailedMetrics.includes(dm.id)}))
            this.setState({metrics:arr})
        }
        this.setState({metricsDetailedBase:res.data});
        axios.get("/api/experiment/Sample/").then((resS)=>{
            let arr =resS.data.map((s)=>{
                return [s.id,"Dodatki: "+ JSON.stringify(s.supplement)+" Czynnik:"+s.externalFactor]
            })
            this.setState({sampleBase:resS.data, samples:arr})
        })
    }).catch(console.log("Metric failure \n"));
     axios.get("/api/experiment/Metrics/").then((res)=>{
         var arr = [];
         //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name,obj.unit]);});
         this.setState({metricsGeneral:arr});
     }).catch(console.log("Metric failure \n"));
 }
 
 // /api/experiment/Experiment/
     handleChangeName = (event) => {    this.setState({name: event.target.value});}
     handleChangeDesc = (event) => {    this.setState({desc: event.target.value});}
     handleChangePaper = (event) => {    this.setState({paper: event.target.value});}
     handleChangeCat = (v) => {    
         var arr = []
         this.state.prodObj.forEach((lv,i,a)=>{if(lv.category === v){arr.push([lv.name,lv.name+" - "+lv.description])}})
         this.setState({prodBase:arr, category: v, product:""})
     }
     handlePrivate = (e) => {
         this.setState({private:!this.state.private})
     }
     handleChangeMetric = (v)=>{
         var arr = []

         this.state.metricsDetailedBase.forEach((lv,i,a)=>{ if(v===lv.metric){
             let s = this.state.sampleBase.find((samp)=>{return samp.id === lv.sample})
             arr.push([lv.id,"(serii:  "+lv.numberOfSeries+"; powtórzeń:  "+lv.numberOfRepeat+")"," Dodatki: "+ JSON.stringify(s.supplement)+" Czynnik:"+s.externalFactor])}})
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
         this.setState({metrics:arr2});
        }
     }
     handleDelDM = (obj)=>{
         let pred = (v,i,a)=>{return !(v.id == obj.id  && obj.type==v.type)};
         var arr2 = this.state.metrics;
         this.setState({metrics:arr2.filter(pred)});
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
             .then((res)=>{alert("Udało się załodować"); this.setState({new:false})})
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
                 "numberOfMeasuredProperties": arr.length,
                 "publicView": this.state.private,
                 "author": 1,
                 "product": this.state.product,
                 "detailedMetrics": arr
             }
 
             axios.post("/api/experiment/Experiment/",exp_head,{ headers:headers }).then((res)=>{
                 alert("Wstawiono");
                 this.setState({idExp:res.data.id, exp:res.data})
             }).catch(()=>{console.log("Something's wrong with inserting experiment"); alert("Nie wstawiono")})
         }else{
             alert("Uzupełnij")
             }
     }
     
     handleChange =(e) =>{
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
                 "numberOfMeasuredProperties": arr.length,
                 "publicView": this.state.private,
                 "author": 1,
                 "product": this.state.product,
                 "detailedMetrics": arr,
             }
            let put = ()=>{
                 axios.put("/api/experiment/Experiment/"+this.state.idExp+"/",exp_head,{ headers:headers }).then(()=>{
                 alert("Zmieniono");
                }).catch(()=>{console.log("Something's wrong with changing experiment"); alert("Nie dokonano zmian!")})
            }
            let post = ()=>{
                     axios.delete("/api/experiment/Experiment/"+this.state.idExp+"/",{ headers:headers }).then(()=>{
                        axios.post("/api/experiment/Experiment/",exp_head,{ headers:headers }).then((res2)=>{
                            alert("Dokonano zmiany");
                            this.setState({idExp:res2.data.id, new:true})
                        }).catch(()=>{console.log("Something's wrong with inserting experiment"); alert("Usunięto, lecz nie wstawiono")})
                    }).catch(()=>{console.log("Something's wrong with changing experiment"); alert("Nie dokonano zmian!")})    
                }
                let open = ()=>{this.setState({openDialog:true})}
                let close = ()=>{this.setState({openDialog:false,dialog:undefined})}
            let dial = <Dialog
            open={open}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Czy chcesz zresetować eksperyment?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Zmiana metryk w eksperymencie powoduje usunięcie dotychczasowych wyników. 
                Czy jesteś pewien?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={close} color="primary">
                Nie
              </Button>
              <Button onClick={()=>{post();close()}} color="primary" autoFocus>
                Tak
              </Button>
            </DialogActions>
          </Dialog>
          var test = true
          this.state.exp.detailedMetrics.forEach(v =>{test=test&&arr.includes(v)})
            if (test){
                put()
            }else{
                this.setState({dialog:dial})
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
         }).catch((e)=>{console.log("Something's wrong with file download")})
 
     }
     else{
         alert("Uzupełnij")
         }
     }
     refDM = (lv)=>{
        var arr = this.state.metricsDetailed
        let s = this.state.sampleBase.find((samp)=>{return samp.id === lv.sample})
        arr.push([lv.id,
                "(serii:  "+lv.numberOfSeries+"; powtórzeń:  "+lv.numberOfRepeat+")",
                " Dodatki: "+ JSON.stringify(s.supplement)+" Czynnik:"+s.externalFactor
            ])
        var arr2 = this.state.metricsDetailedBase
        arr2.push(lv)
        this.setState({metricsDetailed : arr, metricsDetailedBase:arr2, metric:lv, metricID:lv.id});
     }
     addSampl = (s)=>{
         this.refresh()
     }

     closeWindow =()=>{ this.setState({window:null}) }
     render(){
     return(
         <div id="dataform">
                <Button variant="contained" className="line" type="button" onClick={this.props.closeProc}>X</Button>
                 <InputLabel className="line">
                     Nazwa:
                     <Input className="line" type="text" value={this.state.name} onChange={this.handleChangeName} />
                 </InputLabel>
                 <InputLabel className="line">
                     Opis eksperymentu:
                     <TextareaAutosize className="line" type="text" value={this.state.desc} onChange={this.handleChangeDesc} />
                 </InputLabel>
                 <InputLabel className="line">
                     URL pracy:
                     <Input className="line" type="text" value={this.state.paper} onChange={this.handleChangePaper} />
                 </InputLabel>
                 <InputLabel className="line">
                     Produkt:
                     <Input className="line" readonly value={this.state.product}/>
                     <Accordion>
                         <AccordionSummary>
                             {(this.state.product===undefined)? "Nowy produkt":"Edytuj produkt"}
                         </AccordionSummary>
                         <AccordionDetails>
                            <ProductForm changeProductName={(v)=>{this.setState({product:v})}} 
                                name={(this.props.obj=== undefined)? "":this.props.obj.product} 
                                closeProc={()=>{this.setState({productWindow:undefined})}}/>
                         </AccordionDetails>
                     </Accordion>
                 </InputLabel>
                 <InputLabel className="line">
                     Prywatny
                     <Checkbox className="line"  checked={this.state.private}  onChange={this.handlePrivate}/>
                     
                 </InputLabel>
                 <InputLabel className="line">
                     <span className="line">
                     <InputLabel className="margin">
                     Metryka:
                     <Select className="line" onChange={this.handleChangeMetric} array={this.state.metricsGeneral}/>
                     </InputLabel>
                     <InputLabel className="margin">
                     Metryka szczegółowa:
                     <Select className="line" value={this.state.metricID} onChange={this.handleChangeDetailedMetric} array={this.state.metricsDetailed}/>
                     </InputLabel>
                     <span className="margin" ><Button className="line" variant="contained" type="button" onClick={this.handleAddDM}>
                             Przypisz
                         </Button>
                     </span>
                     </span>
                 </InputLabel>
                 {this.state.dialog}
                 <Accordion className="line">
                     <AccordionSummary>
                        Nowa metryka szczegółowa
                     </AccordionSummary>
                     <AccordionDetails>
                         <DetailedMetricForm refreshDB={this.refDM} addSampl={this.addSampl} sampleBase={this.state.samples}/>
                     </AccordionDetails>
                 </Accordion>
                 <Accordion className="line">
                     <AccordionSummary>
                        Edytuj metrykę szczegółową
                     </AccordionSummary>
                     <AccordionDetails>
                         <DetailedMetricForm metricObj={this.state.metric} refreshDB={this.refDM} addSampl={this.addSampl} metric={this.state.metricGeneral} sampleBase={this.state.samples}/>
                     </AccordionDetails>
                 </Accordion>
                 <Accordion className="line">
                    <AccordionSummary className="line">
                        Dodane metryki szczegółowe
                    </AccordionSummary>
                    <AccordionDetails className="line">
                        {this.state.metrics.map((obj,n,a)=>{ return <this.Line obj={obj} onButton={this.handleDelDM}/>})}
                    </AccordionDetails>
                 </Accordion>
                 <ButtonGroup className="line">
                     <span  className="margin"><Button className="line" color="primary" variant="contained" type="button" onClick={this.handleInsert}>Dodaj</Button></span>
                     <span className="margin" hidden={!this.state.new}><Button className="line" variant="contained" type="button" onClick={this.handleSubmit}>Pobierz arkusz eksperymentu</Button></span>
                     <span className="margin" hidden={this.state.idExp == undefined}><Button className="line" variant="contained" type="button" onClick={this.handleChange}>Zmień</Button></span>
                 </ButtonGroup>
                 <div hidden={!this.state.new}><div className="line">
                         <Input type="file"
                             id="XLSXFileChoose" name="XLSXChoose"
                             accept=".xlsx" onChange ={this.handleLoadXLSX}/>
                         <Button variant="contained" color="primary" className={"visible"+this.state.loaded.toString()} onClick={this.handleSubmitXLSX} type="button" >Załaduj</Button>
                 </div></div>
         </div>
     )
     //return <Line obj={obj} onButton={this.handleDelDM}></Line>})}
     }
 }

 export default DataForm