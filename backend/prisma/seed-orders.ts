import { PrismaClient, OrderStatus, DeliveryMethod, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

const ITEM_INFO: Record<string, { desc: string; price: number; uom: string }> = {
  'ITM-001': { desc: 'Roasted Coffee Beans', price: 325.00, uom: 'KG' },
  'ITM-002': { desc: 'Ground Coffee', price: 505.00, uom: 'KG' },
  'ITM-003': { desc: 'Tea Bags', price: 125.00, uom: 'PCS' },
  'ITM-006': { desc: 'Coca-Cola 330ml', price: 448.00, uom: 'CAN' },
  'ITM-012': { desc: 'Orange Juice 1L', price: 226.00, uom: 'BTL' },
  'ITM-017': { desc: 'Water 500ml', price: 108.00, uom: 'BTL' },
  'ITM-018': { desc: 'Water 1.5L', price: 157.00, uom: 'BTL' },
  'ITM-020': { desc: 'Fresh Milk 1L', price: 180.00, uom: 'LTR' },
  'ITM-027': { desc: 'Beef 1kg', price: 68.00, uom: 'KG' },
  'ITM-030': { desc: 'Eggs 12pcs', price: 185.00, uom: 'PCS' },
  'ITM-033': { desc: 'Tomato 1kg', price: 128.00, uom: 'KG' },
  'ITM-034': { desc: 'Onion 1kg', price: 440.00, uom: 'KG' },
  'ITM-035': { desc: 'Potato 1kg', price: 315.00, uom: 'KG' },
  'ITM-038': { desc: 'Orange 1kg', price: 127.00, uom: 'KG' },
  'ITM-042': { desc: 'Banana 1kg', price: 299.00, uom: 'KG' },
  'ITM-043': { desc: 'Apple 1kg', price: 243.00, uom: 'KG' },
  'ITM-048': { desc: 'Olive Oil 1L', price: 456.00, uom: 'LTR' },
  'ITM-050': { desc: 'Sunflower Oil 1L', price: 306.00, uom: 'LTR' },
  'ITM-052': { desc: 'Spaghetti 500g', price: 133.00, uom: 'G' },
  'ITM-054': { desc: 'Rice 1kg', price: 343.00, uom: 'KG' },
  'ITM-055': { desc: 'Instant Noodles', price: 299.00, uom: 'PCS' },
};

interface DummyOrder {
  orderNo: string;
  orderDate: string;
  shopCode: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  deliveryDate: string;
  deliveryTimeWindow: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: OrderStatus;
  itemCodes: string[];
  quantities: number[];
}

const ORDERS: DummyOrder[] = [
  {
    orderNo: 'ORD-001',
    orderDate: '2026-07-20T09:15:00Z',
    shopCode: 'SH-001',
    deliveryMethod: 'PICKUP',
    paymentMethod: 'CASH',
    deliveryDate: 'Today',
    deliveryTimeWindow: '12:00-13:00',
    customerName: 'Natnael Tizazu',
    customerPhone: '1111111110',
    customerEmail: 'natnael@email.com',
    status: 'NEW',
    itemCodes: ['ITM-001', 'ITM-006', 'ITM-017', 'ITM-030', 'ITM-033', 'ITM-054', 'ITM-055'],
    quantities: [2, 6, 12, 3, 5, 10, 4],
  },
  {
    orderNo: 'ORD-002',
    orderDate: '2026-07-19T14:30:00Z',
    shopCode: 'SH-001',
    deliveryMethod: 'PICKUP',
    paymentMethod: 'BANK_TRANSFER',
    deliveryDate: 'Today',
    deliveryTimeWindow: '10:00-11:00',
    customerName: 'Hailemariam Asrat',
    customerPhone: '1111111112',
    customerEmail: 'hailemariam@email.com',
    status: 'DEFICIENCY',
    itemCodes: ['ITM-002', 'ITM-012', 'ITM-020', 'ITM-034', 'ITM-042', 'ITM-048', 'ITM-050'],
    quantities: [1, 4, 3, 2, 5, 1, 2],
  },
  {
    orderNo: 'ORD-003',
    orderDate: '2026-07-18T11:00:00Z',
    shopCode: 'SH-002',
    deliveryMethod: 'DELIVERY',
    paymentMethod: 'CASH',
    deliveryDate: 'Today',
    deliveryTimeWindow: '11:00-12:00',
    customerName: 'Alazar Kassa',
    customerPhone: '1111111113',
    customerEmail: 'alazar@email.com',
    status: 'PENDING_PAYMENT',
    itemCodes: ['ITM-003', 'ITM-018', 'ITM-027', 'ITM-035', 'ITM-043', 'ITM-052'],
    quantities: [10, 6, 4, 8, 3, 5],
  },
  {
    orderNo: 'ORD-004',
    orderDate: '2026-07-17T08:45:00Z',
    shopCode: 'SH-003',
    deliveryMethod: 'DELIVERY',
    paymentMethod: 'CASH',
    deliveryDate: 'Today',
    deliveryTimeWindow: '13:00-14:00',
    customerName: 'Tadeos Melesse',
    customerPhone: '1111111114',
    customerEmail: 'tadeos@email.com',
    status: 'PREPARED',
    itemCodes: ['ITM-001', 'ITM-006', 'ITM-020', 'ITM-030', 'ITM-033', 'ITM-038', 'ITM-054'],
    quantities: [3, 8, 5, 6, 4, 7, 15],
  },
  {
    orderNo: 'ORD-005',
    orderDate: '2026-07-16T16:20:00Z',
    shopCode: 'SH-001',
    deliveryMethod: 'PICKUP',
    paymentMethod: 'CASH',
    deliveryDate: 'Today',
    deliveryTimeWindow: '17:00-18:00',
    customerName: 'M K',
    customerPhone: '1111111115',
    customerEmail: 'mk@email.com',
    status: 'DELIVERED',
    itemCodes: ['ITM-017', 'ITM-018', 'ITM-034', 'ITM-035', 'ITM-042', 'ITM-048'],
    quantities: [10, 8, 3, 5, 4, 1],
  },
  {
    orderNo: 'ORD-006',
    orderDate: '2026-07-15T10:10:00Z',
    shopCode: 'SH-001',
    deliveryMethod: 'DELIVERY',
    paymentMethod: 'CASH',
    deliveryDate: 'Today',
    deliveryTimeWindow: '16:00-17:00',
    customerName: 'Hellina Demrew',
    customerPhone: '1111111116',
    customerEmail: 'hellina@email.com',
    status: 'CANCELED',
    itemCodes: ['ITM-001', 'ITM-003', 'ITM-012', 'ITM-027', 'ITM-030', 'ITM-050', 'ITM-055'],
    quantities: [1, 8, 3, 2, 4, 1, 6],
  },
  {
    orderNo: 'ORD-007',
    orderDate: '2026-07-22T08:30:00Z',
    shopCode: 'SH-002',
    deliveryMethod: 'PICKUP',
    paymentMethod: 'TELEBIRR',
    deliveryDate: 'Today',
    deliveryTimeWindow: '09:00-10:00',
    customerName: 'Samuel Bekele',
    customerPhone: '1111111117',
    customerEmail: 'samuel@email.com',
    status: 'READY',
    itemCodes: ['ITM-006', 'ITM-018', 'ITM-027', 'ITM-033', 'ITM-048', 'ITM-052', 'ITM-055'],
    quantities: [12, 5, 3, 8, 2, 10, 6],
  },
  {
    orderNo: 'ORD-008',
    orderDate: '2026-07-23T06:00:00Z',
    shopCode: 'SH-003',
    deliveryMethod: 'DELIVERY',
    paymentMethod: 'BANK_TRANSFER',
    deliveryDate: 'Today',
    deliveryTimeWindow: '14:00-15:00',
    customerName: 'Betelhem Ayele',
    customerPhone: '1111111118',
    customerEmail: 'betelhem@email.com',
    status: 'NEW',
    itemCodes: ['ITM-003', 'ITM-017', 'ITM-030', 'ITM-034', 'ITM-043', 'ITM-054'],
    quantities: [15, 20, 5, 4, 6, 8],
  },
];

async function main() {
  console.log('Seeding orders...');

  const customerIds: { key: string; id: string }[] = [];
  for (const order of ORDERS) {
    const existing = await prisma.customer.findFirst({
      where: { phone: order.customerPhone, name: order.customerName },
    });
    if (existing) {
      customerIds.push({ key: order.customerName, id: existing.id });
    } else {
      const customer = await prisma.customer.create({
        data: {
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail,
        },
      });
      customerIds.push({ key: order.customerName, id: customer.id });
    }
  }

  for (const order of ORDERS) {
    const customer = customerIds.find((c) => c.key === order.customerName);
    if (!customer) continue;

    const subtotal = order.itemCodes.reduce((sum, code, i) => {
      const info = ITEM_INFO[code];
      return sum + (info ? info.price * order.quantities[i] : 0);
    }, 0);
    const total = subtotal;

    const deficiencyResponseDeadline = order.status === 'DEFICIENCY'
      ? new Date(Date.now() + 2 * 60 * 60 * 1000)
      : undefined;
    const paymentDeadline = order.status === 'PENDING_PAYMENT'
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : undefined;

    const created = await prisma.order.create({
      data: {
        orderNo: order.orderNo,
        shopCode: order.shopCode,
        customerId: customer.id,
        status: order.status,
        orderDate: new Date(order.orderDate),
        deliveryDate: order.deliveryDate,
        deliveryTimeWindow: order.deliveryTimeWindow,
        deliveryMethod: order.deliveryMethod,
        paymentMethod: order.paymentMethod,
        subtotal,
        total,
        deficiencyResponseDeadline,
        paymentDeadline,
        deliveredAt: order.status === 'DELIVERED' ? new Date() : undefined,
        canceledAt: order.status === 'CANCELED' ? new Date() : undefined,
        cancellationReason: order.status === 'CANCELED' ? 'Customer requested cancellation' : undefined,
        items: {
          create: order.itemCodes.map((code, i) => {
            const info = ITEM_INFO[code];
            const qty = order.quantities[i];
            const unitPrice = info ? info.price : 100;
            const qtyAvailable = order.status === 'DEFICIENCY' && info
              ? Math.min(qty, Math.floor(qty * 0.6))
              : qty;
            return {
              itemCode: code,
              itemDescription: info ? info.desc : code,
              uom: info?.uom,
              quantityRequested: qty,
              quantityAvailable: qtyAvailable < qty ? qtyAvailable : undefined,
              unitPrice,
              totalPrice: +(unitPrice * qty).toFixed(2),
            };
          }),
        },
        statusHistory: {
          create: {
            fromStatus: 'NEW',
            toStatus: order.status,
            reason: order.status === 'CANCELED' ? 'Customer requested cancellation' : undefined,
            changedAt: new Date(order.orderDate),
          },
        },
      },
      include: { items: true },
    });

    if (order.status === 'PREPARED' || order.status === 'READY') {
      let baseTime = new Date(order.orderDate).getTime();
      for (const step of ['PENDING_PAYMENT', 'PREPARED']) {
        baseTime += 3600000;
        await prisma.orderStatusHistory.create({
          data: {
            orderId: created.id,
            fromStatus: step === 'PENDING_PAYMENT' ? 'NEW' : 'PENDING_PAYMENT' as OrderStatus,
            toStatus: step as OrderStatus,
            changedAt: new Date(baseTime),
          },
        });
      }
      if (order.status === 'READY') {
        await prisma.orderStatusHistory.create({
          data: {
            orderId: created.id,
            fromStatus: 'PREPARED',
            toStatus: 'READY',
            changedAt: new Date(baseTime + 3600000),
          },
        });
      }
    }

    if (order.status === 'DELIVERED') {
      const steps = ['PENDING_PAYMENT', 'PREPARED', 'READY', 'PICKED', 'DELIVERED'];
      let baseTime = new Date(order.orderDate).getTime();
      for (const step of steps) {
        baseTime += 3600000;
        await prisma.orderStatusHistory.create({
          data: {
            orderId: created.id,
            fromStatus: step === 'PENDING_PAYMENT' ? 'NEW' : steps[steps.indexOf(step) - 1] as OrderStatus,
            toStatus: step as OrderStatus,
            changedAt: new Date(baseTime),
          },
        });
      }
    }

    console.log(`  Created order ${order.orderNo} (${order.status}) with ${order.itemCodes.length} items`);
  }

  console.log('Done seeding orders.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
