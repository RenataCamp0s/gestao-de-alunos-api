import request from 'supertest';
import { expect } from 'chai';

describe('POST /login com servidor em execução', () => {
    it('Deve retornar 200 e um token para credenciais válidas', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'admin123' });
        
        expect(response.status).to.equal(200);
    });
    it('Deve retornar 400 para campos ausentes', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': '' });
        
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });
    it('Deve retornar 401 para credenciais inválidas', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'wrongpassword' });
        
        expect(response.status).to.equal(401);
    });
});