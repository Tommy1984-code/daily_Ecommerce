import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.landMarkPrice.deleteMany();
  await prisma.deliveryDate.deleteMany();
  await prisma.timeRange.deleteMany();
  await prisma.landMark.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.comboLine.deleteMany();
  await prisma.comboHeader.deleteMany();
  await prisma.priceDiscount.deleteMany();
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

  const now = new Date();

  // ============================================================
  // CREATE CATEGORIES
  // ============================================================
  const cat1 = await prisma.category.create({ data: { categoryId: 'CAT-001', titleEn: 'Drinks', titleAm: 'መጠጦች', image: null, syncedAt: now } });
  const cat2 = await prisma.category.create({ data: { categoryId: 'CAT-002', titleEn: 'Food Items', titleAm: 'የምግብ ዝርዝር', image: null, syncedAt: now } });
  const cat3 = await prisma.category.create({ data: { categoryId: 'CAT-003', titleEn: 'Grocery', titleAm: 'የታሸጉ ምግቦች', image: null, syncedAt: now } });

  // ============================================================
  // CREATE PRODUCT GROUPS (Category 2)
  // ============================================================
  const grp1 = await prisma.productGroup.create({ data: { productId: 'PG-001', titleEn: 'Coffee & Tea', titleAm: 'ቡና እና ሻይ', categoryId: cat1.id, image: null, syncedAt: now } });
  const grp2 = await prisma.productGroup.create({ data: { productId: 'PG-002', titleEn: 'Carbonated Drinks', titleAm: 'የለስላሳ መጠጦች', categoryId: cat1.id, image: null, syncedAt: now } });
  const grp3 = await prisma.productGroup.create({ data: { productId: 'PG-003', titleEn: 'Juices', titleAm: 'ጭማቂዎች', categoryId: cat1.id, image: null, syncedAt: now } });
  const grp4 = await prisma.productGroup.create({ data: { productId: 'PG-004', titleEn: 'Water', titleAm: 'ውሃ', categoryId: cat1.id, image: null, syncedAt: now } });

  const grp5 = await prisma.productGroup.create({ data: { productId: 'PG-005', titleEn: 'Dairy Products', titleAm: 'የወተት ተዋጽኦዎች', categoryId: cat2.id, image: null, syncedAt: now } });
  const grp6 = await prisma.productGroup.create({ data: { productId: 'PG-006', titleEn: 'Meat & Poultry', titleAm: 'ስጋ እና ዶሮና እንቁላል', categoryId: cat2.id, image: null, syncedAt: now } });
  const grp7 = await prisma.productGroup.create({ data: { productId: 'PG-007', titleEn: 'Vegetables', titleAm: 'አትክልት', categoryId: cat2.id, image: null, syncedAt: now } });
  const grp8 = await prisma.productGroup.create({ data: { productId: 'PG-008', titleEn: 'Fruits', titleAm: 'ፍሬሽ ፍራፍሬ', categoryId: cat2.id, image: null, syncedAt: now } });

  const grp9 = await prisma.productGroup.create({ data: { productId: 'PG-009', titleEn: 'Canned Food', titleAm: 'የታሸጉ ምግቦች', categoryId: cat3.id, image: null, syncedAt: now } });
  const grp10 = await prisma.productGroup.create({ data: { productId: 'PG-010', titleEn: 'Jam, Spreads & Honey', titleAm: 'ማልማላት እና ማር', categoryId: cat3.id, image: null, syncedAt: now } });
  const grp11 = await prisma.productGroup.create({ data: { productId: 'PG-011', titleEn: 'Cooking Oil', titleAm: 'የምግብ ዘይት', categoryId: cat3.id, image: null, syncedAt: now } });
  const grp12 = await prisma.productGroup.create({ data: { productId: 'PG-012', titleEn: 'Pasta, Rice & Noodles', titleAm: 'ፓስታ ፣ ሩዝና ኑድል', categoryId: cat3.id, image: null, syncedAt: now } });
  const grp13 = await prisma.productGroup.create({ data: { productId: 'PG-013', titleEn: 'Plastic bag & foam trays', titleAm: 'ፓስታ ፣ ሩዝና ኑድል', categoryId: cat3.id, image: null, syncedAt: now } });
  const grp14 = await prisma.productGroup.create({ data: { productId: 'PG-014', titleEn: 'Fuel', titleAm: 'አዳዲስ አበበ', categoryId: cat3.id, image: null, syncedAt: now } });

  // ============================================================
  // CREATE BRANDS (Category 3)
  // ============================================================
  const brd1 = await prisma.brand.create({ data: { brandId: 'BR-001', titleEn: 'Roasted', titleAm: 'የተቆላ ቡና', productId: grp1.id, image: null, syncedAt: now } });
  const brd2 = await prisma.brand.create({ data: { brandId: 'BR-002', titleEn: 'Instant', titleAm: 'ማስጀመሪያ', productId: grp1.id, image: null, syncedAt: now } });

  const brd3 = await prisma.brand.create({ data: { brandId: 'BR-003', titleEn: 'Coca-Cola', titleAm: 'ኮካ-ኮላ', productId: grp2.id, image: null, syncedAt: now } });
  const brd4 = await prisma.brand.create({ data: { brandId: 'BR-004', titleEn: 'Pepsi', titleAm: 'ፔፕሲ', productId: grp2.id, image: null, syncedAt: now } });
  const brd5 = await prisma.brand.create({ data: { brandId: 'BR-005', titleEn: 'Mirinda', titleAm: 'ሚሪንዳ', productId: grp2.id, image: null, syncedAt: now } });

  const brd6 = await prisma.brand.create({ data: { brandId: 'BR-006', titleEn: 'Minute Maid', titleAm: 'ሚኒት ሜድ', productId: grp3.id, image: null, syncedAt: now } });
  const brd7 = await prisma.brand.create({ data: { brandId: 'BR-007', titleEn: 'Fresh Juice', titleAm: 'ጣፋጭ ጭማቂ', productId: grp3.id, image: null, syncedAt: now } });

  const brd8 = await prisma.brand.create({ data: { brandId: 'BR-008', titleEn: 'Bottled Water', titleAm: 'በቦተል ውሃ', productId: grp4.id, image: null, syncedAt: now } });

  const brd9 = await prisma.brand.create({ data: { brandId: 'BR-009', titleEn: 'Milk', titleAm: 'ወተት', productId: grp5.id, image: null, syncedAt: now } });
  const brd10 = await prisma.brand.create({ data: { brandId: 'BR-010', titleEn: 'Yogurt', titleAm: 'እርጎ', productId: grp5.id, image: null, syncedAt: now } });
  const brd11 = await prisma.brand.create({ data: { brandId: 'BR-011', titleEn: 'Cheese', titleAm: 'አይብ', productId: grp5.id, image: null, syncedAt: now } });

  const brd12 = await prisma.brand.create({ data: { brandId: 'BR-012', titleEn: 'Beef', titleAm: 'ስጋ', productId: grp6.id, image: null, syncedAt: now } });
  const brd13 = await prisma.brand.create({ data: { brandId: 'BR-013', titleEn: 'Poultry and Egg', titleAm: 'ዶሮና እንቁላል', productId: grp6.id, image: null, syncedAt: now } });

  const brd14 = await prisma.brand.create({ data: { brandId: 'BR-014', titleEn: 'Leafy Vegetables', titleAm: 'ቅጣላቅጠል አትልት', productId: grp7.id, image: null, syncedAt: now } });
  const brd15 = await prisma.brand.create({ data: { brandId: 'BR-015', titleEn: 'Other Vegetables', titleAm: 'ሌሎች አትክቶች', productId: grp7.id, image: null, syncedAt: now } });

  const brd16 = await prisma.brand.create({ data: { brandId: 'BR-016', titleEn: 'Mangoes & Avocado', titleAm: 'ማንጎ እና አቮካዶ', productId: grp8.id, image: null, syncedAt: now } });
  const brd17 = await prisma.brand.create({ data: { brandId: 'BR-017', titleEn: 'Oranges & Lemon', titleAm: 'ብርቱካን እና ሊሞን', productId: grp8.id, image: null, syncedAt: now } });
  const brd18 = await prisma.brand.create({ data: { brandId: 'BR-018', titleEn: 'Papaya & Melons', titleAm: 'ፓፓያ እና ሜለን', productId: grp8.id, image: null, syncedAt: now } });
  const brd19 = await prisma.brand.create({ data: { brandId: 'BR-019', titleEn: 'Others', titleAm: 'ሌሎች', productId: grp8.id, image: null, syncedAt: now } });

  const brd20 = await prisma.brand.create({ data: { brandId: 'BR-020', titleEn: 'Fruits & Veg.', titleAm: 'ፍሬሽ እና አትክልት', productId: grp9.id, image: null, syncedAt: now } });

  const brd21 = await prisma.brand.create({ data: { brandId: 'BR-021', titleEn: 'Margarine', titleAm: 'ማርጋሪን', productId: grp10.id, image: null, syncedAt: now } });

  const brd22 = await prisma.brand.create({ data: { brandId: 'BR-022', titleEn: 'Olive', titleAm: 'ወይራ', productId: grp11.id, image: null, syncedAt: now } });
  const brd23 = await prisma.brand.create({ data: { brandId: 'BR-023', titleEn: 'Others', titleAm: 'ሌሎች', productId: grp11.id, image: null, syncedAt: now } });

  const brd24 = await prisma.brand.create({ data: { brandId: 'BR-024', titleEn: 'Pasta & Macaroni', titleAm: 'ፓስታ እና ማኮሮኒ', productId: grp12.id, image: null, syncedAt: now } });
  const brd25 = await prisma.brand.create({ data: { brandId: 'BR-025', titleEn: 'Rice & Noodles', titleAm: 'ሩዝ እና ኑድል', productId: grp12.id, image: null, syncedAt: now } });

  const brd26 = await prisma.brand.create({ data: { brandId: 'BR-026', titleEn: 'Plastic bag & foam trays', titleAm: 'ፓስታል ባግ እና ፎም ትሬይ', productId: grp13.id, image: null, syncedAt: now } });

  const brd27 = await prisma.brand.create({ data: { brandId: 'BR-027', titleEn: 'Fuel', titleAm: 'ነዳጅ', productId: grp14.id, image: null, syncedAt: now } });

  // ============================================================
  // CREATE ITEMS
  // ============================================================
  const itemsData = [
    // Coffee & Tea - Roasted
    { itemId: 'ITM-001', titleEn: 'Roasted Coffee Beans', titleAm: 'የተቆላ ቡና ሁሉን', salesUom: 'KG', categoryId: cat1.id, productId: grp1.id, brandId: brd1.id },
    { itemId: 'ITM-002', titleEn: 'Ground Coffee', titleAm: 'የተጠቀሰ ቡና', salesUom: 'KG', categoryId: cat1.id, productId: grp1.id, brandId: brd1.id },
    { itemId: 'ITM-003', titleEn: 'Tea Bags', titleAm: 'የሻይ ባግስ', salesUom: 'PCS', categoryId: cat1.id, productId: grp1.id, brandId: brd1.id },
    // Coffee & Tea - Instant
    { itemId: 'ITM-004', titleEn: 'Instant Coffee', titleAm: 'ፈጣን ቡና', salesUom: 'PCS', categoryId: cat1.id, productId: grp1.id, brandId: brd2.id },
    { itemId: 'ITM-005', titleEn: 'Instant Tea', titleAm: 'ፈጣን ሻይ', salesUom: 'PCS', categoryId: cat1.id, productId: grp1.id, brandId: brd2.id },
    // Carbonated - Coca-Cola
    { itemId: 'ITM-006', titleEn: 'Coca-Cola 330ml', titleAm: 'Coca-Cola 330ml', salesUom: 'CAN', categoryId: cat1.id, productId: grp2.id, brandId: brd3.id },
    { itemId: 'ITM-007', titleEn: 'Coca-Cola 500ml', titleAm: 'Coca-Cola 500ml', salesUom: 'BTL', categoryId: cat1.id, productId: grp2.id, brandId: brd3.id },
    { itemId: 'ITM-008', titleEn: 'Coca-Cola 1L', titleAm: 'Coca-Cola 1L', salesUom: 'BTL', categoryId: cat1.id, productId: grp2.id, brandId: brd3.id },
    // Carbonated - Pepsi
    { itemId: 'ITM-009', titleEn: 'Pepsi 330ml', titleAm: 'Pepsi 330ml', salesUom: 'CAN', categoryId: cat1.id, productId: grp2.id, brandId: brd4.id },
    { itemId: 'ITM-010', titleEn: 'Pepsi 500ml', titleAm: 'Pepsi 500ml', salesUom: 'BTL', categoryId: cat1.id, productId: grp2.id, brandId: brd4.id },
    // Carbonated - Mirinda
    { itemId: 'ITM-011', titleEn: 'Mirinda Orange 330ml', titleAm: 'Mirinda Orange 330ml', salesUom: 'CAN', categoryId: cat1.id, productId: grp2.id, brandId: brd5.id },
    // Juices - Minute Maid
    { itemId: 'ITM-012', titleEn: 'Orange Juice 1L', titleAm: 'Orange Juice 1L', salesUom: 'BTL', categoryId: cat1.id, productId: grp3.id, brandId: brd6.id },
    { itemId: 'ITM-013', titleEn: 'Apple Juice 1L', titleAm: 'Apple Juice 1L', salesUom: 'BTL', categoryId: cat1.id, productId: grp3.id, brandId: brd6.id },
    { itemId: 'ITM-014', titleEn: 'Mango Juice 1L', titleAm: 'Mango Juice 1L', salesUom: 'BTL', categoryId: cat1.id, productId: grp3.id, brandId: brd6.id },
    // Juices - Fresh
    { itemId: 'ITM-015', titleEn: 'Fresh Orange Juice', titleAm: 'Fresh Orange Juice', salesUom: 'CUP', categoryId: cat1.id, productId: grp3.id, brandId: brd7.id },
    { itemId: 'ITM-016', titleEn: 'Fresh Mango Juice', titleAm: 'Fresh Mango Juice', salesUom: 'CUP', categoryId: cat1.id, productId: grp3.id, brandId: brd7.id },
    // Water
    { itemId: 'ITM-017', titleEn: 'Water 500ml', titleAm: 'Water 500ml', salesUom: 'BTL', categoryId: cat1.id, productId: grp4.id, brandId: brd8.id },
    { itemId: 'ITM-018', titleEn: 'Water 1.5L', titleAm: 'Water 1.5L', salesUom: 'BTL', categoryId: cat1.id, productId: grp4.id, brandId: brd8.id },
    { itemId: 'ITM-019', titleEn: 'Sparkling Water', titleAm: 'Sparkling Water', salesUom: 'BTL', categoryId: cat1.id, productId: grp4.id, brandId: brd8.id },
    // Dairy - Milk
    { itemId: 'ITM-020', titleEn: 'Fresh Milk 1L', titleAm: 'Fresh Milk 1L', salesUom: 'LTR', categoryId: cat2.id, productId: grp5.id, brandId: brd9.id },
    { itemId: 'ITM-021', titleEn: 'Fresh Milk 500ml', titleAm: 'Fresh Milk 500ml', salesUom: 'ML', categoryId: cat2.id, productId: grp5.id, brandId: brd9.id },
    { itemId: 'ITM-022', titleEn: 'Powdered Milk 400g', titleAm: 'Powdered Milk 400g', salesUom: 'G', categoryId: cat2.id, productId: grp5.id, brandId: brd9.id },
    // Dairy - Yogurt
    { itemId: 'ITM-023', titleEn: 'Plain Yogurt 500g', titleAm: 'Plain Yogurt 500g', salesUom: 'G', categoryId: cat2.id, productId: grp5.id, brandId: brd10.id },
    { itemId: 'ITM-024', titleEn: 'Fruit Yogurt 200g', titleAm: 'Fruit Yogurt 200g', salesUom: 'G', categoryId: cat2.id, productId: grp5.id, brandId: brd10.id },
    // Dairy - Cheese
    { itemId: 'ITM-025', titleEn: 'Cheddar Cheese 200g', titleAm: 'Cheddar Cheese 200g', salesUom: 'G', categoryId: cat2.id, productId: grp5.id, brandId: brd11.id },
    { itemId: 'ITM-026', titleEn: 'Mozzarella 200g', titleAm: 'Mozzarella 200g', salesUom: 'G', categoryId: cat2.id, productId: grp5.id, brandId: brd11.id },
    // Meat - Beef
    { itemId: 'ITM-027', titleEn: 'Beef 1kg', titleAm: 'Beef 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp6.id, brandId: brd12.id },
    { itemId: 'ITM-028', titleEn: 'Minced Beef 500g', titleAm: 'Minced Beef 500g', salesUom: 'G', categoryId: cat2.id, productId: grp6.id, brandId: brd12.id },
    // Meat - Poultry
    { itemId: 'ITM-029', titleEn: 'Whole Chicken 1kg', titleAm: 'Whole Chicken 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp6.id, brandId: brd13.id },
    { itemId: 'ITM-030', titleEn: 'Eggs 12pcs', titleAm: 'Eggs 12pcs', salesUom: 'PCS', categoryId: cat2.id, productId: grp6.id, brandId: brd13.id },
    // Vegetables - Leafy
    { itemId: 'ITM-031', titleEn: 'Spinach 1kg', titleAm: 'Spinach 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp7.id, brandId: brd14.id },
    { itemId: 'ITM-032', titleEn: 'Lettuce 1pc', titleAm: 'Lettuce 1pc', salesUom: 'PCS', categoryId: cat2.id, productId: grp7.id, brandId: brd14.id },
    // Vegetables - Other
    { itemId: 'ITM-033', titleEn: 'Tomato 1kg', titleAm: 'Tomato 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp7.id, brandId: brd15.id },
    { itemId: 'ITM-034', titleEn: 'Onion 1kg', titleAm: 'Onion 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp7.id, brandId: brd15.id },
    { itemId: 'ITM-035', titleEn: 'Potato 1kg', titleAm: 'Potato 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp7.id, brandId: brd15.id },
    // Fruits - Mangoes & Avocado
    { itemId: 'ITM-036', titleEn: 'Mango 1kg', titleAm: 'Mango 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd16.id },
    { itemId: 'ITM-037', titleEn: 'Avocado 1kg', titleAm: 'Avocado 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd16.id },
    // Fruits - Oranges & Lemon
    { itemId: 'ITM-038', titleEn: 'Orange 1kg', titleAm: 'Orange 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd17.id },
    { itemId: 'ITM-039', titleEn: 'Lemon 1kg', titleAm: 'Lemon 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd17.id },
    // Fruits - Papaya & Melons
    { itemId: 'ITM-040', titleEn: 'Papaya 1kg', titleAm: 'Papaya 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd18.id },
    { itemId: 'ITM-041', titleEn: 'Watermelon 1kg', titleAm: 'Watermelon 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd18.id },
    // Fruits - Others
    { itemId: 'ITM-042', titleEn: 'Banana 1kg', titleAm: 'Banana 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd19.id },
    { itemId: 'ITM-043', titleEn: 'Apple 1kg', titleAm: 'Apple 1kg', salesUom: 'KG', categoryId: cat2.id, productId: grp8.id, brandId: brd19.id },
    // Canned Food
    { itemId: 'ITM-044', titleEn: 'Canned Peas 400g', titleAm: 'Canned Peas 400g', salesUom: 'CAN', categoryId: cat3.id, productId: grp9.id, brandId: brd20.id },
    { itemId: 'ITM-045', titleEn: 'Canned Corn 400g', titleAm: 'Canned Corn 400g', salesUom: 'CAN', categoryId: cat3.id, productId: grp9.id, brandId: brd20.id },
    // Jam, Spreads & Honey
    { itemId: 'ITM-046', titleEn: 'Margarine 250g', titleAm: 'Margarine 250g', salesUom: 'G', categoryId: cat3.id, productId: grp10.id, brandId: brd21.id },
    { itemId: 'ITM-047', titleEn: 'Margarine 500g', titleAm: 'Margarine 500g', salesUom: 'G', categoryId: cat3.id, productId: grp10.id, brandId: brd21.id },
    // Cooking Oil - Olive
    { itemId: 'ITM-048', titleEn: 'Olive Oil 1L', titleAm: 'Olive Oil 1L', salesUom: 'LTR', categoryId: cat3.id, productId: grp11.id, brandId: brd22.id },
    { itemId: 'ITM-049', titleEn: 'Olive Oil 500ml', titleAm: 'Olive Oil 500ml', salesUom: 'ML', categoryId: cat3.id, productId: grp11.id, brandId: brd22.id },
    // Cooking Oil - Others
    { itemId: 'ITM-050', titleEn: 'Sunflower Oil 1L', titleAm: 'Sunflower Oil 1L', salesUom: 'LTR', categoryId: cat3.id, productId: grp11.id, brandId: brd23.id },
    { itemId: 'ITM-051', titleEn: 'Palm Oil 1L', titleAm: 'Palm Oil 1L', salesUom: 'LTR', categoryId: cat3.id, productId: grp11.id, brandId: brd23.id },
    // Pasta & Macaroni
    { itemId: 'ITM-052', titleEn: 'Spaghetti 500g', titleAm: 'Spaghetti 500g', salesUom: 'G', categoryId: cat3.id, productId: grp12.id, brandId: brd24.id },
    { itemId: 'ITM-053', titleEn: 'Macaroni 500g', titleAm: 'Macaroni 500g', salesUom: 'G', categoryId: cat3.id, productId: grp12.id, brandId: brd24.id },
    // Rice & Noodles
    { itemId: 'ITM-054', titleEn: 'Rice 1kg', titleAm: 'Rice 1kg', salesUom: 'KG', categoryId: cat3.id, productId: grp12.id, brandId: brd25.id },
    { itemId: 'ITM-055', titleEn: 'Instant Noodles', titleAm: 'Instant Noodles', salesUom: 'PCS', categoryId: cat3.id, productId: grp12.id, brandId: brd25.id },
    // Plastic bag & foam trays
    { itemId: 'ITM-056', titleEn: 'Plastic Bags 100pcs', titleAm: 'Plastic Bags 100pcs', salesUom: 'PKT', categoryId: cat3.id, productId: grp13.id, brandId: brd26.id },
    { itemId: 'ITM-057', titleEn: 'Foam Trays 50pcs', titleAm: 'Foam Trays 50pcs', salesUom: 'PKT', categoryId: cat3.id, productId: grp13.id, brandId: brd26.id },
    // Fuel
    { itemId: 'ITM-058', titleEn: 'Charcoal 5kg', titleAm: 'Charcoal 5kg', salesUom: 'KG', categoryId: cat3.id, productId: grp14.id, brandId: brd27.id },
    { itemId: 'ITM-059', titleEn: 'Firewood Bundle', titleAm: 'Firewood Bundle', salesUom: 'BDL', categoryId: cat3.id, productId: grp14.id, brandId: brd27.id },
  ];

  for (const item of itemsData) {
    await prisma.item.create({
      data: {
        ...item,
        specificationsEn: '',
        specificationsAm: '',
        status: 1,
        image: null,
        syncedAt: now,
      },
    });
  }

  // ============================================================
  // PRICES
  // ============================================================
  const allItems = await prisma.item.findMany({ select: { itemId: true } });
  for (const item of allItems) {
    await prisma.itemPrice.upsert({
      where: { itemId_branchId: { itemId: item.itemId, branchId: 'BRANCH-001' } },
      update: { price: Math.floor(Math.random() * 500) + 10 },
      create: { itemId: item.itemId, branchId: 'BRANCH-001', price: Math.floor(Math.random() * 500) + 10 },
    });
  }

  // Discounts on some items
  const discountTargets = [
    { itemId: 'ITM-006', pct: 15 },
    { itemId: 'ITM-009', pct: 10 },
    { itemId: 'ITM-012', pct: 20 },
    { itemId: 'ITM-020', pct: 5 },
    { itemId: 'ITM-027', pct: 12 },
    { itemId: 'ITM-033', pct: 8 },
    { itemId: 'ITM-038', pct: 25 },
    { itemId: 'ITM-044', pct: 10 },
    { itemId: 'ITM-048', pct: 18 },
    { itemId: 'ITM-054', pct: 7 },
  ];
  for (const target of discountTargets) {
    const exists = await prisma.priceDiscount.findFirst({ where: { itemId: target.itemId } });
    if (!exists) {
      await prisma.priceDiscount.create({
        data: { itemId: target.itemId, discountPer: target.pct },
      });
    }
  }

  // Featured Product Groups
  const allGroups = await prisma.productGroup.findMany({ take: 2, select: { id: true } });
  for (const group of allGroups) {
    await prisma.productGroup.update({ where: { id: group.id }, data: { featured: true, featuredImage: null } });
  }

  // Featured Brands
  const allBrands = await prisma.brand.findMany({ take: 2, select: { id: true } });
  for (const brand of allBrands) {
    await prisma.brand.update({ where: { id: brand.id }, data: { featured: true } });
  }

  // Combos
  const comboItem1 = await prisma.item.findFirst({ select: { itemId: true } });
  const comboItem2 = await prisma.item.findFirst({ where: { itemId: { not: comboItem1?.itemId } }, select: { itemId: true } });

  if (comboItem1 && comboItem2) {
    await prisma.comboHeader.create({
      data: {
        itemId: comboItem1.itemId,
        description: 'Coffee Bundle',
        price: 800.00,
        active: true,
        lines: {
          create: [
            { itemId: comboItem1.itemId, itemDescription: 'Roasted Coffee Beans', quantity: 1, uom: 'KG' },
            { itemId: comboItem2.itemId, itemDescription: 'Tea Bags', quantity: 1, uom: 'PCS' },
          ],
        },
      },
    });

    await prisma.comboHeader.create({
      data: {
        itemId: comboItem2.itemId,
        description: 'Milk & Yogurt Pack',
        price: 120.00,
        active: true,
        lines: {
          create: [
            { itemId: comboItem1.itemId, itemDescription: 'Fresh Milk 1L', quantity: 1, uom: 'LTR' },
            { itemId: comboItem2.itemId, itemDescription: 'Plain Yogurt 500g', quantity: 1, uom: 'G' },
          ],
        },
      },
    });
  }

  // Top Items
  const topItems = await prisma.item.findMany({ take: 5, select: { itemId: true } });
  for (const item of topItems) {
    await prisma.topItem.create({ data: { itemId: item.itemId } });
  }

  // Land Marks
  await prisma.landMark.create({ data: { code: 'LM-001', titleEn: 'Bole', titleAm: 'ቦሌ', latitude: 9.0141667, longitude: 38.7894444 } });
  await prisma.landMark.create({ data: { code: 'LM-002', titleEn: 'Piassa', titleAm: 'ፒያሳ', latitude: 9.0358333, longitude: 38.7419444 } });
  await prisma.landMark.create({ data: { code: 'LM-003', titleEn: 'Megenagna', titleAm: 'መገናኛ', latitude: 9.0302778, longitude: 38.7763889 } });

  // Shops
  await prisma.shop.create({ data: { locationCode: 'SH-001', titleEn: 'Bole Branch', titleAm: 'የቦሌ ቅርንጫፍ', latitude: 9.0141667, longitude: 38.7894444 } });
  await prisma.shop.create({ data: { locationCode: 'SH-002', titleEn: 'Piassa Branch', titleAm: 'የፒያሳ ቅርንጫፍ', latitude: 9.0358333, longitude: 38.7419444 } });
  await prisma.shop.create({ data: { locationCode: 'SH-003', titleEn: 'Megenagna Branch', titleAm: 'የመገናኛ ቅርንጫፍ', latitude: 9.0302778, longitude: 38.7763889 } });

  // Delivery Dates
  const date1 = await prisma.deliveryDate.create({ data: { titleEn: 'Monday', titleAm: 'ሰኞ' } });
  const date2 = await prisma.deliveryDate.create({ data: { titleEn: 'Wednesday', titleAm: 'ረቡዕ' } });
  const date3 = await prisma.deliveryDate.create({ data: { titleEn: 'Friday', titleAm: 'ዓርብ' } });

  // Time Ranges
  const tr1 = await prisma.timeRange.create({ data: { timeRange: '8:00 AM - 10:00 AM' } });
  const tr2 = await prisma.timeRange.create({ data: { timeRange: '10:00 AM - 12:00 PM' } });
  const tr3 = await prisma.timeRange.create({ data: { timeRange: '2:00 PM - 4:00 PM' } });

  // Land Mark Prices
  await prisma.landMarkPrice.create({ data: { dateId: date1.id, timeRange: '8:00 AM - 10:00 AM', landMarkCode: 'LM-001', shopCode: 'SH-001', price: 15.00 } });
  await prisma.landMarkPrice.create({ data: { dateId: date1.id, timeRange: '8:00 AM - 10:00 AM', landMarkCode: 'LM-001', shopCode: 'SH-002', price: 20.00 } });
  await prisma.landMarkPrice.create({ data: { dateId: date2.id, timeRange: '10:00 AM - 12:00 PM', landMarkCode: 'LM-002', shopCode: 'SH-002', price: 10.00 } });
  await prisma.landMarkPrice.create({ data: { dateId: date3.id, timeRange: '2:00 PM - 4:00 PM', landMarkCode: 'LM-003', shopCode: 'SH-003', price: 25.00 } });

  console.log('✅ Seed complete: rootme1984@gmail.com (role: Super Admin)');
  console.log(`   Categories: 3 (Drinks, Food Items, Grocery)`);
  console.log(`   Product Groups: 14`);
  console.log(`   Brands: 27`);
  console.log(`   Items: ${allItems.length}`);
  console.log(`   Prices: ${allItems.length}`);
  console.log(`   Discounts: ${discountTargets.length}`);
  console.log(`   Featured Groups: 2`);
  console.log(`   Featured Brands: 2`);
  console.log(`   Combos: 2`);
  console.log(`   Top Items: ${topItems.length}`);
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