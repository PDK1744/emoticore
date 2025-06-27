import { redirect } from "next/navigation";

export function encodedRedirect(type: string, path: string, message: string): never {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}