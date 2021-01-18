import '../style.css';
import React from 'react';
import Axios from "axios";
import { Button, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
class TestPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {images:[]}
    }
    plotHandle= ()=>{
        let p = {
            experiment_id:25,
            samples:[1],
            plot_types:["radar"]
        }
        Axios.post("/api/experiment/generatePlots/",p).then( res =>{
            let images = res.data.plots.map(pl=>{return "data:image/jpeg;base64,"+pl})
            this.setState({images:images})
        }).catch( e =>{
            alert("Something is no yes "+JSON.stringify(e))
        })
    }
    clickIMG = (ind) => {
        var arr = this.state.images.filter((v,i)=>{return i!==ind})
        this.setState({image:arr})
    }
    render = ()=>{
        return <div>
            <Button className="line" onClick={this.plotHandle}>Test plot</Button>
            {this.state.images.map((v,i)=>{return <img src={v} onClick={()=>{this.clickIMG(i)}}/>})}
        </div>
    }
}

export default TestPanel