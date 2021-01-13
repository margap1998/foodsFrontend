import React from 'react';
import download from 'downloadjs';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { Select } from "../funcComponents.js";
import DetailedMetricForm from './DetailedMetricForm.js';
import { Button, InputLabel, Input, TextareaAutosize, Checkbox,
        Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import ProductForm from './Product.js';
//Komponenet odpowiedzialny za formularz eksperymentu
class DataForm extends React.Component{
    constructor(props){
     super(props);
     //inicjalizacja stanu komponentu
     //TODO: przerobić tak by wykorzystać jeszcze do edycji istniejącego eksperymentu
     if (props.obj === undefined || props.obj === null){
        this.state = {name:null, desc:null, window:null, metricID:"",
            paper:"", private:false, product:"", metric:"", filename:"",
            metricGeneral:"", generated:false, file:"", loaded:false,
            categories:[], ingredients:[], metrics:[],
            prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
            metricsDetailed:[], sampleBase:[],recipeBase:[], idExp:undefined,
            productWindow:undefined, new:true, openDialog:false
            }
        }else{
            this.state = {
                name:props.obj.name, desc:props.obj.description, window:null, metricID:"",
                paper:props.obj.link, private:props.obj.publicView, product:props.obj.product, metric:"",
                filename:"",metricGeneral:"", generated:false, file:"", loaded:false,
                categories:[], ingredients:[], metrics:[], openDialog:false,
                prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
                metricsDetailed:[], sampleBase:[],recipeBase:[],
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
     axios.get("/api/experiment/DetailedMetrics/").then((res)=>{
        if(this.props.obj.detailedMetrics !== undefined) {
            let arr = res.data.filter((dm =>{return this.props.obj.detailedMetrics.includes(dm.id)}))
            this.setState({metrics:arr})
        }
        this.setState({metricsDetailedBase:res.data});
        
    }).catch(console.log("Metric failure \n"));
     axios.get("/api/experiment/Metrics/").then((res)=>{
         var arr = [];
         //wyłuskanie nazw metryk
        res.data.forEach((obj)=>{arr.push([obj.name,obj.name+" - "+obj.unit]);});
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
                 this.setState({idExp:res.data.id})
             }).catch((e)=>{console.log("Something's wrong with inserting experiment"); alert("Nie wstawiono")})
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
                 axios.put("/api/experiment/Experiment/"+this.state.idExp+"/",exp_head,{ headers:headers }).then((res)=>{
                 alert("Zmieniono");
                }).catch((e)=>{console.log("Something's wrong with changing experiment"); alert("Nie dokonano zmian!")})
            }
            let post = ()=>{
                     axios.delete("/api/experiment/Experiment/"+this.state.idExp+"/",{ headers:headers }).then((res)=>{
                        axios.post("/api/experiment/Experiment/",exp_head,{ headers:headers }).then((res)=>{
                            alert("Dokonano zmiany");
                            this.setState({idExp:res.data.id, new:true})
                        }).catch((e)=>{console.log("Something's wrong with inserting experiment"); alert("Usunięto, lecz nie wstawiono")})
                    }).catch((e)=>{console.log("Something's wrong with changing experiment"); alert("Nie dokonano zmian!")})    
                }
                let open = ()=>{this.setState({openDialog:true})}
                let close = ()=>{this.setState({openDialog:false,dialog:undefined})}
            let dial = <Dialog
            open={open}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
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
          this.props.obj.detailedMetrics.forEach(v =>{test=test&&arr.includes(v)})
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
     newProduct = ()=>{
         this.setState({productWindow:<ProductForm changeProductName={(v)=>{this.setState({product:v})}} 
            name={(this.props.obj=== undefined)? "":this.props.obj.product} 
            closeProc={()=>{this.setState({productWindow:undefined})}}/>})
     }
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
                     Produkt:
                     <div className="line">
                        <Input readonly value={this.state.product}/>
                        {(this.props.obj == undefined)? <Button  variant="contained" color="primary"  size="medium" onClick={this.newProduct}>Nowy</Button> : <Button variant="contained" color="primary"  onClick={this.newProduct} size="medium">Zmień</Button>}
                     </div>
                 </InputLabel>
                 {this.state.productWindow}
                 <InputLabel className="line2">
                     Prywatny
                     <Checkbox className="line"  checked={this.state.private}  onChange={this.handlePrivate}/>
                     
                 </InputLabel>
                 <InputLabel className="line2">
                     <span className="line2">
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
                     </span>
                 </InputLabel>
                 {this.state.dialog}
                 {this.state.window}
                 {this.state.metrics.map((obj,n,a)=>{ return <this.Line obj={obj} onButton={this.handleDelDM}/>})}
                 <div className="line2">
                     <Button variant="contained" color="primary" type="button" onClick={this.handleInsert}>Dodaj</Button>
                     <span hidden={this.state.idExp == undefined}><Button variant="contained" color="primary"  className="line2" type="button" onClick={this.handleChange}>Zmień</Button></span>
                     <span hidden={!this.state.new}><Button variant="contained" color="primary"  className="line2" type="button" onClick={this.handleSubmit}>Pobierz arkusz eksperymentu</Button></span>
                 </div>
                 <div hidden={!this.state.new}><div className="line2">
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