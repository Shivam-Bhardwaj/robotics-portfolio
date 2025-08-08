"use client";
import { useState } from "react";
import { siteConfig } from "@/data/site";

const ContactPage = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("sent");
      (event.currentTarget as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="max-w-xl">
      <h1 className="text-3xl font-bold mb-2">Contact Me</h1>
      <p className="mb-6">
        Prefer email? <a href={`mailto:${siteConfig.email}`} className="text-blue-600 underline">{siteConfig.email}</a>
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" required className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} required className="w-full border rounded-md px-3 py-2" />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send"}
        </button>
        {status === "sent" && (
          <p className="text-green-600">Thanks! I will get back to you shortly.</p>
        )}
        {status === "error" && (
          <p className="text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
};

export default ContactPage;
