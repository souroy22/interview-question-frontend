import fs from "fs-extra";

const content = `[[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
    force = false`;

// Path to the dist folder
const distPath = "dist";
const filePath = `${distPath}/netlify.toml`;

// Ensure the dist folder exists
fs.ensureDirSync(distPath);

// Write content to netlify.toml
fs.writeFileSync(filePath, content);

console.log(`netlify.toml file generated at ${filePath}`);
