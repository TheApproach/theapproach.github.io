import starlightPlugin from '@astrojs/starlight-tailwind';

// Generated color palettes
const accent = {
    200: '#95d2f4',
    600: '#0075a0',
    900: '#00374e',
    950: '#002839',
};
const gray = {
    100: '#f6f6f6',
    200: '#eeedee',
    300: '#c2c2c2',
    400: '#8c8b8c',
    500: '#595858',
    700: '#393838',
    800: '#272627',
    900: '#181818',
};

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: { accent, gray },
        },
    },
    plugins: [starlightPlugin()],
};
