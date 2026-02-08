// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightUtils from '@lorenzo_lewis/starlight-utils';
import { remarkMdLinks } from './remark-md-links.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://qentriq.dev',
	markdown: {
		remarkPlugins: [remarkMdLinks],
	},
	integrations: [
		starlight({
			title: 'QentriQ',
			description: 'Quantum-Safe PKI in Go - Post-quantum X.509 infrastructure',
			components: {
				Head: './src/components/Head.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: false,
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
				'./src/styles/tokens.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'navLinks',
					items: [
						{ label: 'QPKI', link: '/qpki/getting-started/pki-basics/' },
						{ label: 'QLAB', link: '/qlab/overview/' },
					],
				},
				{
					label: 'qpki',
					items: [
						{
							label: 'Getting Started',
							items: [
								{ slug: 'qpki/getting-started/pki-basics' },
								{ slug: 'qpki/getting-started/post-quantum' },
								{ label: 'Quick Start', slug: 'qpki/getting-started/quick-start' },
							],
						},
						{
							label: 'Build Your PKI',
							items: [
								{ slug: 'qpki/build-pki/ca' },
								{ slug: 'qpki/build-pki/certificates' },
								{ slug: 'qpki/build-pki/crl' },
								{ slug: 'qpki/build-pki/keys' },
								{ slug: 'qpki/build-pki/profiles' },
								{ slug: 'qpki/build-pki/hsm' },
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
								{ slug: 'qpki/services/audit' },
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
								{ slug: 'qpki/reference/standards' },
								{ slug: 'qpki/reference/troubleshooting' },
								{ slug: 'qpki/reference/glossary' },
							],
						},
						{
							label: 'Development',
							collapsed: true,
							items: [
								{ slug: 'qpki/dev/architecture' },
								{ slug: 'qpki/dev/contributing' },
								{ slug: 'qpki/dev/testing' },
								{ slug: 'qpki/dev/interoperability' },
							],
						},
					],
				},
				{
					label: 'qlab',
					items: [
						{ label: 'Overview', slug: 'qlab/overview' },
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
