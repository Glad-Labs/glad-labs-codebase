/**
 * @file tailwind.config.js
 * @description The configuration file for Tailwind CSS. This file defines the content
 * to be scanned for Tailwind classes, custom theme extensions, and any plugins.
 *
 * @see {@link https://tailwindcss.com/docs/configuration} for more information.
 *
 * @suggestion FUTURE_ENHANCEMENT: As the site's design system matures, consider
 * extending the theme with custom colors, fonts, and spacing to create a more
 * consistent and branded look. For example:
 * theme: {
 *   extend: {
 *     colors: {
 *       'brand-cyan': '#00FFFF',
 *       'brand-dark': '#0A192F',
 *     },
 *     fontFamily: {
 *       'sans': ['Inter', 'sans-serif'],
 *       'mono': ['Fira Code', 'monospace'],
 *     }
 *   },
 * },
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * @property {string[]} content - An array of file paths that Tailwind should scan
   * to find class names. This is crucial for tree-shaking unused styles in production.
   */
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  /**
   * @property {Object} theme - The theme object where you can customize Tailwind's
   * default design system.
   */
  theme: {
    /**
     * @property {Object} extend - Use this to add new values to the theme without
     * overriding the defaults.
     */
    extend: {},
  },
  /**
   * @property {Array} plugins - An array of plugins to extend Tailwind's functionality.
   * The `@tailwindcss/typography` plugin provides the `prose` classes for styling
   * blocks of text content, like markdown-rendered blog posts.
   */
  plugins: [require('@tailwindcss/typography')],
};
