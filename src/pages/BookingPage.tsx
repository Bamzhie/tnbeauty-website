import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  coreServices,
  addOns,
  removals,
  nailArtLevels,
  calculateTotalPrice,
  getSelectedServiceNames,
} from "../data/services";
import {
  getPublicBookingData,
  createBooking,
  type AvailableDate,
} from "../services/api";

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

// Category metadata — mirrors how Fresha groups services into named,
// described sections rather than bare tabs.
const CATEGORIES = [
  {
    id: "core",
    label: "Core Services",
    title: "Core Services",
    description:
      "The foundation of every appointment — extensions, overlays and manicures, each performed with precision and care.",
    items: coreServices,
  },
  {
    id: "nailArt",
    label: "Nail Art",
    title: "Nail Art",
    description:
      "Elevate your set with hand-finished detail. Choose one level to match the complexity you're after.",
    items: nailArtLevels,
  },
  {
    id: "addons",
    label: "Add-ons",
    title: "Add-ons",
    description: "Optional finishing touches to make your set stand out.",
    items: addOns,
  },
  {
    id: "removals",
    label: "Removals",
    title: "Removals",
    description:
      "Safe, gentle removal of your existing set, done without damage to your natural nails.",
    items: removals,
  },
] as const;

export default function BookingPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"services" | "time" | "confirm">("services");
  const [schedule, setSchedule] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [selectedCoreServices, setSelectedCoreServices] = useState<string[]>([]);
  const [selectedNailArtLevel, setSelectedNailArtLevel] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [selectedServiceModal, setSelectedServiceModal] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState<string>("core");
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pillRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const pillBarRef = useRef<HTMLDivElement | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await getPublicBookingData();
      setSchedule(data.availableDates);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll spy — passively tracks which category section is on screen.
  // IMPORTANT: this only writes state; it must never itself trigger a
  // scroll (e.g. via scrollIntoView), or scroll -> state -> scroll turns
  // into a feedback loop that fights the user's own scrolling.
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const lastCategory = CATEGORIES[CATEGORIES.length - 1];

        // Bottom of the page wins outright. A short final section never
        // reaches the reading line: once the scroll is clamped at the end
        // of the document there is nothing left to scroll, so the
        // second-to-last category would stay lit even though the last
        // section is the only one on screen.
        const atBottom =
          window.innerHeight + scrollY >=
          document.documentElement.scrollHeight - 2;

        if (atBottom) {
          setActiveCategory((prev) =>
            prev === lastCategory.id ? prev : lastCategory.id
          );
          ticking.current = false;
          return;
        }

        // Otherwise walk backwards and take the first (i.e. last, since
        // we're going in reverse) section whose top has been passed.
        for (let i = CATEGORIES.length - 1; i >= 0; i--) {
          const cat = CATEGORIES[i];
          const element = categoryRefs.current[cat.id];
          if (element && scrollY + 220 >= element.offsetTop) {
            setActiveCategory((prev) => (prev === cat.id ? prev : cat.id));
            break;
          }
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only the user clicking a pill should move anything — scroll the page
  // to that section, and separately, nudge the pill row so the clicked
  // pill is visible. Never runs from the scroll spy above.
  const goToCategory = useCallback((id: string) => {
    setActiveCategory(id);
    const section = categoryRefs.current[id];
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
    const pill = pillRefs.current[id];
    if (pill) {
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  const totalPrice = calculateTotalPrice(
    selectedCoreServices,
    selectedAddOns,
    selectedRemovals,
    selectedNailArtLevel
  );
  const selectedServicesList = getSelectedServiceNames(
    selectedCoreServices,
    selectedAddOns,
    selectedRemovals,
    selectedNailArtLevel
  );
  const selectedCount = selectedServicesList.length;

  const selectedDateObj = useMemo(
    () => schedule.find((d) => d.date === selectedDateStr),
    [schedule, selectedDateStr]
  );

  const availableTimeSlots = useMemo(() => {
    if (!selectedDateObj) return [];
    return selectedDateObj.availableSlots ?? [];
  }, [selectedDateObj]);

  const validateName = (value: string): string | null => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return "Enter a valid email address";
    return null;
  };

  const validatePhone = (value: string): string | null => {
    if (!value.trim()) return "Phone number is required";
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15)
      return "Enter a valid phone number";
    return null;
  };

  const nameError = validateName(clientName);
  const emailError = validateEmail(clientEmail);
  const phoneError = validatePhone(clientPhone);

  const getType = (id: string): "core" | "addon" | "removal" | "nailArt" =>
    coreServices.some((s) => s.id === id)
      ? "core"
      : addOns.some((s) => s.id === id)
      ? "addon"
      : removals.some((s) => s.id === id)
      ? "removal"
      : "nailArt";

  const isServiceSelected = (id: string) =>
    selectedCoreServices.includes(id) ||
    selectedAddOns.includes(id) ||
    selectedRemovals.includes(id) ||
    selectedNailArtLevel === id;

  const handleAddService = (type: "core" | "addon" | "removal" | "nailArt", id: string) => {
    if (!id) return;
    if (type === "core") {
      if (!selectedCoreServices.includes(id))
        setSelectedCoreServices([...selectedCoreServices, id]);
    } else if (type === "addon") {
      if (!selectedAddOns.includes(id)) setSelectedAddOns([...selectedAddOns, id]);
    } else if (type === "removal") {
      if (!selectedRemovals.includes(id)) setSelectedRemovals([...selectedRemovals, id]);
    } else if (type === "nailArt") {
      setSelectedNailArtLevel(id);
    }
  };

  const handleRemoveService = (type: "core" | "addon" | "removal" | "nailArt", id: string) => {
    if (type === "core") setSelectedCoreServices((prev) => prev.filter((s) => s !== id));
    else if (type === "addon") setSelectedAddOns((prev) => prev.filter((s) => s !== id));
    else if (type === "removal") setSelectedRemovals((prev) => prev.filter((s) => s !== id));
    else if (type === "nailArt") setSelectedNailArtLevel(null);
  };

  const toggleService = (id: string) => {
    const type = getType(id);
    if (isServiceSelected(id)) handleRemoveService(type, id);
    else handleAddService(type, id);
  };

  const handleSubmit = async () => {
    if (nameError) return;
    if (contactMethod === "email" && emailError) return;
    if (contactMethod === "phone" && phoneError) return;
    if (!selectedDateObj) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", clientName);
      if (contactMethod === "email" && clientEmail) formData.append("email", clientEmail);
      if (contactMethod === "phone" && clientPhone) formData.append("phone", clientPhone);
      formData.append("date", selectedDateObj.displayDate);
      if (selectedTime) formData.append("time", selectedTime);

      selectedCoreServices.forEach((id) => {
        const name = coreServices.find((s) => s.id === id)?.name;
        if (name) formData.append("coreServices", name);
      });

      if (selectedNailArtLevel) {
        const level = nailArtLevels.find((l) => l.id === selectedNailArtLevel);
        if (level) formData.append("addons", level.name);
      }

      selectedAddOns.forEach((id) => {
        const name = addOns.find((a) => a.id === id)?.name;
        if (name) formData.append("addons", name);
      });

      selectedRemovals.forEach((id) => {
        const name = removals.find((r) => r.id === id)?.name;
        if (name) formData.append("removals", name);
      });

      await createBooking(formData);
      setBookingSuccess(true);
    } catch (error: any) {
      alert("Booking failed: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-11"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isAvailable = schedule.some((d) => d.date === dateStr && d.canBook);
      const isSelected = selectedDateStr === dateStr;

      days.push(
        <button
          key={dateStr}
          disabled={!isAvailable}
          onClick={() => {
            setSelectedDateStr(dateStr);
            setSelectedTime(null);
          }}
          className={`h-10 md:h-11 rounded-full flex items-center justify-center text-sm font-medium transition
            ${
              isSelected
                ? "bg-[#4A3728] text-white shadow-sm"
                : isAvailable
                ? "border border-[#4A3728] text-[#4A3728] hover:bg-[#FAF6F3] font-semibold"
                : "text-gray-300 cursor-not-allowed"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  // --- Service Detail Modal ---
  const ServiceModal = () => {
    if (!selectedServiceModal) return null;
    const isSelected = isServiceSelected(selectedServiceModal.id);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40"
          onClick={() => setSelectedServiceModal(null)}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E8D5C4]">
              <h3 className="font-heading text-base font-bold text-[#4A3728]">{selectedServiceModal.name}</h3>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {selectedServiceModal.image && (
                <img
                  src={selectedServiceModal.image}
                  alt={selectedServiceModal.name}
                  className="w-full h-44 object-cover rounded-xl"
                />
              )}

              {selectedServiceModal.description && (
                <p className="text-sm text-[#6B5344] leading-relaxed">
                  {selectedServiceModal.description}
                </p>
              )}

              {selectedServiceModal.exampleImages && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedServiceModal.exampleImages.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Example ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#E8D5C4]">
                <span className="text-xl font-bold text-[#4A3728]">
                  £{selectedServiceModal.price}
                </span>
                <button
                  onClick={() => {
                    toggleService(selectedServiceModal.id);
                    setSelectedServiceModal(null);
                  }}
                  className={`px-5 py-2.5 rounded-full font-bold transition flex items-center gap-2 ${
                    isSelected
                      ? "border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#FAF6F3]"
                      : "bg-[#4A3728] text-white hover:bg-[#3A2B20]"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Minus className="w-4 h-4" /> Remove
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-[#FAF6F3]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#4A3728] mb-4">
            Booking confirmed
          </h2>
          <p className="text-[#6B5344] mb-6">
            Thanks, {clientName}. Your appointment request has been sent — we'll be in touch to
            confirm.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-[#4A3728] text-white font-bold rounded-full hover:bg-[#3A2B20] transition"
          >
            Return to home
          </button>
        </motion.div>
      </div>
    );
  }

  const steps: { id: "services" | "time" | "confirm"; label: string }[] = [
    { id: "services", label: "Services" },
    { id: "time", label: "Time" },
    { id: "confirm", label: "Confirm" },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-[#FAF6F3]">
      <ServiceModal />

      {/* Header */}
      <div className="bg-[#FAF6F3] px-4 sm:px-6 lg:px-10 xl:px-14 py-4">
        <div className="max-w-booking mx-auto flex items-center justify-between">
          <button
            onClick={() =>
              step === "services" ? navigate("/") : setStep(steps[stepIndex - 1].id)
            }
            className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border border-[#E8D5C4] bg-white flex items-center justify-center hover:border-[#4A3728] transition"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-[#4A3728]" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border border-[#E8D5C4] bg-white flex items-center justify-center hover:border-[#4A3728] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6 text-[#4A3728]" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-booking mx-auto px-4 sm:px-6 pb-32 lg:pb-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        {/* Left column */}
        <div className="flex-1 lg:max-w-xl w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-5">
            {steps.map((s, idx) => (
              <span key={s.id} className="flex items-center gap-2">
                <span
                  className={
                    idx === stepIndex
                      ? "text-[#4A3728] font-bold"
                      : idx < stepIndex
                      ? "text-[#4A3728]"
                      : "text-[#B8A897]"
                  }
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-[#D9C9B8]" />}
              </span>
            ))}
          </div>

          {/* Step 1: Services */}
          {step === "services" && (
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#4A3728] mb-5">
                Select services
              </h1>

              {/* Sticky category nav */}
              <div
                ref={pillBarRef}
                className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-8 border-b border-[#E8D5C4] bg-[#FAF6F3]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-nowrap overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        ref={(el) => {
                          pillRefs.current[cat.id] = el;
                        }}
                        onClick={() => goToCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium border transition ${
                          activeCategory === cat.id
                            ? "bg-[#4A3728] border-[#4A3728] text-white"
                            : "bg-white border-[#E8D5C4] text-[#4A3728] hover:border-[#4A3728]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  {/* Menu button: mobile-only, opens a dropdown listing the categories */}
                  <button
                    className="lg:hidden ml-1 w-10 h-10 shrink-0 rounded-full border border-[#E8D5C4] bg-white flex items-center justify-center hover:border-[#4A3728] transition"
                    aria-label="All categories"
                    aria-expanded={showMobileCategoryMenu}
                    onClick={() => setShowMobileCategoryMenu((prev) => !prev)}
                  >
                    <List className="w-4 h-4 text-[#4A3728]" />
                  </button>
                </div>

                {/* Mobile dropdown: lists every category, closes on selection */}
                {showMobileCategoryMenu && (
                  <div className="lg:hidden absolute right-4 sm:right-6 top-full mt-2 w-48 bg-white border border-[#E8D5C4] rounded-xl shadow-lg overflow-hidden z-30">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          goToCategory(cat.id);
                          setShowMobileCategoryMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition ${
                          activeCategory === cat.id
                            ? "bg-[#FAF6F3] text-[#4A3728] font-bold"
                            : "text-[#4A3728] hover:bg-[#FAF6F3]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category sections */}
              <div className="space-y-12">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    ref={(el) => {
                      categoryRefs.current[cat.id] = el;
                    }}
                    className="scroll-mt-24"
                  >
                    <h2 className="font-heading text-xl font-bold text-[#4A3728] mb-1">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-[#6B5344] mb-4 max-w-lg">{cat.description}</p>

                    <div className="space-y-3">
                      {cat.items.map((item: any) => {
                        const selected = isServiceSelected(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`rounded-2xl p-4 flex items-start justify-between gap-4 cursor-pointer transition border-2 ${
                              selected
                                ? "border-[#4A3728] bg-white"
                                : "border-[#E8D5C4] bg-white hover:border-[#4A3728]"
                            }`}
                            onClick={() => setSelectedServiceModal(item)}
                          >
                            <div className="min-w-0">
                              <h3 className="font-heading font-semibold text-[#4A3728]">{item.name}</h3>
                              <p className="text-sm text-[#6B5344] mt-1 line-clamp-2 max-w-md">
                                {item.description}
                              </p>
                              <p className="text-sm font-bold text-[#4A3728] mt-3">
                                £{item.price}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleService(item.id);
                              }}
                              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition ${
                                selected
                                  ? "bg-[#4A3728] text-white"
                                  : "bg-[#FAF6F3] text-[#4A3728] hover:bg-[#E8D5C4]"
                              }`}
                              aria-label={selected ? "Remove" : "Add"}
                            >
                              {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Time */}
          {step === "time" && (
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#4A3728] mb-6">
                Select date &amp; time
              </h1>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full">
                    <ChevronLeft className="w-5 h-5 text-[#4A3728]" />
                  </button>
                  <h3 className="font-heading font-bold text-[#4A3728]">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full">
                    <ChevronRight className="w-5 h-5 text-[#4A3728]" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-[#8B7355] uppercase py-2">
                      {day}
                    </div>
                  ))}
                  {renderCalendar()}
                </div>
              </div>

              {selectedDateStr && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-[#4A3728]">Available times</p>
                  {availableTimeSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-3">
                      No available times for this date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time === selectedTime ? null : time)}
                          className={`py-2.5 px-3 rounded-full border-2 text-sm font-semibold transition ${
                            selectedTime === time
                              ? "bg-[#4A3728] border-[#4A3728] text-white shadow-sm"
                              : "bg-white border-[#E8D5C4] text-[#4A3728] hover:border-[#4A3728]"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#4A3728] mb-6">
                Your details
              </h1>

              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-[#4A3728] mb-2">Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`w-full p-3 border-2 rounded-xl focus:border-[#4A3728] outline-none bg-white ${
                      nameError && clientName ? "border-red-400" : "border-[#E8D5C4]"
                    }`}
                    placeholder="Your name"
                  />
                  {nameError && clientName && (
                    <p className="text-red-500 text-xs mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4A3728] mb-2">
                    Preferred contact method
                  </label>
                  <div className="flex gap-2 mb-3">
                    {(["email", "phone"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setContactMethod(m)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition ${
                          contactMethod === m
                            ? "bg-[#4A3728] border-[#4A3728] text-white"
                            : "bg-white border-[#E8D5C4] text-[#4A3728]"
                        }`}
                      >
                        {m === "email" ? "Email" : "Phone"}
                      </button>
                    ))}
                  </div>

                  {contactMethod === "email" ? (
                    <>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className={`w-full p-3 border-2 rounded-xl focus:border-[#4A3728] outline-none bg-white ${
                          emailError && clientEmail ? "border-red-400" : "border-[#E8D5C4]"
                        }`}
                        placeholder="your@email.com"
                      />
                      {emailError && clientEmail && (
                        <p className="text-red-500 text-xs mt-1">{emailError}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className={`w-full p-3 border-2 rounded-xl focus:border-[#4A3728] outline-none bg-white ${
                          phoneError && clientPhone ? "border-red-400" : "border-[#E8D5C4]"
                        }`}
                        placeholder="07123 456789"
                      />
                      {phoneError && clientPhone && (
                        <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer: keeps the pinned summary's column reserved in the flex row
            so the service list can never run into the card, and ml-auto shoves
            that column hard right — which is what opens up the gap. */}
        <div className="hidden lg:block w-[420px] shrink-0 ml-auto" />

        {/* The summary is PINNED, not sticky: it must not move a single pixel
            while the list scrolls past it. A fixed box escapes the flex row,
            so it re-anchors by replaying this page's own container geometry
            (max-w-booking + px-6 + justify-end) — that tracks the real layout
            width, scrollbar included, at any viewport size, with no maths.
            top-24 clears the header, bottom-6 keeps a margin under the CTA. */}
        <div className="hidden lg:flex fixed top-24 bottom-6 left-0 right-0 z-10 pointer-events-none max-w-booking mx-auto px-6 justify-end">
          <div className="w-[420px] h-full pointer-events-auto flex flex-col bg-white border-2 border-[#E8D5C4] rounded-2xl shadow-sm pt-6 pb-6 px-6">
            {/* Business card */}
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#4A3728] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[#4A3728] truncate">TNL Beauty</h3>
                {/* <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 fill-[#E8B4A8] text-[#E8B4A8]" />
                  <span className="font-bold text-[#4A3728]">4.9</span>
                  <span className="text-[#8B7355]">(238)</span>
                </div> */}
                <div className="flex items-center gap-1 text-xs text-[#8B7355] mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">By appointment · UK</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E8D5C4] my-4 shrink-0" />

            {(step === "time" || step === "confirm") && (
              <div className="space-y-1 mb-4 shrink-0">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7355]">Date</span>
                  <span className="font-medium text-[#4A3728]">
                    {selectedDateStr
                      ? new Date(selectedDateStr).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7355]">Time</span>
                  <span className="font-medium text-[#4A3728]">{selectedTime || "-"}</span>
                </div>
              </div>
            )}

            {/* Services — scrolls internally if the list is long, so the
                card itself never grows past its fixed height */}
            <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
              {selectedCount > 0 ? (
                <div className="space-y-2">
                  {selectedServicesList.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm gap-3">
                      <span className="text-[#4A3728]">{item.name}</span>
                      <span className="font-medium text-[#4A3728] shrink-0">£{item.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No services selected</p>
              )}
            </div>

            <div className="shrink-0 pt-4">
              <div className="h-px bg-[#E8D5C4] mb-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-[#4A3728]">Total</span>
                <span className="font-black text-[#4A3728] text-xl">
                  {totalPrice > 0 ? `£${totalPrice}` : "free"}
                </span>
              </div>

              {step === "services" && (
                <button
                  onClick={() => setStep("time")}
                  disabled={selectedCoreServices.length === 0}
                  className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center gap-2 ${
                    selectedCoreServices.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#4A3728] text-white hover:bg-[#3A2B20] shadow-sm"
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {step === "time" && (
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!selectedDateStr || !selectedTime}
                  className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center gap-2 ${
                    !selectedDateStr || !selectedTime
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#4A3728] text-white hover:bg-[#3A2B20] shadow-sm"
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {step === "confirm" && (
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !!validateName(clientName) ||
                    (contactMethod === "email" ? !!validateEmail(clientEmail) : !!validatePhone(clientPhone))
                  }
                  className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center gap-2 ${
                    submitting ||
                    !!validateName(clientName) ||
                    (contactMethod === "email" ? !!validateEmail(clientEmail) : !!validatePhone(clientPhone))
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#4A3728] text-white hover:bg-[#3A2B20] shadow-sm"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm booking"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8D5C4] p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#4A3728]">
                {totalPrice > 0 ? `£${totalPrice}` : "free"}
              </p>
              <p className="text-xs text-[#8B7355] truncate">
                {selectedCount} service{selectedCount !== 1 ? "s" : ""}
                {selectedDateStr
                  ? ` · ${new Date(selectedDateStr).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}`
                  : ""}
                {selectedTime ? ` · ${selectedTime}` : ""}
              </p>
            </div>
            {step === "services" && (
              <button
                onClick={() => setStep("time")}
                disabled={selectedCoreServices.length === 0}
                className={`shrink-0 px-6 py-3 rounded-full font-bold transition flex items-center gap-2 ${
                  selectedCoreServices.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#4A3728] text-white"
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === "time" && (
              <button
                onClick={() => setStep("confirm")}
                disabled={!selectedDateStr || !selectedTime}
                className={`shrink-0 px-6 py-3 rounded-full font-bold transition flex items-center gap-2 ${
                  !selectedDateStr || !selectedTime
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#4A3728] text-white"
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === "confirm" && (
              <button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !!validateName(clientName) ||
                  (contactMethod === "email" ? !!validateEmail(clientEmail) : !!validatePhone(clientPhone))
                }
                className={`shrink-0 px-6 py-3 rounded-full font-bold transition flex items-center gap-2 ${
                  submitting ? "bg-gray-200 text-gray-400" : "bg-[#4A3728] text-white"
                }`}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden h-24"></div>
    </div>
  );
}
