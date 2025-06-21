"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { sendMail } from "@/lib/sendMail";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CardWrapper from "./CardWrapper";
import { contactFormSchema } from "@/schemas";


export default function ContactForm() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    const mailText = `Name:${values.name}\n Email:{values.eamil}\n Message: ${values.message}`;
    const response = await sendMail({
      email: values.email,
      subject: "New Contact Us Form",
      text: mailText,
    });

    if (response?.messageId) {
      toast.success("Application Submitted Successfully");
    } else {
      toast.error("Failed to send application");
    }
  };
  return (
    <CardWrapper
      headerLabel="Contact Us"
      backButtonLabel="Visit Website"
      backButtonHref="/"
    >
      <Form {...form}>
        <form
          className="grid grid-cols-3 items-center p-4 lg;p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="col-span-3 flex flex-col gap-4 lg:col-span-3 lg:gap-6">
            <h2 className="lg:text-xl">Enter your Good Name Here</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="john-Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h2 className="lg:text-xl">Enter Email Here</h2>
            <FormField
              control={form.control}
              name="email"
              render={({ ...field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h2 className="lg:text-xl">Enter Your Message Here:</h2>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="My question is which framework do you prefer to use?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}