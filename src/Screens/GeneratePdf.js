import '../style.css';
import React from 'react';
import Axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import { SelectArrayElement } from '../funcComponents'
import { Checkbox, Button, Input, FormLabel, FormGroup, FormControl,
     FormControlLabel } from "@material-ui/core"

class GeneratePdf extends React.Component{
    constructor(props){
        super(props)
                this.state = {
					Metrics:[
					'Barwa - Temperatura (140,150,160) ',
					'Zapach - Temperatura (150,160,170) ',
					'Chrupkość - Temperatura (120,130,140) '],
					Ids:[6,2,3]}
    }

	
	getDataCheckboxesUsingMap = () => {

    return this.state.Metrics.map((metrick_name,i) => {
		return <FormControlLabel
			control={<Checkbox name='1' className="checkboxStyle"/>} 
			/>
		})
	}
	
	getPdfCheckboxesUsingMap = () => {

    return this.state.Metrics.map((metrick_name,i) => {
		return <FormControlLabel 
			control={<Checkbox name='1'/>}
			label={metrick_name + this.state.Ids[i]}/>
		})
	}


    render = ()=>{
        return <div>
			<FormControl>
				<FormLabel component="legend">Tabele</FormLabel>
				<FormGroup className="checkboxStyle">
					{this.getDataCheckboxesUsingMap()}
				</FormGroup>
            </FormControl>
			<FormControl>
				<FormLabel component="legend">Wykresy</FormLabel>
				<FormGroup>
				{this.getPdfCheckboxesUsingMap()}
				</FormGroup>
            </FormControl>
        </div>
    }
}

export default GeneratePdf