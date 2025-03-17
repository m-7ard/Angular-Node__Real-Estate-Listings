import path from "path";

export const DIST_DIR = process.cwd();
export const STATIC_DIR = path.join(DIST_DIR, "static");

export const MEDIA_FOLDER_NAME = "media";
export const MEDIA_ROOT = path.join(DIST_DIR, MEDIA_FOLDER_NAME);
export const TEST_MEDIA_ROOT = path.join(MEDIA_ROOT, "tests");
