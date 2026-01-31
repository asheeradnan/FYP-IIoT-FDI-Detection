export interface User {
  id: number;
  name: string;
  employee_id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'declined';
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  employee_id: string;
  email: string;
  password: string;
  confirm_password: string;
  recaptcha_token: string;
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
  label: string;
  status: 'normal' | 'anomaly';
  x: number;
  y: number;
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
  active_users: number;
  pending_users: number;
  anomaly_frequency: number;
  system_health: string;
}
