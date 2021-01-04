
class SourceOfTruth{
    constructor(props){
        //super(props)
    }
    static handlers = new Set()
    static register = (han)=>{
       this.handlers.add(han)
    }
    static unregister = (han)=>{
        this.handlers.delete(han)
    }
    static baseTables = {
        experiments:[]

    }
}
export default SourceOfTruth;