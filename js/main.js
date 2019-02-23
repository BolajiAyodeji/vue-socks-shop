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
        <button v-on:click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock}">Clear Cart</button>

      </div>

      <div>
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
        <p>{{ review.name }}</p>
        <p>Rating: {{ review.rating }}</p>
        <p>{{ review.review }}</p>
        </li>
      </ul>
      </div>

      <product-review @review-submitted="addReview"></product-review>

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
        onSale: true,
        reviews: []
      }
    },
    methods: {
      addToCart() {
        this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
      },
      updateProduct(index) {
        this.selectedVariant = index
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
     },
     addReview(productReview) {
       this.reviews.push(productReview)
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

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>

  <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>
  </p>

  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    <input type="submit" value="Submit">
  </p>

</form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null
    }
  },
  methods: {
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      }
      this.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
    }
  }
})


let app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      for(let i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
           this.cart.splice(i, 1);
        }
      }
    }
  }

})
