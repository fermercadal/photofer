import { extractExifData } from "../src/utils/exif";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ASSETS_IMAGES_DIR = path.join(process.cwd(), "src/assets/images");
const CONTENT_IMAGES_DIR = path.join(process.cwd(), "src/content/images");

async function processImages() {
	try {
		// Read all markdown files
		const files = await fs.readdir(CONTENT_IMAGES_DIR);
		const mdFiles = files.filter(file => file.endsWith(".md"));

		for (const file of mdFiles) {
			const filePath = path.join(CONTENT_IMAGES_DIR, file);
			const content = await fs.readFile(filePath, "utf-8");
			const { data, content: markdownContent } = matter(content);

			// Get the image path from the frontmatter
			const imagePath = path.join(
				ASSETS_IMAGES_DIR,
				data.image.replace("../../assets/images/", "")
			);

			// Extract EXIF data
			const exifData = await extractExifData(imagePath);

			if (exifData) {
				// Update the frontmatter with EXIF data and ensure featured/description fields
				const updatedData = {
					...data,
					description: data.description ?? "Image description",
					featured: typeof data.featured === "boolean" ? data.featured : false,
					exif: exifData,
				};

				// Create new frontmatter
				const newContent = matter.stringify(markdownContent, updatedData);

				// Write back to file
				await fs.writeFile(filePath, newContent);
				console.log(`Updated ${file} with EXIF data`);
			} else {
				console.log(`No EXIF data found for ${file}`);
			}
		}
	} catch (error) {
		console.error("Error processing images:", error);
	}
}

processImages();
