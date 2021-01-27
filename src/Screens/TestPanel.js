import '../style.css';
import React from 'react';
import Axios from "axios";
import { Button } from "@material-ui/core";
class TestPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {images:[]}
    }
    plotHandle= (type)=>{
        let p = {
            experiment_id:8,
            samples:[3,2],
            series_metric:[[1,7],[1,6]],
            metrics:['Smak','Siła cięcia']
        }
        Axios.post(`/api/experiment/generate${type}Plots/`,p).then( res =>{
            let images = this.state.images.concat(res.data.plots.map(pl=>{return "data:image/png;base64,"+pl}))
            this.setState({images:images})
        }).catch( e =>{
            alert("Something is no yes "+JSON.stringify(e))
        })
    }
    statsHandle = ()=>{
        Axios.post("/api/experiment/generateStats/",{experiment_id:8}).then( res =>{
            alert(JSON.stringify(res.data))
        }).catch( e =>{
            alert("Something is no yes "+JSON.stringify(e))
        })
    }
    clickIMG = (ind) => {
        this.setState({images:[]})
    }
    render = ()=>{
        return <div>
            <Button className="line" onClick={() =>{this.plotHandle("Radar")}}>Test radar plot</Button>
            <Button className="line" onClick={() =>{this.plotHandle("Bar")}}>Test bar plot</Button>
            <Button className="line" onClick={() =>{this.plotHandle("Linear")}}>Test linear plot</Button>
            <Button className="line" onClick={() =>{this.statsHandle()}}>Test statistics</Button>
            {this.state.images.map((v,i)=>{return <img src={v} onClick={()=>{this.clickIMG(i)}}/>})}
        </div>
    }
}

export default TestPanel