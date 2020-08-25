'use strict';

const InventoryAllocator = require('../src/InventoryAllocator');

describe("Inventory Allocator", () => {

  // Test 1: If the order can be completed by both warehouses, return the shipment from cheapest warehouse.
  describe("If the order can be completed by both warehouses", () => {
    it("return the shipment from cheapest warehouse", () => {
      const order = { apple: 5, oranges: 2, banana: 5 };
      const warehouses = [
        { name: "owd", inventory: { apple: 5, oranges: 5, banana: 6 } },
        { name: "dm", inventory: {  apple: 10, oranges: 10, banana: 10 } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment())
        .toEqual([ { "owd": { apple: 5, oranges: 2, banana: 5 } } ]);
    });
  });

  // Test 2: If the order cannot be fulfilled from the cheapest warehouse, return the shipment split between warehouses.
  describe("If the order cannot be fulfilled from the cheapest warehouse", () => {
    it("return the shipment split between warehouses ", () => {
      const order = { apple: 10, oranges: 10 };
      const warehouses = [
        { name: "owd", inventory: { oranges: 5, banana: 19, apple: 5 } },
        { name: "dm", inventory: { apple: 5, oranges: 5 } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment())
        .toEqual([{ "owd": { apple: 5, oranges: 5 } },
          { "dm": { apple: 5, oranges: 5 } }]);
    });
  });

  // Test 3: If the order has to be split between warehouses, return the shipment order that prioritizes
  // the cheapest warehouses.
  describe("If the order has to be split between warehouses", () => {
    it("return the shipment order that prioritizes the cheapest warehouses", () => {
      const order = { apple: 12 };
      const warehouses = [
        { name: "owd", inventory: { apple: 5 } },
        { name: "dm", inventory: { apple: 7 } },
        { name: "wdo", inventory: { apple: 12 } },
        { name: "cnq", inventory: { apple: 12 } },
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment())
        .toEqual([{ "owd": { apple: 5 } },
          { "dm": { apple: 7 } }]);
    });
  });

  // Test 4: If the order is very large, return a correctly distributed shipment among the warehouses.
  describe("If the order is very large", () => {
    it("return a correctly distributed shipment among the warehouses", () => {
      const order = { apple: 1000, banana: 1000, orange: 1000, durian: 1000 };
      const warehouses = [
        { name: "owd", inventory: { apple: 500, banana: 250, orange: 100, durian: 10 } },
        { name: "dma", inventory: { apple: 0, banana: 500, orange: 800, durian: 990 } },
        { name: "wdo", inventory: {} },
        { name: "cnq", inventory: { apple: 300, banana: 10, orange: 100, durian: 30 } },
        { name: "bhg", inventory: { apple: 10000, banana: 7000, orange: 1000, durian: 500  } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment())
        .toEqual([
            { "owd": { apple: 500, banana: 250, orange: 100, durian: 10 } },
            { "dma": { banana: 500, orange: 800, durian: 990 } },
            { "cnq": { apple: 300, banana: 10, orange: 100 } },
            { "bhg": { apple: 200, banana: 240 } }
          ]);
    })
  });

  // Test 5: If the order can be only partially fulfilled, return an empty shipment order.
  describe("If the order can be only partially fulfilled", () => {
    it("return an empty shipment order", () => {
      const order = { apple: 10, oranges: 5, grapefruit: 21 };
      const warehouses = [
        { name: "owd", inventory: { oranges: 5, grapefruit: 19 } },
        { name: "dm", inventory: { apple: 10, grapefruit: 1 } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment()).toEqual([]);
    });
  });

  // Test 6: If there is no inventory for an order, return an empty shipment order.
  describe("If there is no inventory for an order", () => {
    it("return an empty shipment order", () => {
      const order = { grape: 1 };
      const warehouses = [
        { name: "owd", inventory: { peach: 10 } },
        { name: "dm", inventory: { grape: 0, banana: 1 } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment()).toEqual([]);
    });
  });

  // Test 7: If the order doesn't exist in the inventory, return an empty shipment order.
  describe("If the order doesn't exist in the inventory", () => {
    it("return an empty shipment order", () => {
      const order = { durian: 1 };
      const warehouses = [
        { name: "owd", inventory: { peach: 10 } },
        { name: "dm", inventory: { banana: 1 } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment()).toEqual([]);
    });
  });

  // Test 8: If the order is empty, return an empty shipment order.
  describe("If the order is empty", () => {
    it("return an empty shipment order", () => {
      const order = {};
      const warehouses = [
        { name: "owd", inventory: { peach: 10 } },
        { name: "dm", inventory: { banana: 1 } }
      ];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment()).toEqual([]);
    })
  });

  // Test 9: If there are no warehouses, return an empty shipment order.
  describe("If there are no warehouses", () => {
    it("return an empty shipment order", () => {
      const order = { durian: 1 };
      const warehouses = [];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment()).toEqual([]);
    });
  });

  // Test 10: If there is no order and no warehouses, return an empty shipment order.
  describe("If there is no order and no warehouses", () => {
    it("return an empty shipment order", () => {
      const order = {};
      const warehouses = [];
      const inventoryAllocation = new InventoryAllocator(order, warehouses);
      expect(inventoryAllocation.getCheapestShipment()).toEqual([]);
    });
  });

  // Note: May be a good idea to test associative arrays, i.e. the order object has identical items;
  //       however, associative arrays don't exist in JavaScript, though it might in another language.
});
