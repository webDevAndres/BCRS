import { Component, OnInit } from '@angular/core';
import { LineItem } from 'src/app/shared/models/line-item.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { Product } from 'src/app/shared/models/product.interface';
import { Invoice } from 'src/app/shared/models/invoice';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceSummaryDialogComponent } from 'src/app/shared/invoice-summary-dialog/invoice-summary-dialog.component';
import { SessionService } from 'src/app/shared/services/session.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // items are the products that are in the shopping cart
  username: string;
  // get the cart items from the cookie and parse them to JSON
  items: Product[];
  lineItems: LineItem[];
  yourSubtotal: number;
  orderDate: string;
  invoice: Invoice;
  errorMessages: Message[];
  successMessages: Message[];
  role: string;
  laborFee: number;
  partsFee: number;

  adjustedFeesForm: FormGroup = this.fb.group({
    partsFee: [null, Validators.compose([Validators.required])],
    laborFee: [null, Validators.compose([Validators.required])],
  });



  constructor(
    private cartService: CartService,
    private invoiceService: InvoiceService,
    private router: Router,
    private dialogRef: MatDialog,
    private cookieService: CookieService,
    private sessionService: SessionService,
    private fb: FormBuilder
  ) {

    this.username = this.cookieService.get('sessionuser') || '';
    // get the cart items from the cookie and parse them to JSON
    this.items = JSON.parse(this.cookieService.get('cartItems')) || '[]';
    this.invoice = {} as Invoice;
    this.errorMessages = [];
    this.successMessages = [];
    this.lineItems = [];
    this.laborFee = 0;
    this.partsFee = 0;

    /**************************
     * GETS THE ROLE OF THE USER
     **************************/
    this.role = 'standard';

    this.sessionService.verifyUsername(this.username).subscribe({
      next: (res) => {
        this.role = res.data.role.text;
        console.log(this.role);
      },
      error: (e) => {
        console.log(e);
      }
    });





    this.orderDate = new Date().toLocaleDateString();
    this.yourSubtotal = 0;
    this.yourSubtotal = this.cartService.getSubtotal();

    this.invoice = new Invoice(this.username);
  }

  ngOnInit(): void {
  }

  // remove items from ths shopping cart, then re-calculate the subtotal for the order
  removeItemFromCart(item: Product) {
    this.items = this.cartService.removeItemFromCart(item);
    this.yourSubtotal = this.cartService.getSubtotal();
    }

    updateFees(){

    //get the labor fee from the form
    this.laborFee = this.adjustedFeesForm.controls['laborFee'].value * 50;
    //get the parts fee from the form
    this.partsFee = this.adjustedFeesForm.controls['partsFee'].value;
      this.yourSubtotal = this.cartService.getSubtotal() + this.laborFee + this.partsFee;
      alert('Fees updated');


    }

// function generateInvoice work for Generate Invoice button to open the invoice dialog
  generateInvoice() {
    console.log('generateInvoice() this.invoice');
    console.log(this.invoice);

    console.log('generateInvoice() this.products');
    console.log(this.items);

    for (let item of this.items) {
      this.lineItems.push(item);
    }

    if (this.lineItems.length > 0) {
      this.invoice.setLineItems(this.lineItems);

      // console.log('line items.length > 0', this.invoice);
      console.log(this.invoice);

      const dialogRef = this.dialogRef.open(InvoiceSummaryDialogComponent, {
        data: {
          invoice: this.invoice,
          partsFee: this.partsFee,
          laborFee: this.laborFee,
        },
        disableClose: true,
        width: '800px'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result === 'confirm') {
          this.invoiceService.createInvoice(this.username, this.invoice).subscribe({
            next: (res) => {
              console.log('invoice created');
              this.clearLineItems();
              this.invoice.clear();
              //delete cookies
              this.cookieService.delete('cartItems');
              this.cookieService.delete('cartCount');
              this.items = [];
              // refresh the page then navigate to the service repair page
              this.router.navigate(['/service-repair']).then(() => { window.location.reload() });
              this.successMessages = [
                { severity: 'success', summary: 'Service Repair Invoice Created', detail: 'Your order has been processed successfully.' }
              ]
            },
            error: (e) => {
              console.log(e);
            }
          })
        }
        else {
          console.log('order canceled');
          this.clearLineItems();
          this.invoice.clear();
        }
      })
    }
    else {
      this.errorMessages = [
        { severity: 'error', summary: 'Error', detail: 'Please select at least one product' }
      ]
    }
  }

  clearLineItems() {
    this.lineItems = [];
  }

  // use cookies to keep the cartItems (the shopping cart and items) persisting on the page reload.
  itemCount(){
    let cartCount = JSON.parse(this.cookieService.get('cartItems')) || '[]';
    return cartCount.length;

  }


 // When remove all items in the cart, the page will be navigate to the service repair page
  async clearCart() {
    this.items = [];
    await this.router.navigate(['/service-repair']);
    window.location.reload();
  }



}
