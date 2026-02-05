/// <reference path="../pb_data/types.d.ts" />

/**
 * Add ai_summary and embedding fields to posts collection for semantic search
 */
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('posts');

		// Add ai_summary field (Text, optional)
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'ai_summary',
				name: 'ai_summary',
				type: 'text',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// Add embedding field (JSON, optional)
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'embedding',
				name: 'embedding',
				type: 'json',
				required: false,
				presentable: false,
				unique: false,
				options: {
					maxSize: 2000000 // 2MB max for vector embeddings
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		// Revert migration
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('posts');

		collection.schema.removeField('ai_summary');
		collection.schema.removeField('embedding');

		return dao.saveCollection(collection);
	}
);
