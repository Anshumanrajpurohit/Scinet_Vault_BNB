// Unified storage service (IPFS/Greenfield placeholder)
export const StorageService = {
  async put(data) {
    // TODO: integrate IPFS/Greenfield SDKs
    const cid = 'bafy-placeholder-' + Math.random().toString(36).slice(2, 8);
    return { cid };
  },
  async get(cid) {
    // TODO: fetch from storage
    return { cid, data: null };
  },
};
