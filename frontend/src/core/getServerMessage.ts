type ServerError = {
    data?: { detail?: unknown };
    error?: unknown;
};

/** Extracts a readable message from an RTK Query error, with caller-specific fallback. */
export function getServerMessage(e: unknown, fallback: string): string {
    const err = e as ServerError;
    const d = err?.data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) return d.map((x: { msg?: string }) => x.msg ?? JSON.stringify(x)).join(", ");
    if (typeof err?.error === "string") return err.error;
    return fallback;
}
