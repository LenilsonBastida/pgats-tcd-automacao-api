describe('Tasks Controller', () => {
    const request = require('supertest');
    const sinon = require('sinon');
    const { expect } = require('chai');

    const TaskService = require('../../service/taskService');
    const app = require('../../app');

    async function registerAndLogin(username, password) {
        await request(app)
            .post('/api/users/register')
            .send({ username, password });
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({ username, password });
        return loginRes.body.token;
    }

    async function createTask(token, data) {
        return await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
    }

    describe('POST /tasks', () => {
        it('Deve retornar 400 se o service lançar erro (sinon)', async () => {
            const stub = sinon.stub(TaskService, 'createTask').throws(new Error('Erro simulado'));
            const token = await registerAndLogin('sinonuser', 'sinonpass');
            const resposta = await createTask(token, {
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
            expect(resposta.body).to.have.property('error', 'Token não informado');
        });

        it('Deve retornar 201 ao criar tarefa válida', async () => {
            const token = await registerAndLogin('testuser', 'testpass');
            const resposta = await createTask(token, {
                title: "Estudar Automação de testes na Camada de Serviço (API)",
                description: "Fazer exercícios de Mocha e Chai",
                priority: "baixa",
                dueDate: new Date().toISOString()
            });

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('title', 'Estudar Automação de testes na Camada de Serviço (API)');
            expect(resposta.body).to.have.property('description', 'Fazer exercícios de Mocha e Chai');
            expect(resposta.body).to.have.property('priority', 'baixa');
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('Deve retornar 404 se o service lançar erro (sinon)', async () => {
            const stub = sinon.stub(TaskService, 'updateTask').throws(new Error('Tarefa não encontrada'));
            const token = await registerAndLogin('sinonput', 'sinonputpass');
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
            const token = await registerAndLogin('putuser2', 'putpass2');
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
            const token = await registerAndLogin('putuser', 'putpass');
            const createRes = await createTask(token, {
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
            const token = await registerAndLogin('sinondel', 'sinondelpass');
            const deleteRes = await request(app)
                .delete(`/api/tasks/1`)
                .set('Authorization', `Bearer ${token}`);

            expect(deleteRes.status).to.equal(404);
            stub.restore();
        });

        it('Deve retornar 401 se não enviar token', async () => {
            const token = await registerAndLogin('deleteuser2', 'deletepass2');
            const createRes = await createTask(token, {
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
            const token = await registerAndLogin('deleteuser', 'deletepass');
            const createRes = await createTask(token, {
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
