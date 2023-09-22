import { onGetStreamChat, addStreamChat, updateStreamcChat } from "../firebase/config.js"

export default ()=>{

    const params = location.hash.split('/').splice(1)
    const user   = JSON.parse(localStorage.getItem('user'))
    
    const ElementComponent = createHTML(`
        <div class="div_3gfqE">
            <div class="div_ejM2b">
                <div class="div_o4ubh scroll-y">
                    <div class="div_1d4o4"><img src="./public/img/icons/text-message.png" alt=""></div>
                    <div class="div_3opy8"></div>
                </div>
                <form class="form_68Klg" autocomplete="off">
                    <button class="button_E8Vr8"><i class="fa-solid fa-xmark"></i></button>
                    <label class="label_Fkf9B">
                        <textarea class="txt_W17W2" name="txt_message" placeholder="text..."></textarea>
                    </label>
                    <button class="button_E8Vr8"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
            </div>
            <div data-css="contenedor_chat_fullscreen">
                <div class="background" data-css="elemento_chat"></div>  
            </div>
        </div>
    `)
    
    const root = document.getElementById('root')
    const contenedor_chat = ElementComponent.querySelector('.div_ejM2b')
    const contenido_chat = ElementComponent.querySelector('.div_3opy8')

    const form_chat = ElementComponent.querySelector('.form_68Klg') 
    const btn_cancelar_edicion = form_chat.children[0]

    const style = new createCSS(ElementComponent)
    
    const contenedor_chat_fullscreen = style.element('contenedor_chat_fullscreen').css(`
        & {
            position    : fixed;
            inset       : 0;
            background  : rgb(0 0 0 / .1);
            display     : flex;  
            padding     : 15px;
        }
    `)

    const elemento_chat = style.element('elemento_chat').css(`
        & {
            margin  : auto;
            width   : min(100%, 400px);
            height  : min(100%, 400px);
            overflow : hidden;
            border-radius:8px; 
        }
    `)

    clickElement(contenedor_chat_fullscreen.element, ()=> contenedor_chat_fullscreen.element.remove())
     
    addRemoveEventListenerHashchange(document, 'fullscreenchange', ()=> {
        if(document.fullscreenElement){ 
            elemento_chat.element.append(contenedor_chat) 
        } else {
            contenedor_chat_fullscreen.element.remove()
            ElementComponent.append(contenedor_chat)
        } 
    }) 

    addEventListener('open_message', ()=> {
        if(document.fullscreenElement)
            document.fullscreenElement.append(contenedor_chat_fullscreen.element)
    });

    //eventos al dar click al mensaje
    contenido_chat.addEventListener('click', e => {

        const item  = e.target.closest('.div_T5m0f')
        const button = e.target.closest('button')

        if(button && item){
            const data = JSON.parse(item.dataset.data)
            const action = button.dataset.action

            if(action == 'delete'){
                item.remove()
                updateStreamcChat(data.id, {
                    datetime_update : Date.now().toString(),
                    status : 3
                })
            } else if(action == 'update'){
                form_chat.txt_message.value = data.message
                form_chat.classList.add('edit')
                form_chat.setAttribute('data-id-message', data.id)
                item.classList.remove('active')
            }
        } else if(item){
            if(item.classList.contains('user')){
                const select = contenido_chat.querySelector('.div_T5m0f.user.active')
                if(select) select.classList.toggle('active')
                if(select != item) item.classList.toggle('active')
            }
                
        }
    })

    //eventos de formulario
    form_chat.addEventListener('submit', e => {
        e.preventDefault()
        
        const data = {
            id_user : user.id,
            id_stream : params[1],
            message : form_chat.txt_message.value.trim(),
            datetime_add : Date.now().toString(),
            datetime_update : Date.now().toString(),
        }

        if(data.message == '') return

        if(form_chat.classList.contains('edit')){
            data.status = 2
            updateStreamcChat(e.target.dataset.idMessage, data)
            form_chat.classList.remove('edit')
            form_chat.removeAttribute('data-id-message')
        } else { 
            data.status = 1
            addStreamChat(data) 
        }
        
        form_chat.txt_message.value = ''
        form_chat.txt_message.style.height = '20px'
    })

    form_chat.txt_message.addEventListener('input', e => {
        const target = e.target
        target.style.height = '20px'
        const height = target.scrollHeight
        target.style.height = height + 'px'
    })

    //cancelar edicion
    btn_cancelar_edicion.addEventListener('click', ()=> {
        form_chat.txt_message.value = ''
        form_chat.txt_message.style.height = '20px'
        form_chat.classList.remove('edit')
        form_chat.removeAttribute('data-id-message')
    })

    const def_createHTML =(data, doc)=>{
        const data_data = {
            id              : doc.id,
            datetime_update : data.datetime_update ?? 0,
            message         : data.message
        }

        const user_class = data.id_user == user.id ? 'user' : ''

        const element = createHTML(`
            <div class="div_T5m0f ${ user_class }" id="div-${ doc.id }">
                ${ user_class ? `
                    <div class="div_fR7XE">
                        <button class="button_1I12J" data-action="delete"><i class="fa-solid fa-ban"></i></button>
                        <button class="button_1I12J" data-action="update"><i class="fa-solid fa-pen"></i></button>
                    </div>
                ` : ''}
                <div class="div_5f0m7"></div>
            </div>
        `)

        element.setAttribute('data-data', JSON.stringify(data_data))
        element.querySelector('.div_5f0m7').textContent = data.message

        return element
    }
    
    let render_fisrt_time = true

    const renderHTML =(onSnapshot)=>{
        let index = 0
        onSnapshot.forEach(doc => {
            const data = doc.data()
            const element = contenido_chat.querySelector(`#div-${ doc.id }`)

            if(index++ == 0){
                if(Date.now() < (parseInt(data.datetime_add) + 7000)){ 
                    if(data.id_user != user.id){ 
                        dispatchEvent(new CustomEvent('send_notification_message'))
                    }
                }
            }

            if(element){
                const data_data = JSON.parse(element.dataset.data)
                if(data.status == 3) return element.remove()
                if(parseInt(data.datetime_update) > parseInt(data_data.datetime_update)){
                    return element.replaceWith(def_createHTML(data, doc));
                }
            } else {
                if(data.status == 3) return
                if(render_fisrt_time) contenido_chat.prepend(def_createHTML(data, doc))
                else contenido_chat.append(def_createHTML(data, doc))
            }
        })

        render_fisrt_time = false
    }

    const unsubscribe = onGetStreamChat(renderHTML)
    addRemoveEventListener(window, 'hashchange', unsubscribe)

    contenedor_chat_fullscreen.element.remove()
    return ElementComponent
}