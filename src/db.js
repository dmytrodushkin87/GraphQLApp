
// users data
let users = [{
  id: '1',
  name: 'lom',
  email: 'lom@email.com',
  age: 36,
}, {
  id: '2',
  name: 'bob',
  email: 'bob@email.com',
  age: 35,
}, {
  id: '3',
  name: 'zed',
  email: 'zed@email.com',
}
];
// posts data
let posts = [{
  id: "1ID",
  title: "one",
  body: "one body",
  published: true,
  author: "1",
}, {
  id: "2ID",
  title: "two",
  body: "two body",
  published: false,
  author: "1",
}, {
  id: "3ID",
  title: "three",
  body: "three body",
  published: true,
  author: "2",
}
];

// comments data
let comments = [{
  id: "Com1",
  text: "comment number 1",
  author: "2",
  post: "3ID",
}, {
  id: "Com2",
  text: "comment number 2",
  author: "1",
  post: "2ID",
}, {
  id: "Com3",
  text: "comment number 3",
  author: "3",
  post: "3ID",
}, {
  id: "Com4",
  text: "comment number 4",
  author: "2",
  post: "3ID",
},
]
const db = {
  users,
  posts,
  comments,
}
export { db as default }
