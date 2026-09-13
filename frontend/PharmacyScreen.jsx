import { useState, useRef } from "react";
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Pill,
  ShoppingCart,
  X,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  Package,
} from "lucide-react";
import { TiltCard } from "../common/TiltCard.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { Chip } from "../common/Chip.jsx";
import { MEDICINE_CATEGORIES, EMPTY_MEDICINE_FORM, slugifyMedicineId } from "../../constants/medicines.js";
import { C, glassStyle } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: PHARMACY / ORDER MEDICINES ONLINE
----------------------------------------------------------------*/
export function PharmacyScreen({ isStaff = false, catalog, onAddMedicine }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({}); // id -> qty
  const [view, setView] = useState("browse"); // browse | cart | checkout | placed | addMedicine
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
  const [rxFile, setRxFile] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [newMedicine, setNewMedicine] = useState(EMPTY_MEDICINE_FORM);
  const rxInputRef = useRef(null);

  const filtered = catalog.filter((m) => {
    const matchesCategory = category === "All" || m.category === category;
    const matchesQuery = !query.trim() || m.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...catalog.find((m) => m.id === id), qty }))
    .filter((i) => i.id);

  const canAddMedicine = !!(newMedicine.name.trim() && newMedicine.packSize.trim() && Number(newMedicine.price) > 0);

  const submitNewMedicine = () => {
    if (!canAddMedicine) return;
    const id = slugifyMedicineId(newMedicine.name, new Set(catalog.map((m) => m.id)));
    onAddMedicine?.({
      id,
      name: newMedicine.name.trim(),
      category: newMedicine.category,
      packSize: newMedicine.packSize.trim(),
      price: Math.round(Number(newMedicine.price)),
      rx: newMedicine.rx,
    });
    setNewMedicine(EMPTY_MEDICINE_FORM);
    setView("browse");
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const needsRx = cartItems.some((i) => i.rx);

  const setQty = (id, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };
  const addToCart = (id) => setQty(id, (cart[id] || 0) + 1);

  const canPlaceOrder = !!(orderForm.name.trim() && orderForm.phone.trim() && orderForm.address.trim() && (!needsRx || rxFile));

  const placeOrder = () => {
    if (!canPlaceOrder || placing) return;
    setPlacing(true);
    setTimeout(() => {
      setOrderId(`MK-${Date.now().toString().slice(-8)}`);
      setPlacing(false);
      setView("placed");
    }, 700);
  };

  const resetOrder = () => {
    setCart({});
    setOrderForm({ name: "", phone: "", address: "" });
    setRxFile(null);
    setView("browse");
  };

  if (view === "placed") {
    return (
      <div className="mk-screen max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: C.successPale }}>
          <Package size={28} color={C.success} />
        </div>
        <h2 className="text-2xl mt-5" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Order placed</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          Order {orderId} for {cartCount} item{cartCount > 1 ? "s" : ""} is confirmed. Expect delivery within 24–48 hours — the pharmacy will call {orderForm.phone} to confirm.
        </p>
        <div className="mt-8">
          <PrimaryButton full onClick={resetOrder}>Order more medicines</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-screen max-w-3xl mx-auto px-6 py-10 pb-28">
      <ShoppingBag size={26} color={C.primary} />
      <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Order medicines online</h2>
      <p className="text-sm mt-2" style={{ color: C.inkSoft }}>Search or browse below — prescription medicines need a photo of your prescription at checkout.</p>

      <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-xl" style={glassStyle()}>
        <Search size={16} color={C.inkSoft} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicines…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: C.ink }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {MEDICINE_CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>
        {isStaff && (
          <GhostButton icon={Plus} onClick={() => { setNewMedicine(EMPTY_MEDICINE_FORM); setView("addMedicine"); }}>
            Add medicine
          </GhostButton>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {filtered.map((m) => {
          const qty = cart[m.id] || 0;
          return (
            <TiltCard key={m.id} className="p-4" maxTilt={2.5} radius={18}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{m.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{m.packSize}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: C.primaryDeep }}>₹{m.price}</span>
                    {m.rx && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.warningPale, color: C.warning }}>Rx required</span>
                    )}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
                  <Pill size={16} color={C.primaryDeep} />
                </div>
              </div>
              <div className="mt-3">
                {qty === 0 ? (
                  <GhostButton icon={Plus} onClick={() => addToCart(m.id)}>Add</GhostButton>
                ) : (
                  <div className="flex items-center gap-3 rounded-full px-1 py-1 w-fit" style={{ background: C.primaryPale }}>
                    <button onClick={() => setQty(m.id, qty - 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#FFFFFF" }}>
                      <Minus size={13} color={C.primaryDeep} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center" style={{ color: C.primaryDeep }}>{qty}</span>
                    <button onClick={() => setQty(m.id, qty + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#FFFFFF" }}>
                      <Plus size={13} color={C.primaryDeep} />
                    </button>
                  </div>
                )}
              </div>
            </TiltCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 text-sm text-center py-10" style={{ color: C.inkSoft }}>No medicines match your search.</div>
        )}
      </div>

      {cartCount > 0 && view === "browse" && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-20">
          <button onClick={() => setView("cart")} className="flex items-center gap-3 px-5 py-3.5 rounded-full max-w-md w-full sm:w-auto" style={{ ...glassStyle({ background: C.ink }), color: "#fff" }}>
            <ShoppingCart size={18} />
            <span className="text-sm font-semibold flex-1 text-left">{cartCount} item{cartCount > 1 ? "s" : ""} · ₹{cartTotal}</span>
            <span className="text-sm font-semibold" style={{ color: C.primaryLight }}>View cart →</span>
          </button>
        </div>
      )}

      {(view === "cart" || view === "checkout") && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-0 sm:px-4" style={{ background: "rgba(32,36,31,0.45)" }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto" style={glassStyle({ background: "#FFFFFF" })}>
            {view === "cart" ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold" style={{ color: C.ink }}>Your cart</div>
                  <button onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
                </div>
                {cartItems.length === 0 ? (
                  <div className="text-sm text-center py-10" style={{ color: C.inkSoft }}>Your cart is empty.</div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((i) => (
                      <div key={i.id} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{i.name}</div>
                          <div className="text-xs" style={{ color: C.inkSoft }}>₹{i.price} × {i.qty}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${C.line}` }}>
                            <Minus size={12} color={C.ink} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center" style={{ color: C.ink }}>{i.qty}</span>
                          <button onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${C.line}` }}>
                            <Plus size={12} color={C.ink} />
                          </button>
                        </div>
                        <button onClick={() => setQty(i.id, 0)}><Trash2 size={15} color={C.alert} /></button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px dashed ${C.line}` }}>
                      <span className="text-sm font-semibold" style={{ color: C.ink }}>Total</span>
                      <span className="text-sm font-semibold" style={{ color: C.ink }}>₹{cartTotal}</span>
                    </div>
                    <PrimaryButton full icon={ChevronRight} onClick={() => setView("checkout")}>Checkout</PrimaryButton>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setView("cart")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.inkSoft }}>
                    <ChevronLeft size={14} /> Back to cart
                  </button>
                  <button onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
                </div>
                <div className="text-sm font-semibold mb-4" style={{ color: C.ink }}>Delivery details</div>
                <div className="space-y-3">
                  <input value={orderForm.name} onChange={(e) => setOrderForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
                  <input value={orderForm.phone} onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+ ]/g, "").slice(0, 15) }))} placeholder="Phone number" inputMode="tel" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
                  <textarea value={orderForm.address} onChange={(e) => setOrderForm((f) => ({ ...f, address: e.target.value }))} placeholder="Delivery address" rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ border: `1.5px solid ${C.line}` }} />
                </div>

                {needsRx && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold mb-2" style={{ color: C.ink }}>Your cart has a prescription medicine — upload your prescription</div>
                    <input ref={rxInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setRxFile(e.target.files?.[0] || null)} />
                    <button onClick={() => rxInputRef.current?.click()} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ border: `1.5px dashed ${C.line}`, color: rxFile ? C.ink : C.inkSoft }}>
                      <Upload size={15} />
                      {rxFile ? rxFile.name : "Upload prescription photo or PDF"}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: `1px dashed ${C.line}` }}>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>Total</span>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>₹{cartTotal}</span>
                </div>
                <div className="mt-4">
                  <PrimaryButton full icon={CheckCircle2} onClick={placeOrder} disabled={!canPlaceOrder || placing}>
                    {placing ? "Placing order…" : "Place order"}
                  </PrimaryButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isStaff && view === "addMedicine" && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-0 sm:px-4" style={{ background: "rgba(32,36,31,0.45)" }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto" style={glassStyle({ background: "#FFFFFF" })}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold" style={{ color: C.ink }}>Add medicine to catalog</div>
              <button onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
            </div>
            <div className="space-y-3">
              <input
                value={newMedicine.name}
                onChange={(e) => setNewMedicine((f) => ({ ...f, name: e.target.value }))}
                placeholder="Medicine name (e.g. Azithromycin 500mg)"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: `1.5px solid ${C.line}` }}
              />
              <select
                value={newMedicine.category}
                onChange={(e) => setNewMedicine((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-white"
                style={{ border: `1.5px solid ${C.line}`, color: C.ink }}
              >
                {MEDICINE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                value={newMedicine.packSize}
                onChange={(e) => setNewMedicine((f) => ({ ...f, packSize: e.target.value }))}
                placeholder="Pack size (e.g. Strip of 10 tablets)"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: `1.5px solid ${C.line}` }}
              />
              <input
                value={newMedicine.price}
                onChange={(e) => setNewMedicine((f) => ({ ...f, price: e.target.value.replace(/[^\d]/g, "") }))}
                placeholder="Price (₹)"
                inputMode="numeric"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: `1.5px solid ${C.line}` }}
              />
              <label className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                <input
                  type="checkbox"
                  checked={newMedicine.rx}
                  onChange={(e) => setNewMedicine((f) => ({ ...f, rx: e.target.checked }))}
                />
                Requires prescription (Rx)
              </label>
            </div>
            <div className="mt-5">
              <PrimaryButton full icon={Plus} onClick={submitNewMedicine} disabled={!canAddMedicine}>
                Add to catalog
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
