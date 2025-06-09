import exifr from "exifr";

export async function extractExifData(imagePath: string) {
	try {
		const exif = await exifr.parse(imagePath, {
			pick: [
				"Model",
				"LensModel",
				"FocalLength",
				"FNumber",
				"ExposureTime",
				"ISO",
			],
		});

		return {
			model: exif?.Model,
			lens: exif?.LensModel,
			focalLength: exif?.FocalLength ? `${exif.FocalLength}mm` : undefined,
			aperture: exif?.FNumber ? `f/${exif.FNumber}` : undefined,
			shutterSpeed: exif?.ExposureTime
				? `1/${1 / exif.ExposureTime}s`
				: undefined,
			iso: exif?.ISO,
		};
	} catch (error) {
		console.error("Error extracting EXIF data:", error);
		return null;
	}
}
