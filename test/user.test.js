import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seeDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

describe('Users tests', () => {
  test('Should create a new user', async () => {
    const createUser = gql`
  mutation {
    createUser(
      data: {
        name: "lomkovsky",
        email: "lomkovsky@email.com",
        password: "lomkovsky"
      }
    ) {
      user{
        id
      }
    }
  }
  `
    const responseMutate = await client.mutate({
      mutation: createUser
    })
    const exists = await prisma.exists.User({ id: responseMutate.data.createUser.user.id })
    expect(exists).toBe(true);
  });

  test('Should expose public author profiles', async () => {
    const getUsers = gql`
  query {
    users {
       id
       name
       email
    }
  }
  `
    const response = await client.query({ query: getUsers })
    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('userOne');
  });
  test('Should not login with bad credentials', async () => {
    const login = gql`
    mutation {
      loginUser(
        data: {
          email: "userOne@email.com",
          password: "111userOne"
        }
      ) {
        user{
          id
        }
      }
    }
    `

    await expect(
      client.mutate({ mutation: login })
      ).rejects.toThrow('unable to authenticate please try again!');
  });
  test('Should can not singup a new user with short password', async () => {
    const createUser = gql`
  mutation {
    createUser(
      data: {
        name: "lomkovsky",
        email: "lomkovsky@email.com",
        password: "lom"
      }
    ) {
      token
      user{
        id
      }
    }
  }
  `
  await expect(
    client.mutate({ mutation: createUser })
    ).rejects.toThrow('password less than 5 characters');
  });
  test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt);
    const getProfile = gql`
    {
      me{
        id
        name
        email
      }
    }
    `
  const me = await client.query({ query: getProfile });
  expect(me.data.me.id).toBe(userOne.user.id);
  expect(me.data.me.name).toBe(userOne.user.name);
  expect(me.data.me.email).toBe(userOne.user.email);
  })
  

});
