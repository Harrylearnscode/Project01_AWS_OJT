import React from "react";
import clsx from "clsx";

export function Card({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-2xl shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={clsx("p-4", className)}>{children}</div>;
}
