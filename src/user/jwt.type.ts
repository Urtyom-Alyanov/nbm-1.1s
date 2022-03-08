import { JwtPayload } from "jsonwebtoken";

export interface JwtCustomPayload extends JwtPayload {
    uId: number;
    typ: "access" | "refresh";
};