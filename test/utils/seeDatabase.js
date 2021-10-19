import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'userOne',
    email: 'userOne@email.com',
    password: bcrypt.hashSync('userOne'),
  },
  user: null,
  jwt: null
};

const postOne = {
  input: {
    title: 'title published post of userOne',
    body: 'body published post of userOne',
    published: true,
  },
  post: null
};

const postTwo = {
  input: {
    title: 'title NOT published post of userOne',
    body: 'body NOT published post of userOne',
    published: false,
  },
  post: null
};

const commentOne = {
  input: {
    text: 'comment1'
  },
  comment: null
};

const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyComments();

  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      post: {
        connect: {
          id: postOne.post.id
        }
      },
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
}

export { seedDatabase as default, userOne, postOne, postTwo , commentOne };
