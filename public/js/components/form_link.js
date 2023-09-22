export default ()=>{
    const ElementComponent = createHTML(`
        <div class="div_PGtVi" id="contenedor_form_link">
            <form class="form_slr4j background" id="form_link" autocomplete="off">
                <input type="text" name="link" class="input_V94sL" placeholder="link">
                <button class="button_0JQ7M"><i class="fa-solid fa-play"></i></button>
            </form>
        </div>
    `)

    const form_link  = ElementComponent.querySelector('.form_slr4j')
     
    clickElement(ElementComponent, ()=> ElementComponent.remove())

    form_link.addEventListener('submit', e => {
        e.preventDefault()
        ElementComponent.remove()

        dispatchEvent(new CustomEvent('open_link', {
            detail: { link : form_link.link.value },
        }))

        form_link.link.value = ''
    })

    return ElementComponent
}

