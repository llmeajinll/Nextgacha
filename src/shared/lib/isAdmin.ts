export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  return adminEmails.includes(email);
}
