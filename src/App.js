import './style.css';
import React from 'react';
import MainScreen from "./Screens/MainScreen";

class App extends React.Component{
    constructor(props){
        super(props)
    }
    render = ()=>{
        
        return <div id ="App">
            <MainScreen/>
        </div>
    }
}

export default App;