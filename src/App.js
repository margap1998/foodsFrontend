import DataForm from "./DataForm";
import {getCSRFToken} from "./csrftoken"
import './style.css';
import React from 'react';
import Axios from "axios";

class CategoryAdminForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:""
        }
    }
    componentWillUnmount = ()=>{
        this.props.closeProc(this.props.index)
    }
    handleSubmit = ()=>{
        let token = getCSRFToken()
        let headers = {"X-CSRFTOKEN": token}
        let data = {
            "name": this.state.name 
            }
        Axios.post("/api/experiment/Category/",data,{headers:headers, withCredentials:true}).then((e)=>{ alert("Wstawiono"); this.componentWillUnmount() ;}).catch((e)=>{alert("Nie wstawiono")})
    }
    render = ()=>{
        return(
        <div className="box">
            <button type="button" onClick={this.componentWillUnmount}>X</button>
            <label className="line2">
                Nazwa:
                <input className="line" value={this.state.name} onChange={(e) =>{this.setState({name:e.target.value})}}></input>
            </label>
            <button className="line" onClick={this.handleSubmit}>Dodaj kategorię</button>
        </div>
        )
}
}

class AdminPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sections:[null,null,null,null,null]
        }
    }

    selectSection = (f) => {
        var arr = this.state.sections
        switch(f){
            case 0://"SupplementAdminForm":
                break;
            case 1://"IngredientAdminForm":
                break;
            case 2://"CategoryAdminForm"
                arr[f] = <CategoryAdminForm index={f} closeProc={this.closeWindow}/>
                break;
        }
        this.setState({sections:arr})
    }
    closeWindow = (ind)=>{
        var arr = this.state.sections
        arr[ind] = null
        this.setState({sections:arr})
    }

    render = ()=>{
        return <div id="AdminPanel">
            <nav className="box"><div>
                <button>Dodatki bazowe</button>
                <button>Składniki podstawowe</button>
                <button>Produkty</button>
                <button onClick={()=>{this.selectSection(2)}}>Kategorie</button>
            </div></nav>
            {this.state.sections.map((v)=>{return v})}
        </div>
    }
}


class App extends React.Component{
    constructor(props){
        super(props)
        this.state={main:<DataForm/>, admin:true, adminMode:false};
    }
    setMode(){
        if(this.state.adminMode) {
            this.setState({main:<DataForm/>, adminMode:false})
        }
        else{
            this.setState({main:<AdminPanel/>, adminMode:true})
        }
    }
    render = ()=>{
        return <div id ="App">
        <button onClick={()=>{ this.setMode() }}>{this.state.adminMode ? "Formularz eksperymemtu" : "Panel administracyjny" }</button>
        {this.state.main}
        </div>
    }
}

export default App;