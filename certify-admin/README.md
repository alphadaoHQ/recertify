# CertifyNFT Admin Panel

This is the separate admin panel for CertifyNFT, designed to be hosted independently from the main application.

## Setup

1. Navigate to the admin directory:
```bash
cd certify-admin
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables (if needed):
```bash
# Example .env for client-only admin app
# Set the deployed contract address so the UI can read state and build transactions
NEXT_PUBLIC_CONTRACT_ADDRESS=EQCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

cp ../.env.local .env.local  # adjust as needed for your environment
```

4. Run the development server:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

## Features

- Mint new certificates
- Add admin users
- View contract state
- NFT preview functionality

## Deployment

This admin panel is designed to be deployed separately from the main CertifyNFT application for security reasons.

## Security Note

Admin functionality has been separated to allow for:
- Different hosting environments
- Enhanced security measures
- Independent scaling
- Isolated access controls