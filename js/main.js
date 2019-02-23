Vue.component('product', {

  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },

  template: `

  <div class="product">
      <div class="product-image">
        <img :src="image" :alt="alt">
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock">In stock</p>
        <p v-else :class="{ outOfStock: !inStock}">Out of stock</p>
        <p> Shipping: {{ shipping }}</p>
        <p>{{ sale }}</p>

        <product-details :details="details"></product-details>

        <div v-for="(variant, index) in variants" :key="variant.variants" class="color-box"
          :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock}">Add to Cart</button>

        <div class="cart">
          <p>Cart({{cart}})</p>
        </div>

      </div>
    </div>

    `,

    data() {
      return {
        brand: 'Vue Mastery',
        product: 'Socks',
        selectedVariant: 0,
        alt : 'A pair of socks',
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
          {
            variantId: 2334,
            variantColor: 'green',
            variantImage: '../img/vmSocks-green.jpg',
            variantQuantity: 10
          },
          {
            variantId: 2235,
            variantColor: 'blue',
            variantImage: '../img/vmSocks-blue.jpg',
            variantQuantity: 0
          }
        ],
        cart: 0,
        onSale: true
      }
    },
    methods: {
      addToCart() {
        this.cart += 1
      },
      updateProduct(index) {
        this.selectedVariant = index
        console.log(index)
      }
    },
    computed: {
      title() {
        return this.brand + ' ' + this.product
      },
      image() {
        return this.variants[this.selectedVariant].variantImage
      },
      inStock() {
        return this.variants[this.selectedVariant].variantQuantity
      },
      sale() {
        if (this.onSale) {
          return this.brand + ' ' + this.product + ' are on sale!'
        }
          return  this.brand + ' ' + this.product + ' are not on sale'
      },
      shipping() {
        if(this.premium) {
          return 'Free!'
        }
        return '$250'
      }
    }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

let app = new Vue({
  el: '#app',
  data: {
    premium: false
  }

})
