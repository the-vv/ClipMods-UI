export const themeName = 'clipModsTheme';

export const setMonacoTheme = () => {
  const monaco = (window as any).monaco;
  monaco.editor.defineTheme(themeName, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '1E1E1E', foreground: 'D4D4D4' },
      { token: 'comment', foreground: '008800', fontStyle: 'italic' },
      // { token: 'keyword', foreground: 'DE9087', fontStyle: 'bold' },
    ],
    colors: {
      'editor.background': '#18181b',
      'editor.foreground': '#18181b',
    }
  });
  monaco.editor.setTheme(themeName);
  return themeName;
}

