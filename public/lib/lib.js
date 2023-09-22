//Generar numero Aleatorio
const rand = (min, max = false) => {
    if(!parseInt(max)){
        max = min
        min = 0
    } 

    return Math.floor(Math.random() * ((max + 1) - min) + min);
}

//ejecutar funciones
const doFunction =(...callbacks)=>{
    return callbacks.map(callback => typeof callback === 'function' ? callback() : '')
}

//ejecutar cuando se realizar click en el mismo elemento target y currentTarget
const clickElement =(element, callback)=>{
    if(typeof callback === 'function'){
        element.addEventListener('click', (e)=> e.target === e.currentTarget && callback(e))
    }
}


const clickElementclosest =(element, queryElement, callback)=>{
    if(typeof callback === 'function'){ 
        element.addEventListener('click', (e)=> {
            const target = e.target.closest(queryElement)
            if(target) callback(target, e) 
        })
    }
}

//agregar y quitar el evento una vez se escuche
const addRemoveEventListener =(element, event, callback)=>{
    const def_callback =()=>{
        if(typeof callback === 'function') callback()
        element.removeEventListener(event, def_callback)
    }

    element.addEventListener(event, def_callback)
}
 
//convertir Array a String
const ArrayToString =(array, callback)=>{
    if(Array.isArray(array)){
        return array.map((...data) => {
            if(typeof callback === 'function') {
                const out = callback(...data)
                return ['string', 'number'].includes(typeof out) ? out : ''
            }
            return ''
        }).join('')
    }
    return '' 
}

//cuando el hash cambie eliminar el evento
const addRemoveEventListenerHashchange =(element, type, callback)=>{
    if(typeof callback === 'function') {
        element.addEventListener(type, callback)
        addRemoveEventListener(window, 'hashchange', ()=> element.removeEventListener(type, callback))
    }
}

//generar
const genereteKey =(include = {})=>{
    const permission = {
        upper   : include.upper ?? true,
        lower   : include.lower ?? true,
        number  : include.number ?? true,
        simbol  : include.simbol ?? false,
        length  : include.length ?? 10,
    }

    const contentKey = {}
    contentKey.upper    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    contentKey.lower    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLocaleLowerCase()
    contentKey.number   = '1234567890'
    contentKey.simbol   = '[{!¿$@#=~?¡}]'

    const contentUse = []
    if(permission.upper) contentUse.push(contentKey.upper)
    if(permission.lower) contentUse.push(contentKey.lower)
    if(permission.number) contentUse.push(contentKey.number)
    if(permission.simbol) contentUse.push(contentKey.simbol)

    return ArrayToString([...Array(permission.length)], key => {
        const firstOption   = contentUse[rand(contentUse.length - 1)]
        const secondOption  = firstOption[rand(firstOption.length - 1)]
        return secondOption
    })
}

//parecido al trim de php
const sTrim =(text = '', symbol = '')=>{
    if(symbol != ''){
        text = text.startsWith(symbol) ? text.slice(1) : text
        text = text.endsWith(symbol) ? text.slice(0, -1) : text
    }
    return text
}
 
//obtener cadena de texto entre dos signos, primero y ultimo
const getTextString =(open = '', text, close = '')=>{
    let indexOpen     = text.indexOf(open)
    let indexClose    = text.lastIndexOf(close)
 
    indexOpen   = open != '' || indexOpen == -1 ? ++indexOpen : 0
    indexClose  = close != '' || indexClose !== -1 ? indexClose : text.length

    return (indexOpen > indexClose) ? '' : text.slice(indexOpen, indexClose).trim();
}
 
//Crear HTML
const createHTML =(...params)=>{

    const Element = {
        parent  : {},
        html    : params[0]
    }

    if(params.length == 2){
        Element.parent  = params[0]
        Element.html    = params[1]
    }
    
    let element = document.createElement('div')
    element.innerHTML = Element.html
    element = element.children[0]

    if(Element.parent.element) Element.parent = Element.parent.element
    if(Element.parent.classID) Element.parent = document.querySelector(Element.parent.classID)
    if(Element.parent instanceof HTMLElement) Element.parent.append(element)

    return element
}

