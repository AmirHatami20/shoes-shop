import jwt from "jsonwebtoken";
import {NextRequest} from "next/server";

export interface JwtPayload {
    id: number;
    role?: "user" | "admin";
    iat?: number;
    exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = "7d";

export function signToken(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

export function decodeToken(token: string) {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch {
        return null;
    }
}

export function getUserIdFromRequest(req: NextRequest): number | null {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    return decoded.id;
}

export function getUserRoleFromRequest(req: NextRequest): "user" | "admin" | null {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.role) return null;

    return decoded.role;
}

