# Rehost broken article images

## Scope

Update `pages/2025-12-30-dcb65539-5685-41e9-9cdd-f15f685046e6.md` only, preserving article text and image alt text.

## Steps

1. Extract every remote image URL, including `coverImage`.
2. Download each unique source image and verify it is a valid non-empty image.
3. Upload each file with `ploys3 upload IMAGE_FILENAME` and capture the returned CDN URL.
4. Replace all occurrences of each old URL with the corresponding new URL.
5. Verify no old `cdn.gooo.ai` image links remain, new links are reachable, and review `git diff`/`git status` without disturbing unrelated work.
