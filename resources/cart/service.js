import Cart from "../../models/Cart.js";
import Book from "../../models/Book.js";
import Checkout from "../../models/Checkout.js";
class CartService {
  // TODO create new cart service to handle cart item addition, deletion, clearing
  addItemToCart = async (body, userId) => {
    try {
      const { productId, quantity } = body;

      const book = await Book.findById(productId);
      if (!book) throw new Error("Cart item not found");

      if (quantity > book.quantity) throw Error("Product left in stock is 5");
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
      return await Cart.find({ userId })
        .populate("bookId", "title")
        .select("-userId");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  removeItemFromCart = async (cartId, userId) => {
    if (!cartId || cartId.length < 1) throw new Error("Cart id required");

    try {
      await Cart.findOneAndDelete({ _id: cartId, userId });

      const cartItems = await Cart.find({ userId })
        .populate("bookId", "title")
        .select("-userId");
      return cartItems;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  clearCart = async (userId) => {
    try {
      await Cart.deleteMany({ userId: userId });
      return await Cart.find({ userId });
    } catch (error) {
      throw new Error(error.message);
    }
  };


  checkoutCart = async (body, userId) => {
    const { price } = body;
    const orderId = Date.now();
    let newCheckout;
    try {
      const cart = await Cart.find({ userId });

      // check if user has checkout before
      const checkout = await Checkout.findOne({
        userId,
        cartId: cart._id,
      })
    
      if (checkout) {
        checkout.products = [...checkout.products, ...cart];
        newCheckout = await checkout.save();
      } else {
        newCheckout = await Checkout.create({
          userId,
          products: cart,
          price,
          orderId,
        })
      }
      if (newCheckout) await Cart.deleteMany({ userId });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  getCheckoutItems = async (userId) => {
    return await Checkout.findOne({ userId });
  };
}

export default CartService;
