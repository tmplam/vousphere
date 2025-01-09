# Next.js Project

This is a **Next.js** project built with modern tools and libraries to create a fast, scalable, and maintainable application for Admin and Counterpart website of Vousphere

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Getting Started](#getting-started)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)

---

## Features

-   **Next.js 15**: The latest Next.js version for server-side rendering and static site generation.
-   **React 19**: Modern React features like hooks and concurrent rendering.
-   **TailwindCSS**: Utility-first CSS framework for rapid UI development.
-   **React Query**: Powerful state management and data-fetching utilities.
-   **Redux Toolkit**: Simplified state management for complex applications.
-   **Form Management**: Easy-to-use form validation with `react-hook-form` and `zod`.
-   **Rich Text Editing**: Integrated WYSIWYG editor using `react-froala-wysiwyg`.
-   **Data Visualization**: Charts and graphs powered by `recharts` and `react-apexcharts`.
-   **Map Integration**: Interactive maps with `react-leaflet` and `leaflet`.
-   **Radix UI**: Accessible and customizable UI components.
-   **Dark Mode Support**: Built-in dark mode support with `next-themes`.

---

## Technologies Used

### Core Dependencies

-   **Next.js**: `15.1.0`
-   **React**: `19.0.0`
-   **TailwindCSS**: `3.4.1`
-   **TypeScript**: `5.x`

### State Management

-   **@reduxjs/toolkit**: `^2.5.0`
-   **redux-persist**: `^6.0.0`
-   **@tanstack/react-query**: `^5.61.0`

### Form Handling

-   **react-hook-form**: `^7.54.0`
-   **@hookform/resolvers**: `^3.9.1`
-   **zod**: `^3.24.1`

### UI Components

-   **@radix-ui/react-dialog**
-   **@radix-ui/react-dropdown-menu**
-   **lucide-react**: Icon library
-   **tailwindcss-animate**: Animations for TailwindCSS
-   **vaul**: Elegant UI animations

### Data Visualization

-   **recharts**
-   **react-apexcharts**

### Date & Time

-   **date-fns**

### Maps

-   **react-leaflet**
-   **leaflet**
-   **leaflet-defaulticon-compatibility**

### Utilities

-   **clsx**: Utility for conditional classNames
-   **class-variance-authority**: Utility for handling Tailwind class variants
-   **axios**: HTTP client library
-   **next-themes**: Theme management for Next.js

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

-   **Node.js**: `>= 18.x`
-   **npm**: `>= 9.x` or **yarn**

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/tmplam/vousphere.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env.local` file in the root of your project and add the necessary environment variables. For example:

    ```env
    NEXT_PUBLIC_BASE_URL=http://localhost:6000
    ```

### Run the Development Server

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

Here's a brief overview of the project structure:

```plaintext
.
├── public/                  # Static assets like images, fonts, etc.
├── src/
|   ├── apis/                # Call request API (e.g., axios services)
│   ├── app/                 # Main application components
│   ├    ├── (auth)/         # Authentication pages
│   ├    └── (subsystem)/    # Management pages for Admin and Counterpart
│   ├── components/          # Reusable components including Shadcn, Custom components
│   ├── assets/              # Static assets like images, fonts, etc.
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── lib/                 # Utility libraries (leaflet for maps, react-query for data fetching, redux-toolkit for state management, ...)
|   └── schema/              # Type definitions, validation schemas, etc.
├── .env.local               # Environment variables
├── tailwind.config.js       # TailwindCSS configuration
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
