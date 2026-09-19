import request from 'supertest';
import { expect } from 'chai';

describe('POST /login', () => {
    it('should return 200 and a token for valid credentials', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'admin123' });
        
        expect(response.status).to.equal(200);
    });
    it('should return 400 for missing password', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': '' });
        
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });
    it('should return 401 for invalid credentials', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                'email': 'admin@escola.com', 
                'senha': 'wrongpassword' });
        
        expect(response.status).to.equal(401);
    });
});