import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Save, X, Upload, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { rtdb } from "@/firebase/config";
import { ref, get, set, remove } from "firebase/database";
import toast from "react-hot-toast";

// Model interface
interface CarModel {
    id: string;
    name: string;
    image: string;
    status: "active" | "inactive";
    createdAt?: number;
}

export default function AdminModels() {
    const [models, setModels] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<CarModel>>({
        name: "",
        image: "",
        status: "active",
    });
    const navigate = useNavigate();

    // Fetch models from Firebase
    const fetchModels = async () => {
        try {
            const modelsRef = ref(rtdb, "carModels");
            const snapshot = await get(modelsRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const modelsArray: CarModel[] = Object.entries(data).map(([id, value]: [string, any]) => ({
                    id,
                    ...value,
                }));
                setModels(modelsArray.sort((a, b) => a.name.localeCompare(b.name)));
            } else {
                setModels([]);
            }
        } catch (error) {
            console.error("Error fetching models:", error);
            toast.error("Failed to load models");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    // Generate ID from name
    const generateId = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    // Save model (add or update)
    const handleSave = async () => {
        if (!formData.name || !formData.image) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const modelId = editingId || generateId(formData.name);
            const modelRef = ref(rtdb, `carModels/${modelId}`);

            const modelData: CarModel = {
                id: modelId,
                name: formData.name,
                image: formData.image,
                status: formData.status || "active",
                createdAt: formData.createdAt || Date.now(),
            };

            await set(modelRef, modelData);

            toast.success(editingId ? "Model updated successfully" : "Model added successfully");

            // Reset form
            setFormData({ name: "", image: "", status: "active" });
            setIsAddingNew(false);
            setEditingId(null);

            // Refresh list
            fetchModels();
        } catch (error) {
            console.error("Error saving model:", error);
            toast.error("Failed to save model");
        }
    };

    // Delete model
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            const modelRef = ref(rtdb, `carModels/${id}`);
            await remove(modelRef);
            toast.success("Model deleted successfully");
            fetchModels();
        } catch (error) {
            console.error("Error deleting model:", error);
            toast.error("Failed to delete model");
        }
    };

    // Edit model
    const handleEdit = (model: CarModel) => {
        setFormData({
            name: model.name,
            image: model.image,
            status: model.status,
            createdAt: model.createdAt,
        });
        setEditingId(model.id);
        setIsAddingNew(true);
    };

    // Toggle status
    const handleToggleStatus = async (model: CarModel) => {
        try {
            const modelRef = ref(rtdb, `carModels/${model.id}`);
            const newStatus = model.status === "active" ? "inactive" : "active";

            await set(modelRef, {
                ...model,
                status: newStatus,
            });

            toast.success(`Model ${newStatus === "active" ? "activated" : "deactivated"}`);
            fetchModels();
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Failed to update status");
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setFormData({ name: "", image: "", status: "active" });
        setIsAddingNew(false);
        setEditingId(null);
    };

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">Car Models</h1>
                        <p className="text-gray-500">Manage car models for your shop filter</p>
                    </div>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        disabled={isAddingNew}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} /> Add Model
                    </button>
                </div>

                {/* Add/Edit Form */}
                {isAddingNew && (
                    <div className="bg-white border border-gray-200 p-6 mb-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 text-black">
                            {editingId ? "Edit Model" : "Add New Model"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                                    Model Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Swift, Creta, Fortuner"
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                                    Image URL *
                                </label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {formData.image && (
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                                        Preview
                                    </label>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-32 object-cover border border-gray-200"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-all"
                            >
                                <Save size={16} /> {editingId ? "Update" : "Save"} Model
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-black text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-all"
                            >
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Models List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : models.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] bg-gray-100">
                                    <img
                                        src={model.image}
                                        alt={model.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {model.status === "inactive" && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold uppercase tracking-widest">
                                                Inactive
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-black mb-3">{model.name}</h3>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(model)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${model.status === "active"
                                                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                }`}
                                            title={model.status === "active" ? "Deactivate" : "Activate"}
                                        >
                                            {model.status === "active" ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(model)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold uppercase tracking-wide transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(model.id, model.name)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold uppercase tracking-wide transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-gray-200">
                        <h3 className="text-xl font-bold mb-3 text-black">No Models Yet</h3>
                        <p className="text-gray-500 mb-6">Add your first car model to get started</p>
                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-all"
                        >
                            Add Your First Model
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
