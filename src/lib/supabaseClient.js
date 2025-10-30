"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Authenticated-aware client (used for admin and pages that need user session)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 5 } },
});

// Public (anonymous-only) client that never attaches a logged-in token.
// This avoids RLS issues when an admin is logged in and tries the public form.
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 5 } },
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        // Use a no-op storage so this client never reads localStorage sessions
        storage: {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
        },
    },
    global: { headers: { Authorization: undefined } },
});


