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
            experiment_id:3,
            samples:[1],
            plot_types:[type],
            metrics:['Smak','Siła cięcia']
        }
        Axios.post("/api/experiment/generatePlots/",p).then( res =>{
            let images = this.state.images.concat(res.data.plots.map(pl=>{return "data:image/png;base64,"+pl}))
            this.setState({images:images})
        }).catch( e =>{
            alert("Something is no yes "+JSON.stringify(e))
        })
    }
    clickIMG = (ind) => {
        this.setState({images:[]})
    }
    render = ()=>{
        return <div>
            <Button className="line" onClick={() =>{this.plotHandle("radar")}}>Test radar plot</Button>
            <Button className="line" onClick={() =>{this.plotHandle("bar")}}>Test bar plot</Button>
            <Button className="line" onClick={() =>{this.plotHandle("linear")}}>Test linear plot</Button>
            {this.state.images.map((v,i)=>{return <img src={v} className="line" onClick={()=>{this.clickIMG(i)}}/>})}
        </div>
    }
}

export default TestPanel