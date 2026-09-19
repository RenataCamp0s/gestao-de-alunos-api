import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { comTokenDeUsuario } from '../helpers/auth.js';
import testesDeTrabalhos from '../fixtures/trabalhos.json' with { type: 'json'};


describe('Teste de Entrega de Trabalho do Aluno: Trabalho Final da Disciplina', () => {
    const removeExistingStudent = async (dadosAluno) => {
        const tokenAdmin = await comTokenDeAdmin();

        const listStudentsResponse = await api()
            .get('/api/admin/alunos')
            .set('Authorization', tokenAdmin);

        const alunoExistente = listStudentsResponse.body.find((aluno) =>
            aluno.email === dadosAluno.email || aluno.matricula === dadosAluno.matricula
        );

        if (alunoExistente) {
            await api()
                .delete(`/api/admin/alunos/${alunoExistente.id}`)
                .set('Authorization', tokenAdmin);
        }
    };

    testesDeTrabalhos.forEach(testeDeTrabalho => {
        beforeEach(async () => {
            await removeExistingStudent(testeDeTrabalho.dadosAluno);
        });

        it(testeDeTrabalho.testTitle, async () => {

            //Cadastrar um aluno
            const registerStudentResponse = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(testeDeTrabalho.dadosAluno)

            //Matricular o aluno na disciplina
            const enrollStudentResponse = await api()
                .post(`/api/admin/disciplinas/${testeDeTrabalho.dadosTrabalho.disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send({
                    alunoId: registerStudentResponse.body.id,
                })

            //Login do aluno para obter o token de autenticação
            const tokenStudent = await comTokenDeUsuario(testeDeTrabalho.dadosAluno.email, testeDeTrabalho.dadosAluno.senha);

            //Entregar o trabalho do aluno
            const deliverWorkResponse = await api()
                .post(`/api/alunos/${registerStudentResponse.body.id}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenStudent)
                .send(testeDeTrabalho.dadosTrabalho)

            //Validar que a entrega do trabalho foi realizada com sucesso
            expect(deliverWorkResponse.status).to.equal(testeDeTrabalho.statusCodeEsperado);

        });
    });
});