import '../style.css';
import React from 'react';
import MainScreen from "./MainScreen";
import AdminPanel from "./AdminPanel"
import LoginPanel from "./LoginPanel";
import Axios from "axios";
import { Paper, AppBar, Toolbar, Button} from "@material-ui/core";
class Enter extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            adm:true,
            ms:false,
            whoslogged:props.user,
			is_admin:false
			
        }
    }
	
	logOutUser = ()=>{
		let data = 
			{
				
			}
		Axios.post("/api2/authentication/sign_out/",data).then(r=>{
			alert("Wylogowano")
			this.props.refreshDB('Logged out')
		}).catch( ()=>{ alert("Wylogowanie się nie powiodło"); return})
    }
    screenChange(v){
        this.setState({
            adm:v,
            ms:!v
        })
    }
	
	
	refDM = ()=>{

		Axios.get("api2/authentication/get_user/").then((res)=>{
			this.state.whoslogged = res.data.username;
			this.state.is_admin = res.data.is_superuser;	
			document.getElementById('s1_id').style.display = 'flex';
			if(this.state.is_admin === true){
					document.getElementById('s2_id').style.display = 'flex';
			}else{
					document.getElementById('s2_id').style.display = 'none';
			}
        }).catch( ()=>{ alert("Nie udało się pobrać danych czy użytkownik posiada prawa administracyjne"); return})
	}
	
    render = ()=>{
		this.refDM();
        return <Paper id ="App">
            <AppBar position="static">
				<Toolbar>
					<span id={'s1_id'} >
						<Button color="inherit" onClick={(e)=>{this.screenChange(true)}}>{this.state.whoslogged}</Button>
						<span id={'s2_id'} className="spanClass" >
							<Button color="inherit" onClick={(e)=>{this.screenChange(false)}}>Panel administracyjny</Button>
						</span>
						<Button color="inherit" onClick={(e)=>{this.logOutUser()}}>Wyloguj</Button>
					</span>
				</Toolbar>

            </AppBar>
            <span hidden={this.state.ms}><MainScreen user={this.state.whoslogged}/></span>
            <span hidden={this.state.adm}><AdminPanel/></span>
        </Paper>
    }
}

export default Enter;