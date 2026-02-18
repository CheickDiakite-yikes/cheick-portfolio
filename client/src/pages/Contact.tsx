import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Message Sent",
      description: "Thanks for reaching out! I'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl md:text-7xl mb-4">Get in Touch.</h1>
        <p className="font-mono opacity-60">Available for freelance work and collaborations.</p>
      </div>

      <div className="bg-white p-8 md:p-12 border-4 border-black shadow-brutal-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase font-bold tracking-wider">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="hello@example.com" {...field} className="border-x-0 border-t-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all bg-transparent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase font-bold tracking-wider">Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Inquiry" {...field} className="border-x-0 border-t-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all bg-transparent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase font-bold tracking-wider">Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell me about your project..." {...field} className="border-2 border-black rounded-none min-h-[150px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-stone-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-none bg-black text-white hover:bg-stone-800 font-mono uppercase tracking-widest py-8 text-lg shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all active:shadow-none active:translate-y-0 active:translate-x-0">
              Send Message
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="mt-16 text-center">
         <p className="font-serif italic text-2xl">"Let's build something honest."</p>
      </div>
    </div>
  );
}
