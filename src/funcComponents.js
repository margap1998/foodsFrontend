import React from 'react';
//komponent funk. przekształcający tablicę 1-D z wartościami w listę rozwijaną z elementem "pustym"
function Select(props){
    var q =[""]
    q = q.concat(props.array)//tablica z wartościami
    var op = q.map(value =>{return(<option value={value}>{value}</option>)}) // zrobienie opcji
    return(
        <select value={props.value} onChange={e => props.onChange(e.target.value) /* element typu select z listą rozwijaną*/}> 
            {op /* tablica z mapowanymymi wartościami na elementy typu option*/}
        </select>
    )
}

export {Select};