// db.js
import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")
db.version(1).stores({
    pages:"id , title, createdAt , updatedAt, content" // Primary key and indexed props
})


export async function getAllPages() {
  return await db.pages.toArray();
}

export async function addPage(page) {
  await db.pages.add(page);
}

export async function updatePage(id, updatedData) {
  await db.pages.update(id, updatedData);
}

export async function deletePage(id) {
  await db.pages.delete(id);
}

export async function getPageById(id) {
  return await db.pages.get(id);
}
