import header from "../components/header.js"
import video from "../components/video.js"
import chat from "../components/chat.js"

export default ()=>{
    const ElementComponent = createHTML(`
        <div class="div_M08rV">
            <div class="div_U09zC"></div>
        </div>
    `)

    const element_append = ElementComponent.querySelector('.div_U09zC')

    ElementComponent.prepend(header())
    element_append.append(video())
    element_append.append(chat())

    document.getElementById('main').append(ElementComponent)
}

//elementAppend('.div_3gfqE', chat)
//elementAppend(ElementComponent, '.div_3gfqE', video)