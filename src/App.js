import './style.css';
import React from 'react';
import MainScreen from "./Screens/MainScreen";
import AdminPanel from "./Screens/AdminPanel"
import TestPanel from "./Screens/TestPanel";
import Axios from "axios";
import { Paper, AppBar, Toolbar, Button} from "@material-ui/core";
class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            adm:true,
            ms:false,
            test:true,
            whoslogged:"User1"
        }
    }
	
	logOutUser = ()=>{
		let data = 
			{
				
			}
		Axios.post("/api2/authentication/sign_out/",data).then(r=>{
			alert("Wylogowano")
		}).catch( ()=>{ alert("Wylogowanie się nie powiodło")})
    }
    screenChange(v){
        this.setState({
            adm:v,
            ms:!v,
            test:true
        })
    }
    render = ()=>{
        return <Paper id ="App">
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={(e)=>{this.screenChange(true)}}>{this.state.whoslogged}</Button>
                    <Button color="inherit" onClick={(e)=>{this.screenChange(false)}}>Panel administracyjny</Button>
					<Button color="inherit" onClick={(e)=>{this.setState({adm:true,ms:true,test:false})}}>Testowy</Button>
					<Button color="inherit" onClick={this.logOutUser}>Wyloguj</Button>
            
                </Toolbar>
            </AppBar>
            <span hidden={this.state.ms}><MainScreen/></span>
            <span hidden={this.state.adm}><AdminPanel/></span>
            <span hidden={this.state.test}><TestPanel/></span>
        </Paper>
    }
}

export default App;