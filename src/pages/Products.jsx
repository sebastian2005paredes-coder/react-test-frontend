import { useEffect, useState } from "react";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";

function Products() {
    const [products, setProducts] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ open: false, productId: null });
    const [productModal, setProductModal] = useState({ open: false, product: null });
    const [form, setForm] = useState({ name: "", unit_price: "" });

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openAddModal = () => {
        setForm({ name: "", unit_price: "" });
        setProductModal({ open: true, product: null });
    };

    const openEditModal = (product) => {
        setForm({ name: product.name, unit_price: product.unit_price });
        setProductModal({ open: true, product });
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.unit_price) {
            alert("All fields are required");
            return;
        }
        try {
            if (productModal.product) {
                await api.put(`/products/${productModal.product.id}`, form);
            } else {
                await api.post("/products", form);
            }
            setProductModal({ open: false, product: null });
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.error || "Error saving product");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/products/${confirmModal.productId}`);
            setConfirmModal({ open: false, productId: null });
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting product");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <button
                        onClick={openAddModal}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        + Add Product
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Unit Price</th>
                                <th className="px-4 py-3 text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-400">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{p.id}</td>
                                        <td className="px-4 py-3">{p.name}</td>
                                        <td className="px-4 py-3">${Number(p.unit_price).toFixed(2)}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ open: true, productId: p.id })}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {productModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {productModal.product ? "Edit Product" : "Add Product"}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Product name"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                            <input
                                type="number"
                                min="0"
                                value={form.unit_price}
                                onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setProductModal({ open: false, product: null })}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={confirmModal.open}
                message="Are you sure you want to delete this product?"
                onConfirm={handleDelete}
                onCancel={() => setConfirmModal({ open: false, productId: null })}
            />
        </div>
    );
}

export default Products;