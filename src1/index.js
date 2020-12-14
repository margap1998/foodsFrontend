import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import axios from "axios";
import download from 'downloadjs';


function Select(props){
    var q =[""]
    q = q.concat(props.array)
    var op = q.map(value =>{return(<option value={value}>{value}</option>)})
    return(
        <select onChange={e => props.onChange(e.target.value)}>
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
        num_repeats:"", num_series:"",
        paper:null, sent:false,
        categories:[], ingredientBase: [], supplementBase: [], 
        ingredients:[],supplemensts:[], features:[]
    }
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);
    this.handleChangePaper = this.handleChangePaper.bind(this);
    this.handleChangeCat = this.handleChangeCat.bind(this);
    this.handleChangeRepeats = this.handleChangeRepeats.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFeature = this.handleFeature.bind(this)
    this.handleDeleteFeature = this.handleDeleteFeature.bind(this)
    this.handleDeleteAddition = this.handleDeleteAddition.bind(this)
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
    axios.get("/api/BasicIngredientBase/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name); });
        this.setState({ingredientBase:arr});
    }).catch(console.log("Ingredients failure \n"));
    axios.get("/api/SupplementBase/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name);});
        this.setState({supplementBase:arr});
    }).catch(console.log("Supplements failure \n"));
    axios.get("/api/Metric/").then((res)=>{
        var arr = [];
        res.data.forEach((obj)=>{arr.push(obj.name);});
        this.setState({featureBase:arr});
    }).catch(console.log("Metric failure \n"));
}
    handleSubmit(event){
        var now = new Date();
        var metrices = [];
        var experiment_data = [this.state.name, this.state.num_series, this.state.paper, "Hardcoded", now.getDate()+"."+now.getMonth()+"."+now.getFullYear()]
        var i = 0
        this.state.features.forEach((f)=>{
            var head = [i.toString(),parseInt(this.state.num_series),
                parseInt(this.state.num_repeats),i++,1,[f.value],f.name]
            metrices.push(head)
        })
        var obj = {
            experiment_data : experiment_data,
            supplement_name : this.state.supplemensts[0].name,
            percentage_of_supplement : this.state.supplemensts[0].value,
            metrices : metrices
        };
  
        axios.post("/pools/",obj,{ responseType: 'blob'}).then((res)=>{
            download(res.data,this.state.name+'.xlsx','application/vnd.openxmlformats-');
        }).catch((e)=>{console.log("Something's wrong with me")})
        event.preventDefault();
    }
    handleIngredient= (value)=>{
        var a = this.state.ingredients;
        value.key = a.length + 1;
        a.push(value)
        this.setState({ingedients: a})     
    }
    handleFeature(value){
        var f = this.state.features;
        value.key = f.length + 1;
        f.push(value)
        this.setState({num_featurs: f.length, features:f})
    }
    handleSupplements = (value)=>{
        var a = this.state.supplemensts;
        value.key = a.length + 1;
        a.push(value)
        this.setState({additions: a})
    }
    handleChangeName(event) {    this.setState({name: event.target.value});}
    handleChangeDesc(event) {    this.setState({desc: event.target.value});}
    handleChangePaper(event) {    this.setState({paper: event.target.value});}
    handleChangeCat(v) {    this.setState({category: v});}
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

    handleDeleteFeature(obj){
        var f = this.state.features
        const ind = f.indexOf(obj)
        f.splice(ind,1)
        this.setState({num_featurs: f.length, features:f})
    }
    handleDeleteIngredient = (obj) =>{
        var a = this.state.ingredients
        const ind = a.indexOf(obj)
        a.splice(ind,1)
        this.setState({ingedients:a})

    }
    handleDeleteAddition(obj){
        var a = this.state.supplemensts
        const ind = a.indexOf(obj)
        a.splice(ind,1)
        this.setState({supplemensts:a})
    }
    handleDownload = (ev)=>{

    }
    render(){
    return(
        <form id="dataform" class="box" method="post" action="/pools/" onSubmit={this.handleSubmit}>
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
                Liczba powtórzeń:
                <input class="line" type="text" value={this.state.num_repeats} onChange={this.handleChangeRepeats} />
            </label>
            <label class="line2">
                Liczba serii:
                <input class="line" type="text" value={this.state.num_series} onChange={this.handleChangeSeries} />
            </label>
            <IngredientBlock onAdd={this.handleIngredient} array={this.state.ingredientBase}>                
                <div class="box2">
                    {this.state.ingredients.map(el => (<Line obj={el} onButton={this.handleDeleteIngredient}></Line>))}
                </div>
            </IngredientBlock>
            <AdditionBlock onAdd={this.handleSupplements} array={this.state.supplementBase}>                
                <div class="box2">
                    {this.state.supplemensts.map(el => (<Line obj={el} onButton={this.handleDeleteAddition}></Line>))}
                </div>
            </AdditionBlock>
            <FeaturesBlock onAdd={this.handleFeature} array={this.state.featureBase}>    
                <label class="line2">
                    Liczba cech:
                    <input class="line" type="text" value={this.state.num_featurs}/>
                </label>
                <div class="box2">
                    {this.state.features.map(el => (<Line obj={el} onButton={this.handleDeleteFeature}></Line>))}
                </div>
            </FeaturesBlock>
            <button type="submit">Generuj</button>
            <button className={"visible"+this.state.sent.toString()}type="button" onClick={this.handleDownload}>Pobierz</button>
            
        </form>
    )
    }
}



class App extends React.Component{
    render(){
        return <div id ="App">
            <DataForm>

            </DataForm>
        </div>
    }
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
  