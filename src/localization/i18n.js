const path = require("path");
const i18n = require("i18n");

i18n.configure({
    locales: ["ru", "uz"],
    defaultLocale: "uz",
    directory: path.join(__dirname, "locales"),
    objectNotation: true,
    updateFiles: false,
    syncFiles: false,
    register: global,
});

module.exports = i18n;
