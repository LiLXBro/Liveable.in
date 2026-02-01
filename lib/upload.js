
export async function saveFile(file) {
    if (!file || file.size === 0) return null;

    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data);
    const base64 = buffer.toString('base64');

    // Return Data URI
    return `data:${file.type};base64,${base64}`;
}
