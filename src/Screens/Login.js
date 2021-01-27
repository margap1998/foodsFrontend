import React from 'react';
import Axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { SelectArrayElement } from '../funcComponents'
import { Button, Input, FormLabel, Radio, RadioGroup, FormControl,
     FormControlLabel, AccordionDetails, Accordion, AccordionSummary } from "@material-ui/core"

class Login extends React.Component{
    constructor(props){
        super(props)
                this.state = {user:"", pass:""}
    }

    logUser = ()=>{
			let token = getCSRFToken()
			const headers = {"X-CSRFTOKEN": token}
			//obiekt z danymi do bazy
			let data = 
				{
					"username": this.state.user,
					"password": this.state.pass,
				}
			Axios.post("/api2/authentication/sign_in/",data,{headers:headers, withCredentials:true}).then((response) => {
					alert("Zalogowano "+ this.state.user);	
					this.props.refreshDB(this.state.user)
				}).catch( function (error) {    
				if (error.response) {
					alert(String(error.response.data.message));
				} else if (error.request) {
					alert(String(error.request));
				} 
			});
	}

    render = ()=>{
        return <div>
            <FormLabel className="line">
                Nazwa Użytkownika
                <Input type="user" className="line" value={this.state.user} onChange={(e)=>{this.setState({user:e.target.value})}}/>
            </FormLabel>
			<FormLabel className="line">
                Hasło
                <Input type="password" className="line" value={this.state.pass} onChange={(e)=>{this.setState({pass:e.target.value})}}/>
            </FormLabel>
            <Button className="line" variant="contained" onClick={this.logUser}>Zaloguj się</Button>
            <span className="line"/>
            
        </div>
    }
}

export default Login