import '../style.css';
import React from 'react';
import Register from "./Register"
import Login from "./Login"
import { Paper, AppBar, Toolbar, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
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
        return(
			<div>
			<Paper id ="App">
				<AppBar position="static">
					<Toolbar>
						<span id={'s1_id'}>
							<Button color="inherit">Wyloguj</Button>
						</span>
					</Toolbar>

				</AppBar>
			</Paper>
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