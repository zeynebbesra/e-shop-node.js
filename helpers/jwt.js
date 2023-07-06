//express jwt which is used normally to secure the apis in our server 
const  {expressjwt: jwt} = require('express-jwt')

function authJwt(){
    const secret = process.env.secret
    const api = process.env.API_URL
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
        
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })

}

// req: request is when i want to use the request parameters or the request body i want to know something what is sending the user.
// payload: payload contains the data which are inside the token for example i want to get isAdmin from the token which is signed to the user and this user is sending it to me with the request headers 

async function isRevoked(req, payload) {
    console.log("payload", payload)
    if(payload.isAdmin==false){
        console.log('Not admin')
        return true
    } else {
        console.log('Admin')
        return false
    }
}



module.exports = authJwt


