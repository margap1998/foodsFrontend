import './style.css';
import React from 'react';
import MainScreen from "./Screens/MainScreen";
import { Paper } from "@material-ui/core";
class App extends React.Component{
    constructor(props){
        super(props)
    }
    render = ()=>{
        
        return <Paper id ="App">
            <MainScreen/>
        </Paper>
    }
}

export default App;