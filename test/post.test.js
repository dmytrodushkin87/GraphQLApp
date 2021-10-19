import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import seedDatabase, { userOne, postOne, postTwo }  from './utils/seeDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client = getClient();

beforeEach(seedDatabase);

describe('Posts tests', () => {
test('Should expose published posts', async () => {
    const getPosts = gql`
  query {
    posts {
       title
       body
       published
    }
  }
  `
    const response = await client.query({ query: getPosts })
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
    expect(response.data.posts[0].title).toBe('title published post of userOne');
  });
  
  test('Should fetch my posts', async () => {
    const client = getClient(userOne.jwt);
    const getMyPosts = gql`
    {
      myPosts{
        title
        id
        body
        published
        author{
          name
        }
      }
    }
    `
  const posts = await client.query({ query: getMyPosts });
  expect(posts.data.myPosts.length).toBe(2);
  expect(posts.data.myPosts[0].published).toBe(true);
  expect(posts.data.myPosts[1].published).toBe(false);
  });

  test('Shoude be able to update own post', async () => {
    const client = getClient(userOne.jwt);
    const updatePost = gql`
      mutation {
        updatePost(id: "${postOne.post.id}", data: {
        title: "update",
        body: "update",
        published: false
        }) {
          id
          title
          body
          published
          author{
            name
          }
          }
      }
  `
  const post = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false});
  expect(post.data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
  });

  test('Shoude create post', async () => {
    const client = getClient(userOne.jwt);
    const createPost = gql`
    mutation {
      createPost(
        data:{
          title: "lom Post3", 
          body: "lom Body3", 
          published: true,
        }
      ) {
        id,
        title,
        body,
        createdAt,
        updatedAt,
        published,
        author{
          name
          }
        }
    }
    `
    const post = await client.mutate({ mutation: createPost });
    expect(post.data.createPost.title).toBe('lom Post3');
    expect(post.data.createPost.body).toBe('lom Body3');
    expect(post.data.createPost.published).toBe(true);
  });

  test('Shoude delete post', async () => {
    const client = getClient(userOne.jwt);
    const deletePost = gql`
      mutation {
        deletePost(id: "${postTwo.post.id}"){
        id
        body
        }
      }
  `
  await client.mutate({ mutation: deletePost });
  const exists = await prisma.exists.Post({ id: postTwo.post.id});
  expect(exists).toBe(false);
  });

  test('Should subscribe to posts', async (done) => {
    const subscribeToPosts = gql`
      subscription {
        post {
          mutation
          node{
            id
            body
    	    }
        }
      }
  `
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('DELETED')
      done();
    }
  })
  await prisma.mutation.deletePost({ where: { id: postOne.post.id }})
  });

});
