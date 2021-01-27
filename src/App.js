import './style.css';
import React from 'react';
import MainScreen from "./Screens/MainScreen";
import AdminPanel from "./Screens/AdminPanel"
import LoginPanel from "./Screens/LoginPanel";
import Axios from "axios";
import { Paper, AppBar, Toolbar, Button} from "@material-ui/core";
class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            adm:true,
            ms:true,
			login:false,
            whoslogged:"Unknown User",
			is_admin:false,

        }
    }
	
	logOutUser = ()=>{
		let data = 
			{
				
			}
		Axios.post("/api2/authentication/sign_out/",data).then(r=>{
			alert("Wylogowano")
		}).catch( ()=>{ alert("Wylogowanie się nie powiodło"); return})
		document.getElementById('s1_id').style.display = 'none';
		document.getElementById('s2_id').style.display = 'none';
    }
    screenChange(v){
        this.setState({
            adm:v,
            ms:!v,
			login:true
        })
    }
	
	
	refDM = (lv)=>{
		this.state.whoslogged = lv;
		this.screenChange(true);
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
        return <Paper id ="App">
            <AppBar position="static">
				<Toolbar>
					<span id={'s1_id'} hidden={!this.state.login}>
						<Button color="inherit" onClick={(e)=>{this.screenChange(true)}}>{this.state.whoslogged}</Button>
						<span id={'s2_id'} className="spanClass" >
							<Button color="inherit" onClick={(e)=>{this.screenChange(false)}}>Panel administracyjny</Button>
						</span>
						<Button color="inherit" onClick={(e)=>{this.setState({adm:true,ms:true,login:false}); this.logOutUser()}}>Wyloguj</Button>
					</span>
				</Toolbar>

            </AppBar>
            <span hidden={this.state.ms}><MainScreen user={this.state.whoslogged}/></span>
            <span hidden={this.state.adm}><AdminPanel/></span>
            <span hidden={this.state.login}><LoginPanel refreshDB={this.refDM} /></span>

        </Paper>
    }
}

export default App;