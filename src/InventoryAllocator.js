class InventoryAllocator {
  constructor(order, warehouses) {
    this.order = order;
    this.warehouses = warehouses;
  }

  getCheapestShipment() {
    const shipments = [];

    for(let i = 0; i < this.warehouses.length; i++){
      const warehouse_name = this.warehouses[i].name;
      const inventory = this.warehouses[i].inventory;
      const shipment = {
        [warehouse_name]: {}
      };

      Object.entries(inventory).forEach(([item, quantity]) => {
        if(this.order.hasOwnProperty(item)){
          const supplied_items = quantity > this.order[item] ? this.order[item] : quantity;

          if(supplied_items > 0) {
            this.order[item] = quantity > this.order[item] ? 0 : this.order[item] - quantity;

            shipment[warehouse_name][item] = supplied_items;
          }
        }
      });

      if(!InventoryAllocator.isEmptyShipment(shipment[warehouse_name])) shipments.push(shipment);
    }

    return shipments;
  }

  static isEmptyShipment(shipment) {
    return Object.keys(shipment).length === 0;
  }
}
module.exports = InventoryAllocator;
