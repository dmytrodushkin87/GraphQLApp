import getUserId from '../utils/getUserId';

const Subscription = {
  comment: {
    subscribe(parent, { PostId }, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: PostId
            }
          }
        }
      }, info);
    },
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info);
    },
  },
  myPost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request);
      return prisma.subscription.post({
        where: {
          node: {
            published: true,
            author: {
              id: userId
            }
          }
        }
      }, info);
    }
  },
};

export { Subscription as default };
