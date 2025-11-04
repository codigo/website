import { type RequestEvent, fail } from '@sveltejs/kit';
import { SECRET_CF_TURNSTILE_SECRET } from '$env/static/private';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { sendMessage } from '$lib/services/pb';
import { ContactSchema } from '$routes/contact/schema';

import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod4(ContactSchema)) };
};

export const actions: Actions = {
	email: async ({ request, locals }: RequestEvent) => {
		const form = await superValidate(request, zod4(ContactSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const token = form.data['cf-turnstile-response'];

		const { success, error } = await validateToken(token, SECRET_CF_TURNSTILE_SECRET);

		if (!success) {
			return fail(400, { form, message: error });
		}

		try {
			const { name, email, content } = form.data;
			await sendMessage(name, email, content, locals.logger);
			return message(form, 'Message sent successfully');
		} catch (e) {
			let message: string = '';
			if (e instanceof Error) {
				message = e.message;
			} else {
				message = 'An error occurred while sending the message';
			}
			return fail(500, { form, message });
		}
	}
};
interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

async function validateToken(token: string, secret: string) {
	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			response: token,
			secret: secret
		})
	});

	const data: TokenValidateResponse = await response.json();

	return {
		// Return the status
		success: data.success,

		// Return the first error if it exists
		error: data['error-codes']?.length ? data['error-codes'][0] : null
	};
}
