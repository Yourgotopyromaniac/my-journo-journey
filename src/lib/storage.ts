/** Ask the browser not to clear saved progress when space runs low. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) {
      if (await navigator.storage.persisted()) return true
      return await navigator.storage.persist()
    }
  } catch {
    // Not supported. Backups still protect her work.
  }
  return false
}
