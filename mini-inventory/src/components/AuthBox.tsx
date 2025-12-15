import { useState } from "react";
import { authApi } from "../api";

export default function AuthBox(props: {
    onAuthed: (u: { id: string; username: string }) => void;
}) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit() {
        setLoading(true);
        try {
            const u =
                mode === "login"
                    ? await authApi.login(username, password)
                    : await authApi.register(username, password);
            props.onAuthed(u);
        } catch (e: any) {
            alert(e.message ?? "Auth failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
            <h2 className="h2">{mode === "login" ? "Login" : "Register"}</h2>

            <div className="grid" style={{ gap: 10 }}>
                <label className="label">Username</label>
                <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label className="label">Password</label>
                <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn" onClick={submit} disabled={loading}>
                    {loading ? "..." : mode === "login" ? "Login" : "Create account"}
                </button>

                <button
                    className="btn btn-ghost"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    disabled={loading}
                >
                    {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}