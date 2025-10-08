# GLAD Labs Public Site

This project is the public-facing website for GLAD Labs. It is a Next.js application that consumes content from the Strapi CMS.

## Overview

The public site is responsible for displaying blog posts, pages, and other content to the public. It is designed to be fast, SEO-friendly, and easy to maintain.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository.
2. Navigate to the `web/public-site` directory:
   ```sh
   cd web/public-site
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Key Features

- **Next.js:** The application is built with Next.js, which provides server-side rendering, static site generation, and other performance optimizations.
- **Strapi Integration:** The site fetches content from the Strapi CMS using the Strapi API.
- **Tailwind CSS:** The application is styled with Tailwind CSS, a utility-first CSS framework.
- **SEO-friendly:** The site is designed to be SEO-friendly, with features like dynamic sitemaps and meta tags.
