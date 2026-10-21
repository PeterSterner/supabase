import {
  AuthError,
  PostgrestError,
  Session,
  User,
  WeakPassword,
} from "@supabase/supabase-js";
import { Note } from "./NoteInterface";
import type { GemtTransaktion, Transaktion } from "./TransaktionInterface";
import type { Depot } from "./DepotInterface";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInSupabase: (
    email: string,
    password: string,
  ) => Promise<
    | {
        error: AuthError;
        data?: undefined;
      }
    | {
        data: {
          user: User;
          session: Session;
          weakPassword?: WeakPassword;
        };
        error?: undefined;
      }
  >;
  signInWithOAuthSupabase: (provider: string) => Promise<void>;
  signOutSupabase: () => Promise<{ data?: boolean; error?: AuthError }>;
  signUpSupabase: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<{ data?: boolean; error?: AuthError }>;
  updateUserProfileSupabase: (
    firstName: string,
    lastName: string,
  ) => Promise<{ data?: boolean; error?: PostgrestError }>;
  getUserProfileSupabase: () => Promise<{
    data?: { first_name: string; last_name: string };
    error?: PostgrestError;
  }>;
  addNote: (
    title: string,
    content: string,
  ) => Promise<{
    data?: Note;
    error?: PostgrestError;
  }>;
  addTransaction: (transaction: Transaktion) => Promise<{
    data?: boolean;
    error?: AuthError | PostgrestError;
  }>;
  addDepot: (depot: Depot) => Promise<{
    data?: boolean;
    error?: AuthError | PostgrestError;
  }>;
  listTransactions: () => Promise<{
    data?: GemtTransaktion[];
    error?: AuthError | PostgrestError;
  }>;
  deleteTransaction: (transaction: GemtTransaktion) => Promise<{
    data?: boolean;
    error?: AuthError | PostgrestError;
  }>;
  showNote: (noteId: string) => Promise<{
    data?: Note;
    error?: PostgrestError;
  }>;
  listNotes: () => Promise<{
    data?: Note[];
    error?: PostgrestError;
  }>;
  deleteNote: (
    noteId: number,
  ) => Promise<{ data?: boolean; error?: PostgrestError }>;
  updateNote: (
    noteId: number,
    title: string,
    content: string,
  ) => Promise<{ data?: boolean; error?: PostgrestError }>;
}

export default AuthContextType;
