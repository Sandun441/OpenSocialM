// frontend/src/components/ErrorBoundary.js
import React from 'react';
import ThemeToggle from '../ThemeToggle';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
           <ThemeToggle />
          Something went wrong. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}