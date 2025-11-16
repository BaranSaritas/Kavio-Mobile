// Connection ile ilgili tüm tipler

export interface Connection {
  id: string;
  fullName: string;
  job: string;
  avatar: string;
  email?: string;
  phone?: string;
  company?: string;
  connectedAt?: string;
  isBlocked?: boolean;
}

export interface ConnectionsResponse {
  success: boolean;
  data: Connection[];
  total: number;
  page: number;
  limit: number;
}

export interface RemoveConnectionRequest {
  connectionId: string;
}

export interface BlockConnectionRequest {
  connectionId: string;
  reason?: string;
}

export interface ConnectionsApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
