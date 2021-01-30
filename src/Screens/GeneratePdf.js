import '../style.css';
import React from 'react';
import axios from "axios";
import { getCSRFToken } from '../csrftoken.js'
import download from 'downloadjs';
import { SelectArrayElement } from '../funcComponents'
import { Checkbox, Button, Input, Radio, RadioGroup, FormLabel, FormGroup, FormControl,
     FormControlLabel } from "@material-ui/core"

class GeneratePdf extends React.Component{
    constructor(props){
        super(props)
            this.state = {
                id_exp:props.obj,
                Metrics:[],
                ids:[],
                id_plot:[],
                id_data:[],
				metric_names:[],
				metric_names_chosen:[],
				external_factor_names:[],
				external_factor_names_chosen:[],
				supplements_names:[],
				supplements_names_chosen:[],
				ch:[false, false, false, false, false, false, false]}
			let token = getCSRFToken()
			const headers = {"X-CSRFTOKEN": token}
            let data =
				{
					'id': this.state.id_exp,
				}
            axios.post('/api/experiment/getPdfMetrics/', data, {
                 headers: {
                 "X-CSRFTOKEN": token,
                 withCredentials:true
                 }
             })
             .then((res)=>{this.setState({	Metrics:res.data.metric_description, 
											ids:res.data.metric_id,
											metric_names:res.data.metric_names,
											external_factor_names:res.data.external_factor_names,
											supplements_names:res.data.supplements_names})
             }).catch((a)=>{console.log("Something's wrong with metric id and name downloading");})


    }

	handleChangeData = (v) => {
        if(!this.state.id_data.includes(v)){
                this.state.id_data.push(v)
        }else{
            var index = this.state.id_data.indexOf(v);
            if (index !== -1) {
              this.state.id_data.splice(index, 1);
            }
        }
    };

    handleChangePlotMetrics = (v) => {
        if(!this.state.metric_names_chosen.includes(v)){
                this.state.metric_names_chosen.push(v)
        }else{
            var index = this.state.metric_names_chosen.indexOf(v);
            if (index !== -1) {
              this.state.metric_names_chosen.splice(index, 1);
            }
        }
    };
	
	handleChangePlotFactors = (v) => {
        if(!this.state.external_factor_names_chosen.includes(v)){
                this.state.external_factor_names_chosen.push(v)
        }else{
            var index = this.state.external_factor_names_chosen.indexOf(v);
            if (index !== -1) {
              this.state.external_factor_names_chosen.splice(index, 1);
            }
        }
    };
	
	handleChangePlotSupplements = (v) => {
        if(!this.state.supplements_names_chosen.includes(v)){
                this.state.supplements_names_chosen.push(v)
        }else{
            var index = this.state.supplements_names_chosen.indexOf(v);
            if (index !== -1) {
              this.state.supplements_names_chosen.splice(index, 1);
            }
        }
    };
	
	handleChangePlotCh = (v) => {;
        if(this.state.ch[v]==false){
                this.state.ch[v]=true
        }else{
            this.state.ch[v]=false
        }
    };



	getDataCheckboxesUsingMap = () => {

    return this.state.Metrics.map((metrick_name,i) => {
		return <FormControlLabel
			control={<Checkbox onChange={e =>{this.handleChangeData(this.state.ids[i])}}/>}
			label={metrick_name}/>
		})
	}
	
	getPlotMetricsCheckboxesUsingMap = () => {

    return this.state.metric_names.map((metrick_name,i) => {
		return <FormControlLabel 
			control={<Checkbox name='1' onChange={e =>{this.handleChangePlotMetrics(this.state.metric_names[i])}}/>}
			label={metrick_name}/>
		})
	}
	
	getPlotFactorsCheckboxesUsingMap = () => {

    return this.state.external_factor_names.map((external_factor_name,i) => {
		return <FormControlLabel 
			control={<Checkbox name='1' onChange={e =>{this.handleChangePlotFactors(this.state.external_factor_names[i])}}/>}
			label={external_factor_name}/>
		})
	}
	
	getPlotSupplementsCheckboxesUsingMap = () => {

    return this.state.supplements_names.map((supplements_name,i) => {
		return <FormControlLabel 
			control={<Checkbox name='1' onChange={e =>{this.handleChangePlotSupplements(this.state.supplements_names[i])}}/>}
			label={supplements_name}/>
		})
	}
	

    generate_pdf= ()=>{
		//pobranie znacznika CSRF z ciasteczka
        let token = getCSRFToken()
        //stworzenie odpowiedniego nagłówka zapytania
        const headers = {"X-CSRFTOKEN": token}
		let data =
				{
					"idExp": this.state.id_exp,
					"idDetailedMetrics": this.state.id_data.sort(function (a, b) {  return a - b;  }),
					"idPlots": this.state.id_plot.sort(function (a, b) {  return a - b;  }),
					"info":this.state.ch,
					"metrics":this.state.metric_names_chosen,
					"ex_factors":this.state.external_factor_names_chosen,
					"supplements":this.state.supplements_names_chosen
				}
		    axios.post("/api/experiment/generatePdf/",data,{ headers:headers, withCredentials:true,responseType:"blob"}).then((response)=>{
				download(response.data,`Eksperyment${data.idExp}.pdf`)
        }).catch(function (error) {
				if (error.response) {alert("Nie można wygenerować pliku Pdf")}
		});
		alert("Generowanie pliku PDF")
	 }

    render = ()=>{
        return <div>
			<FormControl>
				<FormGroup>
					<FormLabel>Informacje</FormLabel>
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(0)}}/>} label="Opis" /> 
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(1)}}/>} label="Receptura" />
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(2)}}/>} label="Cechy" />
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(3)}}/>} label="Linki" />
				</FormGroup>
			</FormControl>
			<FormControl>
				<FormLabel>Tabele</FormLabel>
				<FormGroup>
					{this.getDataCheckboxesUsingMap()}
				</FormGroup>
            </FormControl>
			<FormControl>
				<FormGroup>
					<FormLabel>Wykresy: rodzaj</FormLabel>
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(4)}}/>} label="W. Radarowy       " /> 
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(5)}}/>} label="W. Słupkowy       " />
					<FormControlLabel control={<Checkbox onChange={e =>{this.handleChangePlotCh(6)}}/>} label="W. Liniowy        " />
				</FormGroup>
			</FormControl>
			<FormControl>
				<FormLabel >Wykresy: czynniki</FormLabel>
				<FormGroup>
					{this.getPlotFactorsCheckboxesUsingMap()}
				</FormGroup>
			</FormControl>
			<FormControl>
				<FormLabel >Wykresy: dodatki</FormLabel>
				<FormGroup>
					{this.getPlotSupplementsCheckboxesUsingMap()}
				</FormGroup>
			</FormControl>
			<FormControl>
				<FormLabel >Wykresy: cechy</FormLabel>
				<FormGroup>
					{this.getPlotMetricsCheckboxesUsingMap()}
				</FormGroup>
			</FormControl>
            <Button variant="contained" className="line" type="button" onClick={this.generate_pdf}>Generuj Plik Pdf</Button>
        </div>
    }
}

export default GeneratePdf