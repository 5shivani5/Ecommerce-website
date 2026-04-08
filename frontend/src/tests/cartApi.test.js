import cartApi from "../api/cartApi";

const mockGet    = jest.fn();
const mockPost   = jest.fn();
const mockPut    = jest.fn();
const mockDelete = jest.fn();

jest.mock("axios", () => ({
  create: () => ({
    get:    (...args) => mockGet(...args),
    post:   (...args) => mockPost(...args),
    put:    (...args) => mockPut(...args),
    delete: (...args) => mockDelete(...args),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getCar

test("getCart calls GET /", async () => {
  const mockCart = { items: [{ productId: 1, quantity: 2 }] };
  mockGet.mockResolvedValue({ data: mockCart });

  const result = await cartApi.getCart();

  expect(mockGet).toHaveBeenCalledWith("/");
  expect(result).toEqual(mockCart);
});

test("getCart returns empty cart when cart is empty", async () => {
  mockGet.mockResolvedValue({ data: { items: [] } });

  const result = await cartApi.getCart();

  expect(result.items).toHaveLength(0);
});

// ─── addToCart

test("addToCart calls POST /add with correct payload using product.id", async () => {
  const product = { id: 10, name: "Floral Dress", brand: "Zara", imageUrl: "img.jpg", price: 1299 };
  mockPost.mockResolvedValue({ data: { success: true } });

  await cartApi.addToCart(product);

  expect(mockPost).toHaveBeenCalledWith("/add", {
    productId:   10,
    productName: "Floral Dress",
    brand:       "Zara",
    imageUrl:    "img.jpg",
    price:       1299,
    quantity:    1,
  });
});

test("addToCart falls back to product.productId if product.id is missing", async () => {
  const product = { productId: 20, productName: "Slim Jeans", price: 2499, imageUrl: "" };
  mockPost.mockResolvedValue({ data: { success: true } });

  await cartApi.addToCart(product);

  expect(mockPost).toHaveBeenCalledWith("/add", expect.objectContaining({ productId: 20 }));
});

test("addToCart uses default brand 'Urban Vogue' when brand is missing", async () => {
  const product = { id: 5, name: "Kids Kurta", price: 799, imageUrl: "" };
  mockPost.mockResolvedValue({ data: {} });

  await cartApi.addToCart(product);

  expect(mockPost).toHaveBeenCalledWith("/add", expect.objectContaining({ brand: "Urban Vogue" }));
});

test("addToCart always sets quantity to 1", async () => {
  const product = { id: 3, name: "Kurta", price: 999, imageUrl: "" };
  mockPost.mockResolvedValue({ data: {} });

  await cartApi.addToCart(product);

  expect(mockPost).toHaveBeenCalledWith("/add", expect.objectContaining({ quantity: 1 }));
});

// ─── updateQuantity

test("updateQuantity calls PUT /update/:productId?quantity=qty", async () => {
  mockPut.mockResolvedValue({ data: { updated: true } });

  const result = await cartApi.updateQuantity(10, 3);

  expect(mockPut).toHaveBeenCalledWith("/update/10?quantity=3");
  expect(result).toEqual({ updated: true });
});


// ─── removeFromCart

test("removeFromCart calls DELETE /remove/:productId", async () => {
  mockDelete.mockResolvedValue({ data: { removed: true } });

  const result = await cartApi.removeFromCart(10);

  expect(mockDelete).toHaveBeenCalledWith("/remove/10");
  expect(result).toEqual({ removed: true });
});

// ─── clearCart

test("clearCart calls DELETE /clear", async () => {
  mockDelete.mockResolvedValue({ data: { cleared: true } });

  const result = await cartApi.clearCart();

  expect(mockDelete).toHaveBeenCalledWith("/clear");
  expect(result).toEqual({ cleared: true });
});