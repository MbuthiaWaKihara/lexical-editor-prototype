type ConsoleLevel = "log" | "warn" | "error" | "info";

function bridgeConsole(level: ConsoleLevel) {
  const original = console[level];

  console[level] = (...args: any[]) => {
    // Call original console (for browser debugging)
    original(...args);

    // Forward to React Native
    // @ts-ignore
    if (window.ReactNativeWebView?.postMessage) {
    //@ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "console",
          level,
          args: args.map((arg) =>
            typeof arg === "string" ? arg : JSON.stringify(arg)
          ),
        })
      );
    }
  };
}

export function installWebViewConsoleBridge() {
  (["log", "warn", "error", "info"] as ConsoleLevel[]).forEach(
    bridgeConsole
  );
}