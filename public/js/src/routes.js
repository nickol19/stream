import inicio from "../page/inicio.js";
import stream from "../page/stream.js";
import login from "../page/login.js";

export default ()=>{

    const main  = createHTML(`<main id="main"></main>`) 
    document.getElementById('root').append(main)

    const Routes = new Hash()

    Routes.param('/', inicio) 
    Routes.param('/login', login) 
    Routes.param('/stream/:id', stream)

    Routes.dispatch(()=> main.innerHTML = '')
}