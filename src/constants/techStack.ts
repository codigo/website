import type { Component } from 'svelte';

// Import all tech icons
import AWS from '../components/icons/tech/AWS.svelte';
import Docker from '../components/icons/tech/Docker.svelte';
import Git from '../components/icons/tech/Git.svelte';
import OpenAI from '../components/icons/tech/OpenAI.svelte';
import ViteJS from '../components/icons/tech/ViteJS.svelte';
import PostgreSQL from '../components/icons/tech/PostgreSQL.svelte';
import Supabase from '../components/icons/tech/Supabase.svelte';
import PocketBase from '../components/icons/tech/PocketBase.svelte';
import Svelte from '../components/icons/tech/Svelte.svelte';
import Playwright from '../components/icons/tech/Playwright.svelte';
import React from '../components/icons/tech/React.svelte';
import Tailwind from '../components/icons/tech/Tailwind.svelte';
import NodeJS from '../components/icons/tech/NodeJS.svelte';
import TypeScript from '../components/icons/tech/TypeScript.svelte';
import JavaScript from '../components/icons/tech/JavaScript.svelte';
import Firebase from '../components/icons/tech/Firebase.svelte';
import SQLite from '../components/icons/tech/SQLite.svelte';
import Redis from '../components/icons/tech/Redis.svelte';
import MongoDB from '../components/icons/tech/MongoDB.svelte';
import Cloudflare from '../components/icons/tech/Cloudflare.svelte';
import Python from '../components/icons/tech/Python.svelte';

import Expo from '../components/icons/tech/Expo.svelte';
import Fastify from '../components/icons/tech/Fastify.svelte';
import Hono from '../components/icons/tech/Hono.svelte';
import Vitest from '../components/icons/tech/Vitest.svelte';
import Pulumi from '../components/icons/tech/Pulumi.svelte';

export interface TechStack {
	category: string;
	icon: Component<{ size?: string }>;
	name: string;
	duplicate?: boolean;
}

export const TECH_STACK: TechStack[] = [
	// Core Languages
	{ category: 'Languages', icon: TypeScript, name: 'TypeScript' },
	{ category: 'Languages', icon: JavaScript, name: 'JavaScript' },
	{ category: 'Languages', icon: Python, name: 'Python' },

	// Frontend Frameworks
	{ category: 'Frontend', icon: React, name: 'React' },
	{ category: 'Frontend', icon: Svelte, name: 'Svelte' },
	{ category: 'Frontend', icon: Expo, name: 'Expo' },
	{ category: 'Frontend', icon: Tailwind, name: 'Tailwind CSS' },

	// Backend & APIs
	{ category: 'Backend', icon: NodeJS, name: 'Node.js' },
	{ category: 'Backend', icon: Fastify, name: 'Fastify' },
	{ category: 'Backend', icon: Hono, name: 'Hono' },

	// Databases
	{ category: 'Database', icon: PostgreSQL, name: 'PostgreSQL' },
	{ category: 'Database', icon: MongoDB, name: 'MongoDB' },
	{ category: 'Database', icon: Redis, name: 'Redis' },
	{ category: 'Database', icon: SQLite, name: 'SQLite' },

	// Cloud & Infrastructure
	{ category: 'Cloud', icon: AWS, name: 'AWS' },
	{ category: 'Cloud', icon: Cloudflare, name: 'Cloudflare' },
	{ category: 'Cloud', icon: Docker, name: 'Docker' },
	{ category: 'Cloud', icon: Pulumi, name: 'Pulumi' },

	// Backend as a Service
	{ category: 'BaaS', icon: Supabase, name: 'Supabase' },
	{ category: 'BaaS', icon: Firebase, name: 'Firebase' },
	{ category: 'BaaS', icon: PocketBase, name: 'PocketBase' },

	// Development Tools
	{ category: 'Tools', icon: Git, name: 'Git' },
	{ category: 'Tools', icon: ViteJS, name: 'Vite' },
	{ category: 'Tools', icon: Playwright, name: 'Playwright' },
	{ category: 'Tools', icon: Vitest, name: 'Vitest' },

	// AI & ML
	{ category: 'AI', icon: OpenAI, name: 'OpenAI' }
];

export const CHUNKS = 2;
