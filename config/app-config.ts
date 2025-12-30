import packageJson from "@/package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "E-SUMMIT'26",
  version: packageJson.version,
  copyright: `© ${currentYear}, EDC's ESUMMIT'26 Admin.`,
  meta: {
    title: "EDC's ESUMMIT'26 Admin Dashboard",
    description:
      "Admin panel for managing E-Summit 2026 organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra.",
  },
};
