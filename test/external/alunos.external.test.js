import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';

describe('Login usando helpers', () => {

    let token;
    let studentId;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
        studentId = undefined;
    });

    afterEach(async () => {
        if (studentId) {
            const removeStudentResponse = await request('http://localhost:3000')
                .delete(`/api/admin/alunos/${studentId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(removeStudentResponse.status).to.equal(204);
        }
    });

    it('Deve cadastrar um aluno quando fornecidos dados válidos', async () => {
        const registerStudentResponse = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Maria de Souza',
                email: 'maria.souza@example.com',
                matricula: '2026-0002',
                senha: '123456'
            });

        studentId = registerStudentResponse.body.id;

        expect(registerStudentResponse.status).to.equal(201);
        expect(registerStudentResponse.body).to.have.property('id');
        expect(registerStudentResponse.body.nome).to.equal('Maria de Souza');
        expect(registerStudentResponse.body.email).to.equal('maria.souza@example.com');
        expect(registerStudentResponse.body.matricula).to.equal('2026-0002');

        });
    it('Deve negar o cadastro de um aluno quando ele já existir', async () => {

        //Cadastrar um aluno com a mesma matrícula ou e-mail
        const registerStudentResponse = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Ana Souza',
                email: 'ana.souza@example.com',
                matricula: '2024001',
                senha: '123456'
            });

        studentId = registerStudentResponse.body.id;

        //Validar que o aluno não foi cadastrado com sucesso
        expect(registerStudentResponse.status).to.equal(409);
        expect(registerStudentResponse.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');

        });
});
