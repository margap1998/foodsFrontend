import './style.css';
import React from 'react';
import MainScreen from "./Screens/MainScreen";
import AdminPanel from "./Screens/AdminPanel"
import TestPanel from "./Screens/TestPanel";
import { Paper, AppBar, Toolbar, Button} from "@material-ui/core";
class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            adm:true,
            ms:false,
            test:true
        }
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
                    <Button color="inherit" onClick={(e)=>{this.screenChange(true)}}>Uzytkownik</Button>
                    <Button color="inherit" onClick={(e)=>{this.screenChange(false)}}>Panel administracyjny</Button>
        //<Button color="inherit" onClick={(e)=>{this.setState({adm:true,ms:true,test:false})}}>Testowy</Button>
                </Toolbar>
            </AppBar>
            <span hidden={this.state.ms}><MainScreen/></span>
            <span hidden={this.state.adm}><AdminPanel/></span>
            <span hidden={this.state.test}><TestPanel/></span>
        </Paper>
    }
}

export default App;