import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import axios from "axios";
import download from 'downloadjs';
import DjangoCSRFToken from 'django-react-csrftoken'

function Select(props){
    var q =[""]
    q = q.concat(props.array)
    var op = q.map(value =>{return(<option value={value}>{value}</option>)})
    return(
        <select value={props.value} onChange={e => props.onChange(e.target.value)}>
            {op}
        </select>
    )
}
class DataForm extends React.Component{
    
   constructor(props){
    super(props);
    this.state = {name:null, desc:null, 
        num_repeats:"", num_series:"", num_features:0,
        paper:null, private:false, product:"", metric:null,
        metricGeneral:null, generated:false, file:"", loaded:false,
        categories:[], ingredients:[], sample:1, metricID:"", metrics:[],
        prodBase:[], prodObj:[], metricsGeneral:[], metricsGeneralBase:[], metricsDetailedBase:[],
        metricsDetailed:[], sampleBase:[],recipeBase:[]
    }
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);
    this.handleChangePaper = this.handleChangePaper.bind(this);
    this.handleChangeCat = this.handleChangeCat.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

Line = (props) => {
    return(<div>
        {props.obj['id']+":"+" type:"+props.obj['metric']+" number of repeats:"+props.obj['numberOfRepeat']}
        <button type="button" onClick={(e) => props.onButton(props.obj)}>
            Usuń
        </button>
    </div>)
} 
componentDidMount = () => {
    this.refresh()
}
refresh = ()=> {
    axios.get("/api/experiment/Category/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name);});
        this.setState({categories:arr});
    }).catch(console.log("Categories failure \n"));
    axios.get("/api/experiment/DetailedMetrics/").then((res)=>{
        this.setState({metricsDetailedBase:res.data});
    }).catch(console.log("Metric failure \n"));
    axios.get("/api/experiment/Metrics/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name);});
        this.setState({metricsGeneral:arr});
    }).catch(console.log("Metric failure \n"));
    axios.get("/api/experiment/Product/").then((res)=>{
        this.setState({prodObj:res.data});
    }).catch(console.log("Product failure \n"));
}
    handleSubmit(event){
        var now = new Date();
        var metrics = [];
        this.state.metrics.forEach((obj)=>{
            metrics.push(
                [obj.id,obj.numberOfSeries, obj.numberOfRepeat,obj.sample.toString(),"1",["120"],obj.metric])
        })
        var experiment_data = [this.state.name, this.state.desc,this.state.paper, "Hardcoded", now.getDate()+"."+now.getMonth()+"."+now.getFullYear()]
        //var i = 0
        /*this.state.features.forEach((f)=>{
            var head = [i.toString(),parseInt(this.state.num_series),
                parseInt(this.state.num_repeats),1,['120'],f.name]
            metrices.push(head)
        })*/
        var req = {
            experiment_data : experiment_data,
            metrics : metrics
        };  
        axios.post("/api/experiment/geneerateXlsx/",req,{ responseType: 'blob'}).then((res)=>{
            download(res.data,experiment_data[0]+"_"+experiment_data[3]+'.xlsx','application/vnd.openxmlformats-');
            this.setState({generated:true});
        }).catch((e)=>{console.log("Something's wrong with download of file")})
    }

    handleChangeName(event) {    this.setState({name: event.target.value});}
    handleChangeDesc(event) {    this.setState({desc: event.target.value});}
    handleChangePaper(event) {    this.setState({paper: event.target.value});}
    handleChangeCat(v) {    
        this.setState({category: v});
        var arr = []
        this.state.prodObj.forEach((lv,i,a)=>{if(lv.category === v){arr.push(lv.name)}})
        this.setState({prodBase:arr})
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
    handlePrivate =(e)=>{
        this.setState({private:!this.state.private})
    }
    handleChangeProd = (v)=>{
        this.setState({product: v});
    }
    handleChangeMetric = (v)=>{
        var arr = []
        this.state.metricsDetailedBase.forEach((lv,i,a)=>{ if(v===lv.metric){arr.push(lv.id)}})
        this.setState({
            metricsDetailed : arr,
            metricGeneral: v
        })
    }
    handleChangeDetailedMetric = (v)=>{
        if (v === ""){
            this.setState({dialog: null, metric:null, metricID:""})
        }else{
            var obj = null
            this.state.metricsDetailedBase.forEach((lv) => {if (v==lv.id){obj = lv}})
            
            this.setState({metric: obj, metricID:v, dialog: (
            <textarea className="line" value={
                "number of repeats: "+obj.numberOfRepeat+
                "\nnumber of series: " + obj.numberOfSeries+
                "\nsample: "+ obj.sample}/>
            )})
        }
    }
    handleAddDM = (e)=>{
        var arr = this.state.metricsDetailedBase;
        var arr2 = this.state.metrics;
        var obj;
        arr.forEach((v,i,a)=>{if( v.id == this.state.metricID) obj = v})
        if (!arr2.includes(obj)){
        arr2.push(obj);
        this.setState({num_features: (this.state.num_features+1),metrics:arr2});
        }
    }
    handleDelDM = (obj)=>{
        let pred = (v,i,a)=>{return (v.id !== obj.id  && obj.type!==v.type)};
        var arr2 = this.state.metrics;
        this.setState({num_features: (this.state.num_features-1),metrics:arr2.filter(pred)});
    }
    handleLoadXLSX = (e)=>{
        
        let fr = new FileReader()

        fr.onload = (evt)=>{
            this.setState({ filename: e.target.files[0].name, file: evt.target.result, loaded:true });
        };
        fr.readAsBinaryString(e.target.files[0])
    }
    handleSubmitXLSX = (e)=>{
        axios.post("/api/experiment/readXlsx/",
        {
            title: this.state.filename,
            file: this.state.file
        })
        .then((res)=>{alert(res.data)})
        .catch((a)=>{console.log("Something's wrong with file uploading");})
    }
    render(){
    return(
        <form className="box" id="dataform" onSubmit={this.handleSubmit}>
            <DjangoCSRFToken/>
                <label className="line2">
                    Nazwa:
                    <input className="line" type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>
                <label className="line2">
                    Opis:
                    <textarea className="line" type="text" value={this.state.desc} onChange={this.handleChangeDesc} />
                </label>
                <label className="line2">
                    URL pracy:
                    <input className="line" type="text" value={this.state.paper} onChange={this.handleChangePaper} />
                </label>
                <label className="line2">
                    Kategoria:
                    <Select value={this.state.category} onChange={this.handleChangeCat} array={this.state.categories}/>
                </label>
                <label className="line2">
                    Produkt:
                    <Select onChange={this.handleChangeProd} array={this.state.prodBase}/>
                </label>
                <label className="line2">
                    Liczba cech:
                    <input className="line" type="text" defaultValue={this.state.num_features} />
                </label>
                <label className="line2">
                    Liczba serii:
                    <input class="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
                </label>
                <label className="line2">
                    Prywatny
                    <input type="checkbox" value={this.state.private} onChange={this.handlePrivate}/>
                </label>
                <label className="line2">
                    Metryka:
                    <Select onChange={this.handleChangeMetric} array={this.state.metricsGeneral}/>
                </label>
                <label className="line2">
                    Metryka szczegółowa:
                    <Select value={this.state.metricID} onChange={this.handleChangeDetailedMetric} array={this.state.metricsDetailed}/>
                    <button type="button" onClick={this.handleAddDM}>
                            Dodaj
                        </button>
                </label>
                {this.state.dialog}
                {this.state.metrics.map((obj,n,a)=>{return <this.Line obj={obj} onButton={this.handleDelDM}/>})}
                 <button type="button" onClick={this.handleSubmit}>Generuj</button>
                 <div>
                        <input className={"visible"+this.state.generated.toString()} type="file"
                            id="XLSXFileChoose" name="XLSXChoose"
                            accept=".xlsx" onChange ={this.handleLoadXLSX}/>
                        <button className={"visible"+this.state.loaded.toString()} onClick={this.handleSubmitXLSX} type="button" >Załaduj</button>
                    </div>
                 
        </form>
    )
    //return <Line obj={obj} onButton={this.handleDelDM}></Line>})}
    }
}


class App extends React.Component{
    constructor(props){
        super(props)
        this.state={experiment_data:{},section:"form"}
    }
    render(){
        var section = (<div>Coś się popsuło</div>);
        switch(this.state.section){
            case "form":
                section = <DataForm/>
            break;
            default:
            break;
        }
        return <div id ="App">
            {section}
        </div>
    }
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
  