import { api, LightningElement } from "lwc";

export default class ProductItem extends LightningElement {
      @api product;

      handleSelectedProduct() {
          const selectedEvent = new CustomEvent('selected', {
            detail: this.product.Id
          });
          this.dispatchEvent(selectedEvent);
      }
}