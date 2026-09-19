import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Phone, MapPin, Loader2, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../routes/routeConfig";
import { validateForm } from "../../utils/validators";
import {
  getStateDistrictList,
  getVillageList,
} from "../../services/api";
import { CONTENT } from "../../constants/content";
import { 
  Button, 
  Card, 
  Input, 
  AuthLayout, 
  FieldGroup,
  SectionTitle,
  FormError
} from "../../components/ui";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobileNumber || "";

  const { register, isLoading, error, clearError } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: mobile,
    state: "",
    district: "",
    tehsil: "",
    village: "",
    stateId: null,
    districtId: null,
    tehsilId: null,
    villageId: null,
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});

  const [stateDistrictList, setStateDistrictList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [loadingSD, setLoadingSD] = useState(false);
  const [loadingVillage, setLoadingVillage] = useState(false);

  const stateOptions = [
    ...new Set(stateDistrictList.map((i) => i.state)),
  ].filter(Boolean);
  const districtOptions = stateDistrictList
    .filter((i) => i.state === form.state)
    .map((i) => i.district)
    .filter(Boolean);
  const tehsilOptions = [...new Set(villageList.map((i) => i.tehsil))].filter(
    Boolean,
  );
  const villageOptions = villageList.filter((i) => i.tehsil === form.tehsil);

  useEffect(() => {
    setLoadingSD(true);
    getStateDistrictList()
      .then((data) => setStateDistrictList(data))
      .catch(() => {})
      .finally(() => setLoadingSD(false));
  }, []);

  useEffect(() => {
    if (!form.districtId) return;
    setVillageList([]);
    setForm((p) => ({
      ...p,
      tehsil: "",
      village: "",
      tehsilId: null,
      villageId: null,
      latitude: "",
      longitude: "",
    }));
    setLoadingVillage(true);
    getVillageList(form.districtId)
      .then((data) => setVillageList(data))
      .catch(() => {})
      .finally(() => setLoadingVillage(false));
  }, [form.districtId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
    if (error) clearError();
  };

  const handleStateSelect = (state) => {
    const found = stateDistrictList.find((i) => i.state === state);
    setVillageList([]);
    setForm((p) => ({
      ...p,
      state,
      stateId: found?.stateId ?? null,
      district: "",
      tehsil: "",
      village: "",
      districtId: null,
      tehsilId: null,
      villageId: null,
      latitude: "",
      longitude: "",
    }));
  };

  const handleDistrictSelect = (district) => {
    const found = stateDistrictList.find(
      (i) => i.state === form.state && i.district === district,
    );
    setForm((p) => ({
      ...p,
      district,
      districtId: found?.districtId ?? null,
      tehsil: "",
      village: "",
      tehsilId: null,
      villageId: null,
      latitude: "",
      longitude: "",
    }));
  };

  const handleTehsilSelect = (tehsil) => {
    const found = villageList.find((v) => v.tehsil === tehsil);
    setForm((p) => ({
      ...p,
      tehsil,
      tehsilId: found?.tehsilId ?? null,
      village: "",
      villageId: null,
      latitude: "",
      longitude: "",
    }));
  };

  const handleVillageSelect = (villageName) => {
    const found = villageList.find((v) => v.village === villageName);
    if (!found) return;
    setForm((p) => ({
      ...p,
      village: found.village,
      tehsil: found.tehsil,
      villageId: found.villageId,
      tehsilId: found.tehsilId,
      latitude: found.latitude,
      longitude: found.longitude,
    }));
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, "");
    handleChange("firstName", value.charAt(0).toUpperCase() + value.slice(1));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, "");
    handleChange("lastName", value.charAt(0).toUpperCase() + value.slice(1));
  };

  const handleSubmit = async () => {
    const { errors: formErrors, isValid } = validateForm({
      firstName: form.firstName,
      lastName: form.lastName,
    });
    if (!isValid) {
      setErrors(formErrors);
      return;
    }
    await register({ ...form, mobileNumber: mobile });
  };

  // ── Fixed LocationField ───────────────────────────────────────────────────
  const LocationField = ({
    label,
    field,
    value,
    onSelect,
    options,
    disabled,
    loading,
    placeholder,
  }) => {
    const [search, setSearch] = useState("");
    const [showDrop, setShowDrop] = useState(false);

    // Jab bahar se value set ho (select), input mein reflect karo
    useEffect(() => {
      setSearch(value || "");
    }, [value]);

    const filtered = search
      ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
      : options;

    const handleSelect = (opt) => {
      onSelect(opt);
      setSearch(opt);
      setShowDrop(false);
    };

    const handleClear = () => {
      onSelect("");
      setSearch("");
    };

    return (
      <div className="relative">
        <FieldGroup 
          label={label} 
          icon={loading ? Loader2 : MapPin} 
          error={errors[field]}
        >
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDrop(true);
            }}
            onFocus={() => setShowDrop(true)}
            onBlur={() => setTimeout(() => setShowDrop(false), 150)}
            placeholder={loading ? CONTENT.auth.register.loadingData : placeholder}
            disabled={disabled || loading}
            className="border-none shadow-none focus-visible:ring-0 flex-1 px-3 py-2.5 bg-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          />
          {value && !disabled && (
            <button onClick={handleClear} className="pr-3 flex items-center bg-transparent">
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </FieldGroup>
        {showDrop && filtered.length > 0 && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-green-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
            {filtered.map((opt) => (
              <button
                key={opt}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt);
                }}
                className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm text-gray-700 border-b last:border-b-0"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AuthLayout className="pt-3 pb-5">
      <Card className="h-full flex flex-col max-w-lg w-full mx-auto p-0 overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 pt-4 pb-4 flex-shrink-0">
          <SectionTitle className="text-base text-white text-center w-full">
            {CONTENT.auth.register.title}
          </SectionTitle>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <FieldGroup
            label={CONTENT.auth.register.firstNameLabel}
            icon={User}
            error={errors.firstName}
            required
          >
            <Input
              type="text"
              value={form.firstName}
              onChange={handleFirstNameChange}
              placeholder={CONTENT.auth.register.firstNamePlaceholder}
              className="border-none shadow-none focus-visible:ring-0 flex-1 px-4 py-2.5"
            />
          </FieldGroup>

          <FieldGroup
            label={CONTENT.auth.register.lastNameLabel}
            icon={User}
            error={errors.lastName}
            required
          >
            <Input
              type="text"
              value={form.lastName}
              onChange={handleLastNameChange}
              placeholder={CONTENT.auth.register.lastNamePlaceholder}
              className="border-none shadow-none focus-visible:ring-0 flex-1 px-4 py-2.5"
            />
          </FieldGroup>

          <FieldGroup
            label={CONTENT.auth.register.mobileLabel}
            icon={Phone}
          >
            <Input
              type="text"
              value={`+91 ${mobile}`}
              readOnly
              className="border-none shadow-none focus-visible:ring-0 flex-1 px-4 py-2.5 bg-gray-100 cursor-not-allowed text-gray-400"
            />
          </FieldGroup>

            <div className="flex items-center gap-2 pt-1">
              <MapPin className="w-4 h-4 text-green-500" />
              <h3 className="text-base font-bold text-gray-800">
                {CONTENT.auth.register.locationTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <LocationField
                label={CONTENT.auth.register.stateLabel}
                field="state"
                value={form.state}
                onSelect={handleStateSelect}
                options={stateOptions}
                loading={loadingSD}
                placeholder={CONTENT.auth.register.statePlaceholder}
              />
              <LocationField
                label={CONTENT.auth.register.districtLabel}
                field="district"
                value={form.district}
                onSelect={handleDistrictSelect}
                options={districtOptions}
                disabled={!form.state}
                placeholder={CONTENT.auth.register.districtPlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <LocationField
                label={CONTENT.auth.register.tehsilLabel}
                field="tehsil"
                value={form.tehsil}
                onSelect={handleTehsilSelect}
                options={tehsilOptions}
                disabled={!form.district}
                loading={loadingVillage}
                placeholder={CONTENT.auth.register.tehsilPlaceholder}
              />
              <LocationField
                label={CONTENT.auth.register.villageLabel}
                field="village"
                value={form.village}
                onSelect={handleVillageSelect}
                options={villageOptions.map((v) => v.village)}
                disabled={!form.tehsil}
                placeholder={CONTENT.auth.register.villagePlaceholder}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !form.firstName || !form.lastName}
              variant={isLoading || !form.firstName || !form.lastName ? "secondary" : "primary"}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{CONTENT.auth.register.buttonLoadingText}</span>
                </>
              ) : (
                CONTENT.auth.register.buttonText
              )}
            </Button>
            <div className="h-1" />
          </div>
        </Card>
    </AuthLayout>
  );
};

export default Register;