const appName = process.env.NEXT_PUBLIC_APP_NAME || "Gravity";

export const siteConfig = {
  name: appName,
  title: `${appName} AI`,
  description: `Cerebro de ${appName} con Protección Anti-Baneo`,
  aiPlaceholder: `Ej: ${appName} AI`,
  connectionText: `Escanea el código para activar la Inteligencia de ${appName}`
};
