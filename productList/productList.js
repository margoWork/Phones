import {LightningElement, wire, track} from 'lwc';

import getProducts from '@salesforce/apex/ProductCtrl.getProducts';
import getCurrencies from '@salesforce/apex/ProductCtrl.getCurrencies';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class ProductList extends LightningElement {
      @wire(CurrentPageReference) pageRef;

      @track products;
      allProducts;
      filteredProducts;

      currencies;

      filters = {
        searchKey: '',
        price: 100000,
        family: ''
      };

      @wire( getProducts )
      wiredProducts( { error, data } ) {
          if (data) {
            this.products = data;
            this.allProducts = data;
          } else if ( error ) {
              this.dispatchEvent(
                  new ShowToastEvent({
                    title: 'Error getting phones!',
                    message: error.body.message,
                    variant: 'error',
                  }),
              );
          }
      }

      @wire( getCurrencies )
      wiredCurrencies( { error, data } ) {
          if (data) {
            this.currencies = data;
          } else if ( error ) {
            this.currencies = undefined;
            console.log('Error get Products.');
          }
      }


      connectedCallback() {
          registerListener(
            "filterschange",
            this.handleFilterChange,
            this
          );
      }

      disconnectedCallback() {
          unregisterAllListeners(this);
      }

      handleFilterChange(event) {
          if (event.filters.price !== undefined) {
            this.filters.price = event.filters.price;
          }
          if (event.filters.family !== undefined) {
            this.filters.family = event.filters.family;
          }
          const price = this.filters.price;
          const family = this.filters.family;
          let data = [];
          if (price !== "" && family !== "") {
            data = this.allProducts.filter(product => product.Price__c <= price && product.Family === family);
          }
          if(price === "" && family !== "") {
            data = this.allProducts.filter(product => product.Family === family);
          }
          if(price !== "" && family === "") {
            data = this.allProducts.filter(product => product.Price__c <= price);
          }
          this.products = data;
          this.filteredProducts = data;
      }

      handleSearchKeyChange(event) {
          const searchKey = event.target.value;
          const price = this.filters.price;
          const family = this.filters.family;
          const isFilteredData = (price !== 100000 || family !== "");
          let data = [];
          if (searchKey !== "" && !isFilteredData) {
            data = this.allProducts.filter(product => product.Name.toLowerCase().includes(searchKey.toLowerCase()));
          }
          if (searchKey !== "" && isFilteredData) {
            data = this.filteredProducts.filter(product => product.Name.toLowerCase().includes(searchKey.toLowerCase()));
          }
          if (searchKey === "" && !isFilteredData) {
            data = this.allProducts;
          }
          if (searchKey === "" && isFilteredData) {
            data = this.filteredProducts;
          }
          this.products = data;
      }

      handleProductSelected(event){
          const params = {
            productId : event.detail,
            withLocation: false
          };
          fireEvent(this.pageRef, "selectedproduct", params);
      }

}