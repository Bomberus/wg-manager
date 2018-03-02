"use strict"
const {Action, api} = require('actionhero')

class InventoryAction extends Action {
  constructor () {
    super()
  }
}

exports.InventoryAdd = class InventoryItemAdd extends InventoryAction {
  constructor () {
    super()
    this.name = 'inventoryAdd'
    this.description = 'I add an item to the inventory'
  }

  async run (data) {
  }
}

exports.InventoryGet = class InventoryItemGet extends InventoryAction {
  constructor () {
    super()
    this.name = 'inventoryGet'
    this.description = 'I get inventory items'
  }

  async run (data) {
    //api.bugsnag.ActionReporter(new Error("Hello"), this.name, data);
  }
}

exports.InventoryDelete = class InventoryItemDelete extends InventoryAction {
  constructor () {
    super()
    this.name = 'inventoryDelete'
    this.description = 'I delete inventory item'
  }

  async run (data) {
  }
}

exports.InventoryUpdate = class InventoryItemUpdate extends InventoryAction {
  constructor () {
    super()
    this.name = 'inventoryUpdate'
    this.description = 'I update inventory item'
  }

  async run (data) {
  }
}