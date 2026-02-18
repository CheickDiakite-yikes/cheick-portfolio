import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Copy, Github, Linkedin, Mail, Radio, Send, Twitter } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

const quickPings = [
  {
    id: "hello",
    label: "HELLO",
    subject: "Hello from your website!",
    body: "Hey Cheick! Just wanted to say hi.",
  },
  {
    id: "collab",
    label: "COLLAB",
    subject: "Collaboration Inquiry",
    body: "Hi Cheick! I have an exciting collaboration opportunity I would love to discuss with you.",
  },
  {
    id: "hire",
    label: "HIRE",
    subject: "Job Opportunity",
    body: "Hi Cheick! I came across your portfolio and I think you would be a great fit for a role we have.",
  },
  {
    id: "game",
    label: "GAME",
    subject: "Lets Game!",
    body: "Hey Cheick! Want to play some games together?",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    handle: "@CheickDiakite-yikes",
    href: "https://github.com/CheickDiakite-yikes",
    icon: Github,
  },
  {
    label: "LinkedIn",
    handle: "/in/cheickdiakite",
    href: "https://www.linkedin.com/in/cheickdiakite/",
    icon: Linkedin,
  },
  {
    label: "X",
    handle: "@cheicolate",
    href: "https://x.com/cheicolate",
    icon: Twitter,
  },
];

const primaryEmail = "contact@cheickdiakite.com";

export default function Contact() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/contact", values);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message Sent", description: "Thanks for reaching out! I'll get back to you soon." });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", subject: "", message: "" },
  });

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(primaryEmail);
      setCopied(true);
      toast({ title: "COPIED", description: "Primary inbox address copied." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-4xl md:text-5xl">COMMS_ARRAY.</h1>
            <div className="flex items-end gap-1 h-6">
              <span className="w-2 bg-black/40 h-2 animate-pulse" />
              <span className="w-2 bg-black/60 h-3 animate-pulse [animation-delay:120ms]" />
              <span className="w-2 bg-black/80 h-5 animate-pulse [animation-delay:180ms]" />
              <span className="w-2 bg-black h-6 animate-pulse [animation-delay:240ms]" />
            </div>
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.16em] opacity-60 mb-4">Primary Inbox</p>
          <button
            onClick={handleCopyEmail}
            className="w-full flex items-center justify-between border-2 border-black px-4 py-3 font-mono text-sm hover:bg-yellow-100 transition-colors"
            data-testid="button-copy-email"
          >
            <span className="break-all text-left">{primaryEmail}</span>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </span>
          </button>

          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.16em] opacity-60 mb-3">Signal Beacons</p>
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-black px-3 py-2 hover:bg-stone-100 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2 font-mono text-sm">
                      <Icon size={14} />
                      {link.label}
                    </span>
                    <span className="font-mono text-xs opacity-70">{link.handle}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.16em] opacity-60 mb-3">Quick Ping System</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPings.map((ping) => (
                <a
                  key={ping.id}
                  href={`mailto:${primaryEmail}?subject=${encodeURIComponent(ping.subject)}&body=${encodeURIComponent(ping.body)}`}
                  className="border-2 border-black px-3 py-2 font-mono text-xs text-center hover:bg-black hover:text-white transition-colors"
                >
                  {ping.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 border-4 border-black shadow-brutal-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl">Direct Message</h2>
            <Radio size={16} className="opacity-60" />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs uppercase font-bold tracking-wider">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@company.com" {...field} data-testid="input-contact-email" className="border-x-0 border-t-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all bg-transparent" />
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
                      <Input placeholder="Project Inquiry" {...field} data-testid="input-contact-subject" className="border-x-0 border-t-0 border-b-2 border-black rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-4 transition-all bg-transparent" />
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
                      <Textarea placeholder="Tell me what you're building..." {...field} data-testid="input-contact-message" className="border-2 border-black rounded-none min-h-[150px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-stone-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} data-testid="button-contact-submit" className="w-full rounded-none bg-black text-white hover:bg-stone-800 font-mono uppercase tracking-widest py-7 text-base shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all active:shadow-none active:translate-y-0 active:translate-x-0">
                {mutation.isPending ? "Sending..." : "Send Message"}
                {!mutation.isPending && <Send size={14} />}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className="text-center">
        <p className="font-serif italic text-2xl inline-flex items-center gap-2">
          <Mail size={18} />
          Building strategy into shipped product.
        </p>
      </div>
    </div>
  );
}
