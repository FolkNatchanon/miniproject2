import type { Item } from "./types";

const BASE = import.meta.env.VITE_API_BASE;

async function j<T>(r: Response): Promise<T> {
    if (!r.ok) {
        let msg = "Request failed";
        try {
            const data: any = await r.json();
            msg = data?.message ?? msg;
        } catch { }
        throw new Error(msg);
    }
    // 204 ไม่มี body
    if (r.status === 204) return undefined as T;
    return r.json();
}

// ---------- auth ----------
export const authApi = {
    me: async () =>
        j<{ id: string; username: string }>(
            await fetch(`${BASE}/api/auth/me`, { credentials: "include" })
        ),

    register: async (username: string, password: string) =>
        j<{ id: string; username: string }>(
            await fetch(`${BASE}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            })
        ),

    login: async (username: string, password: string) =>
        j<{ id: string; username: string }>(
            await fetch(`${BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            })
        ),

    logout: async () =>
        j<void>(await fetch(`${BASE}/api/auth/logout`, { method: "POST", credentials: "include" })),
};

// ---------- items ----------
export const itemsApi = {
    list: async () =>
        j<Item[]>(await fetch(`${BASE}/api/items`, { credentials: "include" })),

    create: async (payload: Omit<Item, "id">) =>
        j<Item>(
            await fetch(`${BASE}/api/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            })
        ),

    patch: async (id: string, next: Partial<Item>) =>
        j<Item>(
            await fetch(`${BASE}/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(next),
            })
        ),

    remove: async (id: string) =>
        j<void>(await fetch(`${BASE}/api/items/${id}`, { method: "DELETE", credentials: "include" })),
};