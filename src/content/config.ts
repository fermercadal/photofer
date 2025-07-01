import { defineCollection, z } from "astro:content";

const imagesCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.date(),
			image: image(),
			categories: z.array(z.string()),
			featured: z.boolean().default(false),
			camera: z.string().optional(),
			lens: z.string().optional(),
			exif: z
				.object({
					model: z.string().optional(),
					lens: z.string().optional(),
					focalLength: z.string().optional(),
					aperture: z.string().optional(),
					shutterSpeed: z.string().optional(),
					iso: z.number().optional(),
				})
				.optional(),
		}),
});

export const collections = {
	images: imagesCollection,
};
