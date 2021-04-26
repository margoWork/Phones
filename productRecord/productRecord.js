import {LightningElement, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import productRecordTemplate from './productRecord.html';
import productRecordWithLocationTemplate from './productRecordWithLocation.html';

import { getFieldValue } from 'lightning/uiRecordApi';

import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import IMAGE_URL_FIELD from '@salesforce/schema/Product2.Image_URL__c';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import OS_FIELD from '@salesforce/schema/Product2.OS__c';
import DISPLAY_SIZE_FIELD from '@salesforce/schema/Product2.Display_size__c';
import INTERNAL_STORAGE from '@salesforce/schema/Product2.Internal_storage__c';
import RAM_FIELD from '@salesforce/schema/Product2.RAM__c';


export default class ProductRecord extends NavigationMixin(LightningElement){
      @wire(CurrentPageReference) pageRef;

      withLocation;

      recordId;

      productName;
      productImageURL;

      objectApiName = PRODUCT_OBJECT;
      productOS = OS_FIELD;
      productDisplaySize = DISPLAY_SIZE_FIELD;
      productInternalStorage = INTERNAL_STORAGE;
      productRAM = RAM_FIELD;
      productPrice = PRICE_FIELD;

      render() {
          return this.withLocation ? productRecordWithLocationTemplate : productRecordTemplate;
      }

      connectedCallback() {
          registerListener(
              "selectedproduct",
              this.handleProductSelected,
              this
          );
      }

      disconnectedCallback() {
          unregisterAllListeners(this);
      }

      handleRecordLoaded(event) {
          const { records } = event.detail;
          const record = records[this.recordId];
          this.productName = getFieldValue(record, NAME_FIELD);
          this.productImageURL = getFieldValue(record, IMAGE_URL_FIELD);
      }

      handleProductSelected(params){
          this.recordId = params.productId;
          this.withLocation = params.withLocation;
      }
}