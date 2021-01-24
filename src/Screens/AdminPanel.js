import '../style.css';
import React from 'react';
import CategoryAdminForm from "./CategoryAdminForm";
import SupplementBase from "./SupplementBase"
import BasicIngredientBase from "./BasicIngredientBase"
import Register from "./Register"
import Login from "./Login"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { Button} from "@material-ui/core"
import UserPanel from './UserPanel';
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
                    Dodatki bazowe
                </AccordionSummary>
                <AccordionDetails>
                    <SupplementBase/>
                </AccordionDetails>
            </Accordion>
			<Accordion>
                <AccordionSummary>
                    Login
                </AccordionSummary>
                <AccordionDetails>
                    <Login/>
                </AccordionDetails>
            </Accordion>
			<Accordion>
                <AccordionSummary>
                    Register
                </AccordionSummary>
                <AccordionDetails>
                    <Register/>
                </AccordionDetails>
            </Accordion>
			</div>
			 )
        
    }
}
export default AdminPanel