import React from 'react';
//komponent funk. przekształcający tablicę zawierającą pary (wartość, opis) na listę rozwijaną
function Select(props){
   
    var q =[["",""]]
    q = q.concat(props.array)//tablica z wartościami
    var op = q.map(value =>{
        return(<option value={value[0]}>
                {value[1]}
                </option>)}) // zrobienie opcji
    return(
        /* element typu select z listą rozwijaną*/
        <select value={props.value} 
        onChange={e => props.onChange(e.target.value) }
        className={props.className}> 
            {op /* tablica z mapowanymymi wartościami na elementy typu option*/}
        </select>
    )
}

export {Select};