import React from 'react';
import {Select, MenuItem} from "@material-ui/core"
//komponent funk. przekształcający tablicę zawierającą pary (wartość, opis) na listę rozwijaną
function SelectArrayElement(props){
   
    var q =[["",""]]
    q = q.concat(props.array)//tablica z wartościami
    var op = q.map(value =>{
        return(<MenuItem value={value[0]}>
                {value[1]}
                </MenuItem>)}) // zrobienie opcji
    return(
        /* element typu select z listą rozwijaną*/
        <Select value={props.value}  label={props.label} labelWidth={30}
        onChange={e => props.onChange(e.target.value) }
        className={props.className}> 
            {op /* tablica z mapowanymymi wartościami na elementy typu option*/}
        </Select>
    )
}

export {SelectArrayElement as Select, SelectArrayElement};