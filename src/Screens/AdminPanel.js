import Supplement from './Supplement'
import '../style.css';
import React from 'react';
import CategoryAdminForm from "./CategoryAdminForm";
import SupplementBase from "./SupplementBase"
import BasicIngredientBase from "./BasicIngredientBase"
import { Accordion, AccordionSummary, AccordionDetails, Button} from "@material-ui/core";
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
                arr[f]= <SupplementBase index={f} closeProc={this.closeWindow}/>
                break;
            case 1://"SupplementAdminForm":
                arr[f]= <Supplement index={f} closeProc={this.closeWindow}/>
                break;
            case 2://"CategoryAdminForm"
                arr[f] = <CategoryAdminForm index={f} closeProc={this.closeWindow}/>
                break;
            case 3:
                arr[f] = <BasicIngredientBase index={f} closeProc={this.closeWindow}/>
                break;

        }
        this.setState({sections:arr})
    }

    render = ()=>{
        let f = 0
        return(<div>
            <Accordion>
                <AccordionSummary>
                    Dodatki bazowe
                </AccordionSummary>
                <AccordionDetails>
                    <SupplementBase/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    Dodatki
                </AccordionSummary>
                <AccordionDetails>
                    <Supplement/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    Kategorie
                </AccordionSummary>
                <AccordionDetails>
                    <CategoryAdminForm/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    Składniki bazowe
                </AccordionSummary>
                <AccordionDetails>
                    <BasicIngredientBase/>
                </AccordionDetails>
            </Accordion>
            </div>
        )
        
    }
}
export default AdminPanel