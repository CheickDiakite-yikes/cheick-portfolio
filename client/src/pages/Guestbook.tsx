import { StickyNote } from "@/components/StickyNote";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { GuestbookEntry } from "@shared/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  message: z.string().min(5, "Message must be at least 5 characters."),
});

export default function Guestbook() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: entries = [], isLoading } = useQuery<GuestbookEntry[]>({
    queryKey: ["/api/guestbook"],
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const colors = ["yellow", "pink", "blue", "green"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomRotate = (Math.random() * 6 - 3).toFixed(1);
      
      const res = await apiRequest("POST", "/api/guestbook", {
        ...values,
        color: randomColor,
        rotate: randomRotate,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
      toast({ title: "Signed!", description: "Your note has been added to the wall." });
      form.reset();
      setIsOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to post your note.", variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", message: "" },
  });

  return (
    <div>
      <h1 className="font-serif text-5xl md:text-7xl mb-8">Guestbook.</h1>
      <p className="font-mono mb-12 max-w-xl">
        Leave a note for me and others to see. Be nice!
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 h-fit sticky top-8">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="bg-white border-2 border-black shadow-brutal overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <button className="w-full p-6 flex items-center justify-between hover:bg-stone-50 transition-colors group" data-testid="button-toggle-form">
                <h2 className="font-serif text-2xl">Sign the book</h2>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="p-6 pt-0 space-y-6">
              <div className="pt-4 border-t-2 border-black/5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs uppercase font-bold">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} data-testid="input-guestbook-name" className="border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all" />
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
                            <Textarea placeholder="Write something nice..." {...field} data-testid="input-guestbook-message" className="border-black rounded-none min-h-[100px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={mutation.isPending} data-testid="button-guestbook-submit" className="w-full rounded-none bg-black text-white hover:bg-stone-800 font-mono uppercase tracking-widest py-6">
                      {mutation.isPending ? "Posting..." : "Post Note"}
                    </Button>
                  </form>
                </Form>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="min-h-[160px] bg-yellow-100 border-2 border-black/10 animate-pulse" />
            ))
          ) : entries.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="font-hand text-2xl opacity-50">Be the first to sign!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <StickyNote 
                key={entry.id} 
                color={entry.color as any} 
                rotate={parseFloat(entry.rotate)}
                className="min-h-[160px] flex flex-col"
              >
                <p className="font-hand text-xl mb-4 flex-1" data-testid={`text-guestbook-msg-${entry.id}`}>"{entry.message}"</p>
                <p className="font-mono text-xs text-right opacity-50">— {entry.name}</p>
              </StickyNote>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
