import { useEffect, useState } from "react";

function AddProductModal({ open, products, editItem, onConfirm, onCancel }) {
    const [productId, setProductId] = useState("");
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (editItem) {
            setProductId(editItem.product_id || "");
            setQty(editItem.qty || 1);
        } else {
            setProductId("");
            setQty(1);
        }
    }, [editItem, open]);

    if (!open) return null;

    const handleConfirm = () => {
        if (!editItem && !productId) {
            alert("Please select a product");
            return;
        }
        if (qty < 1) {
            alert("Quantity must be at least 1");
            return;
        }
        onConfirm({ product_id: productId, qty: Number(qty) });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {editItem ? "Edit Product" : "Add Product"}
                </h2>

                {!editItem && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Select a product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} - ${Number(p.unit_price).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddProductModal;