import Link from 'next/link';
export default function Admin() {
    return
    <main className="interior admin-placeholder">
        <h1>ADMIN ACCESS</h1>
        <p>This demo does not expose event editing or a public admin interface. Verified event publishing will require Supabase authentication, role-based authorization, server-side validation, and row-level security policies.</p>
        <Link className="button dark" href="/">RETURN HOME ↗</Link>
    </main>
}
