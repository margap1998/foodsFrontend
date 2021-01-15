import React from 'react';
import {Select, MenuItem, ListItemText } from "@material-ui/core"
//komponent funk. przekształcający tablicę zawierającą pary (wartość, opis) na listę rozwijaną
function SelectArrayElement(props){
    var op = props.array.map(value =>{
        if (value.length === 2){
        return(<MenuItem className="line" value={value[0]}>
                <ListItemText className="line" primary={value[1]} primaryTypographyProps={{noWrap:true}}/>
                </MenuItem>)
        } // zrobienie opcji
        if (value.length === 3){
        return(<MenuItem className="line" value={value[0]}>
                <ListItemText className="line" primary={value[1]} secondary={value[2]}  primaryTypographyProps={{noWrap:true}}/>
                </MenuItem>)
        } // zrobienie opcji
    })
    return(
        /* element typu select z listą rozwijaną*/
        <Select value={props.value}  label={props.label}
        onChange={e => props.onChange(e.target.value) }
        className={props.className}> 
            {op /* tablica z mapowanymymi wartościami na elementy typu option*/}
        </Select>
    )
}


export {SelectArrayElement as Select, SelectArrayElement};