import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import seedDatabase, { userOne, postOne, postTwo, commentOne } from './utils/seeDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client = getClient();

beforeEach(seedDatabase);


describe('Comments tests', () => {
  test('Should fetch all comments', async () => {
  const getComments = gql`
  {
  comments{
    id,
    text,
    author{
      id
      name
    }
    post{
      id
      body
      published
      author{
    		name    
      } 
    }
  }
}
  `
  const comments = await client.query({ query: getComments });
  expect(comments.data.comments.length).toBe(1);
  expect(comments.data.comments[0].post.id).toBe(postOne.post.id);
  });

  test('Should update comment', async () => {
    const client = getClient(userOne.jwt);
    const updateComment = gql`
      mutation {
        updateComment(id: "${commentOne.comment.id}", data: {
        text: "update text",
        }) {
          text
          author{
            name
          }
          }
      }
  `
  const comment = await client.mutate({ mutation: updateComment });
  expect(comment.data.updateComment.text).toBe('update text');
  });

  test('Should subscribe to comments for a post', async (done) => {
    const subscribeToComments = gql`
      subscription {
        comment(PostId: "${postOne.post.id}"){
          mutation
          node {
            id
            text
          }
        }
      }
  `
  client.subscribe({ query: subscribeToComments }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe('DELETED')
      done();
    }
  })
  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
  })
});