//crear CSS
class createCSS {
    constructor(element){
        this.rootElement  = element
        this.childElement = null
        this.styleElement = document.createElement('style')

        this.className  = ''
        this.classNameRoot = ''
        this.attributeName = 'data-css' 

        this._thiself = true

        if(this.rootElement instanceof HTMLElement) {
            this.rootElement.prepend(this.styleElement)
            this.classNameRoot = (this.rootElement.tagName).toLowerCase() + '-' + genereteKey({ length : 20 })
            this.rootElement.classList.add(this.classNameRoot)
        }
    }

    thiself(){
        this._thiself = true
        return this
    }

    element(element){
        this._thiself = false
        const code = genereteKey({ length : 15 })
 
        const dataCSS = element.split(',').map(element => {
            return `[${ this.attributeName } = ${ element }]`
        }).join(', ')

        this.childElement = this.rootElement.querySelectorAll(dataCSS)
        this.childElement.forEach(element => {
            this.className = (element.tagName).toLowerCase() + '-' + code
            element.classList.add(this.className)
            element.removeAttribute(this.attributeName)
            //element.setAttribute(this.attributeName, this.className)
        })

        return this
    }
    css(css){
        const one   = /&/g
        const two   = /\s+/g 
        const three = /[\;/\s]+?\;/g
        const four  = /[\;/\s]+?\}/g
        const five  = /\}/g
        const six   = /\)[/\s+]?\{/g 

        css = css.replace(one   , '.' + (this._thiself ? this.classNameRoot : this.className))
        css = css.replace(two   , ' ') 
        css = css.replace(three , ';'); 
        css = css.replace(four  , ' }'); 
        css = css.replace(five  , '}\n')
        css = css.replace(six   , ') {\n');

        css = css.split('\n').map(css => css.trim()).join('\n')
        this.styleElement.innerHTML += css

        if(this._thiself) return this.rootElement

        const res = []

        this.childElement.forEach(child => {
            res.push({
                element : child,
                class   : this.className
            })
            
        });
 
        return res.length == 1 ? res[0] : res
    }
}

//Crear Alert modal
class AlertModal {
    constructor(element, limit = 3){
        this.ElementParent = element
        this.ElementTemp = document.createDocumentFragment()
        this.Element = createHTML(`<div class="div_AKMyj"></div>`)
        this.limit = limit
    }

    add(data = {}){ 

        if(this.ElementParent instanceof HTMLElement) this.ElementParent.append(this.Element)
        else this.ElementTemp.append(this.Element)

        const element = createHTML(`
            <div style="background:${ data.color ?? 'pink' }" class="div_FFZQY">
                <p>${ data.message ?? '' }</p>
                <button><i class="fa-solid fa-xmark"></i></button>
            </div>
        `)

        const removeItem =()=>{
            element.remove()
            if(this.Element.children.length == 0){
                this.ElementTemp.append(this.Element)
            }
        }

        if(this.Element.children.length >= this.limit){
            this.Element.children[0].remove()
        }

        if(!data.keep){ setTimeout(removeItem, (data.time ?? 3000)) }
        element.querySelector('button').addEventListener('click', removeItem)

        this.Element.append(element)
    }

    clean(){
        this.Element.textContent = ''
    }
}

//Crear rutas por hash
class Hash {
    constructor(){
        this._params = []
        this._routes = []
        this._dispatch = true
    }

    param(route = '', callback = false){
        route = sTrim(route, '/').split('/')
        this._routes.push({route, callback})
    }

    dispatch(callback){ 
        const change =()=>{
            if (typeof callback === 'function') callback()
            this.__change()
        }

        if(this._dispatch) {
            change()
            window.addEventListener('hashchange', change)
        } 

        this._dispatch = false
    }

    __change(){
        this._params = sTrim(location.hash.slice(1), '/').split('/')
        const params = {}
        const findRoute = this._routes.find(route => { 
            if(route.route[0] == '*') return route
            if(route.route.length == this._params.length){
                for (let i = 0; i < route.route.length; i++) {
                    if(route.route[i][0] == ':') params[ route.route[i].slice(1) ] = this._params[i]
                    else if(route.route[i] !== this._params[i]) return false
                }

                return route
            }

            return false 
        })

        if(findRoute){
            if (typeof findRoute.callback === 'function') findRoute.callback(params)
        }
    }
}


//icono con https://fontawesome.com/
const Icon = icon => `<i class="fa-solid fa-${ icon }"></i>`





 