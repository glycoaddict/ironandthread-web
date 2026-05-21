This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# How I made this app
...



- To connect the migration of Clerk users to supabase, I used src/.py/migrate_users.py. This script uses the Clerk API to fetch all users and then inserts them into the Supabase database.
    - Auth: Supabase secrets should be set to the CLERK_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY environment variables. The script uses these keys to authenticate with the Clerk API and Supabase.
    - Create the edge function in supabase. Code is at `src\.migration\migrate_clerk_to_supabase.py`. This function will be called by the migrate_users.py script to insert users into the Supabase database.
    - You execute the migrate.ts script locally using `python src/.migration/migrate_users.py` with the correct venv with supabase python library installed.

# Outstanding Features to consider adding
- create an edge function that sends an email to all users in the database. This will be used to send a message that a new chapter has dropped, or a new thing is available. Either called by admin panel or manually by running a script. This is a good way to keep users engaged and informed about new content. Probably want a standardised email with a template that can be filled in with the relevant information about the new content. This could include a link to the new content, a brief description, and any other relevant information.

