import { ui, defaultLang, showDefaultLang, routes } from "./ui";

export function getLangFromUrl(url: URL | string): keyof typeof ui {
	const { pathname } =
		typeof url === "string" ? new URL(url, "http://dummy") : url;
	const langMatch = pathname.split("/")[1];
	if (ui[langMatch as keyof typeof ui]) {
		return langMatch as keyof typeof ui;
	}
	return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
	return ui[lang];
}

export function useTranslatedPath(lang: keyof typeof ui) {
	return function translatePath(path: string, l: string = lang) {
		const pathName = path.replaceAll("/", "");
		const hasTranslation =
			defaultLang !== l &&
			(routes as Record<string, Record<string, string>>)[l] !== undefined &&
			(routes as Record<string, Record<string, string>>)[l][pathName] !==
				undefined;
		const translatedPath = hasTranslation
			? "/" + (routes as Record<string, Record<string, string>>)[l][pathName]
			: path;
		return !showDefaultLang && l === defaultLang
			? translatedPath
			: `/${l}${translatedPath}`;
	};
}

export function getRouteFromUrl(url: URL | string): string | undefined {
	const pathname =
		typeof url === "string"
			? new URL(url, "http://dummy").pathname
			: url.pathname;
	const parts = pathname?.split("/");
	const path = parts.pop() || parts.pop();
	if (path === undefined) {
		return undefined;
	}
	const currentLang = getLangFromUrl(url);
	if (defaultLang === currentLang) {
		const route = Object.values(routes)[0] as Record<string, string>;
		return route && route[path] !== undefined ? route[path] : undefined;
	}
	const getKeyByValue = (
		obj: Record<string, string>,
		value: string
	): string | undefined => {
		return Object.keys(obj).find(key => obj[key] === value);
	};
	const reversedKey =
		(routes as Record<string, Record<string, string>>)[currentLang] &&
		getKeyByValue(
			(routes as Record<string, Record<string, string>>)[currentLang],
			path
		);
	if (reversedKey !== undefined) {
		return reversedKey;
	}
	return undefined;
}
