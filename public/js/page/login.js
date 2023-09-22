export default ()=>{

    const User = [
        { id      : '1695101156748', name    : 'victor', code : '0119' },
        { id      : '1695101337892', name    : 'nickol', code : '0715' }
    ]

    if(localStorage.getItem('user')){
        location.hash = '/'
    } else {
        const code = prompt('ingrese el codigo')
        const validar = User.find(user => user.code == code)
        if(validar){
            localStorage.setItem('user', JSON.stringify(validar))
            location.hash = '/'
        }
    }
     
}