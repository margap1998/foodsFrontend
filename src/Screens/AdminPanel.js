import '../style.css';
import React from 'react';
import CategoryAdminForm from "./CategoryAdminForm";
import SupplementBase from "./SupplementBase"
import BasicIngredientBase from "./BasicIngredientBase"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import UserPanel from './UserPanel';
import MetricForm from './MetricForm';
class AdminPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render = ()=>{
        return(<div>
            <Accordion>
                <AccordionSummary>
                    Użytkownicy
                </AccordionSummary>
                <AccordionDetails>
                    <UserPanel/>
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
            <Accordion>
                <AccordionSummary>
                    Metryki
                </AccordionSummary>
                <AccordionDetails>
                    <MetricForm/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    Dodatki bazowe
                </AccordionSummary>
                <AccordionDetails>
                    <SupplementBase/>
                </AccordionDetails>
            </Accordion>
            </div>
        )
        
    }
}
export default AdminPanel