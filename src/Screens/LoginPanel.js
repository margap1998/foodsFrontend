import '../style.css';
import React from 'react';
import Register from "./Register"
import Login from "./Login"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { Button} from "@material-ui/core"
class AdminPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }
		
	refDM = (lv)=>{
		this.props.refreshDB(lv)
		}

    render = ()=>{
        return(<div>
			<Accordion defaultExpanded={true}>
                <AccordionSummary>
                    Login
                </AccordionSummary>
                <AccordionDetails>
                    <Login refreshDB={this.refDM} />
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