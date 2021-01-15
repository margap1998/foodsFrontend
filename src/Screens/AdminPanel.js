import '../style.css';
import React from 'react';
import CategoryAdminForm from "./CategoryAdminForm";
import SupplementBase from "./SupplementBase"
import BasicIngredientBase from "./BasicIngredientBase"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
class AdminPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sections:[null,null,null,null]
        }
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