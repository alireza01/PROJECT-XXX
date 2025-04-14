export interface AuthState {
  userId: string | null;
  loading: boolean;
}

export interface AuthHook extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
} 