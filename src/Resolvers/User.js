import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)
      if (userId && userId === parent.id) {
        return parent.posts
      } else {
        return parent.posts.filter((post) => {
          return post.published === true;
        })
      }
    }
  },
};
export { User as default };
