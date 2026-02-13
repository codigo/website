/// <reference path="../pb_data/types.d.ts" />

/**
 * Add ai_summary and embedding fields to posts collection for semantic search
 * Uses PocketBase v0.23+ JSVM migration API
 */
migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId('posts');

		// Add ai_summary field (Text, optional)
		collection.fields.add(
			new Field({
				name: 'ai_summary',
				type: 'text',
				required: false,
			})
		);

		// Add embedding field (JSON, optional)
		collection.fields.add(
			new JSONField({
				name: 'embedding',
				required: false,
				maxSize: 2000000, // 2MB max for vector embeddings
			})
		);

		app.save(collection);
	},
	(app) => {
		const collection = app.findCollectionByNameOrId('posts');

		collection.fields.removeByName('ai_summary');
		collection.fields.removeByName('embedding');

		app.save(collection);
	}
);
