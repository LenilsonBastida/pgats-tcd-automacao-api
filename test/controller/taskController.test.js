const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const TaskService = require('../../service/taskService');

const app = require('../../app');

describe('Tasks Controller', () => {
    describe('POST /tasks', () => {
        it('Deve retornar 400 se o service lançar erro (sinon)', async () => {
            const stub = sinon.stub(TaskService, 'createTask').throws(new Error('Erro simulado'));

            await request(app)
                .post('/api/users/register')
                .send({ username: 'sinonuser', password: 'sinonpass' });
            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ username: 'sinonuser', password: 'sinonpass' });
            const token = loginRes.body.token;

            const resposta = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: "Teste erro service",
                    description: "Descrição",
                    priority: "baixa",
                    dueDate: new Date().toISOString()
                });
            expect(resposta.status).to.equal(400);
            stub.restore();
        });

        it('Deve retornar 401 se não enviar token', async () => {
            const resposta = await request(app)
                .post('/api/tasks')
                .send({
                    title: "Teste sem token",
                    description: "Descrição",
                    priority: "baixa",
                    dueDate: new Date().toISOString()
                });
            expect(resposta.status).to.equal(401);
        });

        it('Deve retornar 201 ao criar tarefa válida', async () => {
                await request(app)
                    .post('/api/users/register')
                    .send({ username: 'testuser', password: 'testpass' });

                const loginRes = await request(app)
                    .post('/api/users/login')
                    .send({ username: 'testuser', password: 'testpass' });
                const token = loginRes.body.token;

                const resposta = await request(app)
                    .post('/api/tasks')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        title: "Estudar Automação de testes na Camada de Serviço (API)",
                        description: "Fazer exercícios de Mocha e Chai",
                        priority: "baixa",
                        dueDate: new Date().toISOString()
                    });

                expect(resposta.status).to.equal(201);
            });
    });

    describe('PUT /api/tasks/:id', () => {
        it('Deve retornar 404 se o service lançar erro (sinon)', async () => {
            const stub = sinon.stub(TaskService, 'updateTask').throws(new Error('Tarefa não encontrada'));

            await request(app)
                .post('/api/users/register')
                .send({ username: 'sinonput', password: 'sinonputpass' });
            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ username: 'sinonput', password: 'sinonputpass' });
            const token = loginRes.body.token;

            const updateRes = await request(app)
                .put(`/api/tasks/1`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: "Teste erro service",
                    description: "Descrição",
                    priority: "baixa"
                });
            expect(updateRes.status).to.equal(404);
            stub.restore();
        });

        it('Deve retornar 404 ao tentar atualizar tarefa inexistente', async () => {
            await request(app)
                .post('/api/users/register')
                .send({ username: 'putuser2', password: 'putpass2' });

            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ username: 'putuser2', password: 'putpass2' });
                
            const token = loginRes.body.token;

            const updateRes = await request(app)
                .put(`/api/tasks/9999`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: "Tarefa não existe",
                    description: "Descrição",
                    priority: "baixa"
                });
            expect(updateRes.status).to.equal(404);
        });

        it('Deve retornar 200 ao atualizar tarefa existente', async () => {
                await request(app)
                    .post('/api/users/register')
                    .send({ username: 'putuser', password: 'putpass' });

                const loginRes = await request(app)
                    .post('/api/users/login')
                    .send({ username: 'putuser', password: 'putpass' });
                const token = loginRes.body.token;

                const createRes = await request(app)
                    .post('/api/tasks')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        title: "Tarefa original",
                        description: "Descrição original",
                        priority: "media",
                        dueDate: new Date().toISOString()
                    });
                const taskId = createRes.body.id;

                const updateRes = await request(app)
                    .put(`/api/tasks/${taskId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        title: "Tarefa atualizada",
                        description: "Descrição alterada",
                        priority: "alta"
                    });

                expect(updateRes.status).to.equal(200);
                expect(updateRes.body.title).to.equal("Tarefa atualizada");
                expect(updateRes.body.description).to.equal("Descrição alterada");
                expect(updateRes.body.priority).to.equal("alta");
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('Deve retornar 404 se o service lançar erro (sinon)', async () => {
            const stub = sinon.stub(TaskService, 'deleteTask').throws(new Error('Tarefa não encontrada'));

            await request(app)
                .post('/api/users/register')
                .send({ username: 'sinondel', password: 'sinondelpass' });

            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ username: 'sinondel', password: 'sinondelpass' });

            const token = loginRes.body.token;

            const deleteRes = await request(app)
                .delete(`/api/tasks/1`)
                .set('Authorization', `Bearer ${token}`);
            expect(deleteRes.status).to.equal(404);
            stub.restore();
        });

        it('Deve retornar 401 se não enviar token', async () => {
            await request(app)
                .post('/api/users/register')
                .send({ username: 'deleteuser2', password: 'deletepass2' });

            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ username: 'deleteuser2', password: 'deletepass2' });

            const token = loginRes.body.token;

            const createRes = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: "Tarefa para deletar sem token",
                    description: "Descrição delete",
                    priority: "baixa",
                    dueDate: new Date().toISOString()
                });

            const taskId = createRes.body.id;

            const deleteRes = await request(app)
                .delete(`/api/tasks/${taskId}`);

            expect(deleteRes.status).to.equal(401);
        });
    
        it('Deve retornar 200 ao remover tarefa existente', async () => {
            await request(app)
                .post('/api/users/register')
                .send({ username: 'deleteuser', password: 'deletepass' });

            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ username: 'deleteuser', password: 'deletepass' });

            const token = loginRes.body.token;

            const createRes = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: "Tarefa para deletar",
                    description: "Descrição delete",
                    priority: "baixa",
                    dueDate: new Date().toISOString()
                });

            const taskId = createRes.body.id;

            const deleteRes = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(deleteRes.status).to.equal(200);
            expect(deleteRes.body.id).to.equal(taskId);
        });
    });
});
