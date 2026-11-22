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

export type ApiPartner = {
  id: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  roleKa: string;
  roleEn: string;
  summaryKa: string;
  summaryEn: string;
  aboutKa: string;
  aboutEn: string;
  serviceSlugs: string[];
  since: string;
  colorBg: string;
  colorFg: string;
  userId: string | null;
  sortOrder: number;
};

export async function apiFetchPartners(): Promise<ApiPartner[]> {
  const res = await fetch(`${API_URL}/partners`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiPartner[]>;
}

export async function apiFetchPartner(slug: string): Promise<ApiPartner> {
  const res = await fetch(`${API_URL}/partners/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiPartner>;
}

export type ApiWork = {
  id: string;
  slug: string;
  titleKa: string;
  titleEn: string;
  summaryKa: string;
  summaryEn: string;
  serviceSlugs: string[];
  partnerId: string | null;
  userId: string | null;
  showOnWorks: boolean;
  showOnPartner: boolean;
  coverPath: string | null;
  youtubeUrl: string | null;
  youtubeEmbedUrl: string | null;
  sortOrder: number;
};

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function apiFetchWorks(): Promise<ApiWork[]> {
  const res = await fetch(`${API_URL}/works`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiWork[]>;
}

export async function apiFetchWorksByPartner(
  partnerId: string,
): Promise<ApiWork[]> {
  const res = await fetch(
    `${API_URL}/works/by-partner/${encodeURIComponent(partnerId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiWork[]>;
}

export async function apiFetchWorksForMe(token: string): Promise<ApiWork[]> {
  const res = await fetch(`${API_URL}/works/for-me`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await parseError(res);
  return res.json() as Promise<ApiWork[]>;
}
