type OtpRow = { code: string; expiresAt: number };

const otps = new Map<string, OtpRow>();

export function setOtp(phone: string, code: string, expiresAt: number): void {
  otps.set(phone, { code, expiresAt });
}

export function issueOtp(phone: string, now = Date.now()): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  setOtp(phone, code, now + 10 * 60 * 1000);
  return code;
}

export function verifyOtp(phone: string, code: string, now = Date.now()): boolean {
  const row = otps.get(phone);
  if (!row || row.expiresAt < now) return false;
  return row.code === code;
}
