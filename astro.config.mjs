// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightUtils from '@lorenzo_lewis/starlight-utils';
import { remarkMdLinks } from './remark-md-links.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://qpki.io',
	markdown: {
		remarkPlugins: [remarkMdLinks],
	},
	integrations: [
		starlight({
			title: 'QPKI',
			description: 'Post-Quantum X.509 PKI in Go — ML-DSA, ML-KEM, SLH-DSA',
			components: {
				Head: './src/components/Head.astro',
				Hero: './src/components/Hero.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/qentriq' },
			],
			plugins: [
				starlightUtils({
					multiSidebar: {
						switcherStyle: 'hidden',
					},
					navLinks: {
						leading: { useSidebarLabelled: 'navLinks' },
					},
				}),
			],
			customCss: [
				'./src/styles/tailwind.css',
				'./src/styles/tokens.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'navLinks',
					items: [
						{ label: 'Docs', link: '/qpki/getting-started/quick-start/' },
						{ label: 'Learning Path', link: '/qlab/overview/' },
					],
				},
				{
					label: 'qpki',
					items: [
						{
							label: 'Getting Started',
							items: [
								{ slug: 'qpki/getting-started/installation' },
								{ label: 'Quick Start', slug: 'qpki/getting-started/quick-start' },
								{ slug: 'qpki/getting-started/post-quantum' },
							],
						},
						{
							label: 'Core PKI',
							items: [
								{ slug: 'qpki/core-pki/ca' },
								{ slug: 'qpki/core-pki/profiles' },
								{ label: 'Keys & CSR', slug: 'qpki/core-pki/keys' },
								{ slug: 'qpki/core-pki/certificates' },
								{ slug: 'qpki/core-pki/crl' },
							],
						},
						{
							label: 'End Entities',
							items: [
								{ slug: 'qpki/end-entities/credentials' },
							],
						},
						{
							label: 'Services',
							items: [
								{ slug: 'qpki/services/ocsp' },
								{ slug: 'qpki/services/tsa' },
								{ slug: 'qpki/services/cms' },
								{ slug: 'qpki/services/cose' },
								{ slug: 'qpki/services/ssh' },
							],
						},
						{
							label: 'Operations',
							items: [
								{ slug: 'qpki/operations/hsm' },
								{ slug: 'qpki/operations/audit' },
							],
						},
						{
							label: 'Migration',
							items: [
								{ slug: 'qpki/migration/crypto-agility' },
								{ slug: 'qpki/migration/hybrid' },
							],
						},
						{
							label: 'Reference',
							collapsed: true,
							items: [
								{ slug: 'qpki/reference/cli' },
								{ slug: 'qpki/reference/troubleshooting' },
								{ slug: 'qpki/reference/standards' },
								{ slug: 'qpki/reference/pki-basics' },
								{ slug: 'qpki/reference/glossary' },
							],
						},
						{
							label: 'Development',
							collapsed: true,
							items: [
								{ slug: 'qpki/dev/architecture' },
								{ slug: 'qpki/dev/contributing' },
							],
						},
					],
				},
				{
					label: 'qlab',
					items: [
						{
							label: 'Getting Started',
							items: [
								{ label: 'Learning Path', slug: 'qlab/overview' },
							],
						},
						{
							label: 'Awareness',
							items: [
								{ slug: 'qlab/journey/00-revelation/readme' },
								{ slug: 'qlab/journey/01-quickstart/readme' },
							],
						},
						{
							label: 'Build',
							items: [
								{ slug: 'qlab/journey/02-full-chain/readme' },
								{ slug: 'qlab/journey/03-hybrid/readme' },
							],
						},
						{
							label: 'Lifecycle',
							items: [
								{ slug: 'qlab/journey/04-revocation/readme' },
								{ slug: 'qlab/journey/05-ocsp/readme' },
							],
						},
						{
							label: 'Long-term Signatures',
							items: [
								{ slug: 'qlab/journey/06-code-signing/readme' },
								{ slug: 'qlab/journey/07-timestamping/readme' },
								{ slug: 'qlab/journey/08-ltv-signatures/readme' },
							],
						},
						{
							label: 'Encryption',
							items: [
								{ slug: 'qlab/journey/09-cms-encryption/readme' },
							],
						},
						{
							label: 'Migration',
							items: [
								{ slug: 'qlab/journey/10-crypto-agility/readme' },
							],
						},
						{
							label: 'Reference',
							collapsed: true,
							items: [
								{ slug: 'qlab/docs/glossary' },
							],
						},
					],
				},
			],
		}),
	],
});
