import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { z } from "zod";
import {
  AuthResponse,
  AuthResponseSchema,
  CreateTicket,
  CreateTunnel,
  ElectricityMeter,
  ElectricityMeterSchema,
  ElectricityReading,
  ElectricityReadingSchema,
  Fan,
  FanControl,
  FanSchema,
  FaultTicket,
  FaultTicketSchema,
  Light,
  LightControl,
  LightSchema,
  LoginRequest,
  MockFanAction,
  RegisterRequest,
  SystemSetting,
  SystemSettingSchema,
  Tunnel,
  TunnelSchema,
  TunnelSummary,
  TunnelSummarySchema,
  TunnelFilter,
  UpsertSetting,
  DashboardSummarySchema,
  DashboardSummaryDto,
  PaginatedResult,
  TicketQueryParams,
} from "@/types/api";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tunnels-management-system.runasp.net/api";

// Token storage keys
const TOKEN_KEY = "tunnel_access_token";
const USER_KEY = "tunnel_user";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token validation
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Don't redirect if it's a login attempt failure
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Clear auth state and redirect to login on any 401
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper to validate response with Zod
function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("API Response Validation Error:", result.error);
    throw new Error("Invalid API response format");
  }
  return result.data;
}

// ============ Auth API ============
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post("/auth/login", credentials);
    const validated = validateResponse(AuthResponseSchema, data);
    localStorage.setItem(TOKEN_KEY, validated.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(validated));
    return validated as AuthResponse;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post("/auth/register", userData);
    const validated = validateResponse(AuthResponseSchema, data);
    localStorage.setItem(TOKEN_KEY, validated.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(validated));
    return validated as AuthResponse;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  async checkAdmin(): Promise<boolean> {
    try {
      await apiClient.get("/auth/admin-check");
      return true;
    } catch {
      return false;
    }
  },

  getStoredUser(): AuthResponse | null {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthResponse;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

// ============ Tunnels API ============
export const tunnelsApi = {
  async getAll(): Promise<Tunnel[]> {
    const { data } = await apiClient.get("/");
    return validateResponse(z.array(TunnelSchema), data);
  },

  async getPaginated(params: TunnelFilter): Promise<PaginatedResult<TunnelSummary>> {
    const { data } = await apiClient.get("/paginated", { params });
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map((item: unknown) => 
        validateResponse(TunnelSummarySchema, item)
      );
    }
    return data as PaginatedResult<TunnelSummary>;
  },

  async getById(id: number): Promise<Tunnel> {
    const { data } = await apiClient.get(`/${id}`);
    return validateResponse(TunnelSchema, data);
  },

  async create(tunnel: CreateTunnel): Promise<Tunnel> {
    const { data } = await apiClient.post("/", tunnel);
    return validateResponse(TunnelSchema, data);
  },

  async update(id: number, tunnel: Partial<CreateTunnel>): Promise<Tunnel> {
    const { data } = await apiClient.put(`/${id}`, tunnel);
    return validateResponse(TunnelSchema, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/${id}`);
  },
};

// ============ Fans API ============
export const fansApi = {
  async getByTunnel(tunnelId: number): Promise<Fan[]> {
    const { data } = await apiClient.get(`/tunnels/${tunnelId}/fans`);
    return validateResponse(z.array(FanSchema), data) as Fan[];
  },

  async getById(id: number): Promise<Fan> {
    const { data } = await apiClient.get(`/fans/${id}`);
    return validateResponse(FanSchema, data) as Fan;
  },

  async create(fan: Partial<Fan>): Promise<Fan> {
    const { data } = await apiClient.post("/fans", fan);
    return validateResponse(FanSchema, data) as Fan;
  },

  async update(id: number, fan: Partial<Fan>): Promise<Fan> {
    const { data } = await apiClient.put(`/fans/${id}`, fan);
    return validateResponse(FanSchema, data) as Fan;
  },

  async control(id: number, command: FanControl): Promise<void> {
    await apiClient.post(`/fans/${id}/control`, command);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/fans/${id}`);
  },
};

