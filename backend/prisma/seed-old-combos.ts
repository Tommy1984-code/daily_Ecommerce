import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GROCERY_CAT_ID = 'd48ce9b0-3a97-4b09-9670-701e4a68386f';
const GROCERY_GROUP_ID = '220f0f69-c3ba-4095-b808-db9fbce2ffd7';
const GROCERY_BRAND_ID = '859b006f-37a1-40ce-beff-87e7ed64a30b';
const FOOD_CAT_ID = '0cbf69bf-d309-4f0a-ada3-3d47335df2e1';
const FOOD_GROUP_ID = 'cedc3953-712f-4735-b2bb-2c5c713a0a80';
const FOOD_BRAND_ID = '41a0f393-af75-4ae1-88da-316649d42420';

const comboData: { itemId: string; titleEn: string; price: number; categoryId: string; groupId: string; brandId: string; description: string }[] = [
  { itemId: '10388', titleEn: 'special offers 1', price: 1056.39, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: 'Special combo offer 1' },
  { itemId: '10389', titleEn: 'special offers 2', price: 2665.00, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: 'Special combo offer 2' },
  { itemId: '10321', titleEn: '(23) CRAP STICK', price: 3173, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: '(23) CRAP STICK combo' },
  { itemId: '10497', titleEn: 'EASTER PACKAGE 2', price: 972, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: 'Easter package combo 2' },
  { itemId: '10552', titleEn: 'NEW YEAR SPECIAL OFFER -1', price: 3990, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: 'New year special offer combo 1' },
  { itemId: '10553', titleEn: 'NEW YEAR SPECIAL OFFER - 2', price: 1205, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: 'New year special offer combo 2' },
  { itemId: '10581', titleEn: 'GENA COMBO 1', price: 3482.00, categoryId: FOOD_CAT_ID, groupId: FOOD_GROUP_ID, brandId: FOOD_BRAND_ID, description: 'Gena combo 1 - meat bundle' },
  { itemId: '10582', titleEn: 'GENA COMBO 2', price: 1241.65, categoryId: FOOD_CAT_ID, groupId: FOOD_GROUP_ID, brandId: FOOD_BRAND_ID, description: 'Gena combo 2' },
  { itemId: '21076', titleEn: 'GENA COMBO 3', price: 965.58, categoryId: FOOD_CAT_ID, groupId: FOOD_GROUP_ID, brandId: FOOD_BRAND_ID, description: 'Gena combo 3' },
  { itemId: '20222', titleEn: 'PURE BAKING SOD 100GM', price: 1644.96, categoryId: GROCERY_CAT_ID, groupId: GROCERY_GROUP_ID, brandId: GROCERY_BRAND_ID, description: 'Pure baking soda' },
];

async function main() {
  for (const item of comboData) {
    const existingItem = await prisma.item.findUnique({ where: { itemId: item.itemId } });
    if (!existingItem) {
      await prisma.item.create({
        data: {
          itemId: item.itemId,
          titleEn: item.titleEn,
          titleAm: item.titleEn,
          categoryId: item.categoryId,
          productId: item.groupId,
          brandId: item.brandId,
          salesUom: 'PCS',
          status: 1,
          specificationsEn: '',
          specificationsAm: '',
        },
      });
      console.log(`Created item: ${item.itemId} - ${item.titleEn}`);
    } else {
      console.log(`Item ${item.itemId} already exists, skipping`);
    }

    const existingPrice = await prisma.itemPrice.findUnique({
      where: { itemId_branchId: { itemId: item.itemId, branchId: 'BRANCH-001' } },
    });
    if (!existingPrice) {
      await prisma.itemPrice.create({
        data: {
          itemId: item.itemId,
          branchId: 'BRANCH-001',
          price: item.price,
          uom: 'PCS',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2030-12-31'),
          customerNo: 'SCO%',
        },
      });
      console.log(`Created price for: ${item.itemId} - ${item.price}`);
    } else {
      console.log(`Price for ${item.itemId} already exists, skipping`);
    }
  }

  const comboHeaders = await prisma.comboHeader.findMany();
  const existingNavNos = new Set(comboHeaders.map((h) => h.itemId));

  for (const item of comboData) {
    if (!existingNavNos.has(item.itemId)) {
      await prisma.comboHeader.create({
        data: {
          itemId: item.itemId,
          description: item.description,
          price: item.price,
          active: true,
        },
      });
      console.log(`Created combo: ${item.itemId} - ${item.titleEn}`);
    } else {
      console.log(`Combo ${item.itemId} already exists, skipping`);
    }
  }

  console.log('\nDone!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
