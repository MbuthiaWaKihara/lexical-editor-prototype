import { createContext, useContext, useState } from "react";

type EditorConfig = {
  mentionsUrl?: string;
  accessToken?: string;
};

const EditorConfigContext = createContext<{
  config: EditorConfig;
  setConfig: (c: EditorConfig) => void;
}>({
  config: {},
  setConfig: () => {},
});

export const EditorConfigProvider = ({ children }: any) => {
  const [config, setConfig] = useState<EditorConfig>({});

  return (
    <EditorConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </EditorConfigContext.Provider>
  );
};

export const useEditorConfig = () => useContext(EditorConfigContext);