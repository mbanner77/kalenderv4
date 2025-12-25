"use client";

import { useState } from "react";

export default function Page() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Willkommen
        </h1>
        <p className="text-gray-600">
          Die App wird generiert. Bitte starte eine neue Generierung.
        </p>
      </div>
    </main>
  );
}