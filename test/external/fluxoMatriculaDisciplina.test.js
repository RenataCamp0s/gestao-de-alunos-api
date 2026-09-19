import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplicasFactory.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json'};

async function clearData(alunoId, disciplinaId, token) {
    if (disciplinaId) {
        await api()
            .delete(`/api/admin/disciplinas/${disciplinaId}`)
            .set('Authorization', token);
    }

    if (alunoId) {
        await api()
            .delete(`/api/admin/alunos/${alunoId}`)
            .set('Authorization', token);
    }
}

describe('Matrícula de Aluno em Disciplina', () => {
    let adminToken;
    let alunoId;
    let disciplinaId;

    beforeEach(async () => {
        adminToken = await comTokenDeAdmin();
        alunoId = undefined;
        disciplinaId = undefined;
    });

    afterEach(async () => {
        await clearData(alunoId, disciplinaId, adminToken);
    });

        it('Deve matricular um aluno em uma disciplina quando fornecidos dados válidos', async () => {
            //Cadastrar um aluno
            const registerStudentResponse = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send(novoAluno());
            alunoId = registerStudentResponse.body.id;

            //Cadastrar uma disciplina
            const registerSubjectResponse = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send(novaDisciplina());
            disciplinaId = registerSubjectResponse.body.id;

            //Matricular o aluno na disciplina
            const enrollStudentResponse = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send({ alunoId });

            //Validar que a matrícula foi realizada com sucesso
            expect(enrollStudentResponse.status).to.equal(201);
            expect(enrollStudentResponse.body).to.have.property('id');
            expect(enrollStudentResponse.body.alunoId).to.equal(alunoId);
            expect(enrollStudentResponse.body.disciplinaId).to.equal(disciplinaId);
        });
    testesDeMatriculas.forEach(testeDeMatricula => {
        it(testeDeMatricula.testTitle, async () => {
            //Cadastrar um aluno
            const registerStudentResponse = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send(testeDeMatricula.dadosAluno);
            alunoId = registerStudentResponse.body.id;

            //Cadastrar uma disciplina
            const registerSubjectResponse = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send(testeDeMatricula.dadosDisciplina);
            disciplinaId = registerSubjectResponse.body.id;

            //Matricular o aluno na disciplina
            const enrollStudentResponse = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send({ alunoId });

            //Validar que a matrícula foi realizada com sucesso
            expect(enrollStudentResponse.status).to.equal(testeDeMatricula.statusCodeEsperado);
            expect(enrollStudentResponse.body.alunoId).to.equal(alunoId);
            expect(enrollStudentResponse.body.disciplinaId).to.equal(disciplinaId);
        });
    });
});
