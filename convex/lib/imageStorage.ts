import { ActionCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { api } from "../_generated/api";

export async function downloadAndStoreImage(
	ctx: ActionCtx,
	imageUrl: string,
	businessId: Id<"businesses">,
	fileName: string,
): Promise<{ storageId: Id<"_storage">; url: string } | null> {
	try {
		// Download the image
		const response = await fetch(imageUrl);
		if (!response.ok) {
			return null;
		}

		// Get the image data as a blob
		const blob = await response.blob();

		// Generate upload URL
		const uploadUrl = await ctx.runMutation(api.storage.generateUploadUrl);

		// Upload the blob to Convex storage
		const uploadResponse = await fetch(uploadUrl, {
			method: "POST",
			headers: {
				"Content-Type": blob.type || "image/jpeg",
			},
			body: blob,
		});

		if (!uploadResponse.ok) {
			return null;
		}

		// Get the storage ID from the response
		const { storageId } = await uploadResponse.json();

		// Get the public URL for the stored file
		const url = await ctx.runQuery(api.storage.getUrl, { storageId });

		if (!url) {
			return null;
		}

		// Add to media library
		await ctx.runMutation(api.mediaLibrary.uploadFile, {
			fileName,
			originalName: fileName,
			fileType: blob.type || "image/jpeg",
			fileSize: blob.size,
			storageId,
			businessId,
			folder: "scraped",
			alt: `${fileName} image`,
			tags: ["scraped", "google-maps"],
		});

		return { storageId, url };
	} catch (error) {
		return null;
	}
}

export async function downloadAndStoreAllImages(
	ctx: ActionCtx,
	imageUrls: string[],
	businessId: Id<"businesses">,
	businessName: string,
): Promise<string[]> {
	const storedUrls: string[] = [];

	for (let i = 0; i < imageUrls.length; i++) {
		const imageUrl = imageUrls[i];
		const fileName = `${businessName.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`;

		const result = await downloadAndStoreImage(
			ctx,
			imageUrl,
			businessId,
			fileName,
		);
		if (result) {
			storedUrls.push(result.url);
		} else {
			// If download fails, keep the original URL
			storedUrls.push(imageUrl);
		}
	}

	return storedUrls;
}
