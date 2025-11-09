export default function ProductCard({ product, onAddToCart, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.name}
        className="rounded-lg h-48 w-full object-cover mb-3"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500 mb-2">{product.brand}</p>
      <p className="text-xl font-bold mb-3">₹{product.price}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
