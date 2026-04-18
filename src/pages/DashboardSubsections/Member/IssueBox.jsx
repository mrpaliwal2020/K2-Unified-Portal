import React, { useState, useEffect } from "react";
import { Inbox, Clock, MapPin, Users, Tag, Phone } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import { getUnitIssues, getUnitMembers } from "../../../services/api/authApi";
import useAuthStore from "../../../store/authStore";

const IssueBox = () => {
  const { selectedUnit } = useAuthStore();
  const unitCode = selectedUnit?.unitCode || "";
  const groupId = selectedUnit?.groupId || "";

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [expandedIssues, setExpandedIssues] = useState(new Set());

  const getTimeAgo = (updatedAt) => {
    try {
      const parts = updatedAt.split(" ");
      const dateParts = parts[0].split("-");
      const timeParts = parts[1].split(":");
      const ampm = parts[2];

      let hours = parseInt(timeParts[0]);
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const listed = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0]),
        hours,
        parseInt(timeParts[1]),
        parseInt(timeParts[2]),
      );

      const now = new Date();
      const diffMs = now - listed;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    } catch {
      return "Recently";
    }
  };

  const getMemberInfo = (members, profileId) => {
    const member = members.find((m) => m.memberProfileId === profileId);
    if (!member) {
      return {
        name: "Unknown",
        mobile: "",
        address: "",
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=unknown`,
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

  useEffect(() => {
    setIssues([]);
    setLoading(true);

    if (!unitCode || !groupId) return;

    const fetchData = async () => {
      const [posts, members] = await Promise.all([
        getUnitIssues(unitCode),
        getUnitMembers(groupId, unitCode),
      ]);

      const mapped = posts.map((post) => {
        const member = getMemberInfo(members, post.profileId);

        const imageUpload = post.uploads?.find(
          (u) => u.kind === "image" && u.url,
        );

        const formattedTags = (post.tags || []).map(
          (t) => `#${t.toLowerCase().replace(/\s+/g, "-")}`,
        );

        const cropKeywords = [
          "wheat",
          "rice",
          "soybean",
          "mango",
          "paddy",
          "maize",
          "cotton",
        ];
        const allText =
          `${post.title} ${post.body} ${post.tags?.join(" ")}`.toLowerCase();
        const matchedCrop =
          cropKeywords.find((c) => allText.includes(c)) || "other";

        return {
          id: post.postId,
          userImage: member.imageUrl,
          userName: member.name,
          address: member.address,
          postDate: getTimeAgo(post.updatedAt),
          issueImage:
            imageUpload?.url ||
            "https://via.placeholder.com/400x200?text=No+Image",
          description: post.body,
          tags: formattedTags,
          joinCount: 0,
          userPhone: member.mobile,
          hasJoined: false,
          crop: matchedCrop,
        };
      });

      setIssues(mapped);
      setLoading(false);
    };

    fetchData();
  }, [unitCode, groupId]);

  const handleJoin = (issueId) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              joinCount: issue.hasJoined
                ? issue.joinCount - 1
                : issue.joinCount + 1,
              hasJoined: !issue.hasJoined,
            }
          : issue,
      ),
    );
  };

  const toggleExpandedIssue = (issueId) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === "all" || issue.crop === selectedCrop;
    const matchesTag =
      selectedTag === "all" ||
      issue.tags.some((tag) =>
        tag.toLowerCase().includes(selectedTag.toLowerCase()),
      );
    return matchesSearch && matchesCrop && matchesTag;
  });

  const isDescriptionLong = (description) => description.length > 150;

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
    <div className="min-h-screen">
      <div className=" mx-auto">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <Input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
              className="flex-1"
            />
            <div className="flex gap-2">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Crops</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="soybean">Soybean</option>
                <option value="mango">Mango</option>
              </select>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Tags</option>
                <option value="#disease">Disease</option>
                <option value="#fertilizer">Fertilizer</option>
                <option value="#pest">Pest</option>
                <option value="#leaf-spots">Leaf Spots</option>
                <option value="#nutrient-deficiency">
                  Nutrient Deficiency
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              {/* User Info Header */}
              <div className="p-3 border-b border-slate-200">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={issue.userImage}
                    alt={issue.userName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">
                      {issue.userName}
                    </h3>
                    <p className="text-sm text-slate-500">{issue.postDate}</p>
                  </div>
                  <a
                    href={`tel:${issue.userPhone}`}
                    className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                    title="Call"
                  >
                    <Phone size={20} />
                  </a>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <MapPin size={16} className="text-emerald-600" />
                  {issue.address}
                </div>
              </div>

              {/* Issue Image */}
              <img
                src={issue.issueImage}
                alt="Issue"
                className="w-full h-32 object-cover"
              />

              {/* Issue Content */}
              <div className="p-3 space-y-2 flex flex-col flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {issue.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full text-sm text-emerald-700 border border-emerald-200"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {expandedIssues.has(issue.id)
                      ? issue.description
                      : isDescriptionLong(issue.description)
                        ? issue.description.substring(0, 150) + "..."
                        : issue.description}
                  </p>
                  {isDescriptionLong(issue.description) && (
                    <button
                      onClick={() => toggleExpandedIssue(issue.id)}
                      className="text-emerald-600 font-semibold text-sm mt-2 hover:text-emerald-700"
                    >
                      {expandedIssues.has(issue.id) ? "See Less" : "See More"}
                    </button>
                  )}
                </div>

                {/* Join Section */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {Array.from({ length: Math.min(issue.joinCount, 3) }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
                          >
                            <Users size={14} className="text-white" />
                          </div>
                        ),
                      )}
                    </div>
                    {issue.joinCount > 3 && (
                      <span className="text-sm font-bold text-slate-900">
                        +{issue.joinCount - 3}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => handleJoin(issue.id)}
                    asMotion={false}
                    className={`ml-auto px-6 py-2 ${
                      issue.hasJoined
                        ? "bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {issue.hasJoined ? "Leave" : "Join"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-600">No issues found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueBox;
