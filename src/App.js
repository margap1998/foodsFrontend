import './style.css';
import React from 'react';
import Register from "./Screens/Register"
import Login from "./Screens/Login"
import Enter from './Screens/Enter.js';
import { Paper, AppBar, Toolbar, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { Button} from "@material-ui/core"
class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {screen:1, userName:'Logged out'
        }
    }
		
	refDM = (lv)=>{
		if(this.state.screen === 1){
			this.setState({screen: 2,userName: lv});
		}else{
			this.setState({screen: 1,userName: lv});
		}
	}
	
	

    render = ()=>{
		var res
		
		switch (this.state.screen) {
            case 1:
				res = (
				<div>
				<Paper id ="App">
					<AppBar position="static">
						<Toolbar>
							<span style={{fontSize:"x-large"}}>
								System wspomagania decyzji do oceny i projektowania żywności bioaktywnej
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
                break;
            case 2:
                res = <Enter user={this.state.userName} refreshDB={this.refDM}/>
                break;
        }
        
        return res
    }
}
export default App;