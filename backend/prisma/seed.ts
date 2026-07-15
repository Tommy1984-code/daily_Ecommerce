import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing product data for re-seeding
  await prisma.landMarkPrice.deleteMany();
  await prisma.deliveryDate.deleteMany();
  await prisma.timeRange.deleteMany();
  await prisma.landMark.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.comboLine.deleteMany();
  await prisma.comboHeader.deleteMany();
  await prisma.topItem.deleteMany();
  await prisma.itemPrice.deleteMany();
  await prisma.itemStockSnapshot.deleteMany();
  await prisma.item.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.productGroup.deleteMany();
  await prisma.category.deleteMany();

  const adminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Full system access', isSystem: true },
  });

  await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager', description: 'Order and product management', isSystem: false },
  });

  await prisma.role.upsert({
    where: { name: 'Staff' },
    update: {},
    create: { name: 'Staff', description: 'Order review only', isSystem: false },
  });

  const resources = ['orders', 'product', 'customers', 'staff', 'roles', 'reports'];
  for (const name of resources) {
    await prisma.resource.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} management` },
    });
  }

  const allResources = await prisma.resource.findMany();
  for (const resource of allResources) {
    await prisma.rolePermission.upsert({
      where: { roleId_resourceId: { roleId: adminRole.id, resourceId: resource.id } },
      update: { canRead: true, canWrite: true, canDelete: true },
      create: { roleId: adminRole.id, resourceId: resource.id, canRead: true, canWrite: true, canDelete: true },
    });
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.staff.upsert({
    where: { email: 'rootme1984@gmail.com' },
    update: {},
    create: { email: 'rootme1984@gmail.com', password: hashedPassword, name: 'Super Admin', roleId: adminRole.id },
  });

  // ── Catalog seed data: 3 categories × 2–3 groups × 2 brands × 2–3 items ──
  const now = new Date();

  // CATEGORY 1: Dairy Products
  const dairy = await prisma.category.create({
    data: {
      id: '00000000-0000-0000-0000-000000000001',
      titleEn: 'Dairy Products',
      titleAm: 'የወተት ተዋጽኦዎች',
      image: 'https://placehold.co/400x300?text=Dairy',
      syncedAt: now,
      productGroups: {
        create: [
          {
            id: '00000000-0000-0000-0000-000000000010',
            titleEn: 'Milk',
            titleAm: 'ወተት',
            image: 'https://placehold.co/400x300?text=Milk',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000020',
                  titleEn: 'Family',
                  titleAm: 'ፋሚሊ',
                  image: 'https://placehold.co/400x300?text=Family',
                  syncedAt: now,
                    items: {
                    create: [
                      { navItemNo: 'DM-MLK-001', titleEn: 'Fresh Milk 1L', titleAm: 'እርጥብ ወተት 1 ሊትር', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000010', uom: 'PCS', specificationsEn: 'Pasteurized fresh cow milk, 1 liter pack', specificationsAm: 'የተፀዳ እርጥብ የላም ወተት፣ 1 ሊትር ፓኬጅ', syncedAt: now },
                      { navItemNo: 'DM-MLK-002', titleEn: 'Fresh Milk 500ml', titleAm: 'እርጥብ ወተት 500ሚሊ', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000010', uom: 'PCS', specificationsEn: 'Pasteurized fresh cow milk, 500ml pack', specificationsAm: 'የተፀዳ እርጥብ የላም ወተት፣ 500ሚሊ ፓኬጅ', syncedAt: now },
                      { navItemNo: 'DM-MLK-003', titleEn: 'Powdered Milk 400g', titleAm: 'ዱቄት ወተት 400 ግራም', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000010', uom: 'PCS', specificationsEn: 'Instant powdered milk, 400g pack', specificationsAm: 'ፈጣን ዱቄት ወተት፣ 400 ግራም ፓኬጅ', syncedAt: now },
                    ],
                  },
                },
                {
                  id: '00000000-0000-0000-0000-000000000021',
                  titleEn: 'Scamark',
                  titleAm: 'ስካማርክ',
                  image: 'https://placehold.co/400x300?text=Scamark',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-MLK-004', titleEn: 'Organic Milk 1L', titleAm: 'ኦርጋኒክ ወተት 1 ሊትር', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000010', uom: 'PCS', specificationsEn: 'Organic pasteurized milk, 1 liter', specificationsAm: 'ኦርጋኒክ የተፀዳ ወተት፣ 1 ሊትር', syncedAt: now },
                      { navItemNo: 'DM-MLK-005', titleEn: 'Low Fat Milk 1L', titleAm: 'አነስተኛ ስብ ወተት 1 ሊትር', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000010', uom: 'PCS', specificationsEn: 'Low fat pasteurized milk, 1 liter', specificationsAm: 'አነስተኛ ስብ ያለው የተፀዳ ወተት፣ 1 ሊትር', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: '00000000-0000-0000-0000-000000000011',
            titleEn: 'Yogurt',
            titleAm: 'እርጎ',
            image: 'https://placehold.co/400x300?text=Yogurt',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000022',
                  titleEn: 'Family',
                  titleAm: 'ፋሚሊ',
                  image: 'https://placehold.co/400x300?text=Family+Yogurt',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-YOG-001', titleEn: 'Plain Yogurt 500g', titleAm: 'ጣፋጭ እርጎ 500 ግራም', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000011', uom: 'PCS', specificationsEn: 'Creamy plain yogurt, 500g container', specificationsAm: 'ለስላሳ ጣፋጭ እርጎ፣ 500 ግራም ኮንቴይነር', syncedAt: now },
                      { navItemNo: 'DM-YOG-002', titleEn: 'Fruit Yogurt 200g', titleAm: 'የፍራፍሬ እርጎ 200 ግራም', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000011', uom: 'PCS', specificationsEn: 'Mixed fruit flavored yogurt, 200g', specificationsAm: 'የተቀላቀለ የፍራፍሬ ጣዕም ያለው እርጎ፣ 200 ግራም', syncedAt: now },
                    ],
                  },
                },
                {
                  id: '00000000-0000-0000-0000-000000000023',
                  titleEn: 'Dermo',
                  titleAm: 'ደርሞ',
                  image: 'https://placehold.co/400x300?text=Dermo',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-YOG-003', titleEn: 'Greek Yogurt 400g', titleAm: 'ግሪክ እርጎ 400 ግራም', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000011', uom: 'PCS', specificationsEn: 'Thick Greek style yogurt, 400g', specificationsAm: 'ወፍራም የግሪክ አይነት እርጎ፣ 400 ግራም', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: '00000000-0000-0000-0000-000000000012',
            titleEn: 'Cheese',
            titleAm: 'አይብ',
            image: 'https://placehold.co/400x300?text=Cheese',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000024',
                  titleEn: 'Scamark',
                  titleAm: 'ስካማርክ',
                  image: 'https://placehold.co/400x300?text=Scamark+Cheese',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-CHS-001', titleEn: 'Cheddar Cheese 200g', titleAm: 'ቸዳር አይብ 200 ግራም', categoryId: '00000000-0000-0000-0000-000000000001', productGroupId: '00000000-0000-0000-0000-000000000012', uom: 'PCS', specificationsEn: 'Mild cheddar cheese block, 200g', specificationsAm: 'ለስላሳ ቸዳር አይብ ብሎክ፣ 200 ግራም', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // CATEGORY 2: Beverages
  const beverages = await prisma.category.create({
    data: {
      id: '00000000-0000-0000-0000-000000000002',
      titleEn: 'Beverages',
      titleAm: 'መጠጦች',
      image: 'https://placehold.co/400x300?text=Beverages',
      syncedAt: now,
      productGroups: {
        create: [
          {
            id: '00000000-0000-0000-0000-000000000013',
            titleEn: 'Soft Drinks',
            titleAm: 'ለስላሳ መጠጦች',
            image: 'https://placehold.co/400x300?text=Soft+Drinks',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000025',
                  titleEn: 'Coca-Cola',
                  titleAm: 'ኮካ ኮላ',
                  image: 'https://placehold.co/400x300?text=Coca+Cola',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-BEV-001', titleEn: 'Coca-Cola 330ml Can', titleAm: 'ኮካ ኮላ 330ሚሊ ቆርቆሮ', categoryId: '00000000-0000-0000-0000-000000000002', productGroupId: '00000000-0000-0000-0000-000000000013', uom: 'PCS', specificationsEn: 'Carbonated soft drink, 330ml can', specificationsAm: 'ካርቦናዊ ለስላሳ መጠጥ፣ 330ሚሊ ቆርቆሮ', syncedAt: now },
                      { navItemNo: 'DM-BEV-002', titleEn: 'Sprite 330ml Can', titleAm: 'ስፕራይት 330ሚሊ ቆርቆሮ', categoryId: '00000000-0000-0000-0000-000000000002', productGroupId: '00000000-0000-0000-0000-000000000013', uom: 'PCS', specificationsEn: 'Lemon-lime carbonated drink, 330ml', specificationsAm: 'የሎሚ-ኖሚ ካርቦናዊ መጠጥ፣ 330ሚሊ', syncedAt: now },
                    ],
                  },
                },
                {
                  id: '00000000-0000-0000-0000-000000000026',
                  titleEn: 'Pepsi',
                  titleAm: 'ፔፕሲ',
                  image: 'https://placehold.co/400x300?text=Pepsi',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-BEV-003', titleEn: 'Pepsi 330ml Can', titleAm: 'ፔፕሲ 330ሚሊ ቆርቆሮ', categoryId: '00000000-0000-0000-0000-000000000002', productGroupId: '00000000-0000-0000-0000-000000000013', uom: 'PCS', specificationsEn: 'Carbonated cola drink, 330ml can', specificationsAm: 'ካርቦናዊ ኮላ መጠጥ፣ 330ሚሊ ቆርቆሮ', syncedAt: now },
                      { navItemNo: 'DM-BEV-004', titleEn: 'Mirinda Orange 330ml', titleAm: 'ሚሪንዳ ብርቱካን 330ሚሊ', categoryId: '00000000-0000-0000-0000-000000000002', productGroupId: '00000000-0000-0000-0000-000000000013', uom: 'PCS', specificationsEn: 'Orange flavored carbonated drink, 330ml', specificationsAm: 'የብርቱካን ጣዕም ካርቦናዊ መጠጥ፣ 330ሚሊ', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: '00000000-0000-0000-0000-000000000014',
            titleEn: 'Juices',
            titleAm: 'ጭማቂዎች',
            image: 'https://placehold.co/400x300?text=Juices',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000027',
                  titleEn: 'Minute Maid',
                  titleAm: 'ሚኒት ሜድ',
                  image: 'https://placehold.co/400x300?text=Minute+Maid',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-BEV-005', titleEn: 'Orange Juice 1L', titleAm: 'የብርቱካን ጭማቂ 1 ሊትር', categoryId: '00000000-0000-0000-0000-000000000002', productGroupId: '00000000-0000-0000-0000-000000000014', uom: 'PCS', specificationsEn: '100% pure orange juice, 1 liter', specificationsAm: '100% ንጹህ የብርቱካን ጭማቂ፣ 1 ሊትር', syncedAt: now },
                      { navItemNo: 'DM-BEV-006', titleEn: 'Apple Juice 1L', titleAm: 'የአፕል ጭማቂ 1 ሊትር', categoryId: '00000000-0000-0000-0000-000000000002', productGroupId: '00000000-0000-0000-0000-000000000014', uom: 'PCS', specificationsEn: '100% pure apple juice, 1 liter', specificationsAm: '100% ንጹህ የአፕል ጭማቂ፣ 1 ሊትር', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // CATEGORY 3: Snacks
  const snacks = await prisma.category.create({
    data: {
      id: '00000000-0000-0000-0000-000000000003',
      titleEn: 'Snacks',
      titleAm: 'መክሰስ',
      image: 'https://placehold.co/400x300?text=Snacks',
      syncedAt: now,
      productGroups: {
        create: [
          {
            id: '00000000-0000-0000-0000-000000000015',
            titleEn: 'Chips & Crisps',
            titleAm: 'ቺፕስ እና ክሪስፕስ',
            image: 'https://placehold.co/400x300?text=Chips',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000028',
                  titleEn: 'Lays',
                  titleAm: 'ላይስ',
                  image: 'https://placehold.co/400x300?text=Lays',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-SNK-001', titleEn: 'Lays Classic 100g', titleAm: 'ላይስ ክላሲክ 100 ግራም', categoryId: '00000000-0000-0000-0000-000000000003', productGroupId: '00000000-0000-0000-0000-000000000015', uom: 'PCS', specificationsEn: 'Classic salted potato chips, 100g', specificationsAm: 'ክላሲክ የተቀመመ የድንች ቺፕስ፣ 100 ግራም', syncedAt: now },
                      { navItemNo: 'DM-SNK-002', titleEn: 'Lays BBQ 100g', titleAm: 'ላይስ ባርቤኪው 100 ግራም', categoryId: '00000000-0000-0000-0000-000000000003', productGroupId: '00000000-0000-0000-0000-000000000015', uom: 'PCS', specificationsEn: 'BBQ flavored potato chips, 100g', specificationsAm: 'የባርቤኪው ጣዕም ያለው የድንች ቺፕስ፣ 100 ግራም', syncedAt: now },
                    ],
                  },
                },
                {
                  id: '00000000-0000-0000-0000-000000000029',
                  titleEn: 'Doritos',
                  titleAm: 'ዶሪቶስ',
                  image: 'https://placehold.co/400x300?text=Doritos',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-SNK-003', titleEn: 'Doritos Nacho 120g', titleAm: 'ዶሪቶስ ናቾ 120 ግራም', categoryId: '00000000-0000-0000-0000-000000000003', productGroupId: '00000000-0000-0000-0000-000000000015', uom: 'PCS', specificationsEn: 'Nacho cheese flavored tortilla chips, 120g', specificationsAm: 'የናቾ አይብ ጣዕም ያለው ቶርቲያ ቺፕስ፣ 120 ግራም', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: '00000000-0000-0000-0000-000000000016',
            titleEn: 'Chocolate & Candy',
            titleAm: 'ቸኮሌት እና ከረሜላ',
            image: 'https://placehold.co/400x300?text=Chocolate',
            syncedAt: now,
            brands: {
              create: [
                {
                  id: '00000000-0000-0000-0000-000000000030',
                  titleEn: 'Mars',
                  titleAm: 'ማርስ',
                  image: 'https://placehold.co/400x300?text=Mars',
                  syncedAt: now,
                  items: {
                    create: [
                      { navItemNo: 'DM-SNK-004', titleEn: 'Mars Chocolate 51g', titleAm: 'ማርስ ቸኮሌት 51 ግራም', categoryId: '00000000-0000-0000-0000-000000000003', productGroupId: '00000000-0000-0000-0000-000000000016', uom: 'PCS', specificationsEn: 'Milk chocolate with caramel and nougat, 51g', specificationsAm: 'የወተት ቸኮሌት ከካራሜል እና ኑጋ ጋር፣ 51 ግራም', syncedAt: now },
                      { navItemNo: 'DM-SNK-005', titleEn: 'Snickers 50g', titleAm: 'ስኒከርስ 50 ግራም', categoryId: '00000000-0000-0000-0000-000000000003', productGroupId: '00000000-0000-0000-0000-000000000016', uom: 'PCS', specificationsEn: 'Chocolate bar with peanuts, caramel and nougat, 50g', specificationsAm: 'የቸኮሌት ባር ከኦቾሎኒ፣ ካራሜል እና ኑጋ ጋር፣ 50 ግራም', syncedAt: now },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── Prices ──
  const priceData = [
    { navItemNo: 'DM-MLK-001', price: 75.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-MLK-002', price: 42.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-MLK-003', price: 180.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-MLK-004', price: 95.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-MLK-005', price: 78.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-YOG-001', price: 55.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-YOG-002', price: 25.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-YOG-003', price: 65.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-CHS-001', price: 120.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-BEV-001', price: 22.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-BEV-002', price: 22.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-BEV-003', price: 20.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-BEV-004', price: 20.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-BEV-005', price: 85.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-BEV-006', price: 85.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-SNK-001', price: 35.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-SNK-002', price: 35.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-SNK-003', price: 40.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-SNK-004', price: 30.00, branchId: 'BRANCH-001' },
    { navItemNo: 'DM-SNK-005', price: 30.00, branchId: 'BRANCH-001' },
  ];

  for (const p of priceData) {
    await prisma.itemPrice.upsert({
      where: { navItemNo_branchId: { navItemNo: p.navItemNo, branchId: p.branchId } },
      update: { price: p.price },
      create: { navItemNo: p.navItemNo, branchId: p.branchId, price: p.price },
    });
  }

  // ── Discounts (items with discount percentage) ──
  const discountItems = ['DM-MLK-001', 'DM-YOG-001', 'DM-BEV-001', 'DM-SNK-001'];
  for (const navItemNo of discountItems) {
    const existing = await prisma.itemPrice.findFirst({
      where: { navItemNo, branchId: 'BRANCH-001' },
    });
    if (existing) {
      await prisma.itemPrice.update({
        where: { id: existing.id },
        data: { discountPct: 10 },
      });
    }
  }

  // ── Featured Product Groups ──
  await prisma.productGroup.update({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    data: { featured: true, featuredImage: 'https://placehold.co/1200x400?text=Milk+Banner' },
  });
  await prisma.productGroup.update({
    where: { id: '00000000-0000-0000-0000-000000000013' },
    data: { featured: true, featuredImage: 'https://placehold.co/1200x400?text=Soft+Drinks+Banner' },
  });

  // ── Featured Brands ──
  await prisma.brand.update({
    where: { id: '00000000-0000-0000-0000-000000000020' },
    data: { featured: true },
  });
  await prisma.brand.update({
    where: { id: '00000000-0000-0000-0000-000000000025' },
    data: { featured: true },
  });

  // ── Combo Header + Lines ──
  const combo = await prisma.comboHeader.create({
    data: {
      navItemNo: 'DM-MLK-001',
      description: 'Family Milk Pack',
      price: 150.00,
      active: true,
      lines: {
        create: [
          { navItemNo: 'DM-MLK-001', itemDescription: 'Fresh Milk 1L', quantity: 2, salesUom: 'PCS' },
          { navItemNo: 'DM-YOG-001', itemDescription: 'Plain Yogurt 500g', quantity: 1, salesUom: 'PCS' },
        ],
      },
    },
  });

  await prisma.comboHeader.create({
    data: {
      navItemNo: 'DM-BEV-001',
      description: 'Party Drink Pack',
      price: 80.00,
      active: true,
      lines: {
        create: [
          { navItemNo: 'DM-BEV-001', itemDescription: 'Coca-Cola 330ml Can', quantity: 4, salesUom: 'PCS' },
          { navItemNo: 'DM-BEV-003', itemDescription: 'Pepsi 330ml Can', quantity: 4, salesUom: 'PCS' },
        ],
      },
    },
  });

  // ── Top Items ──
  await prisma.topItem.create({ data: { navItemNo: 'DM-MLK-001' } });
  await prisma.topItem.create({ data: { navItemNo: 'DM-BEV-001' } });
  await prisma.topItem.create({ data: { navItemNo: 'DM-SNK-001' } });

  // ── Land Marks ──
  await prisma.landMark.create({
    data: { code: 'LM-001', titleEn: 'Bole', titleAm: 'ቦሌ', latitude: 9.0141667, longitude: 38.7894444 },
  });
  await prisma.landMark.create({
    data: { code: 'LM-002', titleEn: 'Piassa', titleAm: 'ፒያሳ', latitude: 9.0358333, longitude: 38.7419444 },
  });
  await prisma.landMark.create({
    data: { code: 'LM-003', titleEn: 'Megenagna', titleAm: 'መገናኛ', latitude: 9.0302778, longitude: 38.7763889 },
  });

  // ── Shops ──
  await prisma.shop.create({
    data: { locationCode: 'SH-001', titleEn: 'Bole Branch', titleAm: 'የቦሌ ቅርንጫፍ', latitude: 9.0141667, longitude: 38.7894444 },
  });
  await prisma.shop.create({
    data: { locationCode: 'SH-002', titleEn: 'Piassa Branch', titleAm: 'የፒያሳ ቅርንጫፍ', latitude: 9.0358333, longitude: 38.7419444 },
  });
  await prisma.shop.create({
    data: { locationCode: 'SH-003', titleEn: 'Megenagna Branch', titleAm: 'የመገናኛ ቅርንጫፍ', latitude: 9.0302778, longitude: 38.7763889 },
  });

  // ── Delivery Dates ──
  const date1 = await prisma.deliveryDate.create({ data: { titleEn: 'Monday', titleAm: 'ሰኞ' } });
  const date2 = await prisma.deliveryDate.create({ data: { titleEn: 'Wednesday', titleAm: 'ረቡዕ' } });
  const date3 = await prisma.deliveryDate.create({ data: { titleEn: 'Friday', titleAm: 'ዓርብ' } });

  // ── Time Ranges ──
  const tr1 = await prisma.timeRange.create({ data: { timeRange: '8:00 AM - 10:00 AM' } });
  const tr2 = await prisma.timeRange.create({ data: { timeRange: '10:00 AM - 12:00 PM' } });
  const tr3 = await prisma.timeRange.create({ data: { timeRange: '2:00 PM - 4:00 PM' } });

  // ── Land Mark Prices ──
  await prisma.landMarkPrice.create({
    data: { dateId: date1.id, timeRange: '8:00 AM - 10:00 AM', landMarkCode: 'LM-001', shopCode: 'SH-001', price: 15.00 },
  });
  await prisma.landMarkPrice.create({
    data: { dateId: date1.id, timeRange: '8:00 AM - 10:00 AM', landMarkCode: 'LM-001', shopCode: 'SH-002', price: 20.00 },
  });
  await prisma.landMarkPrice.create({
    data: { dateId: date2.id, timeRange: '10:00 AM - 12:00 PM', landMarkCode: 'LM-002', shopCode: 'SH-002', price: 10.00 },
  });
  await prisma.landMarkPrice.create({
    data: { dateId: date3.id, timeRange: '2:00 PM - 4:00 PM', landMarkCode: 'LM-003', shopCode: 'SH-003', price: 25.00 },
  });

  console.log('✅ Seed complete: rootme1984@gmail.com (role: Super Admin)');
  console.log(`   Categories: 3 (Dairy, Beverages, Snacks)`);
  console.log(`   Product Groups: 7`);
  console.log(`   Brands: 10`);
  console.log(`   Items: ${priceData.length}`);
  console.log(`   Prices: ${priceData.length}`);
  console.log(`   Discounts: ${discountItems.length}`);
  console.log(`   Featured Groups: 2`);
  console.log(`   Featured Brands: 2`);
  console.log(`   Combos: 2`);
  console.log(`   Top Items: 3`);
  console.log(`   Land Marks: 3`);
  console.log(`   Shops: 3`);
  console.log(`   Land Mark Prices: 4`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
