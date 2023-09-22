import routes from "./src/routes.js"

export default ()=>{

    localStorage.setItem('click', 'false')

    if(!localStorage.getItem('user')){
        location.hash = '/login'
    }

    routes()
    window.addEventListener('contextmenu', e => e.preventDefault())
    addRemoveEventListener(window, 'click', ()=> localStorage.setItem('click', 'true'))
} 