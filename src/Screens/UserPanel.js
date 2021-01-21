import React from 'react';
import Axios from "axios";
import { SelectArrayElement } from '../funcComponents'
import { Button, Input, FormLabel, Radio, RadioGroup, FormControl, FormControlLabel} from "@material-ui/core"

class UserPanel extends React.Component{
    constructor(props){
        super(props)
        this.state = {level:"administrator", user:"", users:[["1","Michał"],["2","Kasia"]]}
    }

    selectUser = ()=>{

    }
    changeUser = (v)=>{
        this.setState({user:v})
    }
    changeLevel = (e)=>{
        this.setState({level:e.target.value})
    }

    render = ()=>{
        return <div>
            <FormLabel className="line">
                Użytkownik 
                <SelectArrayElement value={this.state.user} className="line" array={this.state.users} onChange={this.selectUser}/>
            </FormLabel>
            <FormLabel className="line">
                Nowe hasło 
                <Input/>
                <Button variant="contained"> Zmień hasło</Button>
            </FormLabel>
            <FormControl component="fieldset">
                <FormLabel component="legend">Poziom uprawnień</FormLabel>
                <RadioGroup aria-label="userLevel" name="userLevelRadio" value={this.state.level} onChange={this.changeLevel}>
                    <FormControlLabel value="administrator" control={<Radio />} label="Administrator" />
                    <FormControlLabel value="normal" control={<Radio />} label="Zwykły" />
                </RadioGroup>
            </FormControl>
        </div>
    }
}

export default UserPanel