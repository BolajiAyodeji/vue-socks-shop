let eventBus = new Vue()

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
        <p>{{ sale }}</p>
        <p v-if="inStock">In stock</p>
        <p v-else :class="{ outOfStock: !inStock}">Out of stock</p>

        <info-tabs :shipping="shipping" :details="details"></info-tabs>

        <div v-for="(variant, index) in variants" :key="variant.variants" class="color-box"
          :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock}">Add to Cart</button>
        <button v-on:click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock}">Clear Cart</button>

      </div>

      <product-tabs :reviews="reviews"></product-tabs>

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
    },
    mounted() {
      eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
      })
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

  <p class="error" v-if="errors.length">
  <b>Please correct the following error(s):</b></p>
  <ul>
  <li v-for="error in errors">{{ error }}</li>
  </ul>
  </p>
  <p>
  <span class="head">Add a review</span>
  <hr> <br/>
    <label for="name">Name:</label>
    <input type="text" id="name" v-model="name" placeholder="Bolaji Ayodeji">
  </p>

  <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review" placeholder="I love this socks!"></textarea>
  </p>

  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option selected>★★★</option>
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>Would you recommend this product?</label></p
  <label>Yes <input type="radio" value="Yes" v-model="recommend"/></label>
  <label>No <input type="radio" value="No" v-model="recommend"/></label>

  <p>
    <input v-on:keyup.enter="submit" type="submit" value="Submit">
  </p>

</form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      if(this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      }else {
        if(!this.name) this.errors.push('Name required!')
        if(!this.review) this.errors.push('Review required!')
        if(!this.rating) this.errors.push('Rating required!')
        if(!this.recommend) this.errors.push('Recommedation required!')
      }
    }
  }
})

Vue.component('product-tabs', {

  props: {
    reviews: {
      type: Array,
      required: true
    }
  },

  template: `
  <div>

  <div>
  <span class="tab" :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">{{ tab }}</span>
  </div>

  <div v-show="selectedTab === 'Reviews'">
  <h2>Reviews</h2>
  <p v-if="!reviews.length">There are no reviews yet.</p>
  <ul>
    <li v-for="review in reviews">
    <p>{{ review.name }}</p>
    <p>Rating: {{ review.rating }}</p>
    <p>{{ review.review }}</p>
    <p>Recommend: {{ review.recommend }}</p>
    </li>
  </ul>
  </div>

  <product-review v-show="selectedTab === 'Make a Review'"></product-review>

</div>
  `,
  data () {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('info-tabs', {
  props: {
    shipping: {
      required: false
    },
    details: {
      type: Array,
      required: true
    }
  },

  template: `
  <div>

        <ul>
          <span class="tabs"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>

      </div>
  `,
  data() {
    return {
      tabs: ['Shipping', 'Details'],
      selectedTab: 'Shipping'
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
