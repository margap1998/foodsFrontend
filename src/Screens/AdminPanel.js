import Supplement from './Supplement'
import '../style.css';
import React from 'react';
import CategoryAdminForm from "./CategoryAdminForm";
class AdminPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sections:[null,null,null,null]
        }
    }

    selectSection = (f) => {
        var arr = this.state.sections
        switch(f){
            case 0:
                break;
            case 1://"SupplementAdminForm":
                arr[f]= <Supplement index={f} closeProc={this.closeWindow}/>
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
            <nav className="box">
                <button type="button" onClick={this.props.closeProc}>X</button>
                <div>
                    <button onClick={()=>{this.selectSection(1)}}>Dodatki bazowe</button>
                    <button>Składniki podstawowe</button>
                    <button onClick={()=>{this.selectSection(2)}}>Kategorie</button>
                </div>
            </nav>
            {this.state.sections.map((v)=>{return v})}
        </div>
    }
}
export default AdminPanel