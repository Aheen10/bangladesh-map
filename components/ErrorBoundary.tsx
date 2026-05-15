"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
          <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কিছু একটা সমস্যা হয়েছে</h2>
            <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}