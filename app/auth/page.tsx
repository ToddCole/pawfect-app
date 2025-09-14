// app/auth/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase-client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        // Provide specific error handling for common Supabase authentication issues
        console.error('Supabase authentication error:', error);
        
        let userFriendlyMessage = "";
        
        if (error.message.includes("Database error") || error.message.includes("saving new user")) {
          userFriendlyMessage = "Database error saving new user. This usually means the Supabase database is not properly configured. Please check that:\n\n" +
            "1. Your Supabase project is active and not paused\n" +
            "2. Row Level Security (RLS) policies are correctly set up\n" +
            "3. The database schema includes proper user tables\n" +
            "4. Authentication is enabled in your Supabase dashboard\n\n" +
            "Contact support if this issue persists.";
        } else if (error.message.includes("Invalid API key") || error.message.includes("Project not found")) {
          userFriendlyMessage = "Configuration error: Invalid Supabase credentials. Please check your environment variables and ensure the Supabase project is properly set up.";
        } else if (error.message.includes("Failed to fetch") || error.message.includes("network")) {
          userFriendlyMessage = "Network error: Unable to connect to authentication service. Please check your internet connection and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          userFriendlyMessage = "Please check your email and click the confirmation link before trying to sign in.";
        } else if (error.message.includes("Invalid email")) {
          userFriendlyMessage = "Please enter a valid email address.";
        } else {
          userFriendlyMessage = `Authentication error: ${error.message}`;
        }
        
        setMessage(`Error: ${userFriendlyMessage}`);
      } else {
        setMessage("Check your email for the magic link!");
      }
    } catch (err) {
      console.error('Authentication error:', err);
      
      // Handle network and connection errors
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setMessage("Error: Unable to connect to authentication service. This usually means:\n\n" +
          "1. Your internet connection is down\n" +
          "2. The Supabase service is unreachable\n" +
          "3. Your Supabase URL is incorrect\n\n" +
          "Please check your connection and Supabase configuration.");
      } else {
        setMessage("Error: An unexpected error occurred. Please try again or contact support if the issue persists.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-4 rounded-md ${
          message.includes("Error") 
            ? "bg-red-100 text-red-700 border border-red-300" 
            : "bg-green-100 text-green-700 border border-green-300"
        }`}>
          <div className="whitespace-pre-line text-sm leading-relaxed">
            {message}
          </div>
        </div>
      )}
      
      <p className="mt-6 text-sm text-gray-600">
        We&apos;ll send you a secure link to sign in without a password.
      </p>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Having trouble signing in? <a href="/api/health" target="_blank" className="text-blue-600 hover:underline">Check system status</a></p>
      </div>
    </main>
  );
}