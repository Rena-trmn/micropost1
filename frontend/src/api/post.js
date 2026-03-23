const BASE_URL = "http://localhost:3000";

//投稿一覧取得
export const getPosts = async (token) => {
  const res = await fetch(`${BASE_URL}/post?token=${token}`);

  if (!res.ok) {
    throw new Error("取得に失敗しました");
  }

  const data = await res.json();

  //フロント用に変換
  return data.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.created_at,
    user: {
      name: post.user_name,
    },
  }));
};

//投稿作成
export const createPost = async (message, user) => {
  const res = await fetch(`${BASE_URL}/post?token=${user.token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("投稿に失敗しました");
  }

  const data = await res.json();

  return {
    id: data.id,
    content: data.content,
    createdAt: data.created_at,
    user: {
      name: user.name,
    },
  };
};