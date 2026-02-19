import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  MailOpen,
  X,
  LogOut,
  Check,
  CircleX,
  RotateCcw,
} from "lucide-react";
import type { Project, BlogPost, GuestbookEntry, ContactMessage } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

type AdminSession = {
  authenticated: boolean;
};

function AdminDashboard({
  onLogout,
  isLoggingOut,
}: {
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"projects" | "blog" | "guestbook" | "messages">("projects");
  const { toast } = useToast();

  const tabs = [
    { key: "projects" as const, label: "Projects" },
    { key: "blog" as const, label: "Blog" },
    { key: "guestbook" as const, label: "Guestbook" },
    { key: "messages" as const, label: "Messages" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-4xl">Admin Panel</h1>
        <Button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="rounded-none bg-black text-white font-mono text-xs uppercase tracking-wider"
          data-testid="button-admin-logout"
        >
          <LogOut size={14} />
          {isLoggingOut ? "Logging Out..." : "Logout"}
        </Button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider border-2 border-black transition-all whitespace-nowrap ${
              activeTab === tab.key 
                ? "bg-black text-white shadow-brutal-sm" 
                : "bg-white hover:bg-stone-100"
            }`}
            data-testid={`button-tab-${tab.key}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "projects" && <ProjectsAdmin />}
          {activeTab === "blog" && <BlogAdmin />}
          {activeTab === "guestbook" && <GuestbookAdmin />}
          {activeTab === "messages" && <MessagesAdmin />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProjectsAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("white");
  const [liveUrl, setLiveUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const { toast } = useToast();

  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/projects", {
        title,
        description,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        color,
        liveUrl: liveUrl || null,
        sourceUrl: sourceUrl || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created!" });
      setTitle(""); setDescription(""); setTags(""); setLiveUrl(""); setSourceUrl("");
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted." });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Projects ({projects.length})</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-none bg-black text-white font-mono text-xs" data-testid="button-add-project">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Cancel" : "Add"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-yellow-100 border-2 border-black p-6 mb-6 shadow-brutal space-y-4">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" className="border-black rounded-none" data-testid="input-project-title" />
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border-black rounded-none" data-testid="input-project-desc" />
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="border-black rounded-none" data-testid="input-project-tags" />
          <div className="flex gap-2">
            {["white", "yellow", "pink", "blue", "green"].map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 border-2 ${color === c ? "border-black ring-2 ring-offset-1 ring-black" : "border-black/30"} ${
                  c === "white" ? "bg-white" : c === "yellow" ? "bg-yellow-200" : c === "pink" ? "bg-pink-200" : c === "blue" ? "bg-sky-200" : "bg-green-200"
                }`}
              />
            ))}
          </div>
          <Input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="Live demo URL (optional)" className="border-black rounded-none" />
          <Input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="Source code URL (optional)" className="border-black rounded-none" />
          <Button onClick={() => createMutation.mutate()} disabled={!title || !description || createMutation.isPending} className="rounded-none bg-black text-white font-mono w-full" data-testid="button-submit-project">
            {createMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {projects.map(project => (
          <div key={project.id} className="bg-white border-2 border-black p-4 flex justify-between items-center" data-testid={`row-project-${project.id}`}>
            <div>
              <h3 className="font-bold font-mono">{project.title}</h3>
              <p className="text-sm opacity-60 font-mono">{project.tags.join(", ")}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(project.id)} data-testid={`button-delete-project-${project.id}`}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const { toast } = useToast();

  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/blog", { title, excerpt, content, published });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog?published=true"] });
      toast({ title: "Post created!" });
      setTitle(""); setExcerpt(""); setContent(""); setPublished(false);
      setShowForm(false);
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      await apiRequest("PUT", `/api/blog/${id}`, { published: !published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog?published=true"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog?published=true"] });
      toast({ title: "Post deleted." });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Blog Posts ({posts.length})</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-none bg-black text-white font-mono text-xs" data-testid="button-add-post">
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Cancel" : "Add"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-pink-100 border-2 border-black p-6 mb-6 shadow-brutal space-y-4">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" className="border-black rounded-none" data-testid="input-post-title" />
          <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short excerpt" className="border-black rounded-none" data-testid="input-post-excerpt" />
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Full content..." className="border-black rounded-none min-h-[150px]" data-testid="input-post-content" />
          <label className="flex items-center gap-2 font-mono text-sm cursor-pointer">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4" />
            Publish immediately
          </label>
          <Button onClick={() => createMutation.mutate()} disabled={!title || !excerpt || createMutation.isPending} className="rounded-none bg-black text-white font-mono w-full" data-testid="button-submit-post">
            {createMutation.isPending ? "Creating..." : "Create Post"}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="bg-white border-2 border-black p-4 flex justify-between items-center" data-testid={`row-post-${post.id}`}>
            <div>
              <h3 className="font-bold font-mono">{post.title}</h3>
              <p className="text-sm opacity-60 font-mono">{post.published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => togglePublish.mutate({ id: post.id, published: post.published })} data-testid={`button-toggle-publish-${post.id}`}>
                {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(post.id)} data-testid={`button-delete-post-${post.id}`}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuestbookAdmin() {
  const { toast } = useToast();
  const { data: entries = [] } = useQuery<GuestbookEntry[]>({ queryKey: ["/api/admin/guestbook"] });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "pending" | "approved" | "rejected" }) => {
      const res = await apiRequest("PATCH", `/api/guestbook/${id}/status`, { status });
      return res.json();
    },
    onSuccess: (_entry, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
      toast({
        title:
          variables.status === "approved"
            ? "Entry approved."
            : variables.status === "rejected"
              ? "Entry rejected."
              : "Entry moved to pending.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/guestbook/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
      toast({ title: "Entry removed." });
    },
  });

  const statusRank: Record<GuestbookEntry["status"], number> = {
    pending: 0,
    approved: 1,
    rejected: 2,
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (statusRank[a.status] !== statusRank[b.status]) {
      return statusRank[a.status] - statusRank[b.status];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Guestbook Entries ({entries.length})</h2>
      {entries.length === 0 ? (
        <p className="font-mono opacity-50 text-center py-12">No entries yet.</p>
      ) : (
        <div className="space-y-3">
          {sortedEntries.map(entry => (
            <div key={entry.id} className="bg-white border-2 border-black p-4 flex justify-between items-start" data-testid={`row-guestbook-${entry.id}`}>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] mb-2 opacity-60">
                  Status:{" "}
                  <span
                    className={
                      entry.status === "approved"
                        ? "text-green-700"
                        : entry.status === "rejected"
                          ? "text-red-700"
                          : "text-amber-700"
                    }
                  >
                    {entry.status}
                  </span>
                </p>
                <p className="font-hand text-lg">"{entry.message}"</p>
                <p className="font-mono text-xs opacity-50 mt-1">— {entry.name}</p>
              </div>
              <div className="flex gap-1 ml-4">
                {entry.status !== "approved" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => statusMutation.mutate({ id: entry.id, status: "approved" })}
                    data-testid={`button-approve-guestbook-${entry.id}`}
                  >
                    <Check size={16} />
                  </Button>
                )}
                {entry.status !== "rejected" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => statusMutation.mutate({ id: entry.id, status: "rejected" })}
                    data-testid={`button-reject-guestbook-${entry.id}`}
                  >
                    <CircleX size={16} />
                  </Button>
                )}
                {entry.status !== "pending" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => statusMutation.mutate({ id: entry.id, status: "pending" })}
                    data-testid={`button-pending-guestbook-${entry.id}`}
                  >
                    <RotateCcw size={16} />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(entry.id)} data-testid={`button-delete-guestbook-${entry.id}`}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesAdmin() {
  const { toast } = useToast();
  const { data: messages = [] } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact"] });

  const setReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: number; read: boolean }) => {
      await apiRequest("PATCH", `/api/contact/${id}/read`, { read });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({ title: "Message deleted." });
    },
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">
        Messages ({messages.length})
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-mono px-2 py-0.5 align-middle">{unreadCount} new</span>
        )}
      </h2>
      {messages.length === 0 ? (
        <p className="font-mono opacity-50 text-center py-12">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`border-2 border-black p-4 ${msg.read ? "bg-stone-50" : "bg-yellow-50 border-l-4 border-l-yellow-500"}`} data-testid={`row-message-${msg.id}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold font-mono">{msg.subject}</h3>
                    {!msg.read && <span className="bg-yellow-400 text-[10px] font-bold px-1.5 font-mono">NEW</span>}
                  </div>
                  <p className="font-mono text-xs opacity-50">{msg.email}</p>
                  <p className="font-mono text-sm mt-2">{msg.message}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  {msg.read ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setReadMutation.mutate({ id: msg.id, read: false })}
                      data-testid={`button-mark-unread-${msg.id}`}
                    >
                      <Mail size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setReadMutation.mutate({ id: msg.id, read: true })}
                      data-testid={`button-mark-read-${msg.id}`}
                    >
                      <MailOpen size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(msg.id)} data-testid={`button-delete-message-${msg.id}`}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { data: session, isLoading: isSessionLoading } = useQuery<AdminSession>({
    queryKey: ["/api/admin/session"],
  });

  const isLoggedIn = Boolean(session?.authenticated);

  const loginMutation = useMutation({
    mutationFn: async (value: string) => {
      await apiRequest("POST", "/api/admin/login", { password: value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      toast({ title: "Access Granted" });
      setPassword("");
    },
    onError: () => {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      queryClient.clear();
      toast({ title: "Logged out" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to log out.", variant: "destructive" });
    },
  });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate(password);
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md bg-stone-200 border-2 border-black p-8 shadow-brutal text-center">
          <p className="font-mono text-sm uppercase tracking-wider opacity-70">Checking session...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} isLoggingOut={logoutMutation.isPending} />;
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
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-mono text-xs uppercase font-bold block mb-2">Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="bg-white border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-black shadow-brutal-sm" 
              data-testid="input-admin-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-black text-white rounded-none font-mono hover:bg-stone-800"
            data-testid="button-admin-login"
          >
            {loginMutation.isPending ? "VERIFYING..." : "LOGIN"}
          </Button>
        </form>
        
        <p className="font-mono text-xs text-center mt-4 opacity-40">
          Admin auth is server-verified.
        </p>
      </div>
    </div>
  );
}
