/**
 * Unique, up-to-10-digit Employee Id. The Add Employee form pre-fills the next free
 * Id, so parallel tests would otherwise collide ("Employee Id already exists").
 */
export function uniqueEmployeeId(): string {
  return `${Date.now() % 1_000_000_000}${Math.floor(Math.random() * 10)}`;
}

/** Letters-only suffix so generated names stay valid and searchable. */
export function uniqueSuffix(): string {
  return Math.random().toString(36).replace(/[^a-z]/g, '').slice(0, 6).padEnd(6, 'x');
}
