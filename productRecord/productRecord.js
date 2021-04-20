import {LightningElement, track, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

import { getFieldValue } from 'lightning/uiRecordApi';

import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import IMAGE_URL_FIELD from '@salesforce/schema/Product2.Image_URL__c';
import PRODUCT_CODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';
import DESCRIPTION_FIELD from '@salesforce/schema/Product2.Description';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';


export default class ProductRecord extends NavigationMixin(LightningElement){
      @wire(CurrentPageReference) pageRef;

      @track recordId;

      productName;
      productImageURL;

      objectApiName = PRODUCT_OBJECT;
      productCode = PRODUCT_CODE_FIELD;
      productFamily = FAMILY_FIELD;
      productDescription = DESCRIPTION_FIELD;
      productPrice = PRICE_FIELD;


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

      handleProductSelected(productId){
          this.recordId = productId;
      }
}