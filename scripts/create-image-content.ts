import fs from "fs/promises";
import path from "path";

const ASSETS_IMAGES_DIR = path.join(process.cwd(), "src/assets/images");
const CONTENT_IMAGES_DIR = path.join(process.cwd(), "src/content/images");

async function createImageContent() {
	try {
		// Read all image files
		const files = await fs.readdir(ASSETS_IMAGES_DIR);
		const imageFiles = files.filter(file =>
			/\.(jpg|jpeg|png|gif|webp)$/i.test(file)
		);

		for (const imageFile of imageFiles) {
			const mdFileName = `${path.parse(imageFile).name}.md`;
			const mdFilePath = path.join(CONTENT_IMAGES_DIR, mdFileName);

			// Check if markdown file already exists
			try {
				await fs.access(mdFilePath);
				console.log(`Markdown file already exists for ${imageFile}`);
				continue;
			} catch {
				// File doesn't exist, create it
				const content = `---
title: "${path.parse(imageFile).name}"
description: "Image description"
date: ${new Date().toISOString().split("T")[0]}
image: "../../assets/images/${imageFile}"
categories: []
featured: false
---
`;
				await fs.writeFile(mdFilePath, content);
				console.log(`Created markdown file for ${imageFile}`);
			}
		}
	} catch (error) {
		console.error("Error creating image content:", error);
	}
}

createImageContent();
