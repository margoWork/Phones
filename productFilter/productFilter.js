import { LightningElement, wire } from "lwc";
import { getPicklistValues} from "lightning/uiObjectInfoApi";


import PRODUCT_FAMILY_FIELD from "@salesforce/schema/Product2.Family";
import { fireEvent } from 'c/pubsub';

import { CurrentPageReference } from 'lightning/navigation';


export default class ProductFilter extends LightningElement {

  @wire(CurrentPageReference) pageRef;

  filters = {
      searchKey: '',
      price: 10000,
      family: ''
  };

  @wire(getPicklistValues, {
        recordTypeId: "0125g000000p288",
        fieldApiName: PRODUCT_FAMILY_FIELD
    })
    families;

  handleSearchKeyChange(event) {
    this.filters.searchKey = event.target.value;
    this.fireFiltersChangeEvent();
  }

  handlePriceChange(event) {
      if (event.detail) {
          this.filters.price = event.target.value;
          this.fireFiltersChangeEvent();
      }
  }

  handleFamilyChange(event) {
      if (event.detail) {
        this.filters.family = event.target.value === "None" ? undefined : event.target.value;
        this.fireFiltersChangeEvent();
      }
  }

  fireFiltersChangeEvent() {
      fireEvent(this.pageRef, 'filterschange', {
        filters: this.filters
      });
  }
}