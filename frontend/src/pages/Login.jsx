import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  const [mode, setMode] = useState('login'); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (mode === "login") {
        res = await fetch(
          `http://localhost:3000/auth?email=${email}&password=${password}`
        );
      } else {
        res = await fetch("http://localhost:3000/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
      }

      const data = await res.json();

      if (!res.ok){
        alert(data.message || "ログインに失敗しました");
        return;
      }

      if (mode === "login") {
        setUserInfo({
          id: data.user_id,
          name: data.name,
          email:data.email,
          token: data.token,
        });
        navigate("/main");
      } else {
        alert("アカウント作成成功！");
        setMode("login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>{mode === "login" ? "ログイン" : "アカウント作成"}</h2>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <input
            type="text"
            placeholder="ユーザー名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {mode === "login" ? "ログイン" : "アカウント作成"}
        </button>
      </form>

      <p>
        {mode === "login" ? (
          <>
            アカウントをお持ちでないですか？{" "}
            <span onClick={() => setMode("signup")}>
              アカウント作成
            </span>
          </>
        ) : (
          <>
            すでにアカウントをお持ちですか？{" "}
            <span onClick={() => setMode("login")}>
              ログイン
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default Login