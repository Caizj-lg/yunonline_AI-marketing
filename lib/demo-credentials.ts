const demoAccounts: Record<string, string> = {
  admin: "admin135",
  admin_01: "aigeo802274",
};

export function isDemoCredential(username: string, password: string) {
  return Object.hasOwn(demoAccounts, username) && demoAccounts[username] === password;
}
