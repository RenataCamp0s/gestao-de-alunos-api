import request from 'supertest';
import app from '../../src/app.js'; // Adjust the path to your Express app
import { expect } from 'chai';
import * as sinon from 'sinon';
import authService from '../../src/services/auth.service.js';

describe('POST /login', () => {
    it('should return 500 when have an internal server error', async () => {
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
    it('should return 200 and a token for valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'admin123' });
        
        expect(response.status).to.equal(200);
    });
    it('should return 400 for missing password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': '' });
        
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });
    it('should return 401 for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'wrongpassword' });
        
        expect(response.status).to.equal(401);
    });
});