"use client";

import { useCounterStore } from "@/zustand/useCounterStore";

export default function Home() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-600">Hello, Zustand! 🚀</h1>
        <p className="mt-2 text-gray-600">Counter State with Zustand:</p>
        <div className="mt-4">
          <p className="text-lg font-medium">Count: {count}</p>
          <div className="flex gap-4 justify-center mt-2">
            <button
              onClick={decrement}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
            >
              - Decrement
            </button>
            <button
              onClick={increment}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
            >
              + Increment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
