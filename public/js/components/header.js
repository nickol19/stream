import form_link from "./form_link.js"

export default ()=>{

    const stream = {
        id : '1',
        id_user : '1695101156748',
        name : 'VN'
    }

    const user = JSON.parse(localStorage.getItem('user'))

    const ElementComponent = createHTML(`
        <header class="header_zyfS8">
            <div class="div_9vVlk">
                <a href="#/" class="a_Ma0S6"><i class="fa-solid fa-caret-left"></i></a>
                <h3 class="h3_X0B6J text-ellipsis">${ stream.name + ' ♥' ?? 'hola' }</h3>
                <div class="div_6y9bH">
                    ${ user.id == stream.id_user ? '<button class="button_Ma0S6" id="btn_open_form_link"><i class="fa-solid fa-plus"></i></button>' : '' } 
                    <button class="button_Ma0S6"><i class="fa-solid fa-user-group"></i></button>
                </div>
            </div>
        </header>
    `)
    
    const root = document.getElementById('root') 
    const ElementFormLink = form_link()

    const btn_open_form_link = ElementComponent.querySelector('#btn_open_form_link')

    if(btn_open_form_link){
        btn_open_form_link.addEventListener('click', e => {
            root.append(ElementFormLink) 
        })
    }

    return ElementComponent
}