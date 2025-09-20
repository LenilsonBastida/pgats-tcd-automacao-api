const request = require('supertest');
const app = require('../../../graphql/app');
const { expect } = require('chai');

function graphqlRequest(query) {
	return request(app)
		.post('/graphql')
		.send({ query });
}

describe('Tasks Controller GraphQL', () => {
	it('Deve consultar todas as tarefas', async () => {
		const query = `{
			tasks {
				id
				title
				completed
			}
		}`;

		const res = await graphqlRequest(query);

		expect(res.statusCode).to.equal(200);
		expect(res.body.data).to.have.property('tasks');
		expect(res.body.data.tasks).to.be.an('array');
	});

	it('Deve consultar uma tarefa por id', async () => {
		const query = `{
			task(id: 1) {
				id
				title
				completed
			}
		}`;

		const res = await graphqlRequest(query);

		expect(res.statusCode).to.equal(200);
		expect(res.body.data).to.have.property('task');
		if (res.body.data.task) {
			expect(res.body.data.task).to.have.property('id');
		} else {
			expect(res.body.data.task).to.be.null;
		}
	});

	it('Deve consultar todos os usuários', async () => {
		const query = `{
			users {
				id
				name
			}
		}`;

		const res = await graphqlRequest(query);
        
		expect(res.statusCode).to.equal(200);
		expect(res.body.data).to.have.property('users');
		expect(res.body.data.users).to.be.an('array');
	});
});
