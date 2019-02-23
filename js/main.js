let app = new Vue({
  el: '#app',
  data: {
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
    cart: 0
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
    }
  }
})
