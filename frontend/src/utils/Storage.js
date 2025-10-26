import localforage from "localforage";

localforage.config({
  name: "MyApp",
  storeName: "userDataStore",
});

export const storage = {
  setItem: async (key, value) => {
    await localforage.setItem(key, value);
  },
  getItem: async (key) => {
    return await localforage.getItem(key);
  },
  removeItem: async (key) => {
    await localforage.removeItem(key);
  },
  clear: async () => {
    await localforage.clear();
  },
};
