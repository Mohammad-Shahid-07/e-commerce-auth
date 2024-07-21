import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateUniqueCategory() {
  const base = faker.commerce.department();
  const adjective = faker.commerce.productAdjective();
  const material = faker.commerce.productMaterial();
  return `${adjective} ${material} ${base}`.trim();
}

async function main() {
  try {
    const uniqueCategories = new Set();

    while (uniqueCategories.size < 100) {
      uniqueCategories.add(generateUniqueCategory());
    }

    const categories = Array.from(uniqueCategories).map(name => ({ name }));

    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });

    console.log(`${categories.length} unique categories created`);
  } catch (e) {
    console.error("Error creating categories:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Unhandled error in main:", e);
  process.exit(1);
});