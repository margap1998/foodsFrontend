import React from 'react';
import Axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { SelectArrayElement } from '../funcComponents'
import { Button, Input, FormLabel, Radio, RadioGroup, FormControl,
     FormControlLabel, AccordionDetails, Accordion, AccordionSummary } from "@material-ui/core"

class Register extends React.Component{
    constructor(props){
        super(props)
                this.state = {user:"", email:"", pass:"", pass_check:""}
    }
    addUser = ()=>{
		console.log("Moze Dodaje");
		if(this.checkRequierments()===true){
			let token = getCSRFToken()
			const headers = {"X-CSRFTOKEN": token}
			//obiekt z danymi do bazy
			let data = 
				{
					"username": this.state.user,
					"email": this.state.email,
					"password1": this.state.pass,
					"password2": this.state.pass_check,
				}
				Axios.post("/api2/authentication/register/",data,{headers:headers, withCredentials:true}).then(function (response){
					alert("Dodanie Użytkownika "+ this.state.user);
					console.log(response);
				}).catch( function (error) {    
				if (error.response) {
					alert(String(error.response.data.message));
				} else if (error.request) {
					alert(String(error.request));
				} 
			});
		}else{alert("NOPE");}
    }
	checkRequierments = ()=>{	
		var msg = "";
		if(String(this.state.user) < 8) {  
			msg = msg + "- Nazwa użytkownika musi zawierać co najmniej 8 znaków \n"; 
		} 
        if (String(this.state.pass) != String(this.state.pass_check)){
            msg = msg + "- Podane hasła są różne! \n";
		}	
		var pw = String(this.state.pass);  
		if(pw.length < 8) {  
			msg = msg + "- Hasło musi zawierać co najmniej 8 znaków \n"; 
		}  
		var lowerCaseLetters = /[a-z]/g;
		if(!this.state.pass.match(lowerCaseLetters)) {
			msg = msg + "- Hasło musi zawierać co najmniej jedną małą literę \n"; 
		}
		var upperCaseLetters = /[A-Z]/g;
		if(!this.state.pass.match(upperCaseLetters)) {
			msg = msg + "- Hasło musi zawierać co najmniej jedną dużą literę \n"; 
		}
		var numbers = /[0-9]/g;
		if(!this.state.pass.match(numbers)) {
			msg = msg + "- Hasło musi zawierać co najmniej jedną cyfrę \n"; 
		}
		var specials = /[!@#$%^&*,.?:]/g;
		if(!this.state.pass.match(specials)) {
			msg = msg + "- Hasło musi zawierać co najmniej jeden znak specjalny \n"; 
		}
		if(msg!=""){
			alert(msg);
			return false
		}
		return true
    }

    render = ()=>{
        return <div>
            <FormLabel className="line">
                Nazwa Użytkownika*
                <Input type="user" className="line" value={this.state.user} onChange={(e)=>{this.setState({user:e.target.value})}}/>
            </FormLabel>
            <FormLabel className="line">
                E-mail
                <Input type="email" className="line" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
            </FormLabel>
			<FormLabel className="line">
                Hasło**
                <Input type="password" className="line" value={this.state.pass} onChange={(e)=>{this.setState({pass:e.target.value})}} id="myInput"/>
            </FormLabel>
			<FormLabel className="line">
                Powtórz Hasło
                <Input type="password" className="line" value={this.state.pass_check} onChange={(e)=>{this.setState({pass_check:e.target.value})}}id="myInput"/>
            </FormLabel>
			<FormLabel className="line">		
				*Minimum 8 znaków<br></br>
				**Hasło musi zawierać co najmniej:<br></br> 
				- 8 znaków<br></br> 
				- 1 znak specjalny<br></br> 
				- 1 cyfrę<br></br> 
				- 1 małą literę<br></br> 
				- 1 dużą literę<br></br> 
            </FormLabel>
            <Button className="line" variant="contained" onClick={this.addUser}>Zarajestruj</Button>
            <span className="line"/>
            
        </div>
    }
}

export default Register 