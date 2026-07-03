const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3001"
  : "";

function getToken(): string | null {
  return localStorage.getItem("metro_token");
}

function setToken(token: string) {
  localStorage.setItem("metro_token", token);
}

function clearToken() {
  localStorage.removeItem("metro_token");
  localStorage.removeItem("metro_user");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

export const api = {
  // Auth
  async login(jobNumber: string, password: string) {
    const data = await request<{ token: string; user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ jobNumber, password }),
    });
    setToken(data.token);
    localStorage.setItem("metro_user", JSON.stringify(data.user));
    return data.user;
  },

  async getMe() {
    const token = getToken();
    if (!token) return null;
    try {
      return await request<any>("/api/auth/me");
    } catch {
      return null;
    }
  },

  logout() {
    clearToken();
  },

  getToken,

  // Incidents
  async getIncidents() {
    return request<any[]>("/api/incidents");
  },

  async getIncident(id: string) {
    return request<any>(`/api/incidents/${id}`);
  },

  async createIncident(data: any) {
    return request<any>("/api/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateIncident(id: string, data: any) {
    return request<any>(`/api/incidents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteIncident(id: string) {
    return request<any>(`/api/incidents/${id}`, { method: "DELETE" });
  },

  // Staff
  async getStaff() {
    return request<any[]>("/api/staff");
  },

  async createStaff(data: { jobNumber: string; name: string; password: string; role: string; station: string }) {
    return request<any>("/api/staff", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteStaff(id: string) {
    return request<any>(`/api/staff/${id}`, { method: "DELETE" });
  },
};
