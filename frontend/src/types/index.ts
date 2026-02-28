export interface User {
  id: number;
  name?: string;
  full_name: string;
  employee_id?: string;
  organization?: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'declined';
  is_active?: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  full_name: string;
  employee_id?: string;
  organization?: string;
  email: string;
  password: string;
  confirm_password?: string;
  recaptcha_token?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Anomaly {
  id: number;
  node_id: string;
  confidence: number;
  detected_at: string;
  is_resolved: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface TopologyNode {
  id: string;
  label?: string;
  name?: string;
  type?: 'sensor' | 'plc' | 'hmi' | 'server';
  status: 'normal' | 'anomaly' | 'online' | 'offline' | 'alert';
  x?: number;
  y?: number;
}

export interface TopologyEdge {
  source: string;
  target: string;
}

export interface Topology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface Analytics {
  total_users: number;
  active_users?: number;
  pending_users: number;
  total_anomalies: number;
  anomalies_today: number;
  anomaly_frequency?: number;
  system_health?: string;
  attack_types?: { [key: string]: number };
}
