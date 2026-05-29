import fs from "node:fs";

const service = fs.readFileSync("src/service/mod.rs", "utf8");
const install = fs.readFileSync("src/install.rs", "utf8");
const uninstall = fs.readFileSync("src/uninstall.rs", "utf8");

const checks = [
  {
    name: "legacy service listens on the legacy-only HTTP port",
    passed: service.includes("const LISTEN_PORT: u16 = 33212;"),
  },
  {
    name: "runtime service name is legacy-only",
    passed:
      service.includes('const SERVICE_NAME: &str = "clash_verge_legacy_service";') &&
      !service.includes('const SERVICE_NAME: &str = "clash_verge_service";'),
  },
  {
    name: "installer and uninstaller manage the legacy Windows service",
    passed:
      install.includes('"clash_verge_legacy_service"') &&
      uninstall.includes('"clash_verge_legacy_service"') &&
      !install.includes('"clash_verge_service"') &&
      !uninstall.includes('"clash_verge_service"'),
  },
];

const failed = checks.filter((item) => !item.passed);

for (const item of checks) {
  console.log(`${item.passed ? "ok" : "not ok"} - ${item.name}`);
}

if (failed.length) {
  process.exitCode = 1;
}
