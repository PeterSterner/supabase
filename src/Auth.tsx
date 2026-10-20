import React, { createContext, useState, useEffect, ReactNode } from "react";

import { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase, SUPPORTED_PROVIDERS } from "./Supabase";
import AuthContextType from "./types/AuthContextType";
import type { Transaktion } from "./types/TransaktionInterface";
import type { Depot } from "./types/DepotInterface";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      },
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInSupabase = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error);
      return { error };
    }
    setSession(data.session);
    setUser(data.user);
    return { data };
  };

  const signOutSupabase = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return { error };
    }
    setSession(null);
    setUser(null);
    return { data: true };
  };

  const signUpSupabase = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });
    if (error) {
      console.error(error);
      return { error };
    }

    setSession(data.session);
    setUser(data.user);

    return { data: true };
  };

  const signInWithOAuthSupabase = async (provider: string) => {
    // Tjek om provider findes i SUPPORTED_PROVIDERS
    if (
      !SUPPORTED_PROVIDERS.includes(
        provider as (typeof SUPPORTED_PROVIDERS)[number],
      )
    ) {
      console.error("Ugyldig provider:", provider);
      return;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as (typeof SUPPORTED_PROVIDERS)[number], // ✅ type-sikker cast
      options: {
        redirectTo: window.location.origin + "/kontrolpanel",
      },
    });

    if (error) {
      console.error("OAuth login fejl:", error);
    } else {
      console.log("Redirecting til provider...", data);
    }
  };

  const updateUserProfileSupabase = async (
    firstName: string,
    lastName: string,
  ) => {
    const { error } = await supabase
      .from("users")
      .update({
        id: user?.id,
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", user?.id);

    if (error) {
      console.error(error);
      return { error };
    }
    return { data: true };
  };

  const getUserProfileSupabase = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", user?.id)
      .single();

    if (error) {
      console.error(error);
      return { error };
    }
    return { data };
  };

  const addNote = async (title: string, content: string) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ user_id: user?.id, title, content }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return { error };
    }
    return { data };
  };

  const addTransaction = async (transaction: Transaktion) => {
    if (!user) {
      return {
        error: new AuthError(
          "Du skal være logget ind for at tilføje en transaktion.",
        ),
      };
    }

    const { error } = await supabase
      .from("transaktioner")
      .insert({ ...transaction, user_id: user.id });

    if (error) {
      console.error(error);
      return { error };
    }
    return { data: true };
  };

  const addDepot = async (depot: Depot) => {
    if (!user) {
      return {
        error: new AuthError(
          "Du skal være logget ind for at oprette et depot.",
        ),
      };
    }

    const { error } = await supabase.from("depoter").insert({
      navn: depot.navn.trim(),
      handelsplatform_id: depot.handelsplatform_id,
      user_id: user.id,
    });

    if (error) {
      console.error(error);
      return { error };
    }
    return { data: true };
  };

  const showNote = async (noteId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user?.id)
      .eq("id", noteId)
      .single();

    if (error) {
      console.error(error);
      return { error };
    }
    return { data };
  };

  const listNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return { error };
    }
    return { data };
  };

  const deleteNote = async (noteId: number) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user?.id);

    if (error) {
      console.error(error);
      return { error };
    }
    return { data: true };
  };

  const updateNote = async (noteId: number, title: string, content: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", noteId)
      .eq("user_id", user?.id);

    if (error) {
      console.error(error);
      return { error };
    }
    return { data: true };
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    signInSupabase,
    signInWithOAuthSupabase,
    signOutSupabase,
    signUpSupabase,
    updateUserProfileSupabase,
    getUserProfileSupabase,
    addNote,
    addTransaction,
    addDepot,
    showNote,
    listNotes,
    deleteNote,
    updateNote,
  } satisfies AuthContextType;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
