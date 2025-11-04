import fs from 'fs/promises';
import path from 'path';

const extractDataFromContent = (content: string, regex: RegExp): string => {
	const match = content.match(regex);
	return match ? match[1] : '';
};

const parseTechStackItem = (item: string) => {
	const name = extractDataFromContent(item, /name: '([^']+)'/);
	const category = extractDataFromContent(item, /category: '([^']+)'/);
	return { name, category };
};

const getTechStack = async (projectRoot: string) => {
	const techStackPath = path.join(projectRoot, 'src', 'constants', 'techStack.ts');
	const techStackContent = await fs.readFile(techStackPath, 'utf-8');

	const techStackData = extractDataFromContent(
		techStackContent,
		/export const TECH_STACK: TechStack\[] = \[([\s\S]*?)\];/
	);

	return techStackData
		.split('},')
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
		.map(parseTechStackItem);
};

const groupBy = <T extends Record<string, any>>(array: T[], key: keyof T) =>
	array.reduce(
		(acc, item) => {
			const group = String(item[key]);
			if (!acc[group]) acc[group] = [];
			acc[group].push(item);
			return acc;
		},
		{} as Record<string, T[]>
	);

const readMarkdownFiles = async (directory: string) => {
	const files = await fs.readdir(directory);
	const mdFiles = files.filter((file) => file.endsWith('.md'));

	return Promise.all(
		mdFiles.map(async (file) => {
			const filePath = path.join(directory, file);
			const content = await fs.readFile(filePath, 'utf-8');
			return { fileName: file, content };
		})
	);
};

const formatExperiences = (experiences: Array<{ fileName: string; content: string }>) =>
	experiences
		.map(({ content }) => content.replace(/^(order|next|previous):.*$\n?/gm, '').trim())
		.join('\n\n');

const formatTechStack = (techStack: Array<{ name: string; category: string }>) => {
	const techStackByCategory = groupBy(techStack, 'category');
	return Object.entries(techStackByCategory)
		.map(
			([category, technologies]) =>
				`${category}:\n${technologies.map((tech) => tech.name).join(', ')}`
		)
		.join('\n\n');
};

/**
 * Generates the About Me content dynamically from experiences and tech stack
 */
export const generateAboutMeContext = async (): Promise<string> => {
	const projectRoot = process.cwd();
	const experiencesDir = path.join(projectRoot, 'src', 'routes', 'experiences');

	const experiences = await readMarkdownFiles(experiencesDir);
	const techStack = await getTechStack(projectRoot);

	const aboutMeContent = [
		'About Me\n========\n',
		'Experiences\n-----------\n',
		formatExperiences(experiences),
		'Tech Stack\n----------\n',
		formatTechStack(techStack)
	].join('\n');

	return `You are a friendly, helpful AI assistant for Mauricio Mercado's portfolio website.

Your role:
- Answer questions about Mauricio's experience, skills, and background
- Be conversational and natural - match the visitor's tone and query scope
- For greetings or casual questions, respond briefly and warmly
- Only provide detailed information when specifically asked
- If you don't have specific information, politely suggest contacting Mauricio directly

Guidelines:
- Keep responses concise and relevant to what was asked
- Don't dump all information at once - let the conversation flow naturally
- Be enthusiastic but not overly verbose

---

${aboutMeContent}
`;
};
