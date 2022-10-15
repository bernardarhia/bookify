class CartService {
  // TODO create new cart service to handle cart item addition, deletion, clearing
  create = async (body) => {
    try {
      return { body };
    } catch (error) {
      throw new Error("Unable to add item to cart");
    }
  };
}

module.exports = CartService;
