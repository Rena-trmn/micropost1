// src/fakeApi.js
let posts = [
  { id: 1, content: "最初の投稿", author: "Rena" },
];

export const getPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...posts]), 500);
  });
};

export const createPost = async (newPost) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = { id: posts.length + 1, ...newPost };
      posts.push(post);
      resolve(post);
    }, 500);
  });
};