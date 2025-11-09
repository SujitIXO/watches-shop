export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-contain mb-4"
        />
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.brand}</p>
        <p className="text-blue-600 font-bold mb-4">₹{product.price}</p>
        <p className="text-gray-500 mb-4">{product.description}</p>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
