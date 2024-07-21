import { JWTExpired, JWTInvalid } from "jose/errors";
import { z } from "zod";

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export function handleError(error: unknown): ErrorResponse {
  // Ensure the function is named correctly
  if (error instanceof z.ZodError) {
    console.error("Validation error:", error.errors);
    return {
      success: false,
      message: "Invalid input data",
      errors: error.errors,
    };
  } else if (error instanceof JWTExpired) {
    console.error("JWT expired error:", error.message);
    return { success: false, message: "Token has expired" };
  } else if (error instanceof JWTInvalid) {
    console.error("JWT invalid error:", error.message);
    return { success: false, message: "Invalid token" };
  } else if (error instanceof Error) {
    console.error("Error:", error.message);
    return { success: false, message: "An error occurred" };
  } else {
    console.error("Unknown error:", error);
    return { success: false, message: "An unknown error occurred" };
  }
}
