# GetGas

Get ETH on the Superchain.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your own values:
- `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy App ID
- `NEXT_PUBLIC_WORLDCOIN_APP_ID`: Your WorldCoin App ID
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Your Google Analytics ID

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

This project requires several environment variables to be set. Copy `.env.example` to `.env` and fill in your values:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_WORLDCOIN_APP_ID=your_worldcoin_app_id_here
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id_here
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Privy](https://privy.io/) - Authentication
- [WorldID](https://worldcoin.org/) - Identity verification
