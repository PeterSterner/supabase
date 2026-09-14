import { createClient, Provider } from "@supabase/supabase-js";
import {} from "@supabase/supabase-js";
import { useContext } from "react";
import { AuthContext } from "./Auth";

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!PROJECT_URL || !ANON_KEY) {
  throw new Error("Missing environment variables!");
}

const supabase = createClient(PROJECT_URL, ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const SUPPORTED_PROVIDERS: Provider[] = ["google", "facebook", "github"];

export { supabase, useAuth, SUPPORTED_PROVIDERS };
