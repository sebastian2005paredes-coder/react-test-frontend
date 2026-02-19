import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ open: false, orderId: null });
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async () => {
        try {
            await api.delete(`/orders/${confirmModal.orderId}`);
            setConfirmModal({ open: false, orderId: null });
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting order");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.error || "Error updating status");
        }
    };

    const getStatusColor = (status) => {
        if (status === "Pending") return "bg-yellow-100 text-yellow-800";
        if (status === "InProgress") return "bg-blue-100 text-blue-800";
        if (status === "Completed") return "bg-green-100 text-green-800";
        return "";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                    <button
                        onClick={() => navigate("/add-order")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        + Add Order
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Order #</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left"># Products</th>
                                <th className="px-4 py-3 text-left">Final Price</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{order.id}</td>
                                        <td className="px-4 py-3">{order.order_number}</td>
                                        <td className="px-4 py-3">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">{order.product_count}</td>
                                        <td className="px-4 py-3">${Number(order.final_price).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status}
                                                disabled={order.status === "Completed"}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="InProgress">InProgress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                disabled={order.status === "Completed"}
                                                onClick={() => navigate(`/add-order/${order.id}`)}
                                                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ open: true, orderId: order.id })}
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
            </div>

            <ConfirmModal
                open={confirmModal.open}
                message="Are you sure you want to delete this order?"
                onConfirm={handleDelete}
                onCancel={() => setConfirmModal({ open: false, orderId: null })}
            />
        </div>
    );
}

export default MyOrders;