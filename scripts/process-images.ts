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

			// Update the frontmatter with basic fields
			const updatedData: any = {
				...data,
				description: data.description ?? "Image description",
				featured: typeof data.featured === "boolean" ? data.featured : false,
			};

			// Only add EXIF data if it exists and contains valid values
			if (exifData) {
				// Filter out undefined values from EXIF data
				const cleanExifData = Object.fromEntries(
					Object.entries(exifData).filter(([_, value]) => value !== undefined)
				);

				// Only add exif field if we have valid data
				if (Object.keys(cleanExifData).length > 0) {
					updatedData.exif = cleanExifData;
				}
			}

			// Create new frontmatter
			const newContent = matter.stringify(markdownContent, updatedData);

			// Write back to file
			await fs.writeFile(filePath, newContent);

			if (
				exifData &&
				Object.keys(exifData).some(
					(key: string) => (exifData as any)[key] !== undefined
				)
			) {
				console.log(`Updated ${file} with EXIF data`);
			} else {
				console.log(`Updated ${file} (no EXIF data available)`);
			}
		}
	} catch (error) {
		console.error("Error processing images:", error);
	}
}

processImages();
