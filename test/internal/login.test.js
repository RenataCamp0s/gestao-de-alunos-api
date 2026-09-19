import request from 'supertest';
import app from '../../src/app.js'; // Adjust the path to your Express app
import { expect } from 'chai';
import * as sinon from 'sinon';
import authService from '../../src/services/auth.service.js';

describe('POST /login usando mocks e app', () => {
    it('Deve retornar 500 quando houver um erro interno do servidor', async () => {
        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('Erro catastrófico no servidor.')); // Simulate an internal server error
        
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'admin123' });
        
        expect(response.status).to.equal(500);
        expect(response.body.error).to.equal('Erro interno do servidor.');

        sinon.restore(); // Restore the original method after the test
    });
    it('Deve retornar 200 e um token para credenciais válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'admin123' });
        
        expect(response.status).to.equal(200);
    });
    it('Deve retornar 400 para campos ausentes', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': '' });
        
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });
    it('Deve retornar 401 para credenciais inválidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'wrongpassword' });
        
        expect(response.status).to.equal(401);
    });
});