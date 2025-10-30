## Java FutureX Attendance (Next.js + Supabase)

### Quick setup

1. Create a Supabase project.
2. In SQL editor, run `supabase.sql` from the repo to create the `attendance` table, RLS policies, and enable realtime.
3. In Supabase Auth → Users, create admin accounts (email/password). These accounts can read attendance due to the `authenticated` select policy.
4. In Vercel (or `.env.local`), add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Local dev

```bash
npm i
npm run dev
```

### Pages

- `/` landing with CTA
- `/register` public form (fname, lname, NIC, email, batch)
- `/success` confirmation (handles duplicates → shows "Already Marked")
- `/admin/login` email/password login (Supabase Auth)
- `/admin` dashboard with live total, table, CSV/XLSX export

### Notes
- NIC is unique; duplicates redirect to `/success?status=already`.
- Add branding images to `public/futurex-logo.png` and `public/uni-logo.png`.
- Update batches in `src/app/register/page.js` `BATCHES` array.

### Deploy on Vercel
1. Import this repo in Vercel.
2. Add the two Supabase env vars.
3. Deploy.
