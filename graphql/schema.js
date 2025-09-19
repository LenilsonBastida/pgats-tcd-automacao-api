const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createTask(title: String!): Task
    updateTask(id: ID!, completed: Boolean!): Task
    deleteTask(id: ID!): Boolean
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean
  }
`;

module.exports = typeDefs;