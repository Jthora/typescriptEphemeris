/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_BOTTOM_DRAWER?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module '*.ttf?url' {
	const src: string;
	export default src;
}
