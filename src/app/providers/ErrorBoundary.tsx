
import React from "react";
import { useLogs } from "./LogsProvider";

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<{children:React.ReactNode}, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:40,textAlign:"center"}}>
          <h2>🚨 خطای سیستمی رخ داد</h2>
          <p>لطفاً صفحه را رفرش کنید.</p>
          <button onClick={()=>window.location.reload()}>رفرش</button>
        </div>
      );
    }
    return this.props.children;
  }
}
