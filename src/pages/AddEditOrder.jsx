import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import AddProductModal from "../components/AddProductModal";

function AddEditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [orderNumber, setOrderNumber] = useState("");
    const [products, setProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [addProductModal, setAddProductModal] = useState(false);
    const [editProductModal, setEditProductModal] = useState({ open: false, item: null });
    const [confirmModal, setConfirmModal] = useState({ open: false, itemId: null });
    const [isCompleted, setIsCompleted] = useState(false);

    const currentDate = new Date().toLocaleDateString("en-US");
    const productCount = products.length;
    const finalPrice = products.reduce((sum, p) => sum + Number(p.total_price), 0);

    useEffect(() => {
        fetchAvailableProducts();
        if (isEdit) fetchOrder();
    }, [id]);

    const fetchAvailableProducts = async () => {
        try {
            const res = await api.get("/products");
            setAvailableProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrderNumber(res.data.order_number);
            setProducts(res.data.products || []);
            setIsCompleted(res.data.status === "Completed");
        } catch (error) {
            console.error("Error fetching order:", error);
        }
    };

    const handleSaveOrder = async () => {
        if (!orderNumber.trim()) {
            alert("Order number is required");
            return;
        }

        try {
            if (isEdit) {
                await api.put(`/orders/${id}`, { order_number: orderNumber });
            } else {
                await api.post("/orders", {
                    order_number: orderNumber,
                    products: products.map((p) => ({
                        product_id: p.product_id,
                        qty: p.qty,
                    })),
                });
            }
            navigate("/my-orders");
        } catch (error) {
            alert(error.response?.data?.error || "Error saving order");
        }
    };

    const handleAddProduct = async ({ product_id, qty }) => {
        try {
            if (isEdit) {
                await api.post(`/orders/${id}/items`, { product_id, qty });
                fetchOrder();
            } else {
                const product = availableProducts.find((p) => p.id === Number(product_id));
                const total_price = product.unit_price * qty;
                setProducts([...products, {
                    product_id: product.id,
                    name: product.name,
                    unit_price: product.unit_price,
                    qty,
                    total_price,
                }]);
            }
            setAddProductModal(false);
        } catch (error) {
            alert(error.response?.data?.error || "Error adding product");
        }
    };

    const handleEditProduct = async ({ qty }) => {
        try {
            if (isEdit) {
                await api.put(`/orders/${id}/items/${editProductModal.item.id}`, { qty });
                fetchOrder();
            } else {
                setProducts(products.map((p, i) =>
                    i === editProductModal.item.index
                        ? { ...p, qty, total_price: p.unit_price * qty }
                        : p
                ));
            }
            setEditProductModal({ open: false, item: null });
        } catch (error) {
            alert(error.response?.data?.error || "Error editing product");
        }
    };

    const handleRemoveProduct = async () => {
        try {
            if (isEdit) {
                await api.delete(`/orders/${id}/items/${confirmModal.itemId}`);
                fetchOrder();
            } else {
                setProducts(products.filter((_, i) => i !== confirmModal.itemId));
            }
            setConfirmModal({ open: false, itemId: null });
        } catch (error) {
            alert(error.response?.data?.error || "Error removing product");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isEdit ? "Edit Order" : "Add Order"}
                    </h1>
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                </div>

                {isCompleted && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                        This order is completed and cannot be modified.
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order #</label>
                            <input
                                type="text"
                                value={orderNumber}
                                disabled={isCompleted}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100"
                                placeholder="e.g. ORD-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="text"
                                value={currentDate}
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1"># Products</label>
                            <input
                                type="number"
                                value={productCount}
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Final Price</label>
                            <input
                                type="text"
                                value={`$${finalPrice.toFixed(2)}`}
                                disabled
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-700">Products</h2>
                        {!isCompleted && (
                            <button
                                onClick={() => setAddProductModal(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                            >
                                + Add Product
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Unit Price</th>
                                <th className="px-4 py-3 text-left">Qty</th>
                                <th className="px-4 py-3 text-left">Total Price</th>
                                <th className="px-4 py-3 text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-400">
                                        No products added
                                    </td>
                                </tr>
                            ) : (
                                products.map((p, index) => (
                                    <tr key={p.id || index} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{p.id || index + 1}</td>
                                        <td className="px-4 py-3">{p.name}</td>
                                        <td className="px-4 py-3">${Number(p.unit_price).toFixed(2)}</td>
                                        <td className="px-4 py-3">{p.qty}</td>
                                        <td className="px-4 py-3">${Number(p.total_price).toFixed(2)}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            {!isCompleted && (
                                                <>
                                                    <button
                                                        onClick={() => setEditProductModal({
                                                            open: true,
                                                            item: { ...p, index }
                                                        })}
                                                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-xs"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmModal({
                                                            open: true,
                                                            itemId: isEdit ? p.id : index
                                                        })}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>

                {!isCompleted && (
                    <button
                        onClick={handleSaveOrder}
                        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold text-lg"
                    >
                        {isEdit ? "Save Changes" : "Create Order"}
                    </button>
                )}
            </div>

            <AddProductModal
                open={addProductModal}
                products={availableProducts}
                onConfirm={handleAddProduct}
                onCancel={() => setAddProductModal(false)}
            />

            <AddProductModal
                open={editProductModal.open}
                products={availableProducts}
                editItem={editProductModal.item}
                onConfirm={handleEditProduct}
                onCancel={() => setEditProductModal({ open: false, item: null })}
            />

            <ConfirmModal
                open={confirmModal.open}
                message="Are you sure you want to remove this product?"
                onConfirm={handleRemoveProduct}
                onCancel={() => setConfirmModal({ open: false, itemId: null })}
            />
        </div>
    );
}

export default AddEditOrder;