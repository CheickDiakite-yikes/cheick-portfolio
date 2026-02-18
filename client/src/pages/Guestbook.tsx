import { StickyNote } from "@/components/StickyNote";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  message: z.string().min(5, "Message must be at least 5 characters."),
});

// Mock data for initial guestbook entries
const initialEntries = [
  { name: "Sarah", message: "Love the brutalist vibe!", color: "pink", rotate: -2 },
  { name: "Mike", message: "Very clean portfolio.", color: "blue", rotate: 3 },
  { name: "Alex", message: "Hi from NYC!", color: "yellow", rotate: 1 },
];

export default function Guestbook() {
  const [entries, setEntries] = useState(initialEntries);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const colors = ["yellow", "pink", "blue", "green"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotate = Math.random() * 6 - 3; // -3 to 3

    setEntries([
      { ...values, color: randomColor, rotate: randomRotate },
      ...entries
    ]);
    
    toast({
      title: "Signed!",
      description: "Your note has been added to the wall.",
    });
    
    form.reset();
  }

  return (
    <div>
      <h1 className="font-serif text-5xl md:text-7xl mb-8">Guestbook.</h1>
      <p className="font-mono mb-12 max-w-xl">
        Leave a note for me and others to see. Be nice!
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-8 border-2 border-black shadow-brutal h-fit sticky top-8">
          <h2 className="font-serif text-2xl mb-6">Sign the book</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs uppercase font-bold">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} className="border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all" />
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
                    <FormLabel className="font-mono text-xs uppercase font-bold">Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write something nice..." {...field} className="border-black rounded-none min-h-[100px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-none bg-black text-white hover:bg-stone-800 font-mono uppercase tracking-widest py-6">
                Post Note
              </Button>
            </form>
          </Form>
        </div>

        {/* Notes Wall */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {entries.map((entry, i) => (
            <StickyNote 
              key={i} 
              color={entry.color as any} 
              rotate={entry.rotate}
              className="min-h-[160px] flex flex-col"
            >
              <p className="font-hand text-xl mb-4 flex-1">"{entry.message}"</p>
              <p className="font-mono text-xs text-right opacity-50">— {entry.name}</p>
            </StickyNote>
          ))}
        </div>
      </div>
    </div>
  );
}
