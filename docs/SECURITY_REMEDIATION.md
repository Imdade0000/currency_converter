# Security Remediation Runbook

This runbook covers secret rotation and Git history cleanup for this project.

## 1) Immediate containment

1. Pause automatic deployments (Vercel + Railway) during rotation.
2. Treat any previously committed values as compromised.
3. Replace local secrets in `backend/.env` with safe placeholders.

## 2) Rotate secrets at providers

Rotate and invalidate old values:

- `JWT_SECRET`
- `DATABASE_URL` credentials (new DB password/user if possible)
- `EXCHANGE_RATE_API_KEY`
- `SMTP_PASSWORD` / app password
- Stripe keys:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PREMIUM_PRICE_ID` (if needed)

Store new values only in secure locations:

- Railway environment variables (backend)
- Vercel environment variables (frontend)
- Password manager / secrets vault

Never commit real values to Git.

## 3) Configure deployment environments

### Railway (backend)

Set all keys listed in `backend/.env.example`.

Minimum required:

- `DATABASE_URL`
- `JWT_SECRET`
- `EXCHANGE_RATE_API_KEY`
- `FRONTEND_URL=https://app.<your-domain>`

### Vercel (frontend)

Set:

- `NEXT_PUBLIC_API_URL=https://api.<your-domain>/api`

## 4) Purge Git history (mandatory for already exposed secrets)

Use one of the following tools:

- `git filter-repo` (recommended)
- BFG Repo-Cleaner

Example with `git filter-repo`:

```bash
git filter-repo --path backend/.env --path front-end/.env.local --invert-paths
```

If secrets appeared in other files/commits, replace patterns with `--replace-text`.

After rewrite:

```bash
git push --force --all
git push --force --tags
```

Then notify all contributors to re-clone the repository.

## 5) Verification checklist

1. `backend/.env.example` and `front-end/.env.example` are complete.
2. `.gitignore` excludes `.env` files and key/cert files.
3. Build checks pass:
   - backend: `npx tsc -p tsconfig.json --noEmit`
   - frontend: `npx tsc -p tsconfig.json --noEmit`
4. Secret scan passes in CI (Gitleaks workflow).
5. No active secrets remain in tracked files.

## 6) Ongoing controls

1. Keep CI secret scan required for merges.
2. Rotate critical secrets on a regular schedule.
3. Repeat this runbook after any accidental secret exposure.
