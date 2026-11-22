const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export type ApiUser = {
  id: string;
  email: string;
  phone: string;
  nameOrCompany: string;
  role: "user" | "admin";
  planId: string;
  workIds: string[];
};

export type AuthResponse = {
  accessToken: string;
  user: ApiUser;
};

async function parseError(res: Response) {
  const data = (await res.json().catch(() => ({}))) as {
    message?: string | string[];
  };
  const message = Array.isArray(data.message)
    ? data.message.join(", ")
    : data.message || "Request failed";
  throw new Error(message);
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<AuthResponse>;
}

export async function apiRegister(input: {
  email: string;
  phone: string;
  nameOrCompany: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<AuthResponse>;
}

export type ApiService = {
  id: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  summaryKa: string;
  summaryEn: string;
  icon: string;
  iconSvg: string | null;
  color: string;
  sortOrder: number;
};

export async function apiFetchServices(): Promise<ApiService[]> {
  const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiService[]>;
}

export type ApiPlanPricingTier = {
  unit: "day" | "week" | "month" | "year";
  quantity: number;
  price: string;
};

export type ApiPlan = {
  id: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  summaryKa: string;
  summaryEn: string;
  pricing: ApiPlanPricingTier[];
  featuresKa: string[];
  featuresEn: string[];
  featured: boolean;
  isPublic: boolean;
  allowedUserIds: string[];
  sortOrder: number;
};

export async function apiFetchPlans(): Promise<ApiPlan[]> {
  const res = await fetch(`${API_URL}/plans`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiPlan[]>;
}

export async function apiFetchPlansForMe(token: string): Promise<ApiPlan[]> {
  const res = await fetch(`${API_URL}/plans/for-me`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiPlan[]>;
}
