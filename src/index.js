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

class FeaturesBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state = {features:props.array,feature:null,value:"",unit:null}
        this.handleClick = this.handleClick.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }
    handleClick(e){
        const ob = {name:this.state.feature,value:this.state.value,unit:this.state.unit}
        this.props.onAdd(ob)
    }
    handleSelect(v){
        this.setState({feature:v})
    }
    render(){
        let fun = (event)=>{       
            const regExp = /^[0-9]*$/;
            const a = event.target.value;
            if(regExp.test(a)){
                this.setState({value: a});
            }else{
                this.setState({value: this.state.value})
            }
        }
        return(
        <div id="features" class="line">
            <div class="line2">
            <label>
              Cecha:
              <Select array={this.props.array}
                onChange={this.handleSelect}>

              </Select>
            </label>
            <label>
                Wartość:
                <input  type="text" value={this.state.value} onChange={fun} />
            </label>
            <label>
                Jednostka:
                <input type="text" value={this.state.unit} onChange={(event)=>{
                    this.setState({unit :event.target.value})
                }} />
            </label>
                    <button type="button" value="addFeature" onClick={this.handleClick}>
                        Dodaj
                    </button>
          </div>
            {this.props.children}
          </div>
        )
    }
}

class IngredientBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state = {ingredients:props.array,ingr:null,
        value:"",unit:null}
        this.numChange= this.numChange.bind(this)
        this.unitChange=this.unitChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.render = this.render.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }
    unitChange(event){
        this.setState({unit:event.target.value})
    }
    numChange(event){
        const regExp = /^[0-9]*$/;
        const a = event.target.value;
        if(regExp.test(a)){
            this.setState({value: a});
        }else{
            this.setState({value: this.state.value})
        }
    }
    handleClick(event){
        const ob = {name:this.state.ingr,value:this.state.value, unit:'%'}
        this.props.onAdd(ob)
    }
    
    handleSelect(v){
        this.setState({ingr:v})
    }
    render(){
        return(
            <div class="line">
                <div class="line2">
                    <label>
                    Skladnik:
                    <Select array={this.props.array}
                        onChange={this.handleSelect}>
                    </Select>
                    </label>
                    <label>
                        Ile:
                        <input type="text" value={this.state.value} onChange={this.numChange} />
                    </label>
                    <button type="button" value="addIngredient" onClick={this.handleClick}>
                        Dodaj
                    </button>
                </div>
                {this.props.children}
          </div>
        )
    }
}
class AdditionBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state = {suppl:null,
        value:"",unit:null}
        this.numChange= this.numChange.bind(this)
        this.unitChange=this.unitChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.render = this.render.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }
    unitChange(event){
        this.setState({unit:event.target.value})
    }
    numChange(event){
        const regExp = /^[0-9]*$/;
        const a = event.target.value;
        if(regExp.test(a)){
            this.setState({value: a});
        }else{
            this.setState({value: this.state.value})
        }
    }
    handleClick(event){
        const ob = {name:this.state.suppl,value:this.state.value, unit:'%'}
        this.props.onAdd(ob)
    }
    
    handleSelect(v){
        this.setState({suppl:v})
    }
    render(){
        return(
            <div class="line">
                <div class="line2">
                    <label>
                    Dodatek:
                    <Select array={this.props.array}
                        onChange={this.handleSelect}>
                    </Select>
                    </label>
                    <label>
                        Ile:
                        <input type="text" value={this.state.value} onChange={this.numChange} />
                    </label>
                    <button type="button" value="addAddition" onClick={this.handleClick}>
                        Dodaj
                    </button>
                </div>
                {this.props.children}
          </div>
        )
    }
}
function Line(props){
    return(<div>
        {props.obj['name']+" "+props.obj['value']+" "+props.obj['unit']}
        <button type="button" onClick={(e) => props.onButton(props.obj)}>
            Usuń
        </button>
    </div>)
}
class DataForm extends React.Component{
    
   constructor(props){
    super(props);
    this.state = {name:null, desc:null, 
        num_repeats:"", num_series:"", num_features:"",
        paper:null, private:false, product:"", metric:null, metricGeneral:null, 
        categories:[], ingredients:[], sample:1, metricID:"",
        prodBase:[], prodObj:[], metricesGeneral:[], metricesGeneralBase:[], metricesDetailedBase:[],
        metricesDetailed:[], sampleBase:[],recipeBase:[]
    }
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);
    this.handleChangePaper = this.handleChangePaper.bind(this);
    this.handleChangeCat = this.handleChangeCat.bind(this);
    this.handleChangeRepeats = this.handleChangeRepeats.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}
