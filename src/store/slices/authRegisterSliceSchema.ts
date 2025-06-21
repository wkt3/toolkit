import { create } from "zustand";
import { z } from "zod";
import { debounce } from "lodash"

export const authRegisterSliceSchema = z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
  name: z
    .string()
    .min(2, {
      message: "Minimum 2 Characters Required!",
    })
    .max(25, {
      message: "Maximum 25 characters allowed for name",
    }),
    password: z
    .string()
    .min(8, { message: "Must have at least 8 character eg:= Capital3*" })
    .regex(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      ),
      {
        message:
          "Minimum 8 Characters Required(1.lowerCase, 1.UpperCase, 1.Number, 1.Special-Character) for eg:- John_123*#",
      }
    ),
});

export type AuthData = z.infer<typeof authRegisterSliceSchema>;

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
    name: ""
  },
  errors: {},
  loading: false,
  setFormData: debounce((data) => {
    set((state) => ({ formData: { ...state.formData, ...data }, errors: {} }))
  }, 500),//debounced input values
  validateForm: () => {
    const result = authRegisterSliceSchema.safeParse(
      useAuthStore.getState().formData
    );
    if (!result.success) {
      set({ errors: result.error.flatten().fieldErrors })
      return false;
    }
    return true;
  }
}))
