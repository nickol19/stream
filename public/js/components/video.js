import { onGetStreamID, updateStream } from "../firebase/config.js"
import emoji from "./emoji.js"

export default ()=>{

    const params = location.hash.split('/').splice(1)
    const user   = JSON.parse(localStorage.getItem('user'))
 
    let data_update = {
        play : 'false',
        time_progress   : '0',
        datetime_update : Date.now(),
        data_update : Date.now()
    }

    const fisrt_time = {
        render : true,
        seeker : true
    }

    const data_local = {
        datetime_update : 0,
        data_db_update : false
    }

    const ElementComponent = createHTML(`
        <div class="div_v05FO">
            <div class="div_al065">
                <div class="div_Gj3xZ">
                    <video class="video_01Mr1" name="media">
                        <source type="video/mp4">
                    </video>
                </div>
                <div class="div_Mbdqf">
                    <div class="div_6u0fO">
                        <div class="div_BXzT1">
                            <button class="button_hdZNr" data-action="open_emoji"><i class="fa-solid fa-face-smile"></i></button>
                            <button class="button_hdZNr" data-action="open_chat_space" style="display:none"><i class="fa-solid fa-comment"></i></button>
                        </div>  
                    </div>
                    <div class="div_7JM92"></div>
                    <div class="div_XjdZ8">
                        <div class="div_HGz61">
                            <button class="button_KXchF" data-action="play_pause"><i class="fa-solid fa-play"></i></button>
                            <button class="button_KXchF" data-action="seeked_back_10"><i class="fa-solid fa-clock-rotate-left"></i></button>
                        </div>
                        <div class="div_Ve01l">
                            <div class="div_38qNj">
                                <hr class="hr_A6t1K">
                            </div>
                            <input type="range" class="input_908X1" value="0" min="0" max="100">
                        </div>
                        <div class="div_HGz61">
                            <button class="button_KXchF" data-action="fullscreen"><i class="fa-solid fa-expand"></i></button>
                        </div>
                    </div>
                </div>
                <div data-css="element_mensaje_notificacion">
                    <button class="button_hdZNr" data-action="open_chat"><i class="fa-solid fa-comment"></i></button>
                </div>
                <div class="div_82gU7" id="contenedor_emoji_mostrar"></div>
                <div class="div_F6FFR" id="contenedor_chat_2">
                    <div class="div_3b7ZM background"></div>
                </div>
            </div>
            <div data-css="contenedor_video_fullscreen"></div>
        </div>
    `)

    const style = new createCSS(ElementComponent)

    const contenedor_video_fullscreen = style.element('contenedor_video_fullscreen').css(`
        & {
            position    : fixed;
            inset       : 0; 
            display     : flex;
        }

        & .div_al065{
            padding : 0
        }
    `)

    const element_mensaje_notificacion = style.element('element_mensaje_notificacion').css(`
        & {
            position : absolute; 
            right   : 5px; 
            top     : 5px; 
            height  : 50px;  
            width   : 50px;  
            display : none;
        } 

        &:has(.notification) {  
            display : initial;
        }
    `)
 
    const root = document.getElementById('root')
    const contenedor_emoji  = emoji()
    const contenedor_botones = ElementComponent.querySelector('.div_Mbdqf')
    const contenido_video = ElementComponent.querySelector('.video_01Mr1')

    const btn_fullscreen = ElementComponent.querySelector('button[ data-action = fullscreen]')
    const open_emoji = ElementComponent.querySelector('button[ data-action = open_emoji ]')
    const open_chat = ElementComponent.querySelector('button[ data-action = open_chat ]')
    const open_chat_space = ElementComponent.querySelector('button[ data-action = open_chat_space ]')

    const play_pause = ElementComponent.querySelector('button[ data-action = play_pause ]')
    const seeked_back_10 = ElementComponent.querySelector('button[ data-action = seeked_back_10 ]')

    const ipt_duration = ElementComponent.querySelector('.input_908X1')
    const hr_progreso = ElementComponent.querySelector('.hr_A6t1K')
    
    const event_open_message = new CustomEvent('open_message')

    ElementComponent.querySelector('.div_Gj3xZ').addEventListener("click", ()=> {
        contenedor_botones.classList.add('active')
        if(document.fullscreenElement)
            element_mensaje_notificacion.element.style.display = 'initial'
    })

    clickElement(contenedor_botones, ()=> {
        contenedor_botones.classList.remove('active')
        element_mensaje_notificacion.element.style.display = 'none'
    })

    play_pause.addEventListener("click", ()=> {
        if(contenido_video.paused) contenido_video.play()
        else contenido_video.pause()

        const progress = contenido_video.currentTime.toFixed(0)
        
        updateStream(params[1], {
            play : !contenido_video.paused,
            id_user : user.id,
            datetime_update : Date.now().toString(),
            time_progress   : progress,
            change : 'play'
        })

        play_pause.style.pointerEvents = 'none'
        setTimeout(()=> play_pause.style.pointerEvents = 'initial', 1500)
    })

    seeked_back_10.addEventListener("click", ()=> {
        contenido_video.currentTime = contenido_video.currentTime.toFixed(0) - 10  
        
        const progress = contenido_video.currentTime.toFixed(0)

        updateStream(params[1], {
            id_user : user.id,
            datetime_update : Date.now().toString(),
            time_progress   : progress,
            change : 'seeked'
        })

        seeked_back_10.style.pointerEvents = 'none'
        setTimeout(()=> seeked_back_10.style.pointerEvents = 'initial', 1500)
    })

    open_emoji.addEventListener("click", ()=> {
        if(document.fullscreenElement) document.fullscreenElement.append(contenedor_emoji)
        else root.append(contenedor_emoji)
    })

    open_chat.addEventListener("click", ()=> {
        open_chat.classList.remove('notification')
        dispatchEvent(event_open_message)
    })

    const contenedor_video = ElementComponent.querySelector('.div_al065') 

    const def_fullscreen =(status)=>{
        if(document.fullscreenElement){
            if(status) return document.exitFullscreen();
            contenedor_video_fullscreen.element.append(contenedor_video)
            btn_fullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>'
            open_chat_space.style.display = 'initial'
            open_chat_space.style.visibility = 'hidden'
            element_mensaje_notificacion.element.style.display = 'initial' 
        } else {
            if(status) {
                root.append(contenedor_video_fullscreen.element) 
                return contenedor_video_fullscreen.element.requestFullscreen();
            }
            contenedor_video_fullscreen.element.remove()
            ElementComponent.append(contenedor_video)
            btn_fullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>'
            open_chat_space.style.display = 'none'
            element_mensaje_notificacion.element.style.display = 'none'
        }
    }

    btn_fullscreen.addEventListener('click', ()=> {
        def_fullscreen(true)
    })

    addRemoveEventListenerHashchange(document, 'fullscreenchange', ()=> def_fullscreen(false))
    /* eventos del input */

    let change_input = false
    ipt_duration.addEventListener('input', () => {
        change_input = true
        hr_progreso.style.width = ((parseInt(ipt_duration.value) / parseInt(ipt_duration.max)) * 100).toFixed(0) + '%'
    })

    ipt_duration.addEventListener('change', () => {
        change_input = false
        contenido_video.currentTime = parseInt(ipt_duration.value) 
        const progress = contenido_video.currentTime.toFixed(0)

        updateStream(params[1], {
            id_user : user.id,
            datetime_update : Date.now().toString(),
            time_progress   : progress,
            change : 'seeked'
        }) 
    })

    /* eventos del contenido */
    contenido_video.addEventListener("play", ()=> play_pause.innerHTML = '<i class="fa-solid fa-pause"></i>');
    contenido_video.addEventListener("pause", ()=> play_pause.innerHTML = '<i class="fa-solid fa-play"></i>');
    contenido_video.addEventListener("loadedmetadata", ()=> {
        ipt_duration.setAttribute('max', contenido_video.duration.toFixed(0))
        const segundos_diferencia = Math.round((Date.now() - data_update.data_update) / 1000) 
        contenido_video.currentTime = parseInt(data_update.time_progress) + segundos_diferencia
    })

    contenido_video.addEventListener("timeupdate", ()=> {
        if(change_input) return 
        ipt_duration.value = contenido_video.currentTime.toFixed(0)
        hr_progreso.style.width = ((parseInt(ipt_duration.value) / parseInt(ipt_duration.max)) * 100).toFixed(0) + '%'
    });

    contenido_video.addEventListener("seeked", ()=> {
        if(fisrt_time.seeker) fisrt_time.seeker = false
        else if(data_update.id_user == user.id) return 

        if(data_local.data_db_update){
            const segundos_diferencia = Math.round((Date.now() - data_update.data_update) / 1000)
            contenido_video.currentTime = parseInt(data_update.time_progress) + segundos_diferencia
            data_local.data_db_update = false
        } else {
            if(JSON.parse(localStorage.getItem('click'))){
                if(JSON.parse(data_update.play)) contenido_video.play()
                else contenido_video.pause()
            }
        }
    })

    //eventos de windows

    addRemoveEventListenerHashchange(window, 'open_link', e => {
        contenido_video.setAttribute('src', e.detail.link)
        contenido_video.setAttribute('autoplay', '')
        contenido_video.currentTime = 0

        updateStream(params[1], {
            link : e.detail.link,
            datetime_update : Date.now().toString(),
            play : 'true',
            change : 'link',
            id_user : user.id,
            time_progress   : '0',
        })
    })

    addRemoveEventListenerHashchange(window, 'send_notification_message', ()=> {
        if(document.fullscreenElement){
            element_mensaje_notificacion.element.style.display = 'initial'
            element_mensaje_notificacion.element.children[0].classList.add('notification')
        }
    })

    const renderVideo =(querySnapshot)=>{
        querySnapshot.forEach(doc => {
            const data = data_update = doc.data()
            data_update.data_update  = Date.now()

            if(fisrt_time.render){
                contenido_video.setAttribute('src', data.link)
                return
            }
            
            if(data.id_user == user.id) return

            if(parseInt(data.datetime_update) > data_local.datetime_update){
                data_local.datetime_update = parseInt(data.datetime_update)

                if(data.change == 'play'){
                    if(JSON.parse(localStorage.getItem('click'))){
                        if(JSON.parse(data_update.play)) contenido_video.play()
                        else contenido_video.pause()
                    }
                } else if(data.change == 'seeked'){
                    data_local.data_db_update = true
                    contenido_video.currentTime = parseInt(data.time_progress) 
                } else if(data.change == 'link'){
                    console.log('se cambio de link');
                    data_local.data_db_update = true
                    contenido_video.currentTime = 0
                    contenido_video.setAttribute('src', data.link)
                }
            }
        });

        fisrt_time.render = false
    }

    const validate_click = JSON.parse(localStorage.getItem('click'))

    if(validate_click){
        const unsubscribe = onGetStreamID(renderVideo, params[1])
        addRemoveEventListener(window, 'hashchange', unsubscribe)
    }

    addRemoveEventListener(window, 'click', ()=> {
        const unsubscribe = onGetStreamID(renderVideo, params[1])
        addRemoveEventListener(window, 'hashchange', unsubscribe)
    }) 
 
    contenedor_video_fullscreen.element.remove()
    return ElementComponent
}
 