import React from 'react';
import Axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { SelectArrayElement } from '../funcComponents'
import { Button, Input, FormLabel, Radio, RadioGroup, FormControl,
     FormControlLabel, AccordionDetails, Accordion, AccordionSummary } from "@material-ui/core"

class UserPanel extends React.Component{
    constructor(props){
        super(props)
                this.state = {level:"false", user:"", users:[], usersDB:[],userObj:undefined,
                        pass:"", email:""}
    }
    componentDidMount = ()=>{
        this.refreshDB()
    }
    refreshDB = ()=>{
        Axios.get("/api2/authentication/get_users/").then(res=>{
            let arr = res.data.map(v=>{ return [v.username,v.username,v.email]})
            this.setState({users:arr, usersDB:res.data})
        }).catch(()=>{console.log("Problem with downloading datas")})
    }
    selectUser = (v)=>{
        let user = this.state.usersDB.find((o)=>{ return o.username==v})
        alert(JSON.stringify(user))
        this.setState({user:v,userObj:user, email:user.email})
    }
    changeUser = (v)=>{
        this.setState({user:v})
    }
    changeLevel = (e)=>{
        this.setState({level:e.target.value})
    }

    changeData = ()=>{
        let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
        //obiekt z danymi do bazy
        let data = 
            {
                "username": this.state.user,
                "email": this.state.email
            }
        Axios.post("/api2/authentication/change_email/",data,{headers:headers, withCredentials:true}).then(r=>{
            alert("Zmiana e-maila użytkownika "+ this.state.user)
            this.refreshDB()
        }).catch( ()=>{ alert("Zmiana e-maila użytkownika "+ this.state.user +" się nie powiodła")})

    }
    deleteUser = ()=>{
        let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
        //obiekt z danymi do bazy
        let data = 
            {
                "username": this.state.user
            }
        Axios.post("/api2/authentication/delete_user/",data,{headers:headers, withCredentials:true}).then(r=>{
            alert("Usunięcie użytkownika "+ this.state.user)
            this.refreshDB()
        }).catch( ()=>{ alert("Usunięcie użytkownika "+ this.state.user +" się nie powiodło")})
    }
    changePass = ()=>{
        let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
        //obiekt z danymi do bazy
        let data = 
            {
                "username": this.state.user,
                "password": this.state.pass
            }
        Axios.post("/api2/authentication/change_password/",data,{headers:headers, withCredentials:true}).then(r=>{
            this.refreshDB()
            alert("Zmieniono hasło użytkownika "+ this.state.user)
        }).catch( ()=>{ alert("Zmiana hasła użytkownika "+ this.state.user +" się nie powiodła")})
    }
    setLevel = ()=>{
        let token = getCSRFToken()
        const headers = {"X-CSRFTOKEN": token}
        let su = this.state.level
        
        su = su.charAt(0).toUpperCase().concat(su.slice(1))
        //obiekt z danymi do bazy
        alert(su)
        let data = {
            "username": this.state.user,
            "is_superuser": su
        }
            
        Axios.post("/api2/authentication/change_super_power/",data,{headers:headers, withCredentials:true}).then(r=>{
            alert("Usunięcie użytkownika "+ this.state.user)
            this.refreshDB()
        }).catch( ()=>{ alert("Usunięcie użytkownika "+ this.state.user +" się nie powiodło")})
    }
    render = ()=>{
        return <div>
            <FormLabel>
                Użytkownik 
                <SelectArrayElement value={this.state.user} className="line" array={this.state.users} onChange={this.selectUser}/>
            </FormLabel>
            <FormLabel className="line">
                E-mail
                <Input type="email" className="line" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
            </FormLabel>
            <Button className="line" variant="contained" onClick={this.changeData}>Zmień e-mail użytkownika</Button>
            <span className="line"/>
            <Accordion>
                <AccordionSummary>
                Nowe hasło 
                </AccordionSummary>
                <AccordionDetails className="line">
                    <Input type="password" value={this.state.pass} onChange={(e)=>{this.setState({pass:e.target.value})}}/>
                    <span className="margin"><Button className="line" variant="contained" onClick={this.changePass}> Zmień hasło</Button></span>
                </AccordionDetails>
            </Accordion>
            <span className="line"/>
            <FormControl component="fieldset">
                <FormLabel component="legend">Poziom uprawnień</FormLabel>
                <RadioGroup aria-label="userLevel" name="userLevelRadio" value={this.state.level} onChange={this.changeLevel}>
                    <FormControlLabel value="true" control={<Radio />} label="Administrator" />
                    <FormControlLabel value="false" control={<Radio />} label="Zwykły" />
                </RadioGroup>
                <Button variant="contained" onClick={this.setLevel}>Nadaj uprawnienia użytkownika</Button>
            </FormControl>
            <span className="line"/>
            <Button className="line" variant="contained" color="secondary" onClick={this.deleteUser}>Usuń użytkownika</Button>
        </div>
    }
}

export default UserPanel