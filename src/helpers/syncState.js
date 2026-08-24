import { Settings } from "../models/index.js"

export async function touchSyncState() {
    const [settings] = await Settings.findOrCreate({ where: { id: 1 }, defaults: { kwhPrice: 0 } });
    await settings.update({ lastModifiedAt: new Date() });
}