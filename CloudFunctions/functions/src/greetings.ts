import * as functions from 'firebase-functions';

export const greetings = functions.https.onRequest((request, response) => {
    if(request.body !== undefined && request.body){
        const name = request.body.name
        const email = request.body.email

        console.log('Your name is '+name);
        console.log('Your email is '+email);
        
        response.send("Hello "+name+" from Firebase!");

    }
    response.send("Hello from Firebase! Do a POST Request with Name & Email");
});