import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (buffer, mimetype) => {
	const base64 = `data:${mimetype};base64,${buffer.toString("base64")}`;

	const result = await cloudinary.uploader.upload(base64, {
		folder: "layersprint/products",
	});

	return { url: result.secure_url, publicId: result.public_id };
};

export const deleteImage = async (publicId) => {
	if (!publicId) return;
	await cloudinary.uploader.destroy(publicId);
};
