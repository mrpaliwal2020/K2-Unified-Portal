import React, { useState, useEffect } from "react";
import { Search, Phone, MapPin, ChevronDown } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import { getUnitItems, getUnitMembers } from "../../../services/api/authApi";
import useAuthStore from "../../../store/authStore";

const Store = () => {
  const { selectedUnit } = useAuthStore();
  const unitCode = selectedUnit?.unitCode || "";
  const groupId = selectedUnit?.groupId || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [items, memberList] = await Promise.all([
        getUnitItems(unitCode),
        getUnitMembers(groupId, unitCode),
      ]);
      setProducts(items);
      setMembers(memberList);
      setLoading(false);
    };
    if (unitCode && groupId) fetchData();
  }, [unitCode, groupId]);

  const getDaysAgo = (dateListed) => {
    const parts = dateListed.split(" ")[0].split("-");
    const listed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    listed.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - listed) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const getMemberInfo = (profileId) => {
    const member = members.find((m) => m.memberProfileId === profileId);
    if (!member) {
      return {
        name: "Unknown",
        mobile: "",
        address: "",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown",
      };
    }
    return {
      name: `${member.memberFirstName.trim()} ${member.memberLastName.trim()}`,
      mobile: member.memberMobile,
      address: [member.village, member.district].filter(Boolean).join(", "),
      imageUrl:
        member.memberImageUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.memberFirstName}`,
    };
  };

  const getStatus = (stockQuantity) =>
    parseInt(stockQuantity) > 0 ? "In Stock" : "Out of Stock";

  const categoryTypes = [
    "All Products",
    ...new Set(products.map((p) => p.categoryD2)),
  ];

  const statusOptions = ["All Status", "In Stock", "Out of Stock"];

  const filteredProducts = products.filter((product) => {
    const status = getStatus(product.stockQuantity);
    const matchesSearch =
      product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.searchCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Products" ||
      product.categoryD2 === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Status" || status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-15 h-15 border-4 border-black-500 border-t-transparent
                          rounded-full animate-spin"
          />
          <p className="text-xl text-gray-500 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search products or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pr-10 pl-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {categoryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pr-10 pl-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const member = getMemberInfo(product.profileId);
          const status = getStatus(product.stockQuantity);
          const timeAgo = getDaysAgo(product.dateListed);
          return (
            <div
              key={product.itemId}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-10 h-10 rounded-full bg-emerald-100 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-500">{timeAgo}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${member.mobile}`}
                    className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors"
                  >
                    <Phone size={16} className="text-emerald-600" />
                  </a>
                </div>
                <div className="flex items-center gap-1 text-slate-600 text-xs">
                  <MapPin size={14} className="text-emerald-600" />
                  {member.address}
                </div>
              </div>

              <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img
                  src={product.imageUrl}
                  alt={product.itemName}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-lg font-bold text-white text-sm ${
                    status === "In Stock" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {status}
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm font-bold text-slate-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <Button
                  fullWidth
                  className={`${
                    status === "In Stock"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-sm`}
                  disabled={status === "Out of Stock"}
                >
                  {status === "In Stock" ? "Purchase" : "Out of Stock"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Store;
