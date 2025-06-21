import { create } from "zustand";
import { z } from "zod";
import { debounce } from "lodash"

export const authLoginSliceSchema =z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
  password: z.string().min(1, {
    message: "Password Required!",
  }),
  code: z.optional(z.string()),
});

export type AuthData = z.infer<typeof authLoginSliceSchema>;

interface AuthState{
  formData: AuthData;
  errors: Record<string, string[]>
  loading: boolean;
  setFormData: (data: Partial<AuthData>) => void;
  validateForm: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  formData: {
    email: "",
    password: "",
    code: ""
  },
  errors: {},
  loading: false,
  setFormData: debounce((data) => {
    set((state) => ({ formData: { ...state.formData, ...data }, errors: {} }))
  }, 500),//debounced input values
  validateForm: () => {
    const result = authLoginSliceSchema.safeParse(
      useAuthStore.getState().formData
    );
    if (!result.success) {
      set({ errors: result.error.flatten().fieldErrors })
      return false;
    }
    return true;
  }
}))
