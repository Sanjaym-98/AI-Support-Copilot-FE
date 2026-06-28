import io from 'socket.io-client'

export const createSocketConnection= ()=>{
    try{
        if (location.hostname === "localhost") {
            return io('http://localhost:3001/')
        }else {
            return io('/',{path:"api/socket.io"})
        }
    }catch(err){
        console.log("err",err)
        return err.message
    }
}