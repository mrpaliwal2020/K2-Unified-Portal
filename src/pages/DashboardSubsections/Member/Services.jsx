import { useState, useRef, useEffect } from "react";
import { X, Users, ChevronRight, Phone, MapPin } from "lucide-react";
import { Button } from "../../../components/ui";

const services = [
  { id: 1,  name: "Thresher",     members: 124, img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop" },
  { id: 2,  name: "Tractor",      members: 312, img: "https://plus.unsplash.com/premium_vector-1731662325035-755eb0473199?" },
  { id: 3,  name: "Rotavator",    members: 87,  img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=250&fit=crop" },
  { id: 4,  name: "Plough",       members: 98,  img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop" },
  { id: 5, name: "Harvester",    members: 142, img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop" },
];

const memberListings = [
  { name: "Deepak Paliwal", time: "10 hours ago", location: "Bhakarganj, Harda",          available: true,  desc: "5000 किंटल धान के बीज उपलब्ध हैं, कीमत 2200 रुपये प्रति किंटल है, बुकिंग उपलब्ध है।", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Deepak" },
  { name: "Anaya Singh",    time: "5 hours ago",  location: "Indore, Madhya Pradesh",     available: true,  desc: "500 बोरी यूरिया है, कीमत 2500 रुपए प्रति बोरी बुकिंग उपलब्ध है।",                    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Anaya" },
  { name: "Ramesh Verma",   time: "2 hours ago",  location: "Hoshangabad, MP",            available: false, desc: "थ्रेशर किराये पर उपलब्ध नहीं है, अगले सीजन में संपर्क करें।",                       avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ramesh" },
  { name: "Sunita Devi",    time: "1 day ago",    location: "Sehore, Madhya Pradesh",     available: true,  desc: "ट्रैक्टर किराये पर उपलब्ध है, प्रति घंटा 500 रुपए, अभी बुक करें।",                  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sunita" },
];

export default function Services() {
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("idle");
  const scrollRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(false);

  const handleSelect = (service) => {
    if (phase !== "idle") return;
    setPhase("leaving");
    setTimeout(() => {
      setSelected(service);
      setPhase("entering");
      setTimeout(() => setPhase("idle"), 400);
    }, 300);
  };

  const handleClose = () => {
    if (phase !== "idle") return;
    setPhase("leaving");
    setTimeout(() => {
      setSelected(null);
      setPhase("entering");
      setTimeout(() => setPhase("idle"), 400);
    }, 300);
  };

  useEffect(() => {
    if (!selected) return;
    const el = scrollRef.current;
    if (!el) return;
    const speed = 0.6;
    const step = () => {
      if (!isPausedRef.current && el) {
        el.scrollTop += speed;
        if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop = 0;
      }
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [selected]);

  const gridOpacity     = phase === "leaving" ? "opacity-0 scale-95"      : "opacity-100 scale-100";
  const sidebarTranslate = selected
    ? phase === "leaving" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
    : "translate-x-full opacity-0";
  const mainTranslate   = selected
    ? phase === "leaving" ? "opacity-0"                  : "opacity-100"
    : "opacity-0 pointer-events-none";

  const others         = selected ? services.filter((s) => s.id !== selected.id) : [];
  const infiniteOthers = [...others, ...others];

  return (
    <div className="min-h-screen w-full bg-[#f0faf4] font-sans">

      {/* ── GRID VIEW ── */}
      {!selected && (
        <div className={`transition-all duration-300 ease-in-out ${gridOpacity} p-8`}>
          <h1 className="text-[28px] font-bold text-[#1a3c2e] mb-2">Services</h1>
          <p className="text-[#5a7a6a] mb-7 text-[15px]">Select a service to explore members and details</p>
          <div className="grid grid-cols-3 gap-5">
            {services.map((s) => (
              <div
                key={s.id}
                onClick={() => handleSelect(s)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-[#d4edd9] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="relative h-[300px] bg-[#1b5e7b] overflow-hidden">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover opacity-85" onError={(e) => { e.target.style.display = "none"; }} />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-xs font-semibold rounded-full px-2.5 py-0.5 bg-white/20 backdrop-blur-sm">
                    <Users size={12} /> {s.members}
                  </div>
                </div>
                <div className="px-3.5 py-3 flex justify-between items-center">
                  <span className="font-bold text-[#1a3c2e] text-[15px]">{s.name}</span>
                  <ChevronRight size={16} color="#16a34a" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SIDEBAR + MAIN VIEW ── */}
      {selected && (
        <div className={`transition-all duration-[400ms] ease-in-out ${mainTranslate} flex w-full h-screen`}>

          {/* SIDEBAR */}
          <div className={`transition-all duration-[400ms] ease-out ${sidebarTranslate} flex flex-col gap-3.5 p-6 border-r-2 border-[#b6e8c8] bg-[#d4f5e2] h-full w-[200px] min-w-[200px]`}>
            <div className="rounded-xl overflow-hidden relative flex-shrink-0 border-2 border-green-700 bg-green-600 shadow-lg shadow-green-500/35">
              <img src={selected.img} alt={selected.name} className="w-full h-20 object-cover opacity-75" onError={(e) => { e.target.style.display = "none"; }} />
              <div className="px-2.5 py-2">
                <div className="font-bold text-white text-[13px]">{selected.name}</div>
                <div className="flex items-center gap-1 text-green-100 text-[11px] mt-0.5"><Users size={10} /> {selected.members} members</div>
              </div>
              <button
                onClick={handleClose}
                className="absolute top-1.5 right-1.5 w-[22px] h-[22px] flex items-center justify-center rounded-full bg-black/45 hover:bg-red-600/80 transition-colors duration-150 border-none cursor-pointer"
              >
                <X size={13} color="#fff" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex flex-col gap-3 overflow-hidden flex-1"
              onMouseEnter={() => { isPausedRef.current = true; }}
              onMouseLeave={() => { isPausedRef.current = false; }}
            >
              {infiniteOthers.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  onClick={() => handleSelect(s)}
                  className="bg-[#e8e8e8] hover:bg-[#d5d5d5] hover:scale-[1.02] rounded-xl overflow-hidden cursor-pointer border border-[#ccc] flex-shrink-0 transition-all duration-150"
                >
                  <img src={s.img} alt={s.name} className="w-full h-16 object-cover opacity-60" onError={(e) => { e.target.style.display = "none"; }} />
                  <div className="px-2.5 py-1.5">
                    <div className="font-semibold text-[#444] text-xs">{s.name}</div>
                    <div className="flex items-center gap-[3px] text-[#888] text-[10px] mt-0.5"><Users size={9} /> {s.members}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 px-9 py-8 overflow-y-auto bg-[#f8fffe]">
            <div className="mb-6">
              <h2 className="text-[26px] font-extrabold text-[#1a3c2e] mb-1">{selected.name}</h2>
              <div className="flex items-center gap-1.5 text-green-600 font-semibold">
                <Users size={16} /> {selected.members} Members Joined
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {memberListings.map((m, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e2f0e8] shadow-sm"
                  style={{ animation: `fadeSlideUp 0.4s ease ${i * 0.07}s both` }}
                >
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full bg-[#e0f2e9] object-cover border border-[#c8e6d0]" onError={(e) => { e.target.style.display = "none"; }} />
                      <div>
                        <div className="font-bold text-[#1a3c2e] text-[14px] leading-tight">{m.name}</div>
                        <div className="text-[#999] text-[11px]">{m.time}</div>
                      </div>
                    </div>
                    <button className="w-9 h-9 rounded-full flex items-center justify-center border border-[#d4edd9] bg-[#f0faf4] hover:bg-[#dcf5e7] transition-colors">
                      <Phone size={15} color="#16a34a" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 px-4 pb-2 text-[#666] text-[12px]">
                    <MapPin size={12} color="#16a34a" />
                    {m.location}
                  </div>

                  <div className="relative mx-4 rounded-xl overflow-hidden h-90 bg-[#e8f5ee]">
                    <img src={selected.img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                    {/* dynamic color — must stay inline */}
                    <div
                      className="absolute top-2 right-2 text-white text-[11px] font-bold px-3 py-1 rounded-full"
                      style={{ background: m.available ? "#16a34a" : "#dc2626" }}
                    >
                      {m.available ? "Available" : "Unavailable"}
                    </div>
                  </div>

                  <div className="px-4 pt-3 pb-1 text-[#2d4a38] text-[13px] leading-snug font-medium">{m.desc}</div>

                  <div className="px-4 py-3">
                    {/* dynamic color — must stay inline */}
                    <Button
                      fullWidth
                      asMotion={false}
                      className="py-2.5 text-[14px] transition-opacity duration-150 disabled:cursor-not-allowed"
                      style={{ background: m.available ? "#16a34a" : "#9ca3af" }}
                      disabled={!m.available}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #a8d5b5; border-radius: 4px; }
      `}</style>
    </div>
  );
}