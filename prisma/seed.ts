import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed categories
  await prisma.category.createMany({
    data: [
      { name: 'Men' },
      { name: 'Women' },
      { name: 'Kids' },
      { name: 'Accessories' },
    ],
    skipDuplicates: true,
  });

  // Get category ID for 'Men'
  const menCategory = await prisma.category.findFirst({ where: { name: 'Men' } });

  // Seed a sample product
  if (menCategory) {
    await prisma.product.create({
      data: {
        name: 'Sample T-Shirt',
        slug: 'sample-t-shirt',
        status: 'ACTIVE',
        basePrice: 499,
        category: { connect: { id: menCategory.id } },
      },
    });
  }

  // Seed a sample user
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Demo User',
      role: 'CUSTOMER',
    },
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