componentDidMount = () => {
    this.refresh()
}
refresh = ()=> {
    axios.get("/api/Category/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name);});
        this.setState({categories:arr});
    }).catch(console.log("Categories failure \n"));
    axios.get("/api/DetailedMetric/").then((res)=>{
        this.setState({metricesDetailedBase:res.data});
    }).catch(console.log("Metric failure \n"));
    axios.get("/api/Metric/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name);});
        this.setState({metricesGeneral:arr});
    }).catch(console.log("Metric failure \n"));
    axios.get("/api/Product/").then((res)=>{
        this.setState({prodObj:res.data});
    })
    axios.get("/api/Recipe/").then((res)=>{
        this.setState({recipeBase:res.data});
    })
    axios.get("/api/Sample/").then((res)=>{
        this.setState({sampleBase:res.data});
    })
}
    handleSubmit(event){
        var now = new Date();
        var metrices = [["1",this.state.num_series, this.state.num_repeats,this.state.metric.sample.toString(),"1",['120'],this.state.metric.metric]];
        var experiment_data = [this.state.name, this.state.desc,this.state.paper, "Hardcoded", now.getDate()+"."+now.getMonth()+"."+now.getFullYear()]
        //var i = 0
        /*this.state.features.forEach((f)=>{
            var head = [i.toString(),parseInt(this.state.num_series),
                parseInt(this.state.num_repeats),1,['120'],f.name]
            metrices.push(head)
        })*/
        var obj = {
            experiment_data : experiment_data,
            supplement_name : "",
            percentage_of_supplement : "3",
            metrices : metrices
        };  
        axios.post("/pools/",obj,{ responseType: 'blob'}).then((res)=>{
            download(res.data,this.state.name+'.xlsx','application/vnd.openxmlformats-');
        }).catch((e)=>{console.log("Something's wrong with me")})
        event.preventDefault();
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
    handleChangeRepeats(event) {    
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
    handlePrivate =(e)=>{
        this.setState({private:!this.state.private})
    }
    handleChangeProd = (v)=>{
        this.setState({product: v});
    }
    handleChangeMetric = (v)=>{
        var arr = []
        this.state.metricesDetailedBase.forEach((lv,i,a)=>{ if(v===lv.metric){arr.push(lv.id)}})
        this.setState({
            metricesDetailed : arr,
            metricGeneral: v
        })
    }
    handleChangeDetailedMetric = (v)=>{
        if (v === ""){
            this.setState({dialog: null, metric:null, metricID:""})
        }else{
            var obj = {}
            this.state.metricesDetailedBase.forEach((lv) => {if (v==lv.id){obj = lv}})
            
            this.setState({metric: obj, metricID:v, dialog: (
            <textarea class="line" value={
                "number of repeat: "+obj.number_of_repeat+
                "\nnumber of series: " + obj.number_of_series+
                "\nsample: "+ obj.sample}/>
            )})
        }
    }

    handleNewDM = (e)=>{
        var arr = this.state.metricesDetailedBase;
        var arr2 = this.state.metricesDetailed;
        var id = 0;
        arr.forEach((v,i,a)=>{if(parseInt(v.id)>id && v.id!="") id=v.id})
        id = id+1
        var obj = {
                id: id,
                number_of_repeat : this.state.num_repeats,
                number_of_series : this.state.num_series,
                metric : this.state.metricGeneral,
                sample : this.state.sample
            }
        arr.push(obj)
        arr2.push(id.toString())
        this.setState({metricesDetailedBase:arr, metric:obj,metricID:id.toString(),dialog: (
            <textarea class="line" value={
                "number of repeat: "+obj.number_of_repeat+
                "\nnumber of series: " + obj.number_of_series+
                "\nsample: "+ obj.sample}/>
            )})

    }
    render(){
    return(
        <form class="box" id="dataform">
            <DjangoCSRFToken/>
                <label class="line2">
                    Nazwa:
                    <input class="line" type="text" value={this.state.name} onChange={this.handleChangeName} />
                </label>
                <label class="line2">
                    Opis:
                    <textarea class="line" type="text" value={this.state.desc} onChange={this.handleChangeDesc} />
                </label>
                <label class="line2">
                    URL pracy:
                    <input class="line" type="text" value={this.state.paper} onChange={this.handleChangePaper} />
                </label>
                <label class="line2">
                    Kategoria:
                    <Select onChange={this.handleChangeCat} array={this.state.categories}/>
                </label>
                <label class="line2">
                    Produkt:
                    <Select onChange={this.handleChangeProd} array={this.state.prodBase}/>
                </label>
                <label class="line2">
                    Liczba próbek:
                    <input class="line" type="text" value={this.state.num_repeats} onChange={this.handleChangeRepeats} />
                </label>
                <label class="line2">
                    Liczba serii:
                    <input class="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
                </label>
                <label class="line2">
                    Prywatny
                    <input type="checkbox" value={this.state.private} onChange={this.handlePrivate}/>
                </label>
                <label class="line2">
                    Metryka:
                    <Select onChange={this.handleChangeMetric} array={this.state.metricesGeneral}/>
                </label>
                <label class="line2">
                    Metryka szczegółowa:
                    <Select value={this.state.metricID} onChange={this.handleChangeDetailedMetric} array={this.state.metricesDetailed}/>
                    <button type="button" onClick={this.handleNewDM}>
                        Nowa
                    </button>
                </label>
                {this.state.dialog}
                 <button type="input" onClick={this.handleSubmit}>Generuj</button>
        </form>
    )
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
  