# Locasite

Locasite is a web application that allows users to create and manage websites for their businesses. It features a visual editor to customize the look and feel of the website, and it uses Convex for its backend.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v20.x or later)
* npm

### Installing

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/locasite.git
   cd locasite
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Convex:**

   - Log in to your Convex account or create a new one.
   - Create a new project in the Convex dashboard.
   - In the project settings, find your project's deployment URL.
   - Create a `.env.local` file in the root of the project and add the following environment variable:

     ```
     NEXT_PUBLIC_CONVEX_URL="your-convex-deployment-url"
     ```

   - Deploy the backend functions and schema to your Convex project:

     ```bash
     npx convex deploy
     ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running the Linter

To run the linter, use the following command:

```bash
npm run lint
```
