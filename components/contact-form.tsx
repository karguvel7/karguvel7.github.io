"use client";

import { useId, useState } from "react";
import { contactForm, mailtoHref, site } from "@/lib/content";

type FormStatus = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length < 2) errors.name = "Enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address.";
  if (message.trim().length < 10) errors.message = "Message should be at least 10 characters.";
  return errors;
}

function mailtoFallback(name: string, email: string, message: string) {
  const subject = encodeURIComponent(contactForm.subject);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

export function ContactForm() {
  const formId = useId();
  const statusId = `${formId}-status`;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (honeypot) return;

    const nextErrors = validate(name, email, message);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setStatusMessage("Fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("Sending…");

    try {
      const response = await fetch(contactForm.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: contactForm.subject,
          _captcha: "false",
          _template: "table",
        }),
      });

      if (!response.ok) throw new Error("submit failed");

      setStatus("success");
      setStatusMessage("Message sent. I will reply to the email you provided.");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch {
      setStatus("error");
      setStatusMessage(
        "Could not send via the form service. Use Download as email instead, or open your mail app.",
      );
    }
  };

  const fieldClass = (key: keyof FieldErrors) =>
    `contact-field-input w-full rounded-sm border bg-canvas/40 px-3 py-2.5 text-sm text-ink ${
      errors[key] ? "border-red-500/70" : "border-line"
    }`;

  return (
    <form className="contact-form diagram-surface mt-10 p-5 sm:p-6" onSubmit={onSubmit} noValidate>
      <div className="diagram-surface-header">
        <span className="diagram-status" data-accent="emerald">Send a message</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">FormSubmit</span>
      </div>

      <p id={statusId} className="contact-form-status mt-4 text-sm" role="status" aria-live="polite">
        {statusMessage}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="contact-field sm:col-span-1">
          <label className="contact-field-label" htmlFor={`${formId}-name`}>Name</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          />
          {errors.name ? (
            <p id={`${formId}-name-error`} className="contact-field-error" role="alert">{errors.name}</p>
          ) : null}
        </div>

        <div className="contact-field sm:col-span-1">
          <label className="contact-field-label" htmlFor={`${formId}-email`}>Email</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          />
          {errors.email ? (
            <p id={`${formId}-email-error`} className="contact-field-error" role="alert">{errors.email}</p>
          ) : null}
        </div>

        <div className="contact-field sm:col-span-2">
          <label className="contact-field-label" htmlFor={`${formId}-message`}>Message</label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldClass("message")} resize-y min-h-[7rem]`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          />
          {errors.message ? (
            <p id={`${formId}-message-error`} className="contact-field-error" role="alert">{errors.message}</p>
          ) : null}
        </div>
      </div>

      <label className="sr-only" htmlFor={`${formId}-honey`}>Leave blank</label>
      <input
        id={`${formId}-honey`}
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="submit"
          className="btn-primary btn-primary-accent inline-flex h-11 items-center justify-center px-6 text-sm font-medium disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        <a
          href={mailtoFallback(name, email, message)}
          className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-5 text-sm text-ink"
        >
          Open in email app
        </a>
        <a href={mailtoHref()} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
          {site.email}
        </a>
      </div>
    </form>
  );
}
