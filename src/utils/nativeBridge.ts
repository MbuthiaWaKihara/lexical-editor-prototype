export function sendToNative(data: unknown) {
  // React Native injects this
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify(data)
    );
  }
}