// Placeholder collaborative service (Yjs/websocket planned)
export const CollabService = {
  connect(docId) {
    return { docId, disconnect: () => {} };
  },
};
