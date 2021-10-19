import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization
  let decoded = {};
  if (requireAuth && !header) {
    throw new Error('you need to provide a authorization token!')
  }
  if (header === undefined) {
    decoded.userId = null;
  } else {
    const token = header.slice(7);
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  return decoded.userId;
};

export { getUserId as default };
