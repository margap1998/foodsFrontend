import DetailedMetricForm from "./DetailedMetricForm";
import SampleForm from "./SampleForm";
import DataForm from "./DataForm";
import './style.css';
import React from 'react';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={experiment_data:{},section:[null,null]};
    }

    closeWindow = (ind)=>{
        var arr = this.state.section
        arr[ind] = null
        this.setState({section:arr})
    }

    addSection = (obj,ind)=>{
        var arr = this.state.section
        arr[ind] = obj
        this.setState({section:arr})
    }

    render = ()=>{
        return <div id ="App">
            <nav className="box">
                <div>
                <button onClick={(e)=>{ this.addSection(<SampleForm closeProc={this.closeWindow}/>,0) }}>Nowa próbka</button>
                <button onClick={(e)=>{ this.addSection(<DetailedMetricForm closeProc={this.closeWindow} />,1) } }>Nowa metryka szczegółowa</button>
                </div>
            </nav>
            {this.state.section.map((v)=>{return v})}
            <DataForm/>
        </div>
    }
}

export default App;