// ============ Lights API ============
export const lightsApi = {
  async getByTunnel(tunnelId: number): Promise<Light[]> {
    const { data } = await apiClient.get(`/tunnels/${tunnelId}/lights`);
    return validateResponse(z.array(LightSchema), data);
  },

  async getById(id: number): Promise<Light> {
    const { data } = await apiClient.get(`/lights/${id}`);
    return validateResponse(LightSchema, data);
  },

  async create(light: Partial<Light>): Promise<Light> {
    const { data } = await apiClient.post("/lights", light);
    return validateResponse(LightSchema, data);
  },

  async update(id: number, light: Partial<Light>): Promise<Light> {
    const { data } = await apiClient.put(`/lights/${id}`, light);
    return validateResponse(LightSchema, data);
  },

  async control(id: number, command: LightControl): Promise<void> {
    await apiClient.post(`/lights/${id}/control`, command);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/lights/${id}`);
  },
};

// ============ Electricity API ============
export const electricityApi = {
  async getMeterByTunnel(tunnelId: number): Promise<ElectricityMeter> {
    const { data } = await apiClient.get(`/tunnels/meter/${tunnelId}`);
    return validateResponse(ElectricityMeterSchema, data);
  },

  async getHistory(
    tunnelId: number,
    params?: { startTime?: string; endTime?: string; limit?: number }
  ): Promise<ElectricityReading[]> {
    const { data } = await apiClient.get(`/electricity/history/${tunnelId}`, {
      params,
    });
    return validateResponse(z.array(ElectricityReadingSchema), data);
  },

  async createReading(reading: Partial<ElectricityReading>): Promise<void> {
    await apiClient.post("/electricity", reading);
  },
};

// ============ Fault Tickets API ============
export const ticketsApi = {
  async getOpen(): Promise<FaultTicket[]> {
    const { data } = await apiClient.get("/FaultTickets");
    return validateResponse(z.array(FaultTicketSchema), data) as FaultTicket[];
  },

  async getPaged(params: TicketQueryParams): Promise<PaginatedResult<FaultTicket>> {
    const { data } = await apiClient.get("/FaultTickets/paged", { params });
  
    // Handle standard paginated response
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map((item: unknown) => 
        validateResponse(FaultTicketSchema, item)
      );
    }
    return data as PaginatedResult<FaultTicket>;
  },

  async getById(id: number): Promise<FaultTicket> {
    const { data } = await apiClient.get(`/FaultTickets/${id}`);
    return validateResponse(FaultTicketSchema, data) as FaultTicket;
  },

  async create(ticket: CreateTicket): Promise<{ success: boolean; alreadyExists: boolean; ticket: FaultTicket }> {
    const { data } = await apiClient.post("/FaultTickets", ticket);
    return data;
  },

  async close(id: number): Promise<void> {
    await apiClient.post(`/FaultTickets/${id}/close`);
  },
};

// ============ Settings API ============
export const settingsApi = {
  async getAll(): Promise<SystemSetting[]> {
    const { data } = await apiClient.get("/settings");
    return validateResponse(z.array(SystemSettingSchema), data);
  },

  async getByKey(key: string): Promise<SystemSetting> {
    const { data } = await apiClient.get(`/settings/${key}`);
    return validateResponse(SystemSettingSchema, data);
  },

  async upsert(setting: UpsertSetting): Promise<{ success: boolean }> {
    const { data } = await apiClient.put("/settings", setting);
    return data;
  },
};

// ============ Dashboard API ============
export const dashboardApi = {
  async getStats(): Promise<DashboardSummaryDto> {
    const { data } = await apiClient.get("/dashboard/stats");
    return validateResponse(DashboardSummarySchema, data);
  },
};

// ============ Mock API (Development/Testing) ============
export const mockApi = {
  async controlFan(id: number, action: MockFanAction): Promise<{ success: boolean }> {
    const { data } = await apiClient.post(`/mock/fans/${id}/control`, { action });
    return data;
  },

  async updateElectricity(
    id: number,
    values: { voltage: number; current: number; powerFactor?: number; isConnected?: boolean }
  ): Promise<{ success: boolean }> {
    const { data } = await apiClient.post(`/mock/electricity/${id}`, values);
    return data;
  },
};

export default apiClient;
