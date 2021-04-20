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
    console.log('SearchKey: ' + event.target.value);
    this.filters.searchKey = event.target.value;
    this.fireFiltersChangeEvent();
  }

  handlePriceChange(event) {
      console.log('Selected Price: ' + event.target.value);
      if (event.detail) {
          this.filters.price = event.target.value;
          this.fireFiltersChangeEvent();
      }
  }

  handleFamilyChange(event) {
      console.log('Selected Family: ' + event.target.value);
      if (event.detail) {
        this.filters.family = event.target.value === "None" ? undefined : event.target.value;
        console.log('Res Family: ' +  this.filters.family);
        this.fireFiltersChangeEvent();
      }
  }

  fireFiltersChangeEvent() {
      fireEvent(this.pageRef, 'filterschange', {
        filters: this.filters
      });
  }
}