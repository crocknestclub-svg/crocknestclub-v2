import React, { useState } from "react";

const tabs = ["Description", "Details", "Shipping"];

export default function ProductTabs({ description }: { description: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mb-4">
      <div className="flex gap-4 border-b mb-2">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActive(i)} className={`pb-2 font-medium ${active===i?'border-b-2 border-primary':'border-b-2 border-transparent'}`}>{tab}</button>
        ))}
      </div>
      <div className="p-2">
        {active===0 && <div>{description}</div>}
        {active===1 && <div>Details about the product...</div>}
        {active===2 && <div>Shipping info...</div>}
      </div>
    </div>
  );
}
