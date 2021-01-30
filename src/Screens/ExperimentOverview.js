import React from 'react';
import download from 'downloadjs';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { Select } from "../funcComponents.js";
import DetailedMetricForm from './DetailedMetricForm.js';
import GeneratePdf from "./GeneratePdf.js"
import TestPanel from "./TestPanel.js"
import { Button, InputLabel, Input, TextareaAutosize, Checkbox,
        Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup,
        Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import ProductForm from './Product.js';
//Komponenet odpowiedzialny za formularz eksperymentu
class ExperimentOverview extends React.Component{
    constructor(props){
     super(props);
        this.state =    {name:props.obj.name,
                        id:props.obj.id}

    }


     closeWindow =()=>{ this.setState({window:null}) }

     render(){
     return(
        <div id="dataform">
            <span className="line">{this.state.name}</span>
            <Button variant="contained" className="line" type="button" onClick={this.props.closeProc}>Powrót</Button>
                <Accordion>
                    <AccordionSummary>
                        Generuj Pdf
                    </AccordionSummary>
                    <AccordionDetails>
                        <GeneratePdf  obj={this.state.id}/>
                    </AccordionDetails>
                </Accordion>
				<Accordion>
                    <AccordionSummary>
                        Wykresy
                    </AccordionSummary>
                    <AccordionDetails>
                        <TestPanel />
                    </AccordionDetails>
                </Accordion>
         </div>

     )
     }
 }

 export default ExperimentOverview