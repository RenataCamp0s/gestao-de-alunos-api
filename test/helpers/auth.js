import { api } from './api.js';
import 'dotenv/config';



export async function comTokenDeAdmin() {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                    email: process.env.ADMIN_EMAIL, 
                    senha: process.env.ADMIN_SENHA
            });

    return `Bearer ${loginResposta.body.token}`;
}

export async function comTokenDeUsuario(email, senha) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
                email: email, 
                senha: senha
        });
    
    return `Bearer ${loginResposta.body.token}`;
}

export async function getToken(emailUser, passUser) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: emailUser, 
            senha: passUser
        });

    return loginResposta.body.token;
}