import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(6),
});

export default function Admin() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Access Denied",
      description: "This is a mockup. No backend connected.",
      variant: "destructive"
    });
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-stone-200 border-2 border-black p-8 shadow-brutal">
        <div className="flex justify-center mb-6">
          <div className="bg-black text-white p-4 rounded-full">
            <Lock size={32} />
          </div>
        </div>
        
        <h1 className="font-serif text-3xl text-center mb-8">Restricted Area</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase font-bold">Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-black shadow-brutal-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase font-bold">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-white border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-black shadow-brutal-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-black text-white rounded-none font-mono hover:bg-stone-800">
              LOGIN
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
