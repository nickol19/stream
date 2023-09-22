import { onGetStreamEmoji, addStreamEmoji } from "../firebase/config.js";

export default ()=>{
    
    const params = location.hash.split('/').splice(1)
    const user   = JSON.parse(localStorage.getItem('user'))

    const Emoji = ["🤣", "🤤","😍","🤫","🤐","😈","👀","😱","😝","😳","😅","🤯","🤤","😶‍🌫","❤️","💔","😵‍💫","😢","🙂","🫣","😭","😡","🤬","😰","😤","🔥","🐾","🐕‍🦺","🐈", "🐣"];

    const ElementComponent = createHTML(`
        <div class="div_WiZV0 scroll-y active">
            <div class="div_Gtfrb background">
                <div class="div_pc6Xr scroll-y">
                    <div class="div_88A39">${ ArrayToString(Emoji, emoji => `<span>${ emoji.trim() }</span>`) }</div>
                </div>
            </div>
        </div>
    `)

    const ElementComponent2 = createHTML(`<div class="div_82gU7"></div>`)

    const root = document.getElementById('root')

    let doEmoji = true

    const fisrt_time = {
        render : true
    }

    clickElement(ElementComponent, ()=> ElementComponent.remove())
    clickElementclosest(ElementComponent, 'span', (target) => {
        if(!doEmoji) return
        doEmoji = false

        if(document.fullscreenElement) document.fullscreenElement.append(ElementComponent2)
        else root.append(ElementComponent2)
        
        ElementComponent.remove()
        ElementComponent2.innerHTML = target.outerHTML

        ElementComponent.style.opacity = '.5' 

        addStreamEmoji({
            id_stream   : params[0],
            id_user     : user.id,
            datetime_add : Date.now().toString(),
            emoji       : target.innerHTML
        })

        setTimeout(()=> {
            ElementComponent.style.opacity = '1'
            ElementComponent2.remove() 
            doEmoji = true
        }, 2000)
    })

    const renderHTML =(onSnapshot)=>{
        onSnapshot.forEach(doc => {
            const data = doc.data()

            if(fisrt_time.render) return
            if(data.id_user == user.id) return

            if(Date.now() < (parseInt(data.datetime_add) + 7000)){
                if(document.fullscreenElement) document.fullscreenElement.append(ElementComponent2)
                else root.append(ElementComponent2)

                ElementComponent2.innerHTML = `<span>${ data.emoji }</span>`
                setTimeout(()=> ElementComponent2.remove() , 2000)
            }
        });

        fisrt_time.render = false
    }

    const unsubscribe = onGetStreamEmoji(renderHTML, params[0])
    addRemoveEventListener(window, 'hashchange', unsubscribe) 

    return ElementComponent
}