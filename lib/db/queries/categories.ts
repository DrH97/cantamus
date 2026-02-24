import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function getCategories() {
  return db.query.categories.findMany({
    orderBy: categories.sortOrder,
  });
}

export async function getCategoriesByType(type: string) {
  return db.query.categories.findMany({
    where: eq(categories.type, type),
    orderBy: categories.sortOrder,
  });
}

export async function getMassSectionCategories() {
  return getCategoriesByType("mass_section");
}
