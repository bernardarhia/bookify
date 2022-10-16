const Cart = require("../../models/Cart");
const Book = require("../../models/Book");
const Checkout = require("../../models/Checkout");
class CartService {
  // TODO create new cart service to handle cart item addition, deletion, clearing
  addItemToCart = async (body, userId) => {
    try {
      const { productId, quantity } = body;

      const book = await Book.findById(productId);
      if (!book) throw new Error("Cart item not found");

      // Check if item already exist in cart
      const cartExists = await Cart.findOne({ bookId: productId });
      if (cartExists) {
        const newQuantity = cartExists.quantity + quantity;
        await Cart.findOneAndUpdate(
          { bookId: productId, userId },
          { quantity: newQuantity, price: book.price * newQuantity }
        );
      } else {
        await Cart.create({
          bookId: book._id,
          quantity,
          userId,
          price: book.price * quantity,
        });
      }

      return await Cart.find({ userId });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getCartItems = async (userId) => {
    try {
      return await Cart.find({ userId });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  removeItemFromCart = async (cartId, userId) => {
    if (!cartId || cartId.length < 1) throw new Error("Cart id required");

    try {
      await Cart.findOneAndDelete({ _id: cartId, userId });

      const cartItems = await Cart.find({ userId });
      return cartItems;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  clearCart = async (userId) => {
    try {
      await Cart.deleteMany({ userId:userId });
      return await Cart.find({ userId });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateCartItem = async (userId) => {
    try {
    } catch (error) {
      throw new Error(error.message);
    }
  };

  checkoutCart = async (body, userId) => {
    const {products, shipping, payment} = body;
    const orderId = Date.now()
    try {
      const checkout = await Checkout.create({
        userId,
        products,
        shipping,
        payment,
        orderId

      });
      return { checkout };
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = CartService;
