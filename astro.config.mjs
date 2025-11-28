// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid({
			theme: 'forest',
			autoTheme: true,
		}),
		starlight({
			title: 'XeoDocs Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/xeodocs' }],
			sidebar: [
				{
					label: 'System Design',
					items: [
						{ label: 'Overview', slug: '01-overview' },
						{ label: 'Microservices', slug: '02-microservices' },
						{ label: 'Data Models', slug: '03-data-model' },
						{ label: 'Infrastructure', slug: '04-infrastructure' },
						{ label: 'Workflows', slug: '05-workflows' },
					],
				},
			],
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			defaultLocale: 'root',
		}),
	],
});
