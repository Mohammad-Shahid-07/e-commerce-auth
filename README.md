# E-commerce Sign-up and Login Flow

This project is a simple sign-up and login flow for an e-commerce website, where users can mark the categories they are interested in. It uses Next.js, Tailwind CSS, Shadcn-ui, NeonDB, and Bun.

## Features

- User registration and login
- Mark categories of interest
- Paginated list of categories
- Persistent user preferences

## Getting Started

### Prerequisites

- Node.js
- Bun/npm (for bundling and running the project)
- PostgreSQL database (NeonDB recommended)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mohammad-Shahid-07/e-commerce-auth
   cd e-commerce-auth
   ```

2. **Install dependencies:**
   You can use either Bun or npm to install dependencies:

   ```bash
   bun install
   ```

   or

   ```bash
   npm install
   ```

3. **Setup environment variables:**
   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_URL=
   # Uncomment next line if you use Prisma <5.10
   # DATABASE_URL_UNPOOLED=

   NODEMAILER_EMAIL=
   NODEMAILER_PASSWORD=
   JWT_SECRET=

   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Generate product list:**

   ```bash
   node product-generator.js
   ```

5. **Run the development server:**

   ```bash
   bun dev
   ```

   or

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- Register a new user through the registration form.
- Login with an existing user account.
- Navigate to the protected page to see and mark categories of interest.
- Use pagination to browse through categories.
- Logout and login again to see your selected categories persist.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
