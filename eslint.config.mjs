import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript'],
    }),
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'error',
            // Prevent hardcoded neutral colors - use semantic color classes instead
            'no-restricted-properties': [
                'error',
                {
                    object: 'className',
                    property: '*',
                    message: 'Use semantic color classes from globals.css instead of hardcoded neutral colors (text-gray-*, bg-gray-*, etc.)'
                }
            ],
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        rules: {
            // Custom rule to catch hardcoded color classes in className strings
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'Literal[value=/\\b(text-gray-|bg-gray-|border-gray-|text-black|text-slate-|bg-neutral-|text-zinc-|bg-zinc-|text-stone-|bg-stone-)\\b/]',
                    message: 'Avoid hardcoded neutral colors. Use semantic color classes: text-gray-* → text-muted-foreground, bg-gray-* → bg-muted, bg-white → bg-background/bg-card, etc.'
                },
                {
                    selector: 'TemplateElement[value.raw=/\\b(text-gray-|bg-gray-|border-gray-|text-black|text-slate-|bg-neutral-|text-zinc-|bg-zinc-|text-stone-|bg-stone-)\\b/]',
                    message: 'Avoid hardcoded neutral colors. Use semantic color classes: text-gray-* → text-muted-foreground, bg-gray-* → bg-muted, bg-white → bg-background/bg-card, etc.'
                }
            ]
        }
    }
];

export default eslintConfig;
