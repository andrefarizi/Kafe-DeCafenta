import { handlers } from "@/lib/auth";

// NextAuth v5 App Router handler
// Menangani semua request ke /api/auth/* (login, callback, session, signout, dll)
export const { GET, POST } = handlers;